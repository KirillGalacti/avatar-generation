import { useState, useEffect, useRef, useCallback } from "react";
import type { CategoryKey, ItemsData, Character, Item } from "../../types/avatar";

const DEFAULT_CATEGORIES: CategoryKey[] = ['head','tors','legs','hands','accessories'];

async function safeParseJson<T = any>(response: Response, label: string): Promise<T> {
  const contentType = response.headers.get("content-type") || "";
  const text = await response.text();
  if (!contentType.includes("application/json")) {
    console.error(`${label} expected JSON but got:`, text.slice(0, 500));
    throw new Error(`${label} is not valid JSON (content-type: ${contentType})`);
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`${label} JSON parse error, raw:`, text.slice(0, 500));
    throw e;
  }
}

export function useCharacterLoader({
  itemsUrl = "/data/test.json",
  configUrl = "/data/character.json",
  categories = DEFAULT_CATEGORIES,
}: {
  itemsUrl?: string;
  configUrl?: string;
  categories?: CategoryKey[];
} = {}) {
  const [itemsData, setItemsData] = useState<ItemsData>({});
  const [character, setCharacter] = useState<Character>({
    name: "",
    items: {},
    colors: {},
  });
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const originalNameRef = useRef<string>("");

  const loadAll = useCallback(async () => {
    try {
      setReady(false);
      setError(null);

      const [itemsRes, savedRes] = await Promise.all([
        fetch(itemsUrl),
        fetch(configUrl),
      ]);

      if (!itemsRes.ok) throw new Error(`Failed to fetch items: ${itemsRes.status}`);
      if (!savedRes.ok) throw new Error(`Failed to fetch config: ${savedRes.status}`);

      const itemsJson = await safeParseJson<ItemsData>(itemsRes, "items.json");
      const saved = await safeParseJson<Character>(savedRes, "character.json");

      setItemsData(itemsJson);

      const initItems: Record<string, string> = {};
      const initColors: Record<string, string> = {};

      categories.forEach((cat) => {
        const available: Item[] = Array.isArray(itemsJson[cat]) ? itemsJson[cat] : [];
        const savedItemId = saved.items?.[cat];
        const savedColor = saved.colors?.[cat] || "default";

        initItems[cat] =
          savedItemId && available.find((i) => i.id === savedItemId)
            ? savedItemId
            : available.length
            ? available[0].id
            : ""; // ❗ вместо null — пустая строка

        initColors[cat] = savedColor;
      });

      setCharacter({
        name: saved.name || "",
        items: initItems,
        colors: initColors,
      });

      originalNameRef.current = saved.name || "";
      setReady(true);
    } catch (e) {
      console.error("Ошибка загрузки character/config:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
      setReady(false);
    }
  }, [itemsUrl, configUrl, categories]);

  const reloadSavedConfig = useCallback(async () => {
    try {
      if (!itemsData || Object.keys(itemsData).length === 0) return;

      const savedRes = await fetch(configUrl);
      if (!savedRes.ok) throw new Error(`Failed to fetch config: ${savedRes.status}`);
      const saved = await safeParseJson<Character>(savedRes, "character.json");

      const initItems: Record<string, string> = {};
      const initColors: Record<string, string> = {};

      categories.forEach((cat) => {
        const available = Array.isArray(itemsData[cat]) ? itemsData[cat] : [];
        const savedItemId = saved.items?.[cat];
        const savedColor = saved.colors?.[cat] || "default";

        initItems[cat] =
          savedItemId && available.find((i) => i.id === savedItemId)
            ? savedItemId
            : available.length
            ? available[0].id
            : ""; // ❗ без null

        initColors[cat] = savedColor;
      });

      setCharacter({
        name: saved.name || "",
        items: initItems,
        colors: initColors,
      });
      originalNameRef.current = saved.name || "";
      setError(null);
    } catch (e) {
      console.error("Ошибка reloadSavedConfig:", e);
      setError(e instanceof Error ? e : new Error(String(e)));
    }
  }, [configUrl, itemsData, categories]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    itemsData,
    character,
    setCharacter,
    ready,
    error,
    originalNameRef,
    reloadSavedConfig,
    reloadAll: loadAll,
  };
}
