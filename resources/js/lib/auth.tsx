import React, {createContext, useContext, useEffect, useState} from "react";
import {LoginedUser} from "@/features/auth";
import storage from "@/utils/storage";
import AxiosClient from "@/lib/axios-client";
import toast from "react-hot-toast";
import {stateFunction} from "@/types";

type AuthContext = {
  user: LoginedUser, setUser: stateFunction<LoginedUser>, logout: () => void
};

const AuthContext = createContext<AuthContext>(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
  const [user, _setUser] = useState<LoginedUser>(false);

  const setUser = (usr: LoginedUser) => {
    if (!usr)
      _setUser(null);
    else
      _setUser({
        ...usr,
        hasRole(...roles) {
          return (roles.filter((role) => usr.roles.indexOf(role) !== -1)).length !== 0;
        }
      });
  }

  useEffect(() => {
    if (storage.getToken()) {
      AxiosClient.get('/user')
        .then(({data}) => setUser(data))
        .catch((e) => toast.error(`Произошла ошибка: ${e.message}`));
    } else
      setUser(null);
  }, []);

  const logout = () => {
    AxiosClient
      .post('/logout').then(() => {
      storage.clearToken();
      setUser(null);
    })
      .catch((e) => {
        toast.error(`Произошла ошибка при выходе: ${e.message}`);
      });
  };

  return <AuthContext.Provider value={{user, setUser, logout}}>
    {children}
  </AuthContext.Provider>
}
