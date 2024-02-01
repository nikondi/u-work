import {useNavigate, useParams} from "react-router-dom";
import React, {FormEventHandler, useEffect, useMemo, useState} from "react";
import LoadingDiv from "../../components/LoadingDiv.jsx";
import toast from "react-hot-toast";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Form/Input";
import ErrorList from "../../components/ErrorList.jsx";
import UsersAPI from "../../API/UsersAPI.js";
import {defaultUser} from "../UserForm";
import {Worker} from "./index";
import Icon from "../../components/Icon";
import Popup from "../../components/Popup";
import AddressesAPI from "../../API/AddressesAPI";
import LoadingArea from "../../components/LoadingArea";
import {err} from "../../helpers";


export default function WorkerForm() {
    const {id} = useParams();

    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false)
    const [passwordRequired, setPasswordRequired] = useState(true);
    const [worker, setWorker] = useState<Worker & {password: string, password_confirmation: string}>({...defaultUser, addresses: []});

    useEffect(() => {
        if(id) {
            setLoading(true);
            UsersAPI
                .getSingle(id)
                .then(({data}) => {
                    setWorker(data);
                    setPasswordRequired(false);
                })
                .catch(err => {
                    const response = err.response;
                    if (response.data.errors)
                        setErrors(response.data.errors);
                })
                .finally(() => setLoading(false));
        }
    }, []);

    const onSubmit: FormEventHandler<HTMLFormElement> = (ev) => {
        ev.preventDefault();
        setSubmitting(true);
        setErrors(null);
        const data = {...worker, addresses: worker.addresses.map(a => a.id)};
        if(worker.id) {
          UsersAPI
              .update(worker.id, data)
              .then(() => toast.success('Исполнитель успешно сохранен'))
              .catch((err) => {
                toast.error('Произошла ошибка');
                const response = err.response;
                if(response.data.errors)
                  setErrors(response.data.errors);
              })
              .finally(() => setSubmitting(false));
        }
        else {
            UsersAPI
              .create(data)
              .then(({data}) => {
                if(typeof data.id !== 'undefined') {
                  toast.success('Исполнитель успешно создан');
                  navigate(`/workers/${data.id}`);
                }
                else {
                  toast.error('Произошла ошибка');
                  console.error(data);
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

    return (
        <>
            <h1 className="heading">{worker.id?`Изменить исполнителя ${worker.name} (${worker.id})`:'Новый исполнитель'}</h1>
            <div className="h-3"></div>
            <div className="mx-auto" style={{maxWidth: '800px'}}>
                {(loading || !worker)
                    ? <div className="text-center p-4 bg-gray-600">Загрузка...</div>
                    : <form onSubmit={onSubmit}>
                        <div className="flex gap-x-3">
                            <FormRow label="Имя" className="mb-4 flex-1">
                                <Input label="Имя" value={worker.name} onChange={(ev) => setWorker({...worker, name: ev.target.value})} />
                            </FormRow>
                            <FormRow label="Логин" className="mb-4 flex-1" required={true}>
                                <Input label="Логин" value={worker.login} onChange={(ev) => setWorker({...worker, login: ev.target.value})} required={true} />
                            </FormRow>
                        </div>
                        <FormRow label="E-mail" className="mb-4" required={true}>
                            <Input label="E-mail" type="email" value={worker.email} onChange={(ev) => setWorker({...worker, email: ev.target.value})} required={true} />
                        </FormRow>
                        <div className="flex gap-x-3">
                            <FormRow label="Пароль" className="mb-4 flex-1" required={passwordRequired}>
                                <Input value="" label="Пароль" type="password" onChange={(ev) => setWorker({...worker, password: ev.target.value})} required={passwordRequired} />
                            </FormRow>
                            <FormRow label="Подтверждение пароля" className="mb-4 flex-1" required={passwordRequired}>
                                <Input value="" label="Подтверждение пароля" type="password" onChange={(ev) => setWorker({...worker, password_confirmation: ev.target.value})} required={passwordRequired} />
                            </FormRow>
                        </div>
                        <FormRow label="Адреса" className="mb-4">
                            <Addresses worker={worker} setWorker={setWorker}/>
                        </FormRow>


                        {!submitting && <button type="submit" className="btn btn-primary py-3 px-7">{worker.id?'Сохранить':'Добавить'}</button>}
                        <LoadingDiv loading={submitting}/>
                      </form>
                }

                <ErrorList errors={errors} />
            </div>
        </>
    )
}


function Addresses({worker, setWorker}: {worker: Worker, setWorker: stateFunction<Worker>}) {
    const [popupOpened, setPopupOpened] = useState(false);

    return <div>
        <div className="mb-2">
            {worker.addresses.map(a => <div key={a.id} className="p-0.5 px-1 rounded transition-colors duration-300 hover:bg-gray-300 hover:bg-opacity-50 dark:hover:bg-opacity-20">
                {a.full}
            </div>)}
        </div>
        <button type="button" onClick={() => setPopupOpened(true)} className="btn btn-cyan btn--small"><Icon icon="plus" size=".75em" style={{transform: 'translateY(-1px)'}}/> Добавить</button>
        {popupOpened && <Popup show={popupOpened} setShow={setPopupOpened}>
            <AddressList worker={worker} setWorker={setWorker}/>
        </Popup>}
    </div>
}

function AddressList({worker, setWorker}: {worker: Worker, setWorker: stateFunction<Worker>}) {
    const [addresses, setAddresses] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const currentList = useMemo(() => {
        return worker.addresses.map((a) => a.id);
    }, [worker.addresses]);

    useEffect(() => {
        setLoading(true);
        AddressesAPI.get(-1, 1).then(({data}) => setAddresses(data.data.sort((a1: Address) => currentList.includes(a1.id)?-1:1)))
            .catch(e=>err(e.message))
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        if(search.trim() === '')
            return addresses;
        else
            return addresses.filter(a => a.full.toLowerCase().includes(search.toLowerCase()));
    }, [search, addresses]);

    const toggleAddress = (address: Address) => {
        if(address.worker && address.worker.id != worker.id)
            return;
        const index = worker.addresses.findIndex((a) => a.id == address.id);
        if(index >= 0)
            setWorker({...worker, addresses: worker.addresses.filter(a => a.id != address.id)});
        else
            setWorker({...worker, addresses: [...worker.addresses, address]});
    }

    return <div className="relative">
        <LoadingArea show={loading}/>
        <div className="mb-4 sticky top-0 w-full bg-gray-200 dark:bg-primary-950 py-2">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск" className="bg-transparent px-2 py-1 border outline-none border-gray-500 rounded" />
        </div>
        {filtered.map(a => <div key={a.id} className={'worker_address '+(currentList.includes(a.id)?' worker_address--active':'')} onClick={() => toggleAddress(a)}>
            <div>{a.full}</div> {a.worker && <div><a href={`/workers/${a.worker.id}`} target="_blank" className="text-orange-500">{a.worker.name}</a></div>}
        </div>)}
    </div>
}
