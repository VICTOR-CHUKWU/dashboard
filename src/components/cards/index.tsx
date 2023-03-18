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
  description?: string;
  children?: any;
}

export const Card: FC<CardProp> = ({ name, description, children }) => {
  return (
    <div className="card card-curved overflow-auto">
      <div className="card-body">
        <h4 className="card-title font-weight-bold">{name}</h4>
        <p className="card-description"> {description}</p>
        {children}
      </div>
    </div>
  );
};


