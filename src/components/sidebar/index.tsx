import React, { useState, useEffect } from "react";
// import Link from "next/link";
import { ActiveLink } from "@components/misc";
// import { AuthContext } from "pages/_app";
import { SVGIcon } from "@src/components/shared";
type SideBarProps = {
  user?: any;
  logout: () => void;
};

export const SideBar: ({ user, logout }: SideBarProps) => JSX.Element = ({
  user,
  logout,
}: SideBarProps) => {


  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <a
            className="nav-link justify-content-between"
            data-toggle="collapse"
            href="#main"
            aria-expanded="true"
            aria-controls="doctors"
          >
            <span className="menu-title mr-2">MAIN MENU</span>
            <i className="mdi mdi-arrow-down" />
          </a>
          <div className="menu-container" id="main">
            <ul className="nav flex-column sub-menu pb-2">
              <li className="nav-item">
                <ActiveLink href={"/dashboard"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="dashboard" className="mr-2" />
                    Dashbard
                  </a>
                </ActiveLink>
              </li>
              <li className="nav-item">
                <ActiveLink href={"/profile"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="profile" className="mr-2" />
                    Profile
                  </a>
                </ActiveLink>
              </li>

            </ul>
          </div>
        </li>
        {/* <li className="nav-item">
          <a
            className="nav-link justify-content-between"
            data-toggle="collapse"
            href="#reports"
            aria-expanded="true"
            aria-controls="doctors"
          >
            <span className="menu-title mr-2">Reports</span>
            <i className="mdi mdi-arrow-down" />
          </a>
          <div className="menu-container" id="reports">
            <ul className="nav flex-column sub-menu pb-2">
            <li className="nav-item">
                <ActiveLink href={"/"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="project" className="mr-2" />
                    No Prject yet
                  </a>
                </ActiveLink>
              </li>
              <li className="nav-item">
                <ActiveLink href={"/projects"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="project" className="mr-2" />
                    Projects
                  </a>
                </ActiveLink>
              </li>
            </ul>
          </div>
        </li> */}
        <li className="nav-item">
          <a
            className="nav-link justify-content-between"
            data-toggle="collapse"
            href="#users"
            aria-expanded="true"
            aria-controls="doctors"
          >
            <span className="menu-title mr-2">Users</span>
            <i className="mdi mdi-arrow-down" />
          </a>
          <div className="menu-container" id="users">
            <ul className="nav flex-column sub-menu pb-2">
              <li className="nav-item">
                <ActiveLink href={"/new_user"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="user" className="mr-2" />
                    New Users
                  </a>
                </ActiveLink>
              </li>
              {/* <li className="nav-item">
                <ActiveLink href={"/contractors"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="user" className="mr-2" />
                    Contractors
                  </a>
                </ActiveLink>
              </li>
              <li className="nav-item">
                <ActiveLink href={"/installers"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="user" className="mr-2" />
                    Installers
                  </a>
                </ActiveLink>
              </li>
              <li className="nav-item">
                <ActiveLink href={"/others"} activeClassName={"active"}>
                  <a className="nav-link">
                    <SVGIcon name="user" className="mr-2" />
                    Others
                  </a>
                </ActiveLink>
              </li> */}
            </ul>
          </div>
        </li>

        {/* <ActiveLink activeClassName={"active"}> */}
        <li className="nav-item">
          <a className="nav-link logout-link" onClick={logout}>
            <span className="menu-title">
              <SVGIcon name="logout" className="mr-2" />
              Logout
            </span>
          </a>
        </li>
        {/* </ActiveLink> */}
      </ul>
    </nav>
  );
};
