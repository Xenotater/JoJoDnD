"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Character, CharacterData, CharacterFolder, CharacterOrFolder, metaFlags} from "@/app/Models/Characters.model";
import {useSession} from "next-auth/react";
import LinkedList from "@/app/Utilities/list.utility";
import { cloneDeep, uniqueId } from "lodash";
import CharacterManagementModal from "./CharacterManagementModal";
import CharactersModal from "./CharactersModal";

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
  save: (character: Character, createState?: boolean) => void;
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
  const [saveStates, setSaveStates] = useState(new LinkedList<Character>());

  useEffect(() => {
    const storedChar = sessionStorage.getItem("charData");
    if (storedChar && storedChar != "undefined") {
      setLoadedCharacter(JSON.parse(storedChar));
      saveChanges(JSON.parse(storedChar), true);
    }
  }, []);

  useEffect(() => {
    setSetting({...setting, allowRedo: step > 0, allowUndo: step < MAX_STEPS && step < saveStates.len - 1})
  }, [step, saveStates]);

  //TODO: Consider saving a list of changes, rather than the whole form state
  const saveChanges = (char: Character, force = false) => {
    if (!force && JSON.stringify(char) == sessionStorage.getItem("charData"))
      return;
    const newStates = cloneDeep(saveStates);
    sessionStorage.setItem("charData", JSON.stringify(char));
    newStates.insertAt(char, 0);
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
  };

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
          newStates.shiftRightBy(1);
          setLoadedCharacter(newStates.getAt(0)!);
          updateSettingsFromMeta(newStates.getAt(0)!);
          setSaveStates(newStates);
          setStep(step + 1);
        },
        redo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftLeftBy(1);
          setLoadedCharacter(newStates.getAt(0)!);
          updateSettingsFromMeta(newStates.getAt(0)!);
          setSaveStates(newStates);
          setStep(step - 1);
        },
        load: () => {
          setLoadOpen(true);
        },
        new: () => {
          const newCharacter = blankCharacter(session?.user.name ?? "");
          setLoadedCharacter(newCharacter);
          saveChanges(newCharacter);
          updateSettingsFromMeta(newCharacter);
        },
        save: (character: Character, createState = true) => {
          console.log("loaded: " + character.data.meta)
          setLoadedCharacter(character);
          if (createState)
            saveChanges(character);
          updateSettingsFromMeta(character);
        },
        rename: (item: CharacterOrFolder) => {
          console.log("rename")
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
