"use client";

import RollerDrawer, { RollerPreset } from "@/app/Components/DiceRoller/RollerDrawer";
import { CharacterData } from "@/app/Models/Characters.model";
import { useEffect, useState } from "react";

export default function CharacterRoller ({char}: {char: CharacterData}) {
  const getCharacterPresets = (): RollerPreset[] => [
    {
      name: "Skill Check",
      subPresets: [
        {
          name: "Acrobatics",
          roll: `1d20+${char["acro-bonus"]}`
        },{
          name: "Athletics (str)",
          roll: `1d20+${char["ath-bonus"]}`
        },{
          name: "Athletics (wis)",
          roll: `1d20+${char["ath-bonus2"]}`
        },{
          name: "Bluff",
          roll: `1d20+${char["dec-bonus"]}`
        },{
          name: "Care (wis)",
          roll: `1d20+${char["ani-bonus"]}`
        },{
          name: "Care (cha)",
          roll: `1d20+${char["ani-bonus2"]}`
        },{
          name: "Diplomacy",
          roll: `1d20+${char["pers-bonus"]}`
        },{
          name: "Finesse",
          roll: `1d20+${char["sli-bonus"]}`
        },{
          name: "Grit",
          roll: `1d20+${char["grit-bonus"]}`
        },{
          name: "Intimidate (str)",
          roll: `1d20+${char["intim-bonus0"]}`
        },{
          name: "Intimidate (cha)",
          roll: `1d20+${char["intim-bonus"]}`
        },{
          name: "Investigation",
          roll: `1d20+${char["invest-bonus"]}`
        },{
          name: "Knowledge",
          roll: `1d20+${char["his-bonus"]}`
        },{
          name: "Medicine (int)",
          roll: `1d20+${char["medi-bonus0"]}`
        },{
          name: "Medicine (wis)",
          roll: `1d20+${char["medi-bonus"]}`
        },{
          name: "Perception",
          roll: `1d20+${char["perc-bonus"]}`
        },{
          name: "Presence",
          roll: `1d20+${char["perf-bonus"]}`
        },{
          name: "Science",
          roll: `1d20+${char["sci-bonus"]}`
        },{
          name: "Sneak",
          roll: `1d20+${char["steal-bonus"]}`
        },{
          name: "Supernautral (int)",
          roll: `1d20+${char["arc-bonus"]}`
        },{
          name: "Supernatural (wis)",
          roll: `1d20+${char["arc-bonus2"]}`
        },{
          name: "Survival (int)",
          roll: `1d20+${char["surv-bonus0"]}`
        },{
          name: "Survival (wis)",
          roll: `1d20+${char["surv-bonus"]}`
        },{
          name: "Vibe (wis)",
          roll: `1d20+${char["ins-bonus"]}`
        },{
          name: "Vibe (cha)",
          roll: `1d20+${char["ins-bonus2"]}`
        }
      ]
    },
    {
      name: "Saving Throw",
      subPresets: [
        {
          name: "Strength",
          roll: `1d20+${char["str-bonus"]}` 
        },{
          name: "Dexterity",
          roll: `1d20+${char["dex-bonus"]}` 
        },{
          name: "Constitution",
          roll: `1d20+${char["con-bonus"]}` 
        },{
          name: "Intelligence",
          roll: `1d20+${char["int-bonus"]}` 
        },{
          name: "Wisdom",
          roll: `1d20+${char["wis-bonus"]}` 
        },{
          name: "Charisma",
          roll: `1d20+${char["cha-bonus"]}` 
        }
      ]
    },
    {
      name: "Misc.",
      subPresets: [
        {
          name: "Initiative",
          roll: `1d20+${parseInt(char.init ?? "0")}`
        },
        {
          name: "Death Save",
          roll: `1d20` //TODO: Consider implementing success and crit detection so things like this are useful and have good UX
        },
        {
          name: "Hit Die",
          roll: `1${char.hdice?.replace(/\d+(d\d+)/, "$1")}+${parseInt(char["con-mod"] ?? "0")}`
        },
        {
          name: "Stand Points",
          roll: `${char.class == "rev" ? 3 : 2}d4${char.class != "multi" ? `+${char.level ?? 0}` : ""}`
        }
      ]
    }
  ];

  const [presets, setPresets] = useState(getCharacterPresets());

  useEffect(() => {
    setPresets(getCharacterPresets());
  }, [char])

  return <RollerDrawer presets={presets}/>
}