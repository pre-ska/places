//12-16
import { useState, useCallback, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  //refactoring u 12-15
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);
  const [avatar, setAvatar] = useState();

  //12-14 refacturing
  const login = useCallback((uid, token, avatar, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setAvatar(avatar);

    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(tokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        avatar: avatar,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null); //12-15
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  //12-15
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  //12-14
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.avatar,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId, avatar };
};
