import React, { useState, useEffect } from "react";
import styled from "styled-components";
import classes from "./Button/Button.module.css";
import TabSection from "./TabSection";
import IntroAvatar from "./IntroAvatar";
import Information from "./Information";
import type { Character, ItemsData, Item } from "../types/avatar";

interface SettingAvatarProps {
  character: Character;
  setCharacter: React.Dispatch<React.SetStateAction<Character>>;
  itemsData: ItemsData;
}

const SectionContainer = styled.section`
  padding: 2rem;
`;

const SettingAvatar: React.FC<SettingAvatarProps> = ({ character, setCharacter, itemsData }) => {
  const palette = [
    { id: "default", color: "#ffffff" },
    { id: "blue", color: "#3490dc" },
    { id: "green", color: "#38c172" },
    { id: "red", color: "#e3342f" },
    { id: "purple", color: "#800080" },
  ];

  const [activeCategory, setActiveCategory] = useState<string>("head");
  const allItems: Item[] = itemsData[activeCategory] || [];

  const selectedId = character.items?.[activeCategory] || ""; // ❗ теперь всегда строка
  const selectedColor = character.colors?.[activeCategory] || "default";

  useEffect(() => {
    if (!character || !allItems.length) return;
    if (!character.items?.[activeCategory]) {
      setCharacter((prev) => ({
        ...prev,
        items: {
          ...prev.items,
          [activeCategory]: allItems[0].id,
        },
      }));
    }
  }, [activeCategory, allItems, character, setCharacter]);

  const handleSelectItem = (itemId: string) => {
    setCharacter((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        [activeCategory]: itemId,
      },
    }));
  };

  const handleColorChange = (colorId: string) => {
    setCharacter((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [activeCategory]: colorId,
      },
    }));
  };

  const layers = Object.keys(character.items || {}).map((category) => {
    const itemId = character.items[category] || ""; // ❗ строка
    const colorId = character.colors?.[category] || "default";
    const itemObj = itemsData[category]?.find((i) => i.id === itemId);
    if (!itemObj) return null;
    return itemObj.variants[colorId] || itemObj.variants.default;
  });

  return (
    <>
      <IntroAvatar
        layers={layers}
        name={character.name}
        onNameChange={(newName) => setCharacter((prev) => ({ ...prev, name: newName }))}
      />

      <section className="setting-avatar">
        <TabSection active={activeCategory} onChange={setActiveCategory} />

        <SectionContainer>
          <div className="grid_container" style={{ marginBottom: "2rem" }}>
            {allItems.map((item) => {
              const isActive = selectedId === item.id;
              const imgSrc = item.variants.default || item.image || null;
              return (
                <div className="container_btn" key={item.id}>
                  <button
                    onClick={() => handleSelectItem(item.id)}
                    className={
                      isActive
                        ? `${classes.grid_item} ${classes.grid_item_active}`
                        : classes.grid_item
                    }
                  >
                    {imgSrc && <img src={imgSrc} alt={item.name} />}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="frame">
            <p className="centered" style={{ padding: "19px 0 30px 0", fontSize: "24px", fontWeight: "bold" }}>
              Цвет
            </p>
            <div className="row_container">
              {palette.map((p) => {
                const isActiveColor = selectedColor === p.id;
                return (
                  <div className="container_btn" key={p.id}>
                    <button
                      onClick={() => handleColorChange(p.id)}
                      style={{ backgroundColor: p.color }}
                      className={isActiveColor ? `${classes.pallete} ${classes.pallete_active}` : classes.pallete}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </SectionContainer>
      </section>
      <Information />
    </>
  );
};

export default SettingAvatar;
