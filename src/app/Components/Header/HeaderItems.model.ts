export interface HeaderItem {
  name: string;
  icon: string;
  link: string;
}

export const headerItems: HeaderItem[] = [
  {
    name: "Rules",
    icon: "list",
    link: "/rules"
  },
  {
    name: "Passions",
    icon: "pencil",
    link: "/passions"
  },
  {
    name: "Races",
    icon: "person",
    link: "/races"
  },
  {
    name: "Classes",
    icon: "muscle",
    link: "/classes"
  },
  {
    name: "Familiars",
    icon: "horse",
    link: "/familiars"
  },
  {
    name: "Abilities",
    icon: "stars",
    link: "/abilities"
  },
  {
    name: "Feats",
    icon: "ribbon",
    link: "/feats"
  },
  {
    name: "Weapons",
    icon: "swords",
    link: "/weapons"
  },
  {
    name: "Artifacts",
    icon: "exclamation",
    link: "/artifacts"
  },
  {
    name: "Resources",
    icon: "pages",
    link: "/resources"
  }
]