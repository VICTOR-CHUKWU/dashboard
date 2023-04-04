import React, { FC } from "react";

interface CardProp {
  name?: string;
  // description?: string;
  children?: any;
  icon?: string;
}

export const Card: FC<CardProp> = ({ name, icon, children }) => {
  return (
    <div className="card card-curved overflow-auto bg-white mb-5 mt-3 position-relative pt-3 pb-0 w-100">
      {icon && (
        <img
          src={`/static/images/${icon}`}
          alt="Icon"
          className="position-absolute card-icon"
        />
      )}
      <div className="card-body position-relative">
        {name && <h4 className="card-name-font ml-5">{name}</h4>}
        <div>{children}</div>
        {/* <p className="card-children-font">{children}</p> */}
      </div>
    </div>
  );
};
