import styles from "./MobileRulesTabs.module.css"

export default function MobileRulesTabItem({title, selected}: {title: string, selected: boolean}) {
  return (
    <div className={`${styles.rulesTab} relative h-fit w-[35px] pt-2 pb-2 bg-jj-mpurple-1 hover:bg-jj-mpurple-2 hover:z-2
        ${selected ? `${styles.selectedTab} z-2 bg-jj-mpurple-3 hover:bg-jj-mpurple-4` : ""}`}>
      <h3 className={`${styles.tabText} text-nowrap pt-5 pb-2 w-[35px] mr-[-1px] mt-[-9px] flex items-center`}><b>{title}</b></h3>
    </div>
  )
}