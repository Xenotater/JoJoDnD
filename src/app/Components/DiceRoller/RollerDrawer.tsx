"use client";

import DiceBox from "@3d-dice/dice-box";
import DicePicker, {DieResult} from "@3d-dice/dice-ui/src/dicePicker";
import {useEffect, useState} from "react";

import styles from "./DiceRoller.module.css";
import {BsList} from "react-icons/bs";
import Divider from "../Layout/Divider/Divider";
import Modal from "../Layout/Modal/Modal";
import Input from "../Layout/Forms/Controlled/Input";
import { useTranslations } from "next-intl";
import DiceParser from "@3d-dice/dice-parser-interface";

export interface RollerPreset {
  name: string;
  roll: string;
}

//TODO: accept preset options in parameters, use callback to export values, allow misc rolls
export default function RollerDrawer({callback, presets}: {callback: (val: number) => void; presets?: RollerPreset[]}) {
  const [box, setBox] = useState<DiceBox>();
  const [picker, setPicker] = useState<DicePicker>();
  const [parser, setParser] = useState<DiceParser>();
  const [showPicker, setShowPicker] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState(0);

  const t = useTranslations("Misc.DiceRoller")

  const complete = (results: number | DieResult[]) => {
    setIsRolling(false);
    const value = typeof results == "number" ? results : results.reduce((total, result) => (total += result.value), 0);
    callback(value);
    setResult(value);
  };

  useEffect(() => {
    const diceParser = new DiceParser();

    const diceBox = new DiceBox({
      assetPath: "/dice-box/",
      container: "#diceBox",
      themeColor: "#a525f0",
      startingHeight: 8,
      throwForce: 6,
      spinForce: 5,
      lightIntensity: 0.9,
      scale: 7,
      onBeforeRoll: () => setIsRolling(true),
      onRollComplete: (results) => {
        complete(diceParser?.parseFinalResults(results).value ?? results);
      },
    });
    const dicePicker = new DicePicker({
      target: "#dicePicker",
      onClear: () => {
        setTimeout(() => document.querySelectorAll(".output")[0]!.textContent = t("pickerPrompt"), 0);
      },
      onSubmit: (result) => {
        diceBox?.roll(result);
      },
    });

    diceBox.init();

    setBox(diceBox);
    setPicker(dicePicker);
    setParser(diceParser);
  }, []);

  useEffect(() => {
    document.querySelectorAll(".output")[0]!.textContent = t("pickerPrompt");
    document.querySelectorAll(".action button")[0]!.textContent = t("clear");
    document.querySelectorAll(".action button")[1]!.textContent = t("throw");
  }, [picker]);

  const loadPreset = (preset?: string) => {
    setShowPicker(false);
    if (preset) {
    }
  };

  return (
    <div className="absolute bottom-[-8px] left-0 w-[100vw] h-[33vh] flex justify-center">
      <div className="content relative p-0 w-[80vw] flex flex-col overflow-y-hidden shadow-lg/66">
        <div className={`${isRolling ? "opacity-33" : ""} absolute top-0 flex justify-between w-full h-fit`}>
          <Modal closeCallback={() => setMenuOpen(false)}>
            <div>
              <div className="h-min flex items-center p-4">
                <div className="p-1.5 bg-jj-purple-1 border rounded-[50%] cursor-pointer hover:shadow-sm/33 z-2">
                  <BsList size={40} color="white" onClick={() => setMenuOpen(!menuOpen)} />
                </div>
              </div>
              {menuOpen && (
                <div className={`absolute top-[48px] left-[16px] z-1`}>
                  <div className="w-[54px] h-[64px] aspect-1/1 border-2 border-t-0 z-2 bg-jj-purple-1" />
                  <div className="border-2 whitespace-nowrap z-1 absolute top-[24px] rounded-lg rounded-tl-4xl bg-jj-purple-1 p-2 pl-4 shadow-md/30 w-fit text-xl leading-4">
                    <a onClick={() => setShowPicker(true)} className="cursor-pointer hover:underline ml-2 mr-2 text-white">
                      {t("Presets.picker")}
                    </a>
                    <Divider className="mt-2 mb-2 border-white" />
                    <a onClick={() => loadPreset()} className="cursor-pointer hover:underline ml-2 mr-2 text-white">
                      {t("Presets.custom")}
                    </a>
                    {presets?.map(p => (
                      <div key={`preset-${p.name}`}>
                        <Divider className="mt-2 mb-2 border-white" />
                        <a onClick={() => loadPreset(p.name)} className="cursor-pointer hover:underline ml-2 mr-2 text-white">
                          {p.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Modal>
          <div id="dicePicker" className={`${styles.picker} ${showPicker ? "" : "hidden"} mt-[-24px] scale-75 w-full h-fit overflow-visible`} />
          {!showPicker &&
            <div className="w-[80%] h-fit flex flex-col items-center mt-2 gap-1">
              <span className="text-lg">{t("prompt")}</span>
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} className="text-xl bg-white/66 rounded-sm max-w-[500px] px-2"/>
              <button className="text-lg rounded-md bg-white" onClick={() => box?.roll(parser?.parseNotation(prompt) ?? prompt)}>{t("throw")}</button>
            </div>
          }
          <b className={`m-4 h-fit border-2 rounded-md border-(--border) text-3xl p-2 px-4`}>{result}</b>
        </div>
        <div id="diceBox" className={`${styles.box} h-full rounded-md w-full shrink overflow-y-hidden`} onClick={() => picker?.setNotation({d6: {count: 12}})} />
      </div>
    </div>
  );
}
