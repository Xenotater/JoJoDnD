"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Character, CharacterData} from "@/app/Models/Characters.model";
import {useSession} from "next-auth/react";
import LinkedList from "@/app/Models/LinkedList";
import { cloneDeep } from "lodash";

export interface CharacterManager {
  loadedCharacter: Character;
  settings: CharacterManagerSettings;
  undo: () => void;
  redo: () => void;
  save: (character: Character) => void;
  rename: (character: Character) => void;
  move: (character: Character) => void;
  delete: (character: Character) => void;
  updateSetting: (name: string, value: unknown) => void;
}

interface CharacterManagerSettings {
  autofill: boolean;
  modOnTop: boolean;
  style: "Standard" | "5e";
  allowUndo: boolean;
  allowRedo: boolean;
}

const CharacterManagementContext = createContext<CharacterManager>({
  loadedCharacter: {} as Character,
  settings: {} as CharacterManagerSettings,
  undo: () => {},
  redo: () => {},
  save: () => {},
  rename: () => {},
  move: () => {},
  delete: () => {},
  updateSetting: () => {},
});

export const useCharacterManager = () => useContext(CharacterManagementContext);

export default function CharacterManagementContextProvider({children}: {children: React.ReactNode}) {
  const {data: session} = useSession();

  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | undefined>();
  const [loadedChar, setLoadedCharacter] = useState<Character>({
    id: -1,
    name: "",
    username: session?.user.name ?? "",
    folder_id: 0,
    img: "",
    img2: "",
    data: {} as CharacterData,
  } as Character);
  const [setting, setSetting] = useState<CharacterManagerSettings>({autofill: true, modOnTop: true, style: "Standard", allowUndo: false, allowRedo: false});

  const MAX_STEPS = 5; //TODO: reconsider this value
  const [step, setStep] = useState(0);
  const [saveStates, setSaveStates] = useState(new LinkedList<CharacterData>());

  useEffect(() => {
    const storedChar = sessionStorage.getItem("charData");
    if (storedChar && storedChar != "undefined") {
      setLoadedCharacter(JSON.parse(storedChar));
      saveChanges(JSON.parse(storedChar));
    }
  }, []);

  useEffect(() => {
    console.log("updating settings");
    setSetting({...setting, allowRedo: step > 0, allowUndo: step < MAX_STEPS && step < saveStates.len - 1})
  }, [step, saveStates])

  const saveChanges = (char: Character) => {
    const newStates = cloneDeep(saveStates);
    console.log("saving: " + char.data.name);
    sessionStorage.setItem("charData", JSON.stringify(char));
    newStates.insertAt({...char.data}, 0);
    if (step > 0) {
      for (let i = 0; i < step; i++)
        newStates.removeAt(saveStates.len - 1);
      setStep(0);
    }
    else {
      if (newStates.len > MAX_STEPS)
        newStates.removeAt(newStates.len - 1);
    }
    setSaveStates(newStates);
    console.log(newStates);
  };

  return (
    <CharacterManagementContext
      value={{
        loadedCharacter: loadedChar,
        settings: setting,
        undo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftRightBy(1);
          setLoadedCharacter({...loadedChar, data: newStates.getAt(0)!});
          setSaveStates(newStates);
          setStep(step + 1);
          console.log(saveStates);
        },
        redo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftLeftBy(1);
          setLoadedCharacter({...loadedChar, data: newStates.getAt(0)!});
          setSaveStates(newStates);
          setStep(step - 1);
          console.log(saveStates);
        },
        save: (character: Character) => {
          setLoadedCharacter(character);
          saveChanges(character);
        },
        rename: (character: Character) => {
          setCurrentCharacter(character);
          setRenameOpen(true);
        },
        move: (character: Character) => {
          setCurrentCharacter(character);
          setMoveOpen(true);
        },
        delete: (character: Character) => {
          setCurrentCharacter(character);
          setDeleteOpen(true);
        },
        updateSetting: (name: string, value: unknown) => setSetting({...setting, [name]: value}),
      }}
    >
      {renameOpen && (
        <RenameCharacterModal
          closer={() => {
            setCurrentCharacter(undefined);
            setRenameOpen(false);
          }}
          data={currentCharacter}
        />
      )}
      {moveOpen && (
        <MoveCharacterModal
          closer={() => {
            setCurrentCharacter(undefined);
            setMoveOpen(false);
          }}
          data={currentCharacter}
        />
      )}
      {deleteOpen && (
        <DeleteCharacterModal
          closer={() => {
            setCurrentCharacter(undefined);
            setDeleteOpen(false);
          }}
          data={currentCharacter}
        />
      )}
      {children}
    </CharacterManagementContext>
  );
}
