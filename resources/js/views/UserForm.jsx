import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.jsx";
import LoadingDiv from "../components/LoadingDiv.jsx";
import toast from "react-hot-toast";
import {FormRow} from "../components/Form/Form";
import Input from "../components/Form/InputRow.jsx";

const defaultUser = {
    id: null,
    name: '',
    email: '',
    login: '',
    roles: [],
    password: '',
    password_confirmation: '',
}

const userRoles = [
    ['admin', 'Администратор'],
    ['worker', 'Рабочий'],
    ['manager', 'Менеджер'],
];

export default function UserForm() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false)
    const [passwordRequired, setPasswordRequired] = useState(true);
    const [user, setUser] = useState(defaultUser);

    if(id) {
        useEffect(() => {
            setLoading(true);
            axiosClient.get('/users/'+id).then(({data}) => {
                setLoading(false);
                setUser(data);
                setPasswordRequired(false);
            }).catch(err => {
              setLoading(false);

              const response = err.response;
              if(response.data.errors)
                setErrors(response.data.errors);
            });
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();

        setSubmitting(true);

        setErrors(null);
        if(user.id) {
          axiosClient.put('/users/'+user.id, user)
              .then(() => toast.success('Пользователь успешно сохранен'))
              .catch((err) => {
                toast.error('Произошла ошибка');
                const response = err.response;
                if(response.data.errors)
                  setErrors(response.data.errors);
              })
              .finally(() => setSubmitting(false));
        }
        else {
          axiosClient.post('/users/add', user)
              .then(({data}) => {
                if(typeof data.id !== 'undefined') {
                  toast.success('Пользователь успешно создан');
                  navigate('/users/'+data.id);
                }
                else {
                  toast.error('Произошла ошибка');
                  console.log(data);
                }
              })
              .catch((err) => {
                toast.error('Произошла ошибка');
                const response = err.response;
                if(response.data.errors)
                  setErrors(response.data.errors);
              })
              .finally(() => setSubmitting(false));
        }
    }

    const changeRoles = (event) => {
        const box = event.target;
        if(box.checked) {
            if(user.roles.indexOf(box.value) < 0)
                setUser({...user, roles: [...user.roles, box.value]});
        }
        else {
            const tmp = user.roles;
            tmp.splice(user.roles.indexOf(box.value), 1);
            setUser({...user, roles: tmp});
        }
    }

    return (
        <>
            <h1 className="heading">{user.id?`Изменить пользователя ${user.name} (${user.id})`:'Новый пользователь'}</h1>
            <div className="h-3"></div>
            <div className="mx-auto" style={{maxWidth: '800px'}}>
                {(loading || !user)
                    ? <div className="text-center p-4 bg-gray-600">Загрузка...</div>
                    : <form onSubmit={onSubmit}>
                        <FormRow label="Имя" className="mb-4">
                            <Input label="Имя" value={user.name} onChange={(ev) => setUser({...user, name: ev.target.value})} />
                        </FormRow>
                        <FormRow label="Логин" className="mb-4" required={true}>
                            <Input label="Логин" value={user.login} onChange={(ev) => setUser({...user, login: ev.target.value})} required={true} />
                        </FormRow>
                        <FormRow label="E-mail" className="mb-4" required={true}>
                            <Input label="E-mail" type="email" value={user.email} onChange={(ev) => setUser({...user, email: ev.target.value})} required={true} />
                        </FormRow>
                        <FormRow label="Пароль" className="mb-4" required={passwordRequired}>
                            <Input label="Пароль" type="password" onChange={(ev) => setUser({...user, password: ev.target.value})} required={passwordRequired} />
                        </FormRow>
                        <FormRow label="Подтверждение пароля" className="mb-4" required={passwordRequired}>
                            <Input label="Подтверждение пароля" type="password" onChange={(ev) => setUser({...user, password_confirmation: ev.target.value})} required={passwordRequired} />
                        </FormRow>
                        <FormRow label="Роли" className="mb-5">
                            {userRoles.map((role) =>
                                <label className="block mb-1 cursor-pointer" key={role[0]}>
                                    <input type="checkbox" name="role" value={role[0]} onChange={changeRoles} checked={user.roles.indexOf(role[0]) >= 0} required={user.roles.length === 0} /> {role[1]}
                                </label>
                            )}
                        </FormRow>
                        {!submitting && <button type="submit" className="btn btn-primary py-3 px-7">{user.id?'Сохранить':'Добавить'}</button>}
                        <LoadingDiv loading={submitting}/>
                      </form>
                }

                {errors && <div className="mt-3">{
                    Object.keys(errors).map(key =>
                        Array.isArray(errors[key])
                            ? errors[key].map((e, i) => <div key={key+i} className="errordiv mt-2">{e}</div>)
                            : <div key={key} className="errordiv mt-2">{errors[key]}</div>
                    )}
                </div>
                }
            </div>
        </>
    )
}
