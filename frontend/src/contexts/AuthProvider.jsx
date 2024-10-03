import React, { useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { getUserData } from "../firebase/auth";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return unsubscribe;
  }, []);

  async function refreshCurrentUser() {
    if (currentUser && currentUser.uid) {
      const userData = await getUserData(currentUser.uid);
      setCurrentUser({ ...currentUser, ...userData });
    }
  }

  async function initializeUser(user) {
    if (user) {
      const userData = await getUserData(user.uid);
      setCurrentUser({ ...user, ...userData });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  }

  const exposedStates = {
    currentUser,
    userLoggedIn,
    loading,
    refreshCurrentUser,
  };

  return (
    <AuthContext.Provider value={exposedStates}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
