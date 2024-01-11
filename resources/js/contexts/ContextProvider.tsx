import {createContext, useContext, useEffect, useState} from "react";
import axiosClient from "../axios-client.jsx";
import toast from "react-hot-toast";
import LoadingArea from "../components/LoadingArea.jsx";
import React from "react";

type LoginedUser = null | (user & {
  hasRole: (...roles:Role[]) => boolean,
})

type StateContext = {
  user: LoginedUser,
  setUser: (user: LoginedUser) => void,
  token: string,
  setToken: (token: string) => void,
}

const StateContext = createContext<StateContext>(null);

export const ContextProvider = ({children}) => {
  const [user, _setUser] = useState<LoginedUser>(null);
  const [token, _setToken] = useState<string>(localStorage.getItem('ACCESS_TOKEN'));

  const setToken = (token: string) => {
    _setToken(token);
    if(token)
      localStorage.setItem('ACCESS_TOKEN', token);
    else
      localStorage.removeItem('ACCESS_TOKEN');
  }

  const setUser = (usr: LoginedUser) => {
    _setUser({...usr,
      hasRole(...roles) {
        return (roles.filter((role) => usr.roles.indexOf(role) !== -1)).length !== 0;
      }
    })
  }

  return (
    <StateContext.Provider value={{
      user, setUser,
      token, setToken,
    }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);


export function Authorized({children}) {
  const {user, setUser} = useStateContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get('/user').then(({data}) => {
      setUser(data);
    }).catch((e) => {
      toast.error(`Произошла ошибка: ${e.message}`);
    }).finally(() => setLoading(false));
  }, []);

  return (loading && !user) ? <LoadingArea/> : children;
}
