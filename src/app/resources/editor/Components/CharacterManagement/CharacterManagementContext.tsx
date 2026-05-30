"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Character, CharacterData, CharacterFolder, CharacterOrFolder, EditState, metaFlags} from "@/app/Models/Characters.model";
import {useSession} from "next-auth/react";
import LinkedList from "@/app/Utilities/list.utility";
import { cloneDeep } from "lodash";
import CharactersModal from "./CharactersModal";
import doAutofill from "@/app/resources/editor/Components/CharacterManagement/Autofill.utility";

export interface CharacterManager {
  currentItem: CharacterOrFolder | undefined;
  managementAction: "Rename" | "Move" | "Delete" | undefined;
  loadedCharacter: Character;
  settings: CharacterManagerSettings;
  bucketUrl: string,
  undo: () => void;
  redo: () => void;
  load: () => void;
  new: () => void;
  save: (character: Character, createState?: boolean, autofill?: boolean) => void;
  rename: (item: CharacterOrFolder) => void;
  move: (item: CharacterOrFolder) => void;
  delete: (item: CharacterOrFolder) => void;
  clearAction: () => void;
  updateSetting: (name: string, value: unknown) => void;
}

interface CharacterManagerSettings {
  autofill: boolean;
  modOnTop: boolean;
  style: "Standard" | "5e";
  allowUndo: boolean;
  allowRedo: boolean;
  currentPage: number;
  search: string;
  folderPath: CharacterFolder[];
}

const CharacterManagementContext = createContext<CharacterManager>({
  currentItem: undefined,
  managementAction: undefined,
  loadedCharacter: {} as Character,
  settings: {} as CharacterManagerSettings,
  bucketUrl: "",
  undo: () => {},
  redo: () => {},
  load: () => {},
  new: () => {},
  save: () => {},
  rename: () => {},
  move: () => {},
  delete: () => {},
  clearAction: () => {},
  updateSetting: () => {},
});

export const useCharacterManager = () => useContext(CharacterManagementContext);

const blankCharacter = (user = ""): Character => ({
    id: -1,
    name: "",
    username: user,
    folder_id: 0,
    img: "",
    img2: "",
    data: {} as CharacterData,
  });

