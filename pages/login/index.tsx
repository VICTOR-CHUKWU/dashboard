import React, { useEffect } from "react";
// import { authService } from "@services/auth.service";
import { errorToast } from "@src/utils/toaster";
import Dashboard from "../dashboard";
import Router, { useRouter } from "next/router";
import Head from "next/head";
import { AuthContext } from "../_app";
import { reducer } from "@src/store/auth_reducer";
import S from "./index.module.scss";
import Link from "next/link";

const initialState = {
  email: "",
  password: "",
  isSubmitting: false,
  errorMessage: null,
};

const Login: React.FC = () => {
  const { dispatch, state: authState } = React.useContext(AuthContext);
  const [data, setData] = React.useState(initialState);
  const router = useRouter();
  useEffect(() => {
    if (authState.user && authState.token) {
      Router.replace("", "/dashboard", { shallow: true });
    }
  }, [authState]);

  const handleInputChange = (event: any) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };
  // const handleFormSubmit = (event: any) => {
  //   event.preventDefault();
  //   setData({
  //     ...data,
  //     isSubmitting: true,
  //     errorMessage: null,
  //   });
  //   const { email, password } = data;
  //   authService
  //     .login(email, password)
  //     .then((r) => {
  //       dispatch({
  //         type: "LOGIN",
  //         payload: r,
  //       });
  //       Router.push("/dashboard");
  //     })
  //     .catch((error) => {
  //       setData({
  //         ...data,
  //         isSubmitting: false,
  //         errorMessage:
  //           error?.data?.message ||
  //           error?.data?.errors[0]?.message ||
  //           error?.statusText,
  //       });
  //       errorToast(
  //         error?.data?.message ||
  //           error?.data?.errors[0]?.message ||
  //           error?.statusText
  //       );
  //     });
  // };
  return authState.user ? (
    <Dashboard />
  ) : (
    <main>
      <Head>
        <title>Sign In</title>
      </Head>


    </main>
  );
};

export default Login;
