import { cloneDeep } from "lodash";
import { Character, EditState } from "../../../../Models/Characters.model";

export default function doAutofill(char: Character, changes: EditState) {
  const newChar = cloneDeep(char);
  
  return newChar;  
}