export enum ShapeType {
  SPHERE = 'Sphere',
  HEART = 'Heart',
  FLOWER = 'Flower',
  SATURN = 'Saturn',
  BUDDHA = 'Meditate', // Simplified representation
  FIREWORKS = 'Fireworks'
}

export interface AppState {
  shape: ShapeType;
  color: string;
  particleCount: number;
  handDistance: number; // 0 to 1 (normalized)
  handDetected: boolean;
  gestureTension: number; // 0 (relaxed) to 1 (fist/tension)
  setShape: (shape: ShapeType) => void;
  setColor: (color: string) => void;
  setHandData: (distance: number, detected: boolean, tension: number) => void;
  resetState: () => void;
}