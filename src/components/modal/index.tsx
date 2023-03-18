import React, { FC } from "react";
import ModalJSX from "react-bootstrap/Modal";
import Header from "react-bootstrap/ModalHeader";
import Title from "react-bootstrap/ModalTitle";
import Body from "react-bootstrap/ModalBody";
import Footer from "react-bootstrap/ModalBody";
import Button from "react-bootstrap/Button";
// import { ModalProps } from "@src/types";
type modalProp = {
  onHide: any;
  title: string;
  size: any;
  description?: string;
  cancelText?: string;
  showFooter?: boolean;
  show: boolean;
  children?: React.ReactNode;
  className?: any;
};

export const Modal: FC<modalProp> = (props) => {
  return (
    <ModalJSX {...props} aria-labelledby="contained-modal-title-vcenter">
      <Header closeButton>
        <Title id="contained-modal-title-vcenter" className="h5">
          {props?.title}
        </Title>
      </Header>
      <Body>{props.children}</Body>
      {props?.showFooter && (
        <Footer>
          <Button className={"btn-info btn-sm"} onClick={props?.onHide}>
            {props?.cancelText || "Cancel"}
          </Button>
        </Footer>
      )}
    </ModalJSX>
  );
};
