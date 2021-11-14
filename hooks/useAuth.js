import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import * as Google from "expo-google-app-auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@firebase/auth";
import { auth } from "../firebase";

// video link
// https://www.youtube.com/watch?v=qJaFIGjyRms&t=2608s

const AuthContext = createContext({});
// https://console.cloud.google.com/apis/credentials?project=tinder-rn-29674&pli=1
const config = {
  androidClientId:
    "941684956060-mr3iev04fl09tqdakac3vf7asjarq981.apps.googleusercontent.com",
  iosClientId:
    "941684956060-enfk01kh6fdo6u7787cfumq2cut8t6km.apps.googleusercontent.com",
  scropes: ["profile", "email"],
  permissions: ["public_profile", "email", "gender", "location"],
};

export const AuthProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(
    () =>
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // logged in
          setUser(user);
        } else {
          // error / logout
          setUser(null);
        }
        setLoadingInitial(false);
      }),
    []
  );

  const signInWithGoogle = async () => {
    setLoading(true);

    await Google.logInAsync(config)
      .then(async (loginResult) => {
        if (loginResult.type === "success") {
          // login
          const { idToken, accessToken } = loginResult;
          const credential = GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          await signInWithCredential(auth, credential);
        }
        return Promise.reject();
      })
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  const logout = () => {
    setLoading(true);
    signOut(auth)
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  };

  // cache
  // only re-render based on array[]
  const memoValue = useMemo(
    () => ({
      user: user,
      loading: loading,
      error: error,
      signInWithGoogles: signInWithGoogle,
      logout: logout,
    }),
    [user, loading, error]
  );

  return (
    <AuthContext.Provider value={memoValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
