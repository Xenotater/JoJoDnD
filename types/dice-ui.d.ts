declare module "@3d-dice/dice-ui/src/dicePicker" {
  export interface DiceNotation {
    [dieType: string]: {
      count: number;
      sides?: number;
      modifiers?: string[];
    };
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

  export interface DicePickerOptions {
    target?: string;
    id?: string;
    onSubmit?: (results: DieRoll[]) => void;
    onClear?: () => void;
    onReroll?: (results: DieResult[]) => void;
    onResults?: (results: DieResult[]) => void;
  }

  export default class DicePicker {
    constructor(options?: DicePickerOptions);
    setNotation(notation: DiceNotation): void;
  }
}