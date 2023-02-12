import React, { useEffect, useRef } from "react";
import { Form, useSearchParams, useActionData } from "react-router-dom";

const AuthForm = (props) => {
  const emailRef = useRef();
  const nameRef = useRef();
  const passwordRef = useRef();

  const data = useActionData();

  const [searchParams, setSearchParams] = useSearchParams();
  const isLogin = searchParams.get("mode") === "login";

  const signupHandler = (e) => {
    e.preventDefault();
    setSearchParams({ mode: "register" });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const data = {
      body: {
        password: passwordRef.current.value,
        email: emailRef.current.value,
      },
      isLogin: true,
    };
    if (!isLogin) {
      data.body["name"] = nameRef.current.value;
      data.isLogin = false;
    }

    props.onSubmit(data);
  };

  return (
    <div className="form-container">
      <form onSubmit={submitHandler} className="form">
        <h1 className="form__title">{isLogin ? "Login" : "Register"}</h1>
        {props.error && <p className="form__error-msg">{props.error}</p>}
        {data && <p>{data.detail}</p>}
        <div className="form__group">
          <input
            id="email"
            type="email"
            ref={emailRef}
            placeholder="Email Address"
            className="form__input"
          />
          <label htmlFor="email" className="form__label">
            Email Address
          </label>
        </div>

        {!isLogin && (
          <div className="form__group">
            <input
              id="username"
              type="text"
              ref={emailRef}
              placeholder="Username"
              className="form__input"
            />
            <label htmlFor="username" className="form__label">
              Username
            </label>
          </div>
        )}

        <div className="form__group">
          <input
            id="password"
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="form__input"
            minLength="8"
          />
          <label htmlFor="password" className="form__label">
            Password
          </label>
        </div>

        <button className="account-btn" type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
        {isLogin && (
          <p>
            Don't have an account? <a onClick={signupHandler}>Sign up</a>.
          </p>
        )}
      </form>
    </div>
  );
};

export default AuthForm;
