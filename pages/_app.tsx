import type { AppProps } from "next/app";
import "@public/static/vendors/lightgallery/css/lightgallery.css";
import "@public/static/css/vendor.bundle.base.css";
import "@styles/app.scss";
import Head from "next/head";
import Script from "next/script";
import React, { useEffect, createContext } from "react";
import { getToken } from "@src/utils";
import { ApiService } from "@src/services";
import { initialState, reducer } from "@src/store";
import { ToastContainer } from "react-toastify";
import { authTypes } from "@src/types";

import { useRouter } from "next/router";

export const AuthContext = createContext<any>(null);

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const _window = globalThis || window;
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const [boms, SetBoms] = React.useState(true);
  const onLogin = /login/.test(router.pathname);

  //add base url
  ApiService.init(process.env.NEXT_PUBLIC_BASE_URL);

  // useEffect(() => {
  //   if (getToken()) {
  //     const user = JSON.parse(localStorage.getItem("user") || "");
  //     const token = localStorage.getItem("token");
  //     document.body.className += "sidebar-fixed";
  //     ApiService.setHeader(token);
  //     dispatch({
  //       type: "LOGIN",
  //       payload: { user, token },
  //     });
  //     // Get stats for dashbaord from root
  //   } else {
  //     dispatch({ type: authTypes.LOGOUT });
  //     if (!onLogin) {
  //       window.location.href = "/login";
  //     }
  //   }
  //   setTimeout(() => {
  //     SetBoms(true);
  //   }, 300);
  // }, []);

  useEffect(() => {
    _window.document.querySelector("html")!.lang = "en-UK";
    setTimeout(() => {
      _window.document.querySelector("head")!.insertAdjacentHTML(
        "afterbegin",
        `
        <link rel="stylesheet" href="/static/css/vendor.bundle.base.css" />
        <link rel="stylesheet" href="/static/vendors/lightgallery/css/lightgallery.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.9.0/css/bootstrap-datepicker.min.css"
        />
        <link
          rel="stylesheet"
          href="//cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css"
        />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
          rel="stylesheet"
        />
        <link
        href="https://fonts.googleapis.com/css?family=Poppins:400,500,600&amp;display=swap"
        rel="stylesheet"
      />
      <link
      rel="stylesheet"
      href="https://cdn.materialdesignicons.com/5.4.55/css/materialdesignicons.min.css"
    />
    <script
    src="https://upload-widget.cloudinary.com/global/all.js"
    type="text/javascript"
  />
    `
      );
    }, 25);

    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          src="https://upload-widget.cloudinary.com/global/all.js"
          type="text/javascript"
        />
        <link rel="shortcut icon" href="/static/images/logo-a.png" />
      </Head>
      <Script src="https://code.jquery.com/jquery-3.6.0.min.js" />
      <Script src="/static/js/vendor.bundle.base.js" />
      <Script src="/static/js/misc.js" />
      <Script src="/static/js/datatables.js" />
      {/* <Script src="/static/vendors/lightgallery/js/lightgallery-all.min.js" /> */}
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js" />
      {boms ? <Component {...pageProps} /> : <div>Loading</div>}

      <ToastContainer />
    </AuthContext.Provider>
  );
}

export default MyApp;
