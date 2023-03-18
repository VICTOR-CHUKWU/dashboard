import React, { useEffect, useState } from "react";
import Router from "next/router";
import Head from "next/head";

// @ts-ignore
export const Layout: FC = (props) => {
  const [user, setUser] = useState(null);
  return (
    <div className="container-scroller">
      <Head>
        <title>{props?.name}</title>
      </Head>
      {props.children}
    </div>
  );
};
