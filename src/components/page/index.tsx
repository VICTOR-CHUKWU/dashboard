import React, { FC, useEffect } from "react";
import { Layout } from "@components/layout";
import { NavBar } from "@components/navigation";
import { SideBar } from "@components/sidebar";
import { AuthContext } from "../../../pages/_app";
import { authTypes } from "@src/types";

type pageProp = {
  name?: string;
  children?: React.ReactNode;
};

export const Page: FC<pageProp> = (props) => {
  const { state: authState, dispatch } = React.useContext(AuthContext);

  const onLogout = () => {
    dispatch({ type: authTypes.LOGOUT });
    window.location.href = "/login";
  };

  return (
    <Layout name={props?.name}>
      <NavBar logout={onLogout} />
      <div className="container-fluid page-body-wrapper">
        <SideBar logout={onLogout} />
        <div className="main-panel">
          <div className="content-wrapper">{props.children}</div>
        </div>
      </div>
    </Layout>
  );
};
