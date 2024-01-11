import {useRef, useState} from "react";
import axiosClient from "../axios-client.jsx";
import {useStateContext} from "../contexts/ContextProvider";
import LoadingArea from "../components/LoadingArea.jsx";
import toast from "react-hot-toast";

export default function Login() {
  const loginRef = useRef();
  const passwordRef = useRef();
  const rememberRef = useRef();

  const {setUser, setToken} = useStateContext();
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();

    setLoading(true);

    const payload = {
      login: loginRef.current.value,
      password: passwordRef.current.value,
      remember: rememberRef.current.value
    }

    setErrors(null);

    axiosClient.post('/login', payload).then(({data}) => {
      setLoading(false);
      setUser(data.user);
      setToken(data.token);
    }).catch(err => {
        toast.error('Произошла ошибка');
      const response = err.response;
      if(response && response.status === 422)
        if(response.data.errors)
          setErrors(response.data.errors);
        else if(response.data.message)
          setErrors({message: response.data.message});
      setLoading(false);
    });
  }

  return (
      <section className="overflow-auto h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            WorkUniphone
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 relative">
            <LoadingArea show={loading} />
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Войти
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                <div>
                  <label htmlFor="login" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Логин</label>
                  <input ref={loginRef} type="text" name="login" id="login" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Логин" required="" />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Пароль</label>
                  <input ref={passwordRef} type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input id="remember" ref={rememberRef} aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Запомнить меня</label>
                    </div>
                  </div>
                  {/*<a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>*/}
                </div>
                  <button type="submit" className="w-full btn btn-primary font-medium text-sm px-5 py-2.5">Войти</button>
                {/*<p className="text-sm font-light text-gray-500 dark:text-gray-400">*/}
                {/*  Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>*/}
                {/*</p>*/}
                {errors &&
                  <div className="bg-red-50 border-l-8 border-red-900 p-2 max-w-4xl mx-auto dark:bg-gray-900">
                    <div className="flex items-center text-red-900 dark:text-red-500">
                      <div className="ml-2"><svg className="h-8 w-8 mr-2 cursor-pointer" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
                      <p className="p-3 font-semibold text-lg">Произошла ошибка</p>
                    </div>
                    <div className="pl-16 pr-4 mb-4 text-red-400">
                      {Object.keys(errors).map(key => (
                          <li key={key} className="text-md text-sm">{errors[key]}</li>
                      ))}
                    </div>
                  </div>
                }
              </form>
            </div>
          </div>
        </div>
      </section>
 )
}
