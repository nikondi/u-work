import React, {FormEventHandler, useEffect, useState} from "react";
import {Objects, SimpleObject} from "../types";
import {ObjectFields} from "./ObjectFields";
import {SimpleObjectsAPI} from "../api";
import LoadingArea from "@/components/LoadingArea";
import {defaultObject, defaultSimpleObject} from "../const";
import Save from "@/components/Save";
import {FormRow, Input, Option, Select} from "@/components/Form";
import toast from "react-hot-toast";
import {err} from "@/helpers";

export function ObjectForm({id}) {
  const [loading, setLoading] = useState(false);
  const [simpleObject, setSimpleObject] = useState<SimpleObject>(defaultSimpleObject);

  useEffect(() => {
    if(id) {
      setLoading(true);
      SimpleObjectsAPI.getSingle(id)
          .then(({data}) => setSimpleObject(data))
          .catch(err)
          .finally(() => setLoading(false));
    }
  }, [id]);

  const onSave: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setLoading(true);

    if(simpleObject.id) {
      SimpleObjectsAPI.save(simpleObject.id, simpleObject)
          .then(() => toast.success(`Объект ${id} сохранён`))
          .catch(err)
          .finally(() => setLoading(false));
    }
    else {
      SimpleObjectsAPI.create(simpleObject)
          .then(({data}) => {
            toast.success(`Объект ${data.id} добавлен`)
            setSimpleObject(data);
          })
          .catch(err)
          .finally(() => setLoading(false));
    }
  }

  return <form onSubmit={onSave}>
    {simpleObject && <>
      <LoadingArea show={loading} />
      <div className="flex gap-x-3 mb-4">
        <FormRow label="Название" className="flex-1" required>
          <Input value={simpleObject.name} setValue={(v: string) => setSimpleObject({...simpleObject, name: v})}/>
        </FormRow>
        <FormRow label="Объект" className="flex-1" required>
          <Select value={simpleObject.type} label="Объект" onChange={(v) => setSimpleObject({...simpleObject, type: v})}>
            <Option value="Детский сад" index={0}>Детский сад</Option>
            <Option value="Школа" index={1}>Школа</Option>
            <Option value="Парк" index={2}>Парк</Option>
            <Option value="Набережная" index={3}>Набережная</Option>
            <Option value="Ясли" index={4}>Ясли</Option>
            <Option value="Поликлиника" index={5}>Поликлиника</Option>
            <Option value="Торговый центр" index={6}>Торговый центр</Option>
            <Option value="Дом культуры" index={7}>Дом культуры</Option>
          </Select>
        </FormRow>
      </div>
      <div className="flex gap-x-3 mb-6">
        <FormRow label="Населённый пункт" className="flex-1" required>
          <Input value={simpleObject.city} setValue={(v: string) => setSimpleObject({...simpleObject, city: v})} />
        </FormRow>
        <FormRow label="Улица" className="flex-1">
          <Input value={simpleObject.street || ''} setValue={(v: string) => setSimpleObject({...simpleObject, street: v})}/>
        </FormRow>
        <FormRow label="Дом" className="flex-1">
          <Input value={simpleObject.house || ''} setValue={(v: string) => setSimpleObject({...simpleObject, house: v})}/>
        </FormRow>
      </div>
      <ObjectFields page="simple_object" object={simpleObject.object || defaultObject} setObject={(obj: Objects) => setSimpleObject({...simpleObject, object: obj})}/>
    </>}
    <Save>
      <button type="submit" className="btn btn-primary">{simpleObject.id?'Сохранить':'Создать'}</button>
    </Save>
  </form>
}
