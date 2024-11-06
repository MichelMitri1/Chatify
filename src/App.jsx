import "./App.css";
import MainPage from "./components/MainPage/MainPage";
import LoginPage from "./components/LoginPage/LoginPage";
import RegisterPage from "./components/RegisterPage/RegisterPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Settings from "./components/Settings/Settings";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./helpers/firebase";

function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await fetch(
        "http://10.40.13.145:3000/api/users/getAllUsers"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <Router>
      <div className="container">
        <div className="wrapper">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {user ? (
              <>
                <Route
                  path="/main"
                  element={<MainPage currentUser={user} users={users} />}
                />
                <Route
                  path="/settings"
                  element={<Settings currentUser={user} users={users} />}
                />
                <Route
                  path="/main/:id"
                  element={
                    <MainPage
                      currentUser={user}
                      friendRequests={[]}
                      users={users}
                    />
                  }
                />
              </>
            ) : (
              <Route path="*" element={<LoginPage />} />
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
