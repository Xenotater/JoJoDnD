import HTMLInclusiveText from "../Display/HTMLInclusiveText";
import PreviewLink from "../Display/PreviewLink";
import styles from "./LevelTable.module.css";

export interface LevelTableProps {
  levels: {
    beforeEx?: string[];
    features: {
      feats?: string[];
      abilities?: string[];
      other?: string[];
    }
    afterEx?: string[];
  }[];
  beforeLabels?: string[];
  afterLabels?: string[];
  showProf?: boolean;
  headBg?: string;
}

export default function LevelTable(props: LevelTableProps) {

  const calcPB = (lvl: number) => {
    const result = Math.ceil(lvl / 4) + 1;
    return result > 6 ? 6 : result < 2 ? 2 : result;
  }

  return (
    <div className="max-w-[inherit] overflow-x-scroll">
        <table className={`table-striped ${styles.levelTable} max-w-[inherit]`}>
        <thead style={{"--bgColor": props.headBg} as React.CSSProperties} className={`bg-(--bgColor)`}>
          <tr>
            <th className="w-0">Level</th>
            {(props.showProf ?? true) &&
              <th className="w-0">Pro. Bonus</th>
            }
            {props.beforeLabels &&
              props.beforeLabels.map((l) => (<th key={`lbl-${l}`} className="w-0">{l}</th>))
            }
            <th className="w-max">Features</th></tr>
            {props.afterLabels &&
              props.afterLabels.map((l) => (<th key={`lbl-${l}`} className="w-0">{l}</th>))
            }
        </thead>
        <tbody>
          {props.levels.map((level, i) => (
            <tr key={`level-${i}`}>
              <td>{i}</td>
              {(props.showProf ?? true) &&
                <td>+{calcPB(i)}</td>
              }
              {props.beforeLabels && props.beforeLabels.map((l, j) => (
                <td key={`before-item-${i}-${j}`}>{level.beforeEx ? level.beforeEx[j] : ""}</td>
              ))}
              <td>
                {level.features.feats?.map((f, j) => (
                  <span key={`feat-${i}-${j}`}>
                    {f != "OR" ? <PreviewLink href={`/feats/${encodeURIComponent(f)}`}>{f}</PreviewLink> : "OR"}
                    {(j + 1 < level.features.feats!.length || level.features.abilities || level.features.other) &&
                      (f != "OR" && level.features.feats![j+1] != "OR" ? " | " : " ")
                    }
                  </span>
                ))}
                {level.features.abilities?.map((f, j) => (
                  <span key={`ability-${i}-${j}`}>
                    {f != "OR" ? <PreviewLink href={`/abilities/${encodeURIComponent(f)}`}>{f}</PreviewLink> : "OR"}
                    {(j + 1 < level.features.abilities!.length || level.features.other) &&
                      (f != "OR" && level.features.abilities![j+1] != "OR" ? " | " : " ")
                    }
                  </span>
                ))}
                {level.features.other?.map((f, j) => (
                  <HTMLInclusiveText as="span" key={`other-${i}-${j}`} text={f}/>
                ))}
              </td>
              {props.afterLabels && props.afterLabels.map((l, j) => (
                <td key={`before-item-${i}-${j}`}>{level.afterEx ? level.afterEx[j] : ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}