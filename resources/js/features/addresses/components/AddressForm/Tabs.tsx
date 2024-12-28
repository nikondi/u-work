import React, {useState} from "react";
import {defaultEntrance} from "../../const";
import {EntrancesAPI} from "../../api";
import {Entrance} from "../../types";
import toast from "react-hot-toast";
import {err} from "@/helpers";
import {FaTimes} from "react-icons/fa";
import Icon from "@/Components/Icon";
import {EntranceForm} from "../EntranceForm";

type Props = {
  entrances: Entrance[],
  address_id: number
}

export default function AddressTabs({entrances, address_id}: Props) {
  const [currentEntrance, setCurrentEntrance] = useState(entrances.findIndex((entrance) => entrance.entrance));
  const [list, setList] = useState(entrances);

  const addEntrance = () => {
    const lastEntrance = list.slice(0).reverse().find(item => item.entrance).entrance;
    setList([...list, {
        ...defaultEntrance,
        address_id: address_id,
        entrance: lastEntrance?(lastEntrance + 1):1,
      }])
  }

  const deleteCurrentEntrance = () => {
    const entrance = list[currentEntrance];
    const num = entrance.entrance;
    if(!confirm(`Точно удалить подъезд ${num}?`))
      return;
    if(!entrance.id)
      setList((prev) => prev.slice(0, prev.length - 1))
    else {
      const toast_id = toast.loading('Удаление...');
      EntrancesAPI.delete(list[currentEntrance].id)
          .then(() => {
            toast.success(`Подъезд ${num} удалён`);
            setList((prev) => prev.filter((ent) => ent.id != entrance.id && ent.entrance != entrance.entrance));
            setCurrentEntrance(entrances.findIndex((entrance) => entrance.entrance));
          })
          .catch(err)
          .finally(() => toast.dismiss(toast_id));
    }
  }

  return <>
    <div className="tab_triggers mt-4">
      {list.map((entrance, i) => {
          const isCurrent = i == currentEntrance;
          return <div key={`ent-${entrance.entrance}` || entrance.id} className={"tab_trigger " + (isCurrent ? 'current' : '')} onClick={() => !isCurrent && setCurrentEntrance(i)}>
              {entrance.entrance || 'Не указан'}
              {isCurrent && (i + 1 == list.length && entrance.entrance) && <>
                  <div className="w-2"></div>
                  <button onClick={deleteCurrentEntrance} className="tab_trigger-button right-1 rounded-full hover:bg-red-500 p-1 absolute"><FaTimes/></button>
              </>}
            </div>
          }
      )}
      <div className="tab_trigger leading-4" onClick={addEntrance}><Icon icon="plus"/></div>
      {/*{nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}*/}
    </div>
    {list[currentEntrance] && <EntranceForm entrance={list[currentEntrance]}/>}
  </>;
}
