declare module "@3d-dice/dice-parser-interface" {
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

  interface ResultItem {
    type: "number" | "roll",
    value: number,
    success: boolean | null,
    successes: number,
    failures: number,
    valid: boolean,
    order: number,
    value?: number,
    critical?: null | "failure" | "success",
    die?: number,
    matched?: boolean,
    roll?: number,
  }

  export interface FinalResults extends ResultItem {
  "count": ResultItem,
  "die": ResultItem,
  "rolls": ResultItem[],
  }

  export default class DiceParser {
    constructor(options?: DicePickerOptions);
    parseNotation: (notation: string) => DieRoll[];
    parseFinalResults: (results: DieResult[]) => FinalResults;
  }
}