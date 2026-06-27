declare module "@3d-dice/dice-box" {
  export interface DiceBoxConfig {
    assetPath: string;
    container: string;
    theme?: string;
    themeColor?: string;
    startingHeight?: number,
    throwForce?: number,
    spinForce?: number,
    lightIntensity?: number,
    scale: number,
    onRollComplete?: (results: DiceResult[]) => void;
    onBeforeRoll?: (results: DiceResult[]) => void;
  }

  export interface DieRoll {
    sides: number;
    qty: number;
    theme?: string;
  }

  export interface DieResult {
    type: string;
    sides: number;
    id: number;
    value: number;
    reason: string;
    position: { x: number; y: number; z: number };
    screenPosition: { x: number; y: number };
    scale: number;
  }

  export default class DiceBox {
    constructor(config: DiceBoxConfig);
    
    init(): Promise<void>;
    roll(notation: string | DieRoll[]): Promise<DiceResult[]>;
    show(): void;
    hide(): void;
    clear(): void;
  }
}
