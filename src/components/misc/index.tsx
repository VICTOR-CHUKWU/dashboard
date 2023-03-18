import { useRouter } from "next/router";
import Link from "next/link";
import React, { FC, Children } from "react";
import { Spinner } from "react-bootstrap";
import { LinkProps } from "src/types";

export const ActiveLink: FC<Omit<LinkProps, "routeLink">> = ({
  children,
  activeClassName,
  href,
  ...props
}) => {
  const { asPath } = useRouter();
  const child: any = Children.only(children);
  const childClassName: any = child.props.className || "";

  const className =
    asPath === href || asPath.includes(href || "")
      ? `${childClassName} ${activeClassName}`.trim()
      : childClassName;

  return (
    //@ts-ignore
    <Link href={(href as string) || ""} {...props}>
      {React.cloneElement(child, {
        className: className || null,
      })}
    </Link>
  );
};

export const Loader: FC<{ text?: string }> = ({ text }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "280px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Spinner animation="border" role="status" variant="info">
        <span className="sr-only">Loading...</span>
      </Spinner>
      <div style={{ marginTop: "20px" }}>{text}</div>
    </div>
  );
};
