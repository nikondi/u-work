import React, {FormEventHandler, useEffect, useState} from "react";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import Icon from "@/Components/Icon";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import Save from "@/components/Save";
import LoadingArea from "@/components/LoadingArea";
import {ObjectFields, ObjectsAPI} from "@/features/objects";
import {FormRow, Option, Select} from "@/components/Form";
import {EntrancesAPI} from '../api/EntrancesAPI'
import {Entrance, Intercom} from "../types";

export function EntranceObject({entrance}) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Entrance>(entrance);

  useEffect(() => {
    setLoading(true);
    const getEntrance = EntrancesAPI.getSingle(entrance.id);
    getEntrance.getResult
        .then(({data: server_data}) => setData(server_data))
        .catch(err)
        .finally(() => setLoading(false));

    return () => getEntrance.abort();
  }, [entrance.entrance]);

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    if(data.id) {
      EntrancesAPI.update(data.id, {intercoms: data.intercoms})
          .then(() => toast.success(`Подъезд ${entrance.id} сохранён`))
          .catch(err);
    }

    ObjectsAPI.manageMorphed(data.id, 'entrances', data.object, {
      object_type: 'intercom',
      callback: (server_data, type) => {
        toast.success(`Объект ${server_data.id} `+((type == 'save')?'сохранён':'добавлен'));
        setData((prev) => ({...prev, object: server_data}));
      },
      onFinally: () => setLoading(false),
    });
  }

  return <div className="pt-6">
    <button className="btn btn-rose !inline-flex gap-x-2.5" onClick={() => setOpened(!opened)}><Icon icon="objects" size="1.4em"/> Подъезд</button>
    {opened && <SidePopup onClose={() => setOpened(false)}>
      <PopupContent>
        <CloseButton onClose={() => setOpened(false)}/>
        <form onSubmit={onSave}>
          <LoadingArea show={loading} />
          <EntranceIntercoms intercoms={data.intercoms || []} setIntercoms={(v) => setData({...data, intercoms: v})} />
          <ObjectFields object={data.object} setObject={(v) => setData({...data, object: v})} page="entrance"/>
          <Save>
            <button type="submit" className="btn btn-primary">{data.object?.id?'Сохранить':'Создать'}</button>
          </Save>
        </form>
      </PopupContent>
    </SidePopup>}
  </div>
}

