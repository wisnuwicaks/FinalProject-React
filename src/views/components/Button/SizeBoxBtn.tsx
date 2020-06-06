import React, { CSSProperties } from "react";
import "./SizeBoxBtn.css";

type ButtonTypes = {
  children: any;
  style?: CSSProperties;
  className?: string;
  onClick?: any;
};

const SizeBoxBtn = (props: ButtonTypes) => {
  let { children, style, className, onClick } = props;

  return (
    <div
      style={style}
      onClick={onClick}
      className={`sizeBoxBtn ${className}`}
    >
      {children}
    </div>
  );
};

export default SizeBoxBtn;
