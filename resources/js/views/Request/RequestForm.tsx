import React, {FormEvent, useCallback, useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import LoadingArea from "../../components/LoadingArea";
import Textarea from "../../components/Form/Textarea";
import RequestsAPI from "../../API/RequestsAPI";
import useFetching from "../../hooks/useFetching";
import {Request, RequestStatus} from "../../API/RequestsAPI";
import {ErrorResponse, Response} from "../../types/LaravelResponse";
import Select, {Option} from "../../components/Form/Select/Select";
import {FormRow} from "../../components/Form/Form";
import Input from "../../components/Form/InputRow";
import ClientsAPI from "../../API/ClientsAPI";
import {Client} from "../Client/Clients";
import useDelayedState from "../../hooks/useDelayedState";
import ErrorList from "../../components/ErrorList";
import RadioList, {Radio} from "../../components/Form/RadioList";
import UsersAPI from "../../API/UsersAPI";
import {err} from "../../helpers";
import AddressesAPI from "../../API/AddressesAPI";
import {useSelectContext} from "../../components/Form/Select/SelectContextProvider";
import {requestTypes} from "./Requests";

const defaultRequest = {
  id: null,
  client: null,
  worker: null,
  email: '',
  client_name: '',
  client_phone: '',
  client_phone_contact: '',
  addressDB: null,
  address: '',
  content: '',
  status: 'new',
} as Request;

export default function RequestForm({type}: { type: 'requestCreate' | 'requestUpdate' }) {
  const {id} = useParams();
  const [request, setRequest] = useState<Request>(defaultRequest);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [clientType, setClientType] = useState<'exists'|'new'>('exists');
  const [addressType, setAddressType] = useState<'exists'|'new'>('exists');
  const navigate = useNavigate();

  const [fetchRequest, loading, peerError]:any = useFetching(async () => {
    const req = await RequestsAPI.single(id);
    setRequest(req);
  });

  const validatedRequest = useCallback((newRequest: Request) => {
    if(!request.status || request.status == 'unknown')
      throw new Error('Выберите статус!');

    if (clientType == 'exists') {
      if(!request.client)
        throw new Error('Выберите клиента!');

      newRequest['client_name'] = null;
      newRequest['client_phone'] = null;
      newRequest['client_phone_contact'] = null;
      newRequest['client_id'] = request.client.id;
    } else {
      newRequest['client_id'] = null;

      if (addressType == 'exists') {
        if(!request.addressDB)
          throw new Error('Выберите адрес!');

        newRequest['address_id'] = request.addressDB.id;
        newRequest['address'] = null;
        newRequest['worker_id'] = null;
      } else {
        if(request.worker)
          newRequest['worker_id'] = request.worker.id;

        newRequest['address_id'] = null;
      }
    }

    delete newRequest['client'];
    delete newRequest['addressDB'];
    delete newRequest['worker'];

    return newRequest;
  }, [clientType, addressType, request.status, request.client, request.addressDB, request.worker]);

  const onSubmit = useCallback((e:FormEvent) => {
    e.preventDefault();
    if(submitting)
      return;
    setSubmitting(true);
    setErrors({});

    let newRequest: Request;
    try {
       newRequest = validatedRequest({...request});
    }
    catch (e) {
      toast.error(e.message);
      setSubmitting(false);
      return;
    }

    if(type === 'requestUpdate' && request.id) {
      RequestsAPI
        .update(request.id, newRequest)
        .then(() => toast.success('Заявка сохранена'))
        .catch((err:ErrorResponse) => {
          toast.error('Произошла ошибка при сохранении');
          const response = err?.response;
          if(typeof response.data !== "string" && response.data.errors)
            setErrors(response.data.errors);
        })
        .finally(() => setSubmitting(false));
    }
    else if(type === 'requestCreate') {
      RequestsAPI
        .create(newRequest)
        .then(({data}:Response) => {
          toast.success(`Заявка #${data.id} добавлена`);
          navigate(`/requests`);
        })
        .catch((err:ErrorResponse) => {
          toast.error('Произошла ошибка при добавлении');
          const response = err?.response;
          if(typeof response.data !== "string" && response.data.errors)
            setErrors(response.data.errors);
        })
        .finally(() => setSubmitting(false));
    }
  }, [request, submitting, type, navigate, validatedRequest]);

  useEffect(() => {
    if(id)
      fetchRequest();
  }, [id]);

  useEffect(() => {
    if(peerError)
      toast.error('Произошла ошибка: '+peerError);
  }, [peerError]);

  const setClient = (client: Client) => setRequest({...request, client: client});
  const setWorker = (worker: user) => setRequest({...request, worker: worker});
  const setAddress = (address: Address) => setRequest({...request, addressDB: address});

  return (
    loading
      ? <div className="h-5"><LoadingArea/></div>
      : <div className="relative">
          <h1 className="heading">{request.id?`Изменить заявку #${request.id}`:'Создать заявку'}</h1>
          <div className="h-3"></div>
          <div className="mx-auto relative" style={{maxWidth: '800px'}}>
            <LoadingArea show={submitting}/>
            <form onSubmit={onSubmit}>
              <h3 className="text-xl border-b pb-1 mb-3">Заявка</h3>
              <FormRow className="mb-6" label="Описание">
                <Textarea label="Описание" value={request.content} setValue={(value: string) => setRequest({...request, content: value})}/>
              </FormRow>

              <FormRow label="Статус" required className="mb-6">
                <Select label="Статус" value={request.status} onChange={(value: RequestStatus) => setRequest({...request, status: value})}>
                  {Object.keys(requestTypes).map((key, i) => key != 'unknown'?<Option value={key} key={i} index={i}>{requestTypes[key]}</Option>:'')}
                </Select>
              </FormRow>

              <div className="mb-6">
                <h3 className="text-xl border-b pb-1 mb-3">Клиент</h3>
                <div className="mb-3">
                  <a href="/clients/new" target="_blank" className="flex items-center gap-x-2 transition-colors duration-150 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">
                    Создать клиента
                    <svg height="1em" viewBox="0 0 515.283 515.283"><g><path d="M372.149 515.283H85.881c-22.941 0-44.507-8.934-60.727-25.155S.001 452.34.001 429.402V143.134c0-22.94 8.934-44.506 25.154-60.726s37.786-25.154 60.727-25.154h114.507c15.811 0 28.627 12.816 28.627 28.627s-12.816 28.627-28.627 28.627H85.881c-7.647 0-14.835 2.978-20.241 8.384s-8.385 12.595-8.385 20.242v286.268c0 7.647 2.978 14.835 8.385 20.243 5.406 5.405 12.594 8.384 20.241 8.384h286.267c7.647 0 14.835-2.978 20.242-8.386 5.406-5.406 8.384-12.595 8.384-20.242V314.895c0-15.811 12.817-28.626 28.628-28.626s28.628 12.816 28.628 28.626v114.507c0 22.94-8.934 44.505-25.155 60.727-16.221 16.22-37.788 25.154-60.726 25.154zm-171.76-171.762c-7.327 0-14.653-2.794-20.242-8.384-11.179-11.179-11.179-29.306 0-40.485L417.544 57.254H314.896c-15.811 0-28.626-12.816-28.626-28.627S299.085 0 314.896 0h171.761a28.542 28.542 0 0 1 19.997 8.144l.002.002.056.056.017.016.044.044.029.029.032.032.062.062.062.062.031.032.029.029a.62.62 0 0 1 .06.061l.056.057.002.002a28.55 28.55 0 0 1 8.144 19.998v171.761c0 15.811-12.817 28.627-28.628 28.627s-28.626-12.816-28.626-28.627V97.739l-237.4 237.399c-5.585 5.59-12.911 8.383-20.237 8.383z" fill="currentColor"></path></g></svg>
                  </a>
                </div>
                <div className="mb-3">
                  <RadioList name="clientType" value={clientType} onChange={setClientType}>
                    <Radio value="exists">Существующий</Radio>
                    <Radio value="new">Временный</Radio>
                  </RadioList>
                </div>
                {clientType == 'exists'
                  ? <>
                    <Select label="Выбрать клиента" value={request.client} onChange={setClient}>
                      <ClientSelect client={request.client}/>
                    </Select>
                  </>
                  : <div>
                    <div className="mb-3"><Input label="ФИО" value={request.client_name} setValue={(value: string) => setRequest({...request, client_name: value})} required={clientType == "new"}/></div>
                    <div className="mb-3 flex gap-x-3">
                      <FormRow label="Номер телефона" className="w-1/3"><Input label="Номер телефона" value={request.client_phone} setValue={(value: string) => setRequest({...request, client_phone: value})}/></FormRow>
                      <FormRow label="Контактный номер телефона" className="w-1/3"><Input label="Контактный номер телефона" value={request.client_phone_contact} setValue={(value: string) => setRequest({...request, client_phone_contact: value})}/></FormRow>
                      <FormRow label="E-mail" className="w-1/3"><Input label="E-mail" value={request.email} setValue={(value: string) => setRequest({...request, email: value})}/></FormRow>
                    </div>
                    <h3 className="text-xl border-b pb-1 mb-3">Адрес</h3>
                    <div className="mb-3">
                      <a href="/addresses/new" target="_blank" className="flex items-center gap-x-2 transition-colors duration-150 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300">
                        Создать адрес
                        <svg height="1em" viewBox="0 0 515.283 515.283"><g><path d="M372.149 515.283H85.881c-22.941 0-44.507-8.934-60.727-25.155S.001 452.34.001 429.402V143.134c0-22.94 8.934-44.506 25.154-60.726s37.786-25.154 60.727-25.154h114.507c15.811 0 28.627 12.816 28.627 28.627s-12.816 28.627-28.627 28.627H85.881c-7.647 0-14.835 2.978-20.241 8.384s-8.385 12.595-8.385 20.242v286.268c0 7.647 2.978 14.835 8.385 20.243 5.406 5.405 12.594 8.384 20.241 8.384h286.267c7.647 0 14.835-2.978 20.242-8.386 5.406-5.406 8.384-12.595 8.384-20.242V314.895c0-15.811 12.817-28.626 28.628-28.626s28.628 12.816 28.628 28.626v114.507c0 22.94-8.934 44.505-25.155 60.727-16.221 16.22-37.788 25.154-60.726 25.154zm-171.76-171.762c-7.327 0-14.653-2.794-20.242-8.384-11.179-11.179-11.179-29.306 0-40.485L417.544 57.254H314.896c-15.811 0-28.626-12.816-28.626-28.627S299.085 0 314.896 0h171.761a28.542 28.542 0 0 1 19.997 8.144l.002.002.056.056.017.016.044.044.029.029.032.032.062.062.062.062.031.032.029.029a.62.62 0 0 1 .06.061l.056.057.002.002a28.55 28.55 0 0 1 8.144 19.998v171.761c0 15.811-12.817 28.627-28.628 28.627s-28.626-12.816-28.626-28.627V97.739l-237.4 237.399c-5.585 5.59-12.911 8.383-20.237 8.383z" fill="currentColor"></path></g></svg>
                      </a>
                    </div>
                    <div className="mb-3">
                      <RadioList name="addressType" value={addressType} onChange={setAddressType}>
                        <Radio value="exists">Существующий</Radio>
                        <Radio value="new">Временный</Radio>
                      </RadioList>
                    </div>
                    {addressType == 'exists'
                      ? <Select label="Выбрать адрес" value={request.addressDB} onChange={setAddress}>
                        <AddressSelect address={request.addressDB}/>
                      </Select>
                      : <>
                        <FormRow label="Адрес" required={addressType == "new"} className="mb-3"><Input label="Адрес" value={request.address} setValue={(value: string) => setRequest({...request, address: value})} required={addressType == "new"}/></FormRow>
                        <FormRow label="Исполнитель" required={true}>
                          <Select label="Выбрать исполнителя" value={request.worker} onChange={setWorker}>
                            <WorkerSelect worker={request.worker}/>
                          </Select>
                        </FormRow>
                      </>
                    }
                  </div>
                }
              </div>

              <button type="submit" className="btn btn-primary py-3 px-7">{request.id?'Сохранить':'Создать'}</button>
            </form>

            <ErrorList errors={errors} />
          </div>
        </div>

  )
}


export function ClientSelect({client}: {client: Client}) {
  const [word, setWord] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const {opened} = useSelectContext();
  const searchInput = useRef<HTMLInputElement>();

  useEffect(() => {
    (opened)?searchInput.current.focus():searchInput.current.blur();
  }, [opened]);

  useEffect(() => {
    if(word.trim() !== '') {
      ClientsAPI
        .search(5, 1, word, false)
        .then(({data}) => setClients(data.data))
        .catch(() => err());
    }
    else
      setClients([]);
  }, [word]);

  const [_word, _setWord] = useDelayedState(setWord, 400, '');

  return <>
    {client && <>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mb-0.5"></div>
      <Option index={-1} value={client}><span className="text-orange-500 dark:text-orange-400 text-xs">#{client.id}</span> {client.name} <span className="text-xs text-gray-400">{client.address?.full}</span></Option>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mt-0.5 mb-2"></div>
    </>}
    <div className="px-2">
      <Input label="Поиск..." value={_word} setValue={_setWord} inputRef={searchInput} />
    </div>
    {clients.length > 0 && <div className="h-2"></div>}
    {clients.map((_client: Client, i: number) => <Option index={i} key={i} value={_client}>
      <span className="text-orange-500 dark:text-orange-400 text-xs">#{_client.id}</span> {_client.name} <span className="text-xs text-gray-400">{_client.address?.full}</span>
    </Option>)}
  </>
}

export function WorkerSelect({worker}: {worker: user}) {
  const [word, setWord] = useState('');
  const [workers, setWorkers] = useState<user[]>([]);
  const {opened} = useSelectContext();
  const searchInput = useRef<HTMLInputElement>();

  useEffect(() => {
    (opened)?searchInput.current.focus():searchInput.current.blur();
  }, [opened]);

  useEffect(() => {
    if(word.trim() !== '') {
      UsersAPI
        .search(5, 1, word, {role: 'worker'}, false)
        .then(({data}) => setWorkers(data.data))
        .catch(() => err());
    }
    else {
      UsersAPI
        .get(5, 1, {role: 'worker'}, false)
        .then(({data}) => setWorkers(data.data))
        .catch(() => err());
    }
  }, [word]);

  const workerLabel = (worker: user) =>
    <><span className="text-orange-500 dark:text-orange-400 text-xs">#{worker.id}</span> {worker.name} <span className="text-xs text-gray-400">{worker.email}</span></>;

  const [_word, _setWord] = useDelayedState(setWord, 400, '');

  return <>
    {worker && <>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mb-0.5"></div>
      <Option index={-1} value={worker}>
        {workerLabel(worker)}
      </Option>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mt-0.5 mb-2"></div>
    </>}
    <div className="px-2">
      <Input label="Поиск..." value={_word} setValue={_setWord} inputRef={searchInput} />
    </div>
    {workers.length > 0 && <div className="h-2"></div>}
    {workers.map((_worker: user, i: number) => <Option index={i} key={i} value={_worker}>
      {workerLabel(_worker)}
    </Option>)}
  </>
}

export function AddressSelect({address}: {address: Address}) {
  const [word, setWord] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const {opened} = useSelectContext();
  const searchInput = useRef<HTMLInputElement>();

  useEffect(() => {
    (opened)?searchInput.current.focus():searchInput.current.blur();
  }, [opened]);

  useEffect(() => {
    if(word.trim() !== '') {
      AddressesAPI
        .search(5, 1, word, false)
        .then(({data}) => setAddresses(data.data))
        .catch(() => err());
    }
    else
      setAddresses([]);
  }, [word]);

  const addressLabel = (address: Address) => {
    return address.full;
  }

  const [_word, _setWord] = useDelayedState(setWord, 400, '');

  return <>
    {address && <>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mb-0.5"></div>
      <Option index={-1} value={address}>
        {addressLabel(address)}
      </Option>
      <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mt-0.5 mb-2"></div>
    </>}
    <div className="px-2">
      <Input label="Поиск..." value={_word} setValue={_setWord} inputRef={searchInput} />
    </div>
    {addresses.length > 0 && <div className="h-2"></div>}
    {addresses.map((_address: Address, i: number) => <Option index={i} key={i} value={_address}>
      {addressLabel(_address)}
    </Option>)}
  </>
}
