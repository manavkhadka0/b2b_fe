export interface MajorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
}

export interface SubMajorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
  major_group: MajorGroup;
}

export interface MinorGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  description: string;
  sub_major_group: SubMajorGroup;
}

export interface UnitGroup {
  id: number;
  code: string;
  title: string;
  slug: string;
  minor_group: MinorGroup;
}
