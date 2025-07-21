import {tabs} from '@/../public/data/rules.json';

export function getRulesContent() {
  return tabs;
}

export function getRuleContent(tabName: string) {
  return tabs.find((t) => t.title.toLowerCase() == tabName.toLowerCase())
}