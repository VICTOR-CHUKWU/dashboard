import { errorToast } from "@src/utils";
import axios from "axios";
// import { errorToast } from "../utils/toasts";

// axios.interceptors.response.use(
//   function (successRes) {
//     if (successRes.data.status === 401) {
//       errorToast("Your session has expired please login");
//       localStorage.clear();
//       window.location.href = "/login";
//       return null;
//     }
//     return successRes;
//   },
//   function (error) {
//     if (error.response?.status === 401) {
//       errorToast("Your session has expired please login");
//       localStorage.clear();
//       window.location.href = "/login";
//       return Promise.reject(error);
//     }
//     if (error.request) {
//       // errorToast(
//       //   "You seem to be offline, check your internet connection and try again"
//       // );
//       // client never received a response, or request never left
//       return Promise.reject(error);
//     } else {
//       return Promise.reject(error);
//     }
//   }
// );

const ApiService = {
  baseUrl: "",
  init(baseURL: any) {
    ApiService.baseUrl = baseURL;
    axios.defaults.baseURL = baseURL;
  },
  getBaseUrl() {
    return ApiService.baseUrl;
  },
  setHeader(token: any) {
    axios.defaults.headers.common["x-access-token"] = `Bearer ${token}`;
  },
  removeHeader() {
    axios.defaults.headers.common = {};
  },
  get(resource: any) {
    return axios.get(resource);
  },

  post(resource: any, data: any) {
    return axios.post(resource, data);
  },

  put(resource: any, data: any) {
    return axios.put(resource, data);
  },

  delete(resource: any, data: any) {
    return axios.delete(resource, data);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data: any) {
    return axios(data);
  },
};

export { ApiService };
