import {createContext, useContext} from "react";
import {TAuthContext} from "./types";

export const AuthContext = createContext<TAuthContext>(null);
const useAuth = () => useContext(AuthContext);
export default useAuth;
