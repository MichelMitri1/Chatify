import React, { useState } from "react";
import "./registerPage.css";
import { IoIosArrowBack } from "react-icons/io";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../helpers/firebase";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [registerInput, setRegisterInput] = useState({
    nameOfUser: "",
    username: "",
    email: "",
    pass: "",
  });

  async function registerUser(e) {
    e.preventDefault();
    try {
      const userApi = "http://10.40.13.145:3000/api/users/addUsers";

      const userResponse = await fetch(userApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerInput.nameOfUser,
          username: registerInput.username.replace(/\s+/g, ""),
          email: registerInput.email,
          pass: registerInput.pass,
        }),
      });

      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(
          `HTTP error! status: ${userResponse.status}, message: ${errorText}`
        );
      }

      await userResponse.json();

      await signInWithEmailAndPassword(
        auth,
        registerInput.email,
        registerInput.pass
      );

      setRegisterInput({
        nameOfUser: "",
        username: "",
        email: "",
        pass: "",
      });

      navigate("/main");
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.message);
    }
  }

  const handleRegisterInput = (e) => {
    const { name, value } = e.target;
    setRegisterInput({
      ...registerInput,
      [name]: value,
    });
  };

  return (
    <form className="registerContainer" onSubmit={(e) => registerUser(e)}>
      <Toaster />
      <div className="registerWrapper">
        <IoIosArrowBack className="backIcon" onClick={() => navigate("/")} />
        <h1 className="appName">Chatify</h1>
        <p className="registerHeader">Register An Account</p>
        <div className="registerInputsWrapper">
          <p className="registerInputHeader">
            Name<span className="red">*</span>
          </p>
          <input
            type="text"
            placeholder="John Doe"
            className="registerInput"
            name="nameOfUser"
            value={registerInput.nameOfUser}
            onChange={(e) => handleRegisterInput(e)}
          />
        </div>
        <div className="registerInputsWrapper">
          <p className="registerInputHeader">
            Username<span className="red">*</span>
          </p>
          <input
            type="text"
            placeholder="JohnDoe"
            className="registerInput"
            name="username"
            value={registerInput.username}
            onChange={(e) => handleRegisterInput(e)}
          />
        </div>
        <div className="registerInputsWrapper">
          <p className="registerInputHeader">
            Email<span className="red">*</span>
          </p>
          <input
            type="email"
            placeholder="youremail@-mail.com"
            className="registerInput"
            name="email"
            value={registerInput.email}
            onChange={(e) => handleRegisterInput(e)}
          />
        </div>
        <div className="registerInputsWrapper">
          <p className="registerInputHeader">
            Password<span className="red">*</span>
          </p>
          <input
            type="password"
            placeholder="●●●●●●●●●●●●"
            className="registerInput"
            name="pass"
            value={registerInput.pass}
            onChange={(e) => handleRegisterInput(e)}
          />
        </div>
        <button className="registerButton" onClick={(e) => registerUser(e)}>
          Register
        </button>
      </div>
    </form>
  );
}
