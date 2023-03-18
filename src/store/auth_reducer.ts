import { ApiService } from "@src/services/api.service";
import { authTypes } from "@src/types";
export const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  statistics: null,
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case authTypes.LOGIN:
      let token =
        action?.payload?.data?.token ||
        action?.payload?.token ||
        action?.payload?.user?.token;
      localStorage.setItem(
        "user",
        JSON.stringify(action.payload?.user || action.payload.data)
      );
      localStorage.setItem("token", token);
      ApiService.setHeader(token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload?.user || action.payload.data,
        token: token,
      };
    case authTypes.SET_STATISTICS:
      return {
        ...state,
        statistics: action.payload,
      };
    case authTypes.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
