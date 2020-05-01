import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  avatar: null,
  token: null,
  login: () => {},
  logout: () => {},
});
