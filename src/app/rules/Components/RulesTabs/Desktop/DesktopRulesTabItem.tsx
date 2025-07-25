import styles from "./DesktopRulesTabs.module.css";

export default function DesktopRulesTabItem({title, selected}: {title: string, selected: boolean}) {
  return (
    <div className={`${styles.rulesTab} relative flex items-center h-[50px] w-[225px] bg-jj-mpurple-1 hover:bg-jj-mpurple-2
          ${selected ? `${styles.selectedTab} z-2 bg-jj-mpurple-3 hover:bg-jj-mpurple-3 cursor-default` : ""}`}>
      <h4 className="ml-2 leading-[20px] max-w-[100px]"><b>{title}</b></h4>
    </div>
  );
}