"use client";

import DiceBox from "@3d-dice/dice-box";
import DicePicker, {DieResult} from "@3d-dice/dice-ui/src/dicePicker";
import {useEffect, useState} from "react";

import styles from "./DiceRoller.module.css";
import Divider from "../Layout/Divider/Divider";
import Modal from "../Layout/Modal/Modal";
import Input from "../Layout/Forms/Controlled/Input";
import {useTranslations} from "next-intl";
import DiceParser from "@3d-dice/dice-parser-interface";
import {FaCaretDown, FaCaretUp, FaDiceD20} from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import Tooltip from "../Layout/Typography/Tooltip";

export interface RollerPreset {
  name: string;
  roll?: string;
  subPresets?: RollerPreset[];
}

//TODO: accept preset options in parameters, use callback to export values, allow misc rolls
export default function RollerDrawer({callback, presets}: {callback?: (val: number) => void; presets?: RollerPreset[]}) {
  const [box, setBox] = useState<DiceBox>();
  const [picker, setPicker] = useState<DicePicker>();
  const [parser] = useState<DiceParser>(new DiceParser());
  const [showPicker, setShowPicker] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(0);
  const [presetOptions, setPresetOptions] = useState<RollerPreset[] | null>(null);

  const t = useTranslations("Misc.DiceRoller");

  const complete = (results: DieResult[]) => {
    setIsRolling(false);
    const parsedResult = parser.parsedNotation ? parser?.parseFinalResults(results).value ?? null : null;
    const value = parsedResult ? parsedResult : results.reduce((total, result) => (total += result.value), 0);
    if (callback)
      callback(value);
    setResult(value);
  };

  useEffect(() => {
    const diceBox = new DiceBox({
      assetPath: "/dice-box/",
      container: "#diceBox",
      themeColor: "#a525f0",
      startingHeight: 8,
      throwForce: 6,
      lightIntensity: 0.9,
      scale: 7,
      gravity: 1.8,
      onBeforeRoll: () => setIsRolling(true),
      onRollComplete: (results) => {
        complete(results);
      },
    });
    const dicePicker = new DicePicker({
      target: "#dicePicker",
      onClear: () => {
        setTimeout(() => (document.querySelectorAll(".output")[0]!.textContent = t("pickerPrompt")), 0);
      },
      onSubmit: (result) => {
        diceBox?.roll(result);
      },
    });

    diceBox.init();

    setBox(diceBox);
    setPicker(dicePicker);
  }, []);

  useEffect(() => {
    document.querySelectorAll(".output")[0]!.textContent = t("pickerPrompt");
    document.querySelectorAll(".action button")[0]!.textContent = t("clear");
    document.querySelectorAll(".action button")[1]!.textContent = t("throw");
  }, [picker]);

  useEffect(() => {
    setPresetOptions(null);
  }, [presets]);

  const loadPreset = (preset?: RollerPreset) => {
    setShowPicker(false);
    if (preset) {
      if (preset.subPresets) {
        setPresetOptions(preset.subPresets);
      }
      else if (preset.roll) {
        setPrompt(preset.roll);
        box?.roll(parser?.parseNotation(preset.roll) ?? preset.roll);
      }
    }
  };

  return (
    <div className={`fixed bottom-[-8px] left-0 w-[100vw] h-[33vh] min-h-[240px] flex justify-center ${drawerOpen ? "" : "translate-y-[calc(33vh-4px)]"} transition-transform`}>
      <div className="content absolute h-2 w-20 top-[-34px] left-[15vw] flex justify-center items-center text-4xl text-jj-purple-1 hover:text-jj-purple-4 hover:shadow-lg/66 cursor-pointer" onClick={() => setDrawerOpen(!drawerOpen)}>
        {drawerOpen ?
          <FaCaretDown/>
          : <FaCaretUp/>
        }
      </div>
      <div className={`content relative p-0 w-[80vw] min-w-[300px] flex flex-col overflow-y-hidden shadow-lg/66`}>
        <div className={`${isRolling ? "opacity-33" : ""} z-1`}>
          <Modal closeCallback={() => setMenuOpen(false)}>
            <div className="absolute top-0">
              <div className="h-min flex items-center p-4">
                <div className="p-2 bg-jj-purple-1 border-2 rounded-[50%] cursor-pointer hover:shadow-sm/33 z-2 text-2xl md:text-3xl">
                  <FaDiceD20 color="white" onClick={() => setMenuOpen(!menuOpen)} />
                </div>
              </div>
              {menuOpen && (
                <div className={`absolute top-[42px] md:top-[48px] left-[16px] md:left-[17px] z-1`}>
                  <div className="w-[44px] md:w-[48px] h-[64px] aspect-1/1 border-2 border-t-0 z-2 bg-jj-purple-1" />
                  <div className="border-2 whitespace-nowrap z-1 absolute top-[24px] rounded-lg rounded-tl-4xl bg-jj-purple-1 p-2 pl-4 shadow-md/30 w-fit md:text-xl leading-3 md:leading-4 max-h-[calc(33vh-100px)] overflow-scroll hideScroll">
                    {presetOptions ? (
                      <>
                        <a onClick={() => setPresetOptions(null)} className="block cursor-pointer hover:underline ml-2 mr-2 text-white flex items-center gap-2">
                          <BsArrowLeft/><span>Back</span>
                        </a>
                        {presetOptions.map(p => (
                        <div key={`preset-${p.name}`}>
                          <Divider className="mt-2 mb-2 border-white" />
                          <a onClick={() => loadPreset(p)} className="block cursor-pointer hover:underline ml-2 mr-2 text-white">
                            {p.name}
                          </a>
                        </div>
                      ))}
                      </>
                    ) : (
                      <>
                        <a onClick={() => setShowPicker(true)} className="block cursor-pointer hover:underline ml-2 mr-2 text-white">
                          {t("Presets.picker")}
                        </a>
                        {presets?.map((p) => (
                          <div key={`preset-${p.name}`}>
                            <Divider className="mt-2 mb-2 border-white" />
                            <a onClick={() => loadPreset(p)} className="block cursor-pointer hover:underline ml-2 mr-2 text-white">
                              {p.name}
                            </a>
                          </div>
                        ))}
                        <Divider className="mt-2 mb-2 border-white" />
                        <a onClick={() => loadPreset()} className="block cursor-pointer hover:underline ml-2 mr-2 text-white">
                          {t("Presets.custom")}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Modal>
          <div id="dicePicker" className={`${styles.picker} ${showPicker ? "" : "hidden"} absolute top-[-48px] md:mt-[-24px] scale-60 md:scale-75 md:static h-full overflow-visible`} />
          {!showPicker && (
            <form
              className="flex flex-col items-center mx-auto mt-2 gap-1 max-w-[40vw] text-center"
              onSubmit={(e) => {
                e.preventDefault();
                box?.roll(parser?.parseNotation(prompt) ?? prompt);
              }}
            >
              <a className="text-black" target="_blank" href="https://help.roll20.net/hc/en-us/articles/360037773133-Dice-Reference">
                <Tooltip className="md:text-lg" label={t("prompt")}>
                  <span>This roller uses the Roll20 Dice Notation</span>
                </Tooltip>
              </a>
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="text-xl bg-white/66 rounded-sm w-full max-w-[500px] px-2" />
              <button className="text-lg rounded-md bg-white" type="submit">
                {t("throw")}
              </button>
            </form>
          )}
          <b className={`absolute right-0 top-0 m-4 h-fit border-2 rounded-md border-(--border) text-2xl md:text-3xl p-2 md:px-4 bg-white/66`}>{result}</b>
        </div>
        <div id="diceBox" className={`${styles.box} absolute h-full rounded-md w-full shrink overflow-y-hidden z-0`} onClick={() => picker?.setNotation({d6: {count: 12}})} />
      </div>
    </div>
  );
}
