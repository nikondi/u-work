import React from "react";
import {Checkbox, FormRow, Input, Option, Select, Textarea} from "@/components/Form";
import Icon from "@/components/Icon";
import {ObjectCamera, ObjectFile, ObjectNet, Objects} from "../types";
import {defaultObject} from "../const";
import {WorkerSelect} from "@/features/requests/components/RequestForm";
import toast from "react-hot-toast";

type Props = {
  object: Objects
  setObject: (v: Objects) => void,
  page: 'simple_object' | 'entrance' | 'address'
}

export function ObjectFields({object = null, setObject, page}: Props) {
  object = object || defaultObject;
  return <div>
    <div className="flex gap-x-3 mb-4 items-end">
      {page == 'simple_object' &&
        <FormRow label="Тип объекта" required>
          <Select value={object.type} onChange={(v) => setObject({...object, type: v})}>
            <Option index={1} value="112-button">Кнопка 112</Option>
            <Option index={2} value="112-stand">Стойка 112</Option>
          </Select>
        </FormRow>
      }
      {page != 'entrance' &&
      <FormRow label="Ответственный">
        <Select onChange={(v) => setObject({...object, worker: v})}>
          <WorkerSelect worker={object.worker}/>
        </Select>
      </FormRow>}
      <FormRow label="Маршрутизатор">
        <Input value={object.router || ''} setValue={(v: string) => setObject({...object, router: v})} />
      </FormRow>
      <div className="flex-1">
        <Checkbox checked={object.internet} setValue={(v) => setObject({...object, internet: v})} markClass="text-2xl" wrapClass="items-center">Интернет</Checkbox>
      </div>
    </div>


    <ObjectNets nets={object.nets || []} setNets={(v) => setObject({...object, nets: v})}/>
    {page != 'address' && <ObjectCameras cameras={object.cameras || []} setCameras={(v) => setObject({...object, cameras: v})}/>}

    {page != 'address' && <div className="flex gap-x-3 mb-4 items-center">
      <FormRow label="IP адрес кубика">
        <Input value={object.cubic_ip || ''} setValue={(v) => setObject({...object, cubic_ip: v})}/>
      </FormRow>
      <FormRow label="SIP номер">
        <Input value={object.sip || ''} setValue={(v) => setObject({...object, sip: v})}/>
      </FormRow>
      <FormRow label="Модель МиниПК">
        <Select value={object.minipc_model || ''} onChange={(v) => setObject({...object, minipc_model: v})}>
          <Option value="Cubieboard2" index={0}>Cubieboard 2</Option>
          <Option value="OrangePi" index={1}>OrangePi</Option>
        </Select>
      </FormRow>
    </div>}
    <FormRow label="Примечание" className="mb-4">
      <Textarea value={object.comment || ''} setValue={(v) => setObject({...object, comment: v})}/>
    </FormRow>
    <ObjectSchemas schemas={object.schemas || []} setSchemas={(v) => setObject({...object, schemas: v})}/>
  </div>
}

function ObjectNets({nets, setNets}: {nets: ObjectNet[], setNets: (v: ObjectNet[]) => void}) {
  const updateNet = (index: number, value: ObjectNet) => setNets(nets.map((item, i) => (index == i)?value:item));
  const addNet = () => setNets([...nets, {id: null, wan: '', pppoe_cred: '', subnet: ''}]);
  const removeNet = (index: number) => setNets(nets.filter((_item, i) => i != index));


  return <div className="mb-6">
    <div className="text-2xl mb-1">Сети</div>
    <div className="mb-2">
      {nets.length > 0
        ? nets.map((net, i) => <div className="flex gap-x-3 mb-1 items-end" key={i}>
          <FormRow label="Подсеть" showLabel={i == 0} required>
            <Input value={net.subnet || ''} setValue={(v) => updateNet(i, {...net, subnet: v})}/>
          </FormRow>
          <FormRow label="WAN IP" showLabel={i == 0} required>
            <Input value={net.wan || ''} setValue={(v) => updateNet(i, {...net, wan: v})}/>
          </FormRow>
          <FormRow label="Учётка PPPoE" showLabel={i == 0} required>
            <Input value={net.pppoe_cred || ''} setValue={(v) => updateNet(i, {...net, pppoe_cred: v})}/>
          </FormRow>
          <div className="flex-shrink-0">
            <button type="button" className="px-2 py-3 transition-colors duration-300 hover:text-orange-400 dark:hover:text-orange-400"><Icon icon="times" onClick={() => removeNet(i)}/></button>
          </div>
        </div>)
        : <div className="text-gray-400 text-center pt-3 px-2">Пусто</div>
      }
    </div>
    <div className="text-right">
      <button type="button" className="btn btn-rose" onClick={addNet}>Добавить <Icon icon="plus"/></button>
    </div>
  </div>
}

