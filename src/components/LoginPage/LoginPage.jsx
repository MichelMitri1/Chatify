import React, { useState } from "react";
import "./loginPage.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { auth } from "../../helpers/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    pass: "",
  });

  const loginUserAux = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginInfo.email,
        loginInfo.pass
      );

      if (user) {
        toast.success("User logged in!");
        navigate("/main");
      } else {
        toast.error("Login failed!");
      }
    } catch (error) {
      toast.error("Cannot login user!");
    }
  };

  const handleLoginInfo = (e) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  return (
    <form className="loginpageContainer" onSubmit={(e) => loginUserAux(e)}>
      <Toaster />
      <div className="loginpageWrapper">
        <h1 className="appName">Chatify</h1>
        <p className="loginHeader">Sign in To Use the App Now</p>
        <div className="loginInputsWrapper">
          <p className="loginInputHeader">
            Email<span className="red">*</span>
          </p>
          <input
            type="email"
            placeholder="youremail@-mail.com"
            className="loginInput"
            name="email"
            onChange={(e) => handleLoginInfo(e)}
          />
        </div>
        <div className="loginInputsWrapper">
          <p className="loginInputHeader">
            Password<span className="red">*</span>
          </p>
          <input
            type="password"
            name="pass"
            placeholder="●●●●●●●●●●●●"
            className="loginInput"
            onChange={(e) => handleLoginInfo(e)}
          />
        </div>
        <button className="loginButton" onClick={(e) => loginUserAux(e)}>
          Login
        </button>
        <a href="/register" className="registerLink">
          Dont Have an Account?
        </a>
      </div>
    </form>
  );
}
