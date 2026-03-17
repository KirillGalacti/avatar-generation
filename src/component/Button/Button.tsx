import React, { ButtonHTMLAttributes, ReactNode } from "react";
import classes from "./Button.module.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isActive?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, isActive = false, ...props }) => {
  return (
    <button
      {...props}
      className={
        isActive
          ? `${classes.button} ${classes.active}`
          : classes.button
      }
    >
      {children}
    </button>
  );
};

export default Button;
