import {PageContext} from "./PageContext";
import {PropsWithChildren, useState} from "react";
import {SidebarType} from "./types";

export default function PageProvider({children}: PropsWithChildren) {
  const [sideBarOpened, setSideBarOpened] = useState(localStorage.getItem('sidebarOpened') === '1');
  const openSideBar = (sidebar: SidebarType) => {
    setSideBarOpened(true)
  };
  const closeSideBar = () => (sidebar: SidebarType) => {
    setSideBarOpened(false)
  };

  return <PageContext.Provider value={{
    sideBarOpened, openSideBar, closeSideBar
  }}>
    {children}
  </PageContext.Provider>
}
