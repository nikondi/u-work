import React from "react";
import {ErrorList, Form, FormHandler, FormSuccess, LoadingDiv, Row} from "@/Components/Form";
import {usePage} from "@inertiajs/react";
import {FormPageProps, IUserForm} from "../types";
import {Input, Roles, SaveButton} from "../components";

type Props = {
  onSubmit: FormHandler
}

export default function UserForm({onSubmit}: Props) {
  const {user} = usePage<FormPageProps>().props;
  const data: IUserForm = user
    ? {
      login: user.login,
      name: user.name,
      email: user.email,
      password: '',
      password_confirmation: '',
      roles: user.roles,
    }
    : {
      login: '',
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      roles: [],
    };

  return <>
    <div className="h-3"></div>
    <div className="mx-auto" style={{maxWidth: '800px'}}>
      <Form initialData={data} onSubmit={onSubmit}>
        <Input name="name" label="Имя" className="mb-4" required/>
        <Input name="login" label="Логин" className="mb-4" required/>
        <Input name="email" label="E-mail" className="mb-4" required/>
        <Input name="password" label="Пароль" className="mb-4" required={!user} type="password"/>
        <Input name="password_confirmation" label="Подтверждение пароля" className="mb-6" required={!user} type="password"/>
        <Roles/>
        <SaveButton>{user ? 'Сохранить' : 'Добавить'}</SaveButton>
        <ErrorList/>
      </Form>
    </div>
    {/* {(loading || !user)
        ? <div className="text-center p-4 bg-gray-600">Загрузка...</div>
        : <form onSubmit={onSubmit}>
          <FormRow label="Имя" className="mb-4">
            <Input label="Имя" value={user.name} onChange={(ev) => setUser({...user, name: ev.target.value})}/>
          </FormRow>
          <FormRow label="Логин" className="mb-4" required={true}>
            <Input label="Логин" value={user.login} onChange={(ev) => setUser({...user, login: ev.target.value})}
                   required={true}/>
          </FormRow>
          <FormRow label="E-mail" className="mb-4" required={true}>
            <Input label="E-mail" type="email" value={user.email}
                   onChange={(ev) => setUser({...user, email: ev.target.value})} required={true}/>
          </FormRow>
          <FormRow label="Пароль" className="mb-4" required={passwordRequired}>
            <Input label="Пароль" type="password" onChange={(ev) => setUser({...user, password: ev.target.value})}
                   required={passwordRequired}/>
          </FormRow>
          <FormRow label="Подтверждение пароля" className="mb-4" required={passwordRequired}>
            <Input label="Подтверждение пароля" type="password"
                   onChange={(ev) => setUser({...user, password_confirmation: ev.target.value})}
                   required={passwordRequired}/>
          </FormRow>
          <FormRow label="Роли" className="mb-5">
            {userRoles.map((role) =>
              <label className="block mb-1 cursor-pointer" key={role[0]}>
                <input type="checkbox" name="role" value={role[0]} onChange={changeRoles}
                       checked={user.roles.indexOf(role[0]) >= 0} required={user.roles.length === 0}/> {role[1]}
              </label>
            )}
          </FormRow>
          {!submitting &&
            <button type="submit" className="btn btn-primary py-3 px-7">{user.id ? 'Сохранить' : 'Добавить'}</button>}
          <LoadingDiv/>
        </form>
      }

      <ErrorList errors={errors}/>
    </div>*/}
  </>
}
