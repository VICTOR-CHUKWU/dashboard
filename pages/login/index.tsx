import React, { useEffect } from "react";
import { authService } from "@services/auth.service";
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
  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null,
    });
    const { email, password } = data;
    authService
      .login(email, password)
      .then((r) => {
        dispatch({
          type: "LOGIN",
          payload: r,
        });
        Router.push("/dashboard");
      })
      .catch((error) => {
        setData({
          ...data,
          isSubmitting: false,
          errorMessage:
            error?.data?.message ||
            error?.data?.errors[0]?.message ||
            error?.statusText,
        });
        errorToast(
          error?.data?.message ||
            error?.data?.errors[0]?.message ||
            error?.statusText
        );
      });
  };
  return authState.user ? (
    <Dashboard />
  ) : (
    <main>
      <Head>
        <title>Sign In</title>
      </Head>

      <div className="container-scroller">
        <div className="container-fluid page-body-wrapper full-page-wrapper">
          <div className="content-wrapper d-flex align-items-stretch auth auth-img-bg">
            <div className={`${S.mainContainer} row flex-grow`}>
              <div className="col-lg-8"></div>
              <div className="col-lg-4 d-flex align-items-center justify-content-start ">
                <div className="auth-form-transparent text-left p-4 mr-lg-4">
                  <h4 className="text-center">Sign In</h4>

                  <form className="pt-3" onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label htmlFor="exampleInputEmail">Email</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          value={data.email}
                          onChange={handleInputChange}
                          name="email"
                          placeholder="Email"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="exampleInputPassword">Password</label>
                      <div className="input-group">
                        <input
                          type="password"
                          className="form-control form-control-lg "
                          value={data.password}
                          onChange={handleInputChange}
                          name="password"
                          placeholder="Password"
                        />
                      </div>
                    </div>

                    {/* display error message */}
                    {data.errorMessage && (
                      <span className=" text-black text-danger">
                        {data.errorMessage}
                      </span>
                    )}

                    <div className="my-3">
                      <button className="btn btn-block btn-success btn-lg font-weight-bold auth-form-btn">
                        {data.isSubmitting ? "Loading..." : "Login"}
                      </button>
                    </div>
                    
                  </form>
                  <div>
                      <Link href={'/forget_password'}>Forgot password?</Link>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
