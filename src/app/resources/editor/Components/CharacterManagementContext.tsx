"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Character } from "@/app/Models/Characters.model";

export interface CharacterManager {
  loadedCharacter: Character | undefined;
  settings: {
    autofill: boolean;
    modOnTop: boolean;
  }
  load: (character: Character) => void;
  rename: (character: Character) => void;
  move: (character: Character) => void;
  delete: (character: Character) => void;
  toggleAutofill: () => void;
  toggleStatPos: () => void;
}

const CharacterManagementContext = createContext<CharacterManager>({
  loadedCharacter: undefined, load: () => { }, rename: () => { }, move: () => { }, delete: () => { },
  settings: {
    autofill: true,
    modOnTop: true
  },
  toggleAutofill: function (): void {
    throw new Error("Function not implemented.");
  },
  toggleStatPos: function (): void {
    throw new Error("Function not implemented.");
  }
});

export const useCharacterManager = () => useContext(CharacterManagementContext);

export default function CharacterManagementContextProvider({children}: {children: React.ReactNode}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [moveOpen, setMoveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | undefined>();
  const [loadedChar, setLoadedCharacter] = useState<Character | undefined>();
  const [setting, setSetting] = useState({autofill: true, modOnTop: true});

  useEffect(() => {
    const storedChar = localStorage.getItem("charData");
    if (storedChar && storedChar != "undefined")
      setLoadedCharacter(JSON.parse(storedChar));
  }, []);

  useEffect(() => {
    localStorage.setItem("charData", JSON.stringify(loadedChar));
  }, [loadedChar]);

  return ( 
    <CharacterManagementContext value={{
      loadedCharacter: loadedChar,
      settings: setting,
      load: (character: Character) => {setLoadedCharacter(character);},
      rename: (character: Character) => {setCurrentCharacter(character); setRenameOpen(true);},
      move: (character: Character) => {setCurrentCharacter(character); setMoveOpen(true);},
      delete: (character: Character) => {setCurrentCharacter(character); setDeleteOpen(true);},
      toggleAutofill: () => setSetting({...setting, autofill: !setting.autofill}),
      toggleStatPos: () => setSetting({...setting, modOnTop: !setting.modOnTop})
    }}>
      {renameOpen &&
        <RenameCharacterModal closer={() => {setCurrentCharacter(undefined); setRenameOpen(false);}} data={currentCharacter}/>
      }
      {moveOpen &&
        <MoveCharacterModal closer={() => {setCurrentCharacter(undefined); setMoveOpen(false);}} data={currentCharacter}/>
      }
      {deleteOpen &&
        <DeleteCharacterModal closer={() => {setCurrentCharacter(undefined); setDeleteOpen(false);}} data={currentCharacter}/>
      }
      {children}
    </CharacterManagementContext>
  );
}