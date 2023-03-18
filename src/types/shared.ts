/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  DetailedHTMLProps,
  ButtonHTMLAttributes,
  AnchorHTMLAttributes,
  HTMLAttributes,
  RefObject,
  BlockquoteHTMLAttributes,
  ImgHTMLAttributes,
  FC,
  InputHTMLAttributes,
  CSSProperties,
  TextareaHTMLAttributes,
  ReactNode,
} from "react";

export interface LinkProps
  extends Partial<
    DetailedHTMLProps<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      HTMLAnchorElement
    >
  > {
  routeLink?: boolean;
  activeClassName?: string;
  children?: React.ReactNode;
}

export interface PaginationProps {
  limit?: number;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onChangePageLimit?: (e: any) => void;
}

export interface AuthContextValue {
  state?: { user: string; password: string };
  dispatch?: (content: any) => void;
}

export const authTypes = {
  LOGIN: "LOGIN",
  SET_STATISTICS: "SET_STATISTICS",
  LOGOUT: "LOGOUT",
};

export interface ModalProps {
  onHide: any;
  title: string;
  size: any;
  description?: string;
  cancelText?: string;
  showFooter?: boolean;
  show: boolean;
}

export interface IconProps {
  name?: SVGIconName & string;
  className?: string;
  size?: "tiny" | "small" | "medium" | "large" | "inherit";
  crop?: boolean;
  style?: CSSProperties;
  fontSize?: string;
  children?: ReactNode;
}

export type TableProp = {
  data: any;
  headers: any;
  emptyMessage?: string;
  totalPages?: number;
  totalItems?: number;
  limit?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onChangePageLimit?: (e: any) => void;
  onExport?: (e: any) => void;
  onSearch?: (e: any) => void;
  currentPage?: number;
  loading: boolean;
  paginated?: boolean;
  loadingText: string;
  searchTerm?: string;
  rowFormat: (data: any, i: number) => ReactNode;
};
export type SVGIconName =
  | "dashboard"
  | "profile"
  | "message"
  | "project"
  | "meter"
  | "disco"
  | "disbursement"
  | "user"
  | "audit"
  | "logout"
  | "plus"
  | "plus-rounded"
  | "location"
  | "calender"
  | "approved"
  | "rejected"
  | "back-arrow"
  | "close-btn"
  | "line"
  | "time"
  | "down-arrow"
  | "setting"
  | "notification"
  | "down-arrow-white"
  | "upload-profile"
  | "arrow-right"
  | "arrow-left"
  | "download"
  | "edit"
  | "ai"
  | "info"
  | "check"
  | "view"
  | "send"
  | "search"
  | "camera";
