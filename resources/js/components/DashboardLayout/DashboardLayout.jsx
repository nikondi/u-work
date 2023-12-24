import SidebarNavLink from "../SidebarNavLink.jsx";
import ErrorBoundary from "../ErrorBoundary.jsx";
import {Link, Outlet} from "react-router-dom";
import axiosClient from "../../axios-client.jsx";
import toast from "react-hot-toast";
import {useStateContext} from "../../contexts/ContextProvider.jsx";
import {useMemo, useState} from "react";
import HasRole from "../HasRole.jsx";

const initialOpenedSidebar = localStorage.getItem('sidebarOpened') === '1';

export default function DashboardLayout() {
  const {user, setUser, setToken} = useStateContext();
  const [openedSidebar, _setOpenedSidebar] = useState(initialOpenedSidebar);
  const [mobileOpenedSidebar, setMobileOpenedSidebar] = useState(false);

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post('/logout').then(() => {
      setUser({});
      setToken(null);
    }).catch((e) => {
      toast.error(`Произошла ошибка при выходе: ${e.message}`);
    });
  }

  const setOpenedSidebar = (val) => {
    localStorage.setItem('sidebarOpened', val?'1':'0');
    _setOpenedSidebar(val);
  }

  const sidebarClass = useMemo(() => {
    let classes = 'sidebar';
    if(openedSidebar)
      classes += ' expanded';
    if(mobileOpenedSidebar)
      classes += ' opened';
    return classes;
  }, [openedSidebar, mobileOpenedSidebar]);


  return (
    <div className="dark:text-white text-gray-800 h-screen flex overflow-hidden text-sm">
      <div className={sidebarClass}>
        <div className="px-3 pt-3 hidden sm:inline-block">
          <BurgerButton active={openedSidebar} setActive={setOpenedSidebar} title={openedSidebar?'Скрыть меню':'Открыть меню'} />
        </div>
        <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-2 p-3 w-full">
          <HasRole roles={['admin']}>
            <SidebarNavLink to="/users" activeOn="/users/.*">
              <svg className="h-5" viewBox="0 0 512 512"><path d="M437.02 330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521 243.251 404 198.548 404 148 404 66.393 337.607 0 256 0S108 66.393 108 148c0 50.548 25.479 95.251 64.262 121.962-36.21 12.495-69.398 33.136-97.281 61.018C26.629 379.333 0 443.62 0 512h40c0-119.103 96.897-216 216-216s216 96.897 216 216h40c0-68.38-26.629-132.667-74.98-181.02zM256 256c-59.551 0-108-48.448-108-108S196.449 40 256 40s108 48.448 108 108-48.449 108-108 108z" fill="currentColor"></path></svg>
              <span>Пользователи</span>
            </SidebarNavLink>
          </HasRole>
          <HasRole roles={['manager']}>
            <SidebarNavLink to="/requests" activeOn="/requests/.*">
              <svg width="20" viewBox="0 0 512 512" className="h-5"><g><path d="M352.459 220c0-11.046-8.954-20-20-20h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20zM126.459 280c-11.046 0-20 8.954-20 20s8.954 20 20 20H251.57c11.046 0 20-8.954 20-20s-8.954-20-20-20H126.459z" fill="currentColor"></path><path d="M173.459 472H106.57c-22.056 0-40-17.944-40-40V80c0-22.056 17.944-40 40-40h245.889c22.056 0 40 17.944 40 40v123c0 11.046 8.954 20 20 20s20-8.954 20-20V80c0-44.112-35.888-80-80-80H106.57c-44.112 0-80 35.888-80 80v352c0 44.112 35.888 80 80 80h66.889c11.046 0 20-8.954 20-20s-8.954-20-20-20z" fill="currentColor"></path><path d="M467.884 289.572c-23.394-23.394-61.458-23.395-84.837-.016l-109.803 109.56a20.005 20.005 0 0 0-5.01 8.345l-23.913 78.725a20 20 0 0 0 24.476 25.087l80.725-22.361a19.993 19.993 0 0 0 8.79-5.119l109.573-109.367c23.394-23.394 23.394-61.458-.001-84.854zM333.776 451.768l-40.612 11.25 11.885-39.129 74.089-73.925 28.29 28.29-73.652 73.514zM439.615 346.13l-3.875 3.867-28.285-28.285 3.862-3.854c7.798-7.798 20.486-7.798 28.284 0 7.798 7.798 7.798 20.486.014 28.272zM332.459 120h-206c-11.046 0-20 8.954-20 20s8.954 20 20 20h206c11.046 0 20-8.954 20-20s-8.954-20-20-20z" fill="currentColor"></path></g></svg>
              <span>Заявки</span>
            </SidebarNavLink>
            <SidebarNavLink to="/clients" activeOn="/clients/.*">
              <svg width="20" viewBox="0 0 32 32"><g><g fill="currentColor" fillRule="evenodd" clipRule="evenodd"><path d="M11 8a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zm-7.5 5.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zM21.184 6h.004a7.5 7.5 0 0 1 0 15 1 1 0 1 1 0-2 5.5 5.5 0 0 0 .001-11 5.813 5.813 0 0 0-1.502.203 1 1 0 0 1-.524-1.93A7.813 7.813 0 0 1 21.184 6z"></path><path d="M11 21a10 10 0 0 0-8.182 4.25 1 1 0 1 1-1.636-1.15 12 12 0 0 1 19.636 0 1 1 0 0 1-1.636 1.15A10 10 0 0 0 11 21zM25.798 22.124A9.988 9.988 0 0 0 21.188 21a1 1 0 1 1-.001-2 11.987 11.987 0 0 1 9.819 5.1 1 1 0 1 1-1.637 1.15 9.988 9.988 0 0 0-3.57-3.126z"></path></g></g></svg>
              <span>Клиенты</span>
            </SidebarNavLink>
          </HasRole>
        </div>
      </div>
      <div className="flex-grow overflow-hidden h-full flex flex-col">
        <div className="topbar">
          <div>
            <BurgerButton active={mobileOpenedSidebar} setActive={setMobileOpenedSidebar} className="sm:hidden" />
            <Link to="/" className="hidden sm:block">
              <svg width="120" viewBox="0 0 238 96"><style type="text/css">{'.st0{fill:#636363;}.st1{fill:#246BFD;}.st2{fill:#0f0f0f;} @media (prefers-color-scheme: dark) {.st0{fill:#B7B7B7;}.st1{fill:#44c9bd;}.st2{fill:#F5F5F5;}}'}</style><path className="st0" d="M146.2,51.5v12.9h3.6V59C148.1,56.9,146.8,54.3,146.2,51.5z"/><path className="st0" d="M120.5,51.5v12.9h-3.6V59C118.6,56.9,119.9,54.3,120.5,51.5z"/><path className="st0" d="M33,51.5v12.9h-3.6V59C31.2,56.9,32.4,54.3,33,51.5z"/><path className="st0" d="M29.4,44.5V31.5H33v5.4C31.2,39.1,29.9,41.6,29.4,44.5z"/><path className="st0" d="M205,51.5v12.9h3.6V59C206.8,56.9,205.6,54.3,205,51.5z"/><path className="st0" d="M179.2,51.5v12.9h-3.6V59C177.4,56.9,178.7,54.3,179.2,51.5z"/><path className="st0" d="M177.2,40.1c-2.8-5.1-8.2-8.6-14.5-8.6c-6.2,0-11.7,3.4-14.5,8.5c0.9,1.7,1.5,3.7,1.8,5.7c1.1-6,6.3-10.6,12.7-10.6c6.3,0,11.6,4.6,12.7,10.6C175.7,43.7,176.3,41.8,177.2,40.1z"/><path className="st0" d="M118.5,40.1c-2.8-5.1-8.2-8.6-14.5-8.6c-8.9,0-16.2,7.1-16.5,16h3.6c0.3-6.9,5.9-12.3,12.9-12.3c6.3,0,11.6,4.6,12.7,10.6C116.9,43.7,117.5,41.8,118.5,40.1z M88.5,53.7c-0.1-0.1-0.1-0.3-0.1-0.4c0.1-0.2,0.3-0.4,0.4-0.6L88.5,53.7z"/><path className="st0" d="M207,40c0.9,1.7,1.5,3.7,1.8,5.7c1.1-6,6.3-10.6,12.7-10.6c7.1,0,12.9,5.7,12.9,12.8h3.6c0-9.1-7.4-16.4-16.5-16.4C215.3,31.5,209.8,35,207,40z"/><path className="st0" d="M122.5,35c-1.5,1-2.5,2.7-3.5,3.8V0h3.4L122.5,35z"/><path className="st0" d="M209,46h28.7l0.3,1.8v1.8h-28.9L209,46z"/><circle className="st1" cx="75" cy="33.3" r="2"/><path className="st2" d="M146.2,48.1L146.2,48.1L146.2,48.1c0.1,9.1,7.4,16.4,16.5,16.4c9.1,0,16.5-7.4,16.5-16.4v-0.1v-0.1h0c0.1-7,5.8-12.7,12.9-12.7c7.1,0,12.8,5.7,12.9,12.7c0,0.1,0,0.1,0,0.2c0,9.1,7.4,16.4,16.5,16.4c0.1,0,0.2,0,0.3,0v-3.6c-0.1,0-0.2,0-0.3,0c-7.1,0-12.8-5.7-12.9-12.7c0,0,0-0.1,0-0.1c0-9.1-7.4-16.4-16.5-16.4c-9.1,0-16.5,7.4-16.5,16.4c0,0.1,0,0.2,0,0.3h0c-0.2,6.9-5.9,12.5-12.9,12.5s-12.7-5.6-12.9-12.5h0l0,0c0-0.1,0-0.2,0-0.3c0-9.1-7.4-16.4-16.5-16.4c-9.1,0-16.5,7.4-16.5,16.4c0,0.1,0,0.2,0,0.3h0c-0.2,6.9-5.9,12.5-12.9,12.5c-7.1,0-12.8-5.7-12.9-12.7v-0.2h-0.2h-3.4c0,0.4,0,1.2,0,1.6l0,46.3h3.4V58.1c3,3.9,7.7,6.4,13,6.4c6.4,0,12-3.6,14.7-8.9l0,0.1l0-0.1c1.1-2.2,1.8-4.7,1.8-7.3v-0.1V48v-0.1c0-7,5.8-12.7,12.9-12.7C140.5,35.1,146.2,40.9,146.2,48.1L146.2,48.1z"/><path className="st2" d="M73,35v29.6h4V35c-0.4,0.6-1.2,1-2,1C74.2,36,73.4,35.6,73,35z"/><path className="st2" d="M3.6,31.5H0V48C0,57,7.4,64.4,16.5,64.4C25.6,64.4,33,57,33,48c0-0.1,0-0.1,0-0.2c0.1-7,5.8-12.7,12.9-12.7c7,0,12.7,5.6,12.9,12.5h0V48v0v0V55l0,9.4h3.6V48c0-9.1-7.4-16.4-16.5-16.4S29.4,38.9,29.4,48c0,0.1,0,0.2,0,0.3l0,0c-0.2,7-5.9,12.5-12.9,12.5C9.4,60.8,3.6,55.1,3.6,48v0c0-0.1,0-0.2,0-0.3h0V31.5z"/></svg>
            </Link>
          </div>
          <div className="flex items-center gap-x-3">
            <span className="ml-2 text-base">{user.name}</span>
            <button className="sidebar-link h-auto" onClick={onLogout}>
              <svg width="20" viewBox="0 0 512 512" className="h-4"><g><path d="M255.15 468.625H63.787c-11.737 0-21.262-9.526-21.262-21.262V64.638c0-11.737 9.526-21.262 21.262-21.262H255.15c11.758 0 21.262-9.504 21.262-21.262S266.908.85 255.15.85H63.787C28.619.85 0 29.47 0 64.638v382.724c0 35.168 28.619 63.787 63.787 63.787H255.15c11.758 0 21.262-9.504 21.262-21.262 0-11.758-9.504-21.262-21.262-21.262z" fill="currentColor"></path><path d="M505.664 240.861 376.388 113.286c-8.335-8.25-21.815-8.143-30.065.213s-8.165 21.815.213 30.065l92.385 91.173H191.362c-11.758 0-21.262 9.504-21.262 21.262 0 11.758 9.504 21.263 21.262 21.263h247.559l-92.385 91.173c-8.377 8.25-8.441 21.709-.213 30.065a21.255 21.255 0 0 0 15.139 6.336c5.401 0 10.801-2.041 14.926-6.124l129.276-127.575A21.303 21.303 0 0 0 512 255.998c0-5.696-2.275-11.118-6.336-15.137z" fill="currentColor"></path></g></svg>
            </button>
          </div>
        </div>
        <div className="flex-grow flex overflow-x-hidden">
          <div className="flex-grow bg-white dark:bg-gray-900 overflow-y-auto sm:p-7 p-4">
            <ErrorBoundary>
              <Outlet/>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}

function BurgerButton({active, setActive, className, ...attributes}) {
  const classes = 'burger-button sidebar-link '+className;
  return (
    <button className={classes} onClick={() => setActive(!active)} {...attributes}>
      {active
        ? <svg width="20" viewBox="0 0 128 128" className="h-5"><g><path d="M84 108a3.988 3.988 0 0 1-2.828-1.172l-40-40a3.997 3.997 0 0 1 0-5.656l40-40c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656L49.656 64l37.172 37.172a3.997 3.997 0 0 1 0 5.656A3.988 3.988 0 0 1 84 108z" fill="currentColor"></path></g></svg>
        : <svg className="h-5" width="20" viewBox="0 0 64 64"><g><path d="M53 21H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3zM53 35H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3zM53 49H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3z" fill="currentColor"></path></g></svg>
      }
    </button>
  )
}
