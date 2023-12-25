import React, {FormEvent, useCallback, useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import LoadingArea from "../../components/LoadingArea";
import Textarea from "../../components/Form/Textarea";
import RequestsAPI from "../../API/RequestsAPI";
import useFetching from "../../hooks/useFetching";
import {Request, RequestStatus, requestTypes} from "./Requests";
import {ErrorResponse, Response} from "../../types/LaravelResponse";
import Select, {Option} from "../../components/Form/Select/Select";
import {FormRow} from "../../components/Form/Form";

type RequestFormProps = {
    type: 'requestCreate' | 'requestUpdate',
}

const defaultRequest = {
    id: null,
    client: null,
    client_name: '',
    client_phone: '',
    client_phone_contact: '',
    addressDB: null,
    address: '',
    content: '',
    status: 'unknown',
} as Request;

export default function RequestForm({type}: RequestFormProps) {
    const {id} = useParams();
    const [request, setRequest] = useState<Request>(defaultRequest);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const [fetchRequest, loading, peerError]:any = useFetching(async () => {
        const req = await RequestsAPI.single(id);
        setRequest(req);
    });

    /*const [fetchTypes, loadingTypes] = useFetching(async () => {
        const _types = await PeersService.getTypes();
        setTypes(_types);
    });*/

    const onSubmit = useCallback((e:FormEvent) => {
        e.preventDefault();
        if(submitting)
            return;
        setSubmitting(true);
        setErrors({});
        if(type === 'requestUpdate' && request.id) {
            RequestsAPI.update(request.id, request).then(() => {
                toast.success('Объект сохранён');
            }).catch((err:ErrorResponse) => {
                toast.error('Произошла ошибка при сохранении');
                const response = err?.response;
                if(typeof response.data !== "string" && response.data.errors)
                    setErrors(response.data.errors);
            }).finally(() => setSubmitting(false));
        }
        else if(type === 'requestCreate') {
            RequestsAPI.create(request).then(({data}:Response) => {
                toast.success('Адрес успешно добавлен');
                navigate(`/requests/${data.id}`);
                // type = 'addressUpdate';
                // setAddress(res);
            }).catch((err:ErrorResponse) => {
                toast.error('Произошла ошибка при добавлении');
                const response = err?.response;
                if(typeof response.data !== "string" && response.data.errors)
                    setErrors(response.data.errors);
            }).finally(() => setSubmitting(false));
        }
    }, [request, submitting, type, navigate]);

    useEffect(() => {
        if(id) {
            console.log(123);
            fetchRequest();
        }
    }, [id]);

    useEffect(() => {
        if(peerError)
            toast.error('Произошла ошибка: '+peerError);
    }, [peerError]);

    /*useEffect(() => {
        fetchTypes();
    }, []);*/

    return (
        <>
            {!loading ? <div className="relative">
                    <h1 className="heading">{request.id?`Изменить заявку #${request.id}`:'Создать заявку'}</h1>
                    <div className="h-3"></div>
                    <div className="mx-auto relative" style={{maxWidth: '800px'}}>
                        <LoadingArea show={submitting}/>
                        <form onSubmit={onSubmit}>
                                {/*<LoadingArea show={loadingTypes}/>*/}
                            <FormRow label="Тип заявки" className="mb-6">
                                <Select label="Тип заявки" value={request.status} onChange={(value) => setRequest({...request, status: value as RequestStatus})}>
                                    {Object.keys(requestTypes).map((key, i) => key != 'unknown'?<Option value={key} key={i} index={i}>{requestTypes[key]}</Option>:'')}
                                </Select>
                            </FormRow>
                            {/*<div className="mb-6">
                                <InputRow label="Название" value={request.name} onChange={(ev) => setRequest({...request, name: ev.target.value})}/>
                            </div>
                            <div className="mb-6">
                                <InputRow label="IP адрес" value={request.ip} onChange={(ev) => setRequest({...request, ip: ev.target.value})}/>
                            </div>
                            <div className="mb-6">
                                <Textarea style={{height: 100}} label="Короткое описание (для экспорта)" value={request.short_description} onChange={(ev) => setRequest({...request, short_description: ev.target.value})}/>
                            </div>*/}
                            <FormRow className="mb-6" label="Содержимое">
                                <Textarea label="Содержимое" value={request.content} onChange={(ev:InputEvent) => setRequest({...request, content: (ev.target as HTMLInputElement).value})}/>
                            </FormRow>
                            {/*<div className="mb-6">
                         <InputRow label="Координаты" value={peer.locate} onChange={(ev) => setPeer({...peer, locate: ev.target.value})}/>
                     </div>*/}
                            <button type="submit" className="btn btn-primary py-3 px-7">{request.id?'Сохранить':'Добавить'}</button>
                        </form>

                        {errors &&
                            <>{Object.keys(errors).map(key => (
                                <div key={key} className="alert">
                                    {errors[key]}
                                </div>
                            ))}</>
                        }
                    </div>
                </div> :
                <div className="h-5"><LoadingArea/></div>
            }

        </>
    )
}