function ObjectCameras({cameras, setCameras}: {cameras: ObjectCamera[], setCameras: (v: ObjectCamera[]) => void}) {
  const updateCamera = (index: number, value: ObjectCamera) => setCameras(cameras.map((item, i) => (index == i)?value:item));
  const addCamera = () => setCameras([...cameras, {id: null, ip: '', model: ''}]);
  const removeCamera = (index: number) => setCameras(cameras.filter((_item, i) => i != index));


  return <div className="mb-6">
    <div className="text-2xl mb-1">Камеры</div>
    <div className="mb-2">
      {cameras.length > 0
        ? cameras.map((camera, i) => <div className="flex gap-x-3 mb-1 items-end" key={i}>
          <FormRow label="IP камеры" showLabel={i == 0}>
            <Input value={camera.ip || ''} setValue={(v) => updateCamera(i, {...camera, ip: v})}/>
          </FormRow>
          <FormRow label="Модель камеры" showLabel={i == 0}>
            <Input value={camera.model || ''} setValue={(v) => updateCamera(i, {...camera, model: v})}/>
          </FormRow>
          <div className="flex-shrink-0">
            <button type="button" className="px-2 py-3 transition-colors duration-300 hover:text-orange-400 dark:hover:text-orange-400"><Icon icon="times" onClick={() => removeCamera(i)}/></button>
          </div>
        </div>)
        : <div className="text-gray-400 text-center pt-3 px-2">Пусто</div>
      }
    </div>
    <div className="text-right">
      <button type="button" className="btn btn-rose" onClick={addCamera}>Добавить <Icon icon="plus"/></button>
    </div>
  </div>
}

function ObjectSchemas({schemas, setSchemas}: {schemas: ObjectFile[], setSchemas: (v: ObjectFile[]) => void}) {
  const addFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files[0];
    if(schemas.find((schema) => schema.basename == file.name)) {
      e.target.value = null;
      toast.error('Файл с таким именем уже загружен!');
      return;
    }
    setSchemas([...schemas, {id: null, path: null, file, url: null, type: 'schema', basename: file.name }]);
    e.target.value = null;
  }
  const removeFile = (index: number) => setSchemas(schemas.filter((_item, i) => i != index));

  return <div className="mb-6">
    <div className="text-2xl mb-2">Схемы</div>
    <div className="mb-3 flex items-center gap-x-3">
      {/*<label className="relative">
        <button type="button" className="btn btn-primary !flex items-center gap-x-3"><FaPlus size="1.2em" /> <div>Выбрать файл</div></button>
        <input type="file" onChange={addFile} accept=".vsdx,.vsd" className="absolute opacity-0 -z-10 top-0"/>
      </label>*/}
      <input type="file" onChange={addFile} accept=".vsdx,.vsd"/>
    </div>
    <div className="flex flex-col gap-y-2">
      {schemas.map((schema, i) =>
        <div key={schema.basename+i} className="flex gap-x-3 items-center hover:bg-gray-400 hover:bg-opacity-10 px-3 transition-colors duration-150 rounded">
          <button type="button" className="transition-colors duration-300 hover:text-orange-400 dark:hover:text-orange-400"><Icon icon="times" onClick={() => removeFile(i)}/></button>
          {schema.url ? <a href={schema.url} className="block flex-1 text-blue-600 dark:text-blue-400 p-1.5" target="_blank">{schema.basename}</a> : <div className="flex-1 p-1.5">{schema.file.name}</div>}
        </div>
      )}
    </div>
  </div>;
}
