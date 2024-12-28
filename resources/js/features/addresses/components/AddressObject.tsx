import React, {FormEventHandler, useEffect, useState} from "react";
import {Address} from "../types";
import toast from "react-hot-toast";
import Icon from "@/Components/Icon";
import SidePopup, {CloseButton, PopupContent} from "@/components/SidePopup";
import LoadingArea from "@/components/LoadingArea";
import {defaultObject, ObjectFields, Objects, ObjectsAPI} from "@/features/objects";
import Save from "@/components/Save";

type Props = {
  address: Address
}

export function AddressObject({address}: Props) {
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const [object, setObject] = useState<Objects>(address.object || defaultObject);

  useEffect(() => {
    setObject(address.object);
  }, [address]);

  const onSave: FormEventHandler = (e) => {
    e.preventDefault();

    setLoading(true);

    ObjectsAPI.manageMorphed(address.id, 'addresses', object, {
      object_type: 'house',
      callback: (server_data, type) => {
        toast.success(`Объект ${server_data.id} `+((type == 'save')?'сохранён':'добавлен'));
        setObject(server_data);
      },
      onFinally: () => setLoading(false),
    });

  }

  return <div>
    <button className="btn btn-rose !inline-flex gap-x-2.5" onClick={() => setOpened(!opened)}><Icon icon="objects" size="1.4em"/> Дом</button>
    {opened && <SidePopup onClose={() => setOpened(false)}>
      <PopupContent>
        <CloseButton onClose={() => setOpened(false)}/>
        <form onSubmit={onSave}>
          <LoadingArea show={loading} />
          <ObjectFields object={object} setObject={setObject} page="address"/>
          <Save>
            <button type="submit" className="btn btn-primary">{object?.id?'Сохранить':'Создать'}</button>
          </Save>
        </form>
      </PopupContent>
    </SidePopup>}
  </div>
}
