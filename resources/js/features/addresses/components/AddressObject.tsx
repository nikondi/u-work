import React, {FormEventHandler, useState} from "react";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import Icon from "@/components/Icon";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import LoadingArea from "@/components/LoadingArea";
import {ObjectFields, Objects, ObjectsAPI} from "@/features/objects";
import Save from "@/components/Save";
import {useAddressContext} from "@/features/addresses/contexts/AddressForm";

export function AddressObject() {
  const {address, setAddress} = useAddressContext();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const setObject = (v: Objects) => setAddress({...address, object: v});

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    const d = {
      ...address.object,
      city: address.city,
      type: 'house',
      nets: address.object.nets || [],
      cameras: []
    }

    if(address.object.id) {
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
          <ObjectFields object={address.object} setObject={setObject} page="address"/>
          <Save>
            <button type="submit" className="btn btn-primary">{address.object?.id?'Сохранить':'Создать'}</button>
          </Save>
        </form>
      </PopupContent>
    </SidePopup>}
  </div>
}
