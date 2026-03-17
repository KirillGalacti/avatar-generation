export type CategoryKey = 'head' | 'tors' | 'hands' | 'legs' | 'accessories';

export interface ItemVariants {
  default: string;
  [colorId: string]: string; // путь к изображению для цвета
}

export interface Item {
  id: string;
  name: string;
  image?: string;
  variants: ItemVariants;
}

export type ItemsData = Record<string, Item[]>;

export interface Character {
  name: string;
  items: Record<string, string>;  // ❗ без null
  colors: Record<string, string>;
}
