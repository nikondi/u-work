import React, {useCallback, useRef, useState} from "react";
import {TableServer} from "@/components/Table/Table.jsx";
import LoadingArea from "@/components/LoadingArea";
import {ResourceFetchFunction} from "@/hooks/useResource";
import SearchInput from "@/components/SearchInput";
import {useDelayedState} from "@/hooks";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import Icon from "@/components/Icon";
import {err} from "@/helpers";
import {ObjectsAPI, SimpleObjectsAPI} from "../api";
import {Objects as ObjectType} from "../types";
import {objectTypeLabel} from "../const";
import {ObjectForm} from "../components/ObjectForm";
import {ObjectStatusDot} from "@/components/ObjectStatus";
import {BiRefresh} from "react-icons/bi";
import toast from "react-hot-toast";

export function ObjectsPage() {
  const [loading, setLoading] = useState(false);

  const [word, setWord] = useState('');
  const [_word, _setWord] = useDelayedState(setWord, 500, '');
  const lastWord = useRef('');

  const setPageRef = useRef<(page: number, silent?: boolean) => void>(null);

  const [currentObject, setCurrentObject] = useState(false);

  const fetchClients: ResourceFetchFunction = useCallback((page, setPage) => {
    if(word.trim() !== '') {
      const pg = word == lastWord.current?page:1;
      setPage(pg, pg != page);
      lastWord.current = word.trim();
      return SimpleObjectsAPI.search(30, pg, word);
    }
    else
      return SimpleObjectsAPI.get(30, page);
  }, [word]);

  const updateObjects = () => {
    const toast_id = toast.loading('Обновление');
    ObjectsAPI.updateStatuses()
      .then(() => {
        setPageRef.current(0)
        toast.success('Статусы обновлены');
      })
      .catch(err)
      .finally(() => toast.dismiss(toast_id));
  }

  return (
    <div>
      {(currentObject !== false) && <SidePopup onClose={() => setCurrentObject(false)}>
        <PopupContent>
          <CloseButton onClose={() => setCurrentObject(false)}/>
          <ObjectForm id={currentObject}/>
        </PopupContent>
      </SidePopup>}
      <div className="relative">
        <div className="flex justify-between">
          <SearchInput value={_word} setValue={_setWord} />
          <div className="flex gap-x-3">
            <button type="button" className="btn btn-primary !p-3 !px-3.5 text-xl" onClick={updateObjects} title="Обновить статусы устройств"><BiRefresh /></button>
            <button type="button" className="btn btn-rose !p-3 !px-4" onClick={() => setCurrentObject(null)}><Icon icon="plus"/></button>
          </div>
        </div>
        <div className="relative">
          <LoadingArea show={loading}/>
          <TableServer config={{
            pagination: true,
            resourceConfig: {
              fetch: fetchClients,
              onFetchError: err
            },
            tableConfig: {
              // linkTo: value => `/clients/${value.id}`,
              onClick(row) {
                setCurrentObject(row.id);
              },
              rowClass: 'cursor-pointer',
              columns: [
                { key: 'id', label: 'ID', linked: true },
                { key: 'name', label: 'Название', linked: true },
                { key: 'object_type', column: 'object', label: 'Тип объекта', linked: true, filter: (v: ObjectType) => objectTypeLabel(v.type)},
                { key: 'object_status', column: 'object', label: 'Статус', linked: true, filter: (v: ObjectType) => <ObjectStatusDot className="pl-5 !justify-start" status={v.status}/>},
                { key: 'type', label: 'Тип', linked: true },
                { key: 'city', label: 'Населенный пункт', linked: true },
                { key: 'street', label: 'Улица', linked: true, filter: (value) => value || <span className="text-gray-500">Пусто</span> },
                { key: 'house', label: 'Дом', linked: true, filter: (value) => value || <span className="text-gray-500">Пусто</span> },
              ],
            }
          }}
           setLoading={setLoading}
           setPageRef={setPageRef}/>
        </div>
      </div>
    </div>
  )
}
