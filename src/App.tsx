import type { JSX } from "react";
import { Fragment } from "react";
import SettingAvatar from "./component/SettingAvatar";
import Button from "./component/Button/Button";
import { useCharacterLoader } from "./component/hooks/useCharacterLoader";
import ToolTipComponent from "./component/Tooltip/ToolTipComponent";

export default function App(): JSX.Element {
  const {
    itemsData,
    character,
    setCharacter,
    ready,
    error,
    originalNameRef,
    reloadSavedConfig,
  } = useCharacterLoader({
    itemsUrl: "/data/catalog.json",
    configUrl: "/data/character.json",
  });

  const handleSave = (): void => {
    if (character.name !== originalNameRef.current) {
      console.log("Имя изменилось:", originalNameRef.current, "→", character.name);
      originalNameRef.current = character.name;
    } else {
      console.log("Имя не менялось:", character.name);
    }

    const payload = JSON.stringify(character, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "character_saved.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = (): void => {
    reloadSavedConfig();
  };

  if (!ready) return <div style={{ padding: 24 }}>Загрузка...</div>;

  if (error) {
    return (
      <div style={{ padding: 24, color: "red" }}>
        Ошибка загрузки: {error.message}
      </div>
    );
  }

  return (
    <Fragment>
      <section className="container" style={{ padding: "40px 24px" }}>
        <ToolTipComponent />
        <div className="setting">
          <SettingAvatar 
          character={character} 
          setCharacter={setCharacter} 
          itemsData={itemsData} 
          />
        </div>
        <div className="btn_control container" style={{ marginTop: 24, display: "flex", gap: 16 }}>
          <Button style={{ width: "auto" }} onClick={handleReset}>Сбросить</Button>
          <Button style={{ width: "auto" }} onClick={handleSave}>Сохранить</Button>
        </div>
      </section>
    </Fragment>
  );
}
