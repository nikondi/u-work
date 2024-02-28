import React, {FormEventHandler, useState} from "react";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import Icon from "@/components/Icon";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import LoadingArea from "@/components/LoadingArea";
import {ObjectFields, ObjectsAPI, Objects} from "@/features/objects";
import Save from "@/components/Save";
import {Address} from "../types";

export function AddressObject({object, setObject, address}: { object: Objects, setObject: (v: Objects) => void, address: Address }) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    const d = {
      ...object,
      city: address.city,
      type: 'house',
      nets: object.nets || [],
      cameras: []
    }

    if(object.id) {
      ObjectsAPI.saveMorphed(address.id, 'addresses', d)
        .then(({data}) => toast.success(`Объект ${data.id} сохранён`))
        .catch(err)
        .finally(() => setLoading(false));
    }
    else {
      ObjectsAPI.createMorphed(address.id, 'addresses', d)
        .then(({data}) => {
          toast.success(`Объект ${data.id} добавлен`)
          setObject(data);
        })
        .catch(err)
        .finally(() => setLoading(false));
    }

  }
  return <div>
    <button className="btn btn-rose !inline-flex gap-x-2.5" onClick={() => setOpened(!opened)}><Icon icon="objects" size="1.4em"/> Объект</button>
    {opened && <SidePopup onClose={() => setOpened(false)}>
      <PopupContent>
        <CloseButton onClose={() => setOpened(false)}/>
        <form onSubmit={onSave}>
          <LoadingArea show={loading} />
          <ObjectFields object={object} setObject={setObject} page="address"/>
          <Save>
            <button type="submit" className="btn btn-primary">{object.id?'Сохранить':'Создать'}</button>
          </Save>
        </form>
      </PopupContent>
    </SidePopup>}
  </div>
}
