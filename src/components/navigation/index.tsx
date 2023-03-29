import React, { useState, useEffect } from "react";
import styles from "./style.module.scss";
import Link from "next/link";
import { useRouter } from "next/router";
import { SVGIcon } from "@components/shared";
import S from "./style.module.scss";

type NavProps = {
  user?: any;
  logout: () => void;
};

export const NavBar: ({ logout }: NavProps) => JSX.Element = ({
  logout,
}: NavProps) => {
  const router = useRouter();
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);



  const showSettings = () => {
    setShowSettingsModal(!showSettingsModal);
  };


  const closeSide = () => {
    console.log("close clicked");
    var body = $("body");
    if (
      body.hasClass("sidebar-toggle-display") ||
      body.hasClass("sidebar-absolute")
    ) {
      body.toggleClass("sidebar-hidden");
    } else {
      body.toggleClass("sidebar-icon-only");
    }
  };



  return (
    <>
      <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link href="/dashboard">
            <a className={`navbar-brand brand-logo ${styles.logo}`}>
              {/* <h3>AWADE</h3> */}
              <img src="/static/images/Logo-updated.png" alt="logo" />
            </a>
          </Link>
          {/* 
        <a className={`logo-small ${styles.logo_sm}`} href="/">
          AWADE
          <img src="/static/images/logo.png" alt="logo" />
        </a> */}
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button
            onClick={() => {
              closeSide();
            }}
            className="navbar-toggler navbar-toggler align-self-center"
            type="button"
            data-toggle="minimize"
          >
            <span className="mdi mdi-menu"></span>
          </button>
          <ul className="navbar-nav navbar-nav-right">
            <li
              onClick={() => {
                showSettings();
              }}
              className="nav-item cursor-pointer nav-logout d-none d-lg-block"
            >
              <span className="nav-link">
                <SVGIcon name="setting" />
              </span>
            </li>

            <li
              onClick={() => setShowNotificationsModal(true)}
              className="nav-item cursor-pointer nav-logout d-none d-lg-block"
            >
              <span className="nav-link">
                <SVGIcon name="notification" />
              </span>
            </li>

          </ul>

          <button
            className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
            type="button"
            data-toggle="offcanvas"
          >
            <span className="mdi mdi-menu" />
          </button>
        </div>
      </nav>

    </>
  );
};
