import React, {FormEventHandler, useState} from "react";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import Icon from "@/components/Icon";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import Save from "@/components/Save";
import LoadingArea from "@/components/LoadingArea";
import {ObjectFields, ObjectsAPI} from "@/features/objects";
import {useAddressContext} from "../contexts/AddressForm";

export function EntranceObject() {
  const {currentEntrance: entrance, setCurrentEntrance: setEntrance, address} = useAddressContext();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    const d = {
      ...entrance.object,
      city: address.city,
      type: 'entrance',
      nets: entrance.object.nets || [],
      cameras: entrance.object.cameras || []
    }


    if(entrance.object.id) {
      ObjectsAPI.saveMorphed(entrance.id, 'entrances', d)
        .then(({data}) => toast.success(`Объект ${data.id} сохранён`))
        .catch(err)
        .finally(() => setLoading(false));
    }
    else {
      ObjectsAPI.createMorphed(entrance.id, 'entrances', d)
        .then(({data}) => {
          toast.success(`Объект ${data.id} добавлен`)
          setEntrance({...entrance, object: data});
        })
        .catch(err)
        .finally(() => setLoading(false));
    }
  }
  return <div className="pt-6">
    <button className="btn btn-rose !inline-flex gap-x-2.5" onClick={() => setOpened(!opened)}><Icon icon="objects" size="1.4em"/> Объект</button>
    {opened && <SidePopup onClose={() => setOpened(false)}>
      <PopupContent>
        <CloseButton onClose={() => setOpened(false)}/>
        <form onSubmit={onSave}>
          <LoadingArea show={loading} />
          <ObjectFields object={entrance.object} setObject={(v) => setEntrance({...entrance, object: v})} page="entrance"/>
          <Save>
            <button type="submit" className="btn btn-primary">{entrance.object?.id?'Сохранить':'Создать'}</button>
          </Save>
        </form>
      </PopupContent>
    </SidePopup>}
  </div>
}
