"use client";

import {createContext, useContext, useEffect, useState} from "react";
import {Character, CharacterData} from "@/app/Models/Characters.model";
import {useSession} from "next-auth/react";
import LinkedList from "@/app/Utilities/list.utility";
import { cloneDeep } from "lodash";

export interface CharacterManager {
  loadedCharacter: Character;
  settings: CharacterManagerSettings;
  bucketUrl: string,
  undo: () => void;
  redo: () => void;
  new: () => void;
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
  currentPage: number;
  search: string;
}

const CharacterManagementContext = createContext<CharacterManager>({
  loadedCharacter: {} as Character,
  settings: {} as CharacterManagerSettings,
  bucketUrl: "",
  undo: () => {},
  redo: () => {},
  new: () => {},
  save: () => {},
  rename: () => {},
  move: () => {},
  delete: () => {},
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

  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | undefined>();
  const [loadedChar, setLoadedCharacter] = useState<Character>(blankCharacter(session?.user.name ?? ""));
  const [setting, setSetting] = useState<CharacterManagerSettings>({autofill: true, modOnTop: true, style: "Standard", allowUndo: false, allowRedo: false, currentPage: 1, search: ""});

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
    console.log(saveStates.len)
    setSetting({...setting, allowRedo: step > 0, allowUndo: step < MAX_STEPS && step < saveStates.len - 1})
  }, [step, saveStates])

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

  return (
    <CharacterManagementContext
      value={{
        loadedCharacter: loadedChar,
        settings: setting,
        bucketUrl: bucketUrl,
        undo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftRightBy(1);
          setLoadedCharacter(newStates.getAt(0)!);
          setSaveStates(newStates);
          setStep(step + 1);
        },
        redo: () => {
          const newStates = cloneDeep(saveStates);
          newStates.shiftLeftBy(1);
          setLoadedCharacter(newStates.getAt(0)!);
          setSaveStates(newStates);
          setStep(step - 1);
        },
        new: () => {
          const newCharacter = blankCharacter(session?.user.name ?? "");
          console.log(newCharacter);
          setLoadedCharacter(newCharacter);
          saveChanges(newCharacter);
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
