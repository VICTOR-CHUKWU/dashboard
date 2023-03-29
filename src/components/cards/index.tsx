import React, { FC, useState } from "react";

import { useRouter } from "next/router";
import { SVGIcon } from "@components/shared";
import { data } from "jquery";

type CardProps = {
  info: {
    size: string;
    bg_class: string;
    image?: string;
    name?: string;
    text: string;
    desc?: string;
    link?: string;
    icon: string;
  };
  onClick?: any;
};

type MapProps = {
  url?: any;
  markers?: any;
  onMapClick?: (e: any) => void;
  showLabel?: any;
  mode?: any;
};

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
        <p className="card-children-font">{children}</p>
      </div>
    </div>
  );
};
