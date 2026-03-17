import React, { useState } from "react";
import classes from "./ToolTipComponent.module.css";
import logo from "/Info.svg";

const ToolTipComponent: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);

  return (
    <div className={classes.container}>
      <h1>Профиль персонажа</h1>

      <div
        className={classes.frame}
        style={{ marginLeft: 20, marginTop: 10 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img className={classes.icon_info} src={logo} alt="Информация" />

        {showTooltip && (
          <span className={classes.tooltip}>
            Здесь можно сменить внешний вид, ник, посмотреть прогресс и награды.
          </span>
        )}
      </div>
    </div>
  );
};

export default ToolTipComponent;
