import React, { useEffect, useRef } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import { useAppStore } from '../store';

const HandTracker: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setHandData } = useAppStore();
  const lastVideoTime = useRef(-1);
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const initHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        
        landmarkerRef.current = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        
        startWebcam();
      } catch (error) {
        console.error("Error initializing hand landmarker:", error);
      }
    };

    initHandLandmarker();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.addEventListener('loadeddata', predictWebcam);
    } catch (err) {
      console.error("Webcam access denied:", err);
    }
  };

  const predictWebcam = () => {
    if (!landmarkerRef.current || !videoRef.current) return;

    const nowInMs = performance.now();
    if (videoRef.current.currentTime !== lastVideoTime.current) {
      lastVideoTime.current = videoRef.current.currentTime;
      
      const results = landmarkerRef.current.detectForVideo(videoRef.current, nowInMs);
      
      let distance = 0;
      let detected = false;
      let tension = 0;

      if (results.landmarks && results.landmarks.length > 0) {
        detected = true;

        // 1. Calculate Distance between hands (if 2 hands)
        if (results.landmarks.length === 2) {
            const handA = results.landmarks[0][9]; // Middle finger MCP (center of hand approx)
            const handB = results.landmarks[1][9];
            
            // Euclidean distance in screen space (0-1)
            const dx = handA.x - handB.x;
            const dy = handA.y - handB.y;
            const rawDist = Math.sqrt(dx*dx + dy*dy);
            
            // Normalize: typically hands are 0.1 to 0.8 apart
            distance = Math.min(Math.max((rawDist - 0.1) / 0.7, 0), 1);
        } else {
            // If only one hand, default to 0.5 (neutral)
            distance = 0.5;
        }

        // 2. Calculate Tension (Fist clench detection)
        // Average of how close finger tips are to wrist
        let totalOpenness = 0;
        results.landmarks.forEach(hand => {
            const wrist = hand[0];
            const tips = [hand[4], hand[8], hand[12], hand[16], hand[20]]; // Thumb to Pinky tips
            
            let handOpenness = 0;
            tips.forEach(tip => {
                const d = Math.sqrt(Math.pow(tip.x - wrist.x, 2) + Math.pow(tip.y - wrist.y, 2));
                handOpenness += d;
            });
            totalOpenness += handOpenness; // Higher = more open
        });
        
        // Normalize tension. Low openness = High tension.
        // Approx: Open hand sum ~ 1.5 - 2.0. Closed fist ~ 0.5 - 0.8 per hand.
        const avgOpenness = totalOpenness / results.landmarks.length;
        // Map 0.8 (closed) -> 1 (tension), 2.0 (open) -> 0 (tension)
        tension = 1 - Math.min(Math.max((avgOpenness - 0.25) / 0.4, 0), 1);
      }

      setHandData(distance, detected, tension);
    }

    requestRef.current = requestAnimationFrame(predictWebcam);
  };

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="fixed bottom-4 right-4 w-32 h-24 object-cover rounded-lg border-2 border-white/20 opacity-50 z-50 pointer-events-none transform scale-x-[-1]"
    />
  );
};

export default HandTracker;