export default function CharacterManagementContextProvider({bucketUrl, children}: {bucketUrl: string, children: React.ReactNode}) {
  const {data: session} = useSession();

  const [loadOpen, setLoadOpen] = useState(false);
  const [managementAction, setManagementAction] = useState<"Rename" | "Move" | "Delete" | undefined>(undefined);
  const [currentItem, setCurrentItem] = useState<CharacterOrFolder | undefined>();
  const [loadedChar, setLoadedCharacter] = useState<Character>(blankCharacter(session?.user.name ?? ""));
  const [setting, setSetting] = useState<CharacterManagerSettings>({autofill: true, modOnTop: true, style: "Standard", allowUndo: false, allowRedo: false, currentPage: 1, search: "", folderPath: [{id: 0, username: "", name: "Root", "parent_id": 0}]});

  const MAX_STEPS = 10; //TODO: reconsider this value
  const [step, setStep] = useState(0);
  const [saveStates, setSaveStates] = useState(new LinkedList<EditState>());

  useEffect(() => {
    const storedChar = sessionStorage.getItem("charData");
    if (storedChar && storedChar != "undefined") {
      setLoadedCharacter(JSON.parse(storedChar));
    }
  }, []);

  useEffect(() => {
    updateSettingsFromMeta(loadedChar);
  }, [loadedChar.data.meta]);

  useEffect(() => {
    setSetting({...setting, allowRedo: step > 0, allowUndo: step < MAX_STEPS && step < saveStates.len})
  }, [step, saveStates]);

  const saveChanges = (char: Character, options?: {force?: boolean, noState?: boolean, noAuto?: boolean}) => {
    if (!options?.force && JSON.stringify(char) == sessionStorage.getItem("charData"))
      return;

    const newStates = cloneDeep(saveStates);
    const state: EditState = (Object.entries(char.data) as [keyof CharacterData, string | number][]).flatMap((field) => field[1] != loadedChar.data[field[0]] ? {field: field[0], prevState: loadedChar.data[field[0]], newState: field[1]} : []);

    if (!options?.noAuto && setting.autofill)
    {
      saveChanges(doAutofill(char, state), {noAuto: true});
      return;
    }
    
    if (!options?.noState) {
      if (char.img != loadedChar.img)
        state.push({field: "img", prevState: loadedChar.img ?? "", newState: char.img ?? ""});
      if (char.img2 != loadedChar.img2)
        state.push({field: "img2", prevState: loadedChar.img2 ?? "", newState: char.img2 ?? ""});
      newStates.insertAt(state, 0);
      if (step > 0) {
        for (let i = 0; i < step; i++)
          newStates.removeAt(newStates.len - 1);
        setStep(0);
      }
      else {
        if (newStates.len > MAX_STEPS)
          newStates.removeAt(newStates.len - 1);
      }
      setSaveStates(newStates);
    }

    sessionStorage.setItem("charData", JSON.stringify(char));
    setLoadedCharacter(char);
    updateSettingsFromMeta(char);
  };

  const updateCharFromState = (state: EditState, dir: "prev" | "new") => {
    const newChar = cloneDeep(loadedChar);
    state.forEach((change) => {
      if (change.field == "img" || change.field == "img2") {
        newChar[change.field] = dir == "new" ? change.newState as string : change.prevState as string;
      }
      else {
        newChar.data = {...newChar.data, [change.field]: dir == "new" ? change.newState : change.prevState};
      }
    });
    setLoadedCharacter(newChar);
    updateSettingsFromMeta(newChar);
  }

  const updateSettingsFromMeta = (char: Character) => {
    setSetting({...setting, 
      modOnTop: !parseMeta(char, "scoreOnTop"),
      autofill: !parseMeta(char, "autofillOff"),
      style: parseMeta(char, "5eSheet") ? "5e" : "Standard",
    });
  }

  const parseMeta = (char: Character, flagName: keyof typeof metaFlags) => {
    return ((char.data.meta ?? 0) & metaFlags[flagName]) > 0;
  }

  const setMeta = (settings: CharacterManagerSettings) => {
    const newChar = cloneDeep(loadedChar);
    newChar.data.meta = (settings.modOnTop ? 0 : metaFlags.scoreOnTop) | (settings.autofill ? 0 : metaFlags.autofillOff) | (settings.style == "5e" ? metaFlags["5eSheet"] : 0);
    setLoadedCharacter(newChar);
  }

  return (
    <CharacterManagementContext
      value={{
        currentItem,
        managementAction,
        loadedCharacter: loadedChar,
        settings: setting,
        bucketUrl: bucketUrl,
        undo: () => {
          const newStates = cloneDeep(saveStates);
          updateCharFromState(newStates.getAt(0)!, "prev");
          newStates.shiftRightBy(1);
          setSaveStates(newStates);
          setStep(step + 1);
        },
        redo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftLeftBy(1);
          updateCharFromState(newStates.getAt(0)!, "new");
          setSaveStates(newStates);
          setStep(step - 1);
        },
        load: () => {
          setLoadOpen(true);
        },
        new: () => {
          const newCharacter = blankCharacter(session?.user.name ?? "");
          saveChanges(newCharacter);
        },
        save: (character: Character, createState = true, autofill = true) => {
          saveChanges(character, {noState: !createState, noAuto: !autofill});
        },
        rename: (item: CharacterOrFolder) => {
          setCurrentItem(item);
          setManagementAction("Rename");
        },
        move: (item: CharacterOrFolder) => {
          setCurrentItem(item);
          setManagementAction("Move");
        },
        delete: (item: CharacterOrFolder) => {
          setCurrentItem(item);
          setManagementAction("Delete");
        },
        clearAction: () => {
          setCurrentItem(undefined);
          setManagementAction(undefined);
        },
        updateSetting: (name: string, value: unknown) => {
          setSetting({...setting, [name]: value});
          setMeta({...setting, [name]: value});
        }}}
    >
      {loadOpen &&
      <CharactersModal closeCallback={() => setLoadOpen(false)}/>
      }
      {children}
    </CharacterManagementContext>
  );
}