function EntranceIntercoms({intercoms, setIntercoms}: {intercoms: Intercom[], setIntercoms: (v: Intercom[]) => void}) {
  const updateIntercom = (index: number, value: Partial<Intercom>) => setIntercoms(intercoms.map((item, i) => (index == i)?{...item, ...value}:item));
  const addIntercom = () => setIntercoms([...intercoms, {id: null, calling_panel: '', model: '', version: '', door_type: 'uniphone'}]);
  const removeIntercom = (index: number) => setIntercoms(intercoms.filter((_item, i) => i != index));

  return <div className="mb-6">
    <div className="text-2xl mb-1">Домофоны</div>
    <div className="mb-2">
      {intercoms.length > 0
          ? intercoms.map((intercom, i) => <div className="flex gap-x-3 mb-1 items-end" key={i}>
            <FormRow label="Модель" showLabel={i == 0} required>
              <Select value={intercom.model} onChange={(v) => updateIntercom(i, {model: v})}>
                <Option index={1} value="metakom">Метаком</Option>
                <Option index={2} value="metakom-video">Метаком (видео)</Option>
                <Option index={3} value="tdf">TDF</Option>
                <Option index={4} value="cyfral">Цифрал</Option>
                <Option index={5} value="cyfral-tc">Цифрал tc</Option>
                <Option index={7} value="cyfral-tm">Цифрал ТМ</Option>
                <Option index={6} value="cyfral-new">Цифрал новый</Option>
                <Option index={8} value="impulse">Импульс</Option>
                <Option index={9} value="bas-ip">BAS IP</Option>
                <Option index={10} value="strazh-k">Страж-к</Option>
                <Option index={11} value="bevard">Бевард</Option>
              </Select>
            </FormRow>
            <FormRow label="Версия" showLabel={i == 0} required>
              <Select value={intercom.version} onChange={(v) => updateIntercom(i, {version: v})}>
                <Option index={1} value="Ver.1.2">Ver.1.2</Option>
                <Option index={2} value="Ver.1.35">Ver.1.35</Option>
                <Option index={3} value="Ver.1.6">Ver.1.6</Option>
                <Option index={4} value="Ver.3.1">Ver.3.1</Option>
                <Option index={5} value="Ver.3.2">Ver.3.2</Option>
                <Option index={6} value="40Д">40Д</Option>
                <Option index={7} value="40Д TC">40Д TC</Option>
                <Option index={8} value="60С">60С</Option>
                <Option index={9} value="МК99">МК99</Option>
                <Option index={10} value="МК2003">МК2003</Option>
                <Option index={11} value="МК2003-ТМ">МК2003-ТМ</Option>
                <Option index={12} value="МК2003.1">МК2003.1</Option>
                <Option index={13} value="МК2003.2">МК2003.2</Option>
                <Option index={14} value="МК2003.2-ТМ">МК2003.2-ТМ</Option>
                <Option index={15} value="МК2007">МК2007</Option>
                <Option index={16} value="МК2008">МК2008</Option>
                <Option index={17} value="МК2012">МК2012</Option>
                <Option index={18} value="МК10-ТМ">МК10-ТМ</Option>
                <Option index={19} value="МК20">МК20</Option>
                <Option index={20} value="МК20-ТМ">МК20-ТМ</Option>
                <Option index={21} value="МК99-ОК">МК99-ОК</Option>
              </Select>
            </FormRow>
            <FormRow label="Вызывная панель" showLabel={i == 0} required>
              <Select value={intercom.calling_panel} onChange={(v) => updateIntercom(i, {calling_panel: v})}>
                <Option value="uniphone" index={2}>UNIPHONE</Option>
                <Option value="uniphone-ros" index={3}>UNIPHONE (Росдомофон)</Option>
                <Option value="cyfral" index={4}>Цифрал</Option>
                <Option value="cyfral-tc" index={5}>Цифрал tc</Option>
                <Option value="cyfral-new" index={6}>Новый цифрал</Option>
                <Option value="cyfral-tm" index={7}>Цифрал ТМ</Option>
                <Option value="impulse" index={8}>Импульс</Option>
                <Option value="impulse-40d" index={9}>Импульс 40Д</Option>
                <Option value="metakom" index={12}>Метаком</Option>
                <Option value="metakom-10tm" index={10}>Метаком 10 тм</Option>
                <Option value="metakom-ksobj" index={11}>Метаком-КСОБЖ</Option>
                <Option value="metakom-video" index={13}>Метаком (видео)</Option>
                <Option value="metakom-uniphone" index={14}>Метаком/Uniphone</Option>
                <Option value="vizit" index={15}>VIZIT</Option>
                <Option value="straj-k" index={16}>Страж-к</Option>
              </Select>
            </FormRow>
            <FormRow label="Тип двери" showLabel={i == 0}>
              <Select value={intercom.door_type} onChange={(v) => updateIntercom(i, {door_type: v})}>
                <Option index={1} value="uniphone">Uniphone</Option>
                <Option index={2} value="builders">Строительная</Option>
              </Select>
            </FormRow>
            <div className="flex-shrink-0">
              <button type="button" className="px-2 py-3 transition-colors duration-300 hover:text-orange-400 dark:hover:text-orange-400"><Icon icon="times" onClick={() => removeIntercom(i)}/></button>
            </div>
          </div>)
          : <div className="text-gray-400 text-center pt-3 px-2">Пусто</div>
      }
    </div>
    {intercoms.length < 2 && <div className="text-right">
      <button type="button" className="btn btn-rose" onClick={addIntercom}>Добавить <Icon icon="plus"/></button>
    </div>}
  </div>
}
