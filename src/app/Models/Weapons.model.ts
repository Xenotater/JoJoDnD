export interface WeaponData {
  name: string;
  attr: string[];
  type: string;
  spec: string;
  stat: string;
  prereq: string;
  dmg: string;
  tags: string[];
}

export interface WeaponAttribute {
  desc: string;
  tooltip?: string;
}