import React, { useState, ChangeEvent } from "react";

interface IntroAvatarProps {
  layers?: (string | null | undefined)[]; // массив путей к слоям изображения
  name: string;
  onNameChange: (newName: string) => void;
}

const IntroAvatar: React.FC<IntroAvatarProps> = ({
  layers = [],
  name,
  onNameChange,
}) => {
  const [touched, setTouched] = useState<boolean>(false);

  // Обработка изменения имени
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = event.target.value;
    setTouched(true);
    onNameChange(value);
  };

  const hasError: boolean = touched && (!name || name.trim().length === 0);

  return (
    <section>
      <div className="intro_avatar">
        <div className="img_avatar" style={{ position: "relative" }}>
          {/* Отрисовка слоёв (каждый слой — отдельное изображение) */}
          {layers.map(
            (src, idx) =>
              src && (
                <img
                  key={idx}
                  src={src}
                  alt={`Layer ${idx}`}
                  className="layer"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              )
          )}
        </div>

        <div className="name_avatar">
          <input
            type="text"
            id="name"
            className="name_control"
            placeholder="Введите имя"
            value={name ?? ""}
            style={{
              border: hasError ? "2px solid red" : undefined,
            }}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default IntroAvatar;
