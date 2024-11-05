import React, {ReactNode} from "react";
import {Form, FormHandler, LoadingArea} from "@/Components/Form";
import {Input, Remember} from "./components";
import {Errors} from "./partials";
import DefaultLayout from "@/Layouts/DefaultLayout";


const LoginForm = () => {
  const onSubmit: FormHandler = (_e, form) => form.post(route('login_handler'))

  return (
    <section className="overflow-auto h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">WorkUniphone</div>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 relative">
          <Form initialData={{
            login: '',
            password: '',
            remember: false
          }} onSubmit={onSubmit} className="space-y-4 md:space-y-6">
            <LoadingArea/>
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1
                className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Войти</h1>

              <Input name="login" label="Логин" required/>
              <Input name="password" label="Пароль" placeholder="••••••••" type="password" required/>
              <Remember/>

              <button type="submit" className="w-full btn btn-primary font-medium text-sm px-5 py-2.5">Войти</button>
              <Errors/>
            </div>
          </Form>
        </div>
      </div>
    </section>
  )
}

LoginForm.layout = (page: ReactNode) => <DefaultLayout children={page}/>
export default LoginForm;
