import React, { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import "./settings.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../helpers/firebase";

export default function Settings({ currentUser, users }) {
  const navigate = useNavigate();
  const [foundCurrentUser, setFoundCurrentUser] = useState({});

  useEffect(() => {
    const foundUser = users.find((user) => user.userId === currentUser.uid);
    setFoundCurrentUser(foundUser);
  }, [users, currentUser.uid]);

  return (
    <div className="settingsContainer">
      <nav className="userInfoNav">
        <div className="userInfoHeader">
          <IoIosArrowBack onClick={() => navigate("/main")} className="icon" />
          <h1>User Info</h1>
        </div>
        <button
          className="logoutButton"
          onClick={async () => {
            await signOut(auth);
            navigate("/");
          }}
        >
          Log Out
        </button>
      </nav>
      <div className="settingsWrapper">
        <div className="userInfoContainer">
          <div className="userInfoWrapper">
            <h2 className="userInfoHeader">Username</h2>
            <p className="userInfo">{foundCurrentUser.username}</p>
          </div>
          <div className="userInfoWrapper">
            <h2 className="userInfoHeader">Email</h2>
            <p className="userInfo">{foundCurrentUser.email}</p>
          </div>
          <div className="userInfoWrapper">
            <h2 className="userInfoHeader">Name</h2>
            <p className="userInfo">{foundCurrentUser.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
