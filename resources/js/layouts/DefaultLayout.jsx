import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.jsx";
import {useEffect} from "react";
import SidebarNavLink from "../components/SidebarNavLink.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import toast, {Toaster} from "react-hot-toast";

export default function DefaultLayout() {
  const {user, token, setUser, setToken} = useStateContext();

  if(!token)
    return <Navigate to="/login"/>

  const onLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post('/logout').then(() => {
      setUser({});
      setToken(null);
    }).catch(() => {
        toast.error('Произошла ошибка при выходе');
    });
  }

  useEffect(() => {
    axiosClient.get('/user').then(({data}) => {
      setUser(data);
    }).catch((e) => {
        toast.error(`Произошла ошибка: ${e.message}`);
    });
  }, []);

  return (
      <div className="dark:text-white text-gray-800 h-screen flex overflow-hidden text-sm">
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border-r border-gray-200 flex-col hidden sm:flex text-sm">
          <div className="p-3 text-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="200" viewBox="0 0 238 96">
              <style type="text/css">{'.st0{fill:#636363;}.st1{fill:#246BFD;}.st2{fill:#0f0f0f;} @media (prefers-color-scheme: dark) {.st0{fill:#B7B7B7;}.st1{fill:#44c9bd;}.st2{fill:#F5F5F5;}}'}</style>
              <path className="st0" d="M146.2,51.5v12.9h3.6V59C148.1,56.9,146.8,54.3,146.2,51.5z"/><path className="st0" d="M120.5,51.5v12.9h-3.6V59C118.6,56.9,119.9,54.3,120.5,51.5z"/><path className="st0" d="M33,51.5v12.9h-3.6V59C31.2,56.9,32.4,54.3,33,51.5z"/><path className="st0" d="M29.4,44.5V31.5H33v5.4C31.2,39.1,29.9,41.6,29.4,44.5z"/><path className="st0" d="M205,51.5v12.9h3.6V59C206.8,56.9,205.6,54.3,205,51.5z"/><path className="st0" d="M179.2,51.5v12.9h-3.6V59C177.4,56.9,178.7,54.3,179.2,51.5z"/><path className="st0" d="M177.2,40.1c-2.8-5.1-8.2-8.6-14.5-8.6c-6.2,0-11.7,3.4-14.5,8.5c0.9,1.7,1.5,3.7,1.8,5.7c1.1-6,6.3-10.6,12.7-10.6c6.3,0,11.6,4.6,12.7,10.6C175.7,43.7,176.3,41.8,177.2,40.1z"/><path className="st0" d="M118.5,40.1c-2.8-5.1-8.2-8.6-14.5-8.6c-8.9,0-16.2,7.1-16.5,16h3.6c0.3-6.9,5.9-12.3,12.9-12.3c6.3,0,11.6,4.6,12.7,10.6C116.9,43.7,117.5,41.8,118.5,40.1z M88.5,53.7c-0.1-0.1-0.1-0.3-0.1-0.4c0.1-0.2,0.3-0.4,0.4-0.6L88.5,53.7z"/><path className="st0" d="M207,40c0.9,1.7,1.5,3.7,1.8,5.7c1.1-6,6.3-10.6,12.7-10.6c7.1,0,12.9,5.7,12.9,12.8h3.6c0-9.1-7.4-16.4-16.5-16.4C215.3,31.5,209.8,35,207,40z"/><path className="st0" d="M122.5,35c-1.5,1-2.5,2.7-3.5,3.8V0h3.4L122.5,35z"/><path className="st0" d="M209,46h28.7l0.3,1.8v1.8h-28.9L209,46z"/><circle className="st1" cx="75" cy="33.3" r="2"/><path className="st2" d="M146.2,48.1L146.2,48.1L146.2,48.1c0.1,9.1,7.4,16.4,16.5,16.4c9.1,0,16.5-7.4,16.5-16.4v-0.1v-0.1h0c0.1-7,5.8-12.7,12.9-12.7c7.1,0,12.8,5.7,12.9,12.7c0,0.1,0,0.1,0,0.2c0,9.1,7.4,16.4,16.5,16.4c0.1,0,0.2,0,0.3,0v-3.6c-0.1,0-0.2,0-0.3,0c-7.1,0-12.8-5.7-12.9-12.7c0,0,0-0.1,0-0.1c0-9.1-7.4-16.4-16.5-16.4c-9.1,0-16.5,7.4-16.5,16.4c0,0.1,0,0.2,0,0.3h0c-0.2,6.9-5.9,12.5-12.9,12.5s-12.7-5.6-12.9-12.5h0l0,0c0-0.1,0-0.2,0-0.3c0-9.1-7.4-16.4-16.5-16.4c-9.1,0-16.5,7.4-16.5,16.4c0,0.1,0,0.2,0,0.3h0c-0.2,6.9-5.9,12.5-12.9,12.5c-7.1,0-12.8-5.7-12.9-12.7v-0.2h-0.2h-3.4c0,0.4,0,1.2,0,1.6l0,46.3h3.4V58.1c3,3.9,7.7,6.4,13,6.4c6.4,0,12-3.6,14.7-8.9l0,0.1l0-0.1c1.1-2.2,1.8-4.7,1.8-7.3v-0.1V48v-0.1c0-7,5.8-12.7,12.9-12.7C140.5,35.1,146.2,40.9,146.2,48.1L146.2,48.1z"/><path className="st2" d="M73,35v29.6h4V35c-0.4,0.6-1.2,1-2,1C74.2,36,73.4,35.6,73,35z"/><path className="st2" d="M3.6,31.5H0V48C0,57,7.4,64.4,16.5,64.4C25.6,64.4,33,57,33,48c0-0.1,0-0.1,0-0.2c0.1-7,5.8-12.7,12.9-12.7c7,0,12.7,5.6,12.9,12.5h0V48v0v0V55l0,9.4h3.6V48c0-9.1-7.4-16.4-16.5-16.4S29.4,38.9,29.4,48c0,0.1,0,0.2,0,0.3l0,0c-0.2,7-5.9,12.5-12.9,12.5C9.4,60.8,3.6,55.1,3.6,48v0c0-0.1,0-0.2,0-0.3h0V31.5z"/></svg>
          </div>
          <div className="flex mx-auto flex-grow mt-4 flex-col text-gray-400 space-y-2 p-3 w-full">
            {/*<SidebarNavLink to="/">
              <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
              <span>Главная</span>
            </SidebarNavLink>*/}
            <SidebarNavLink to="/users" activeOn="/users/.*">
              <svg className="h-5" viewBox="0 0 512 512"><path d="M437.02 330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521 243.251 404 198.548 404 148 404 66.393 337.607 0 256 0S108 66.393 108 148c0 50.548 25.479 95.251 64.262 121.962-36.21 12.495-69.398 33.136-97.281 61.018C26.629 379.333 0 443.62 0 512h40c0-119.103 96.897-216 216-216s216 96.897 216 216h40c0-68.38-26.629-132.667-74.98-181.02zM256 256c-59.551 0-108-48.448-108-108S196.449 40 256 40s108 48.448 108 108-48.449 108-108 108z" fill="currentColor"></path></svg>
              <span>Пользователи</span>
            </SidebarNavLink>
            <SidebarNavLink to="/peers" activeOn="/peers/.*">
              <svg className="h-5" viewBox="0 0 24 24"><path d="M20.473 16.253v-2.6a2.417 2.417 0 0 0-2.413-2.417H12.6V7.747a2.727 2.727 0 1 0-1.2 0v3.49H5.945a2.42 2.42 0 0 0-2.418 2.417v2.6a2.728 2.728 0 1 0 1.2 0v-2.6a1.22 1.22 0 0 1 1.218-1.218H11.4v3.816a2.727 2.727 0 1 0 1.2 0v-3.815h5.46a1.218 1.218 0 0 1 1.214 1.218v2.6a2.727 2.727 0 1 0 1.2 0zM5.655 18.908a1.527 1.527 0 1 1-1.527-1.527 1.529 1.529 0 0 1 1.527 1.527zm7.873 0A1.527 1.527 0 1 1 12 17.381a1.53 1.53 0 0 1 1.527 1.527zM12 6.619a1.528 1.528 0 1 1 1.527-1.527A1.529 1.529 0 0 1 12 6.619zm7.873 13.817a1.528 1.528 0 1 1 1.527-1.528 1.53 1.53 0 0 1-1.527 1.529z" fill="currentColor"></path></svg>
              <span>Устройства</span>
            </SidebarNavLink>
            <SidebarNavLink to="/addresses" activeOn="/addresses/.*">
              <svg className="h-5" viewBox="0 0 512 512"><g><path d="M256 0C153.755 0 70.573 83.182 70.573 185.426c0 126.888 165.939 313.167 173.004 321.035 6.636 7.391 18.222 7.378 24.846 0 7.065-7.868 173.004-194.147 173.004-321.035C441.425 83.182 358.244 0 256 0zm0 278.719c-51.442 0-93.292-41.851-93.292-93.293S204.559 92.134 256 92.134s93.291 41.851 93.291 93.293-41.85 93.292-93.291 93.292z" fill="currentColor"></path></g></svg>              <span>Объекты</span>
            </SidebarNavLink>
            {/*<button className="h-10 dark:text-gray-500 rounded-md flex items-center px-4 gap-x-3 text-blue-500">
              <svg viewBox="0 0 24 24" className="h-5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>*/}
          </div>
        </div>
        <div className="flex-grow overflow-hidden h-full flex flex-col">
          <div className="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10 py-5">
            <div className="flex h-full text-gray-600 dark:text-gray-400">
              {/*<a href="/export" className="h-full border-b-2 border-transparent inline-flex items-center mr-8">Экспорт</a>
              <a href="/users" className="h-full border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white inline-flex mr-8 items-center">Пользователи</a>*/}
            </div>
            <div className="ml-auto flex items-center space-x-7">
              <div className="flex items-center">
                <span className="relative flex-shrink-0">
                  {/*<img className="w-7 h-7 rounded-full" src="https://images.unsplash.com/photo-1521587765099-8835e7201186?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" alt="profile"/>*/}
                  {/*<span className="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-gray-900"></span>*/}
                </span>
                <span className="ml-2">{user.name}</span>
                {/*<svg viewBox="0 0 24 24" className="w-4 ml-1 flex-shrink-0" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>*/}
              </div>
              <button onClick={onLogout} className="h-8 px-3 btn btn-primary">Выйти</button>
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
        <Toaster position="bottom-right" />
      </div>
  );

  /*return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dasboard</Link>
        <Link to="/users">Пользователи</Link>
      </aside>
      {notification && <div className="notification">{notification}</div>}
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">Выйти</a>
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
      </div>
    </div>
  )*/
}
