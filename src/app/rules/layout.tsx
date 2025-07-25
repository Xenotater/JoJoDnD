import RulesTabs from "./Components/RulesTabs/RulesTabs";
import PageTitle from "../Components/Layout/Typography/PageTitle";

import styles from "./Rules.module.css";

export const metadata = {
  title: "Rules",
  description: "Basic rules for JoJo's Bizarre Tabletop Game"
}

export default function RulesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="w-full">
			<PageTitle title="Rules of the Game"/>
			<div className="flex w-full flex-wrap min-h-[80%] content-start">
				<RulesTabs/>
				<div className={`${styles.rulesContentWrapper} content grow z-1 w-[85%] min-h-[70vh]`}>
					{children}
				</div>
			</div>
		</div>
	);
}