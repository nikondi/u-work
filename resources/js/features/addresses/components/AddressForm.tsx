import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useParams} from "react-router-dom";
import LoadingArea from "@/components/LoadingArea";
import Icon from "@/components/Icon";
import {err} from "@/helpers";
import {Address, Entrance} from "../types";
import {defaultAddress, defaultEntrance} from "../const";
import {AddressesAPI} from "../api";
import {AddressObject} from "./AddressObject";
import {EntranceForm} from "./EntranceForm";
import {AddressContext, useAddressContext} from "../contexts/AddressForm";
import {FaUsers} from "react-icons/fa";
import {ClientEntrance} from "@/features/clients";
import Save from "@/components/Save";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {rectSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import ErrorBoundary from "@/components/ErrorBoundary";
import toast from "react-hot-toast";

export function AddressFormPage() {
  const {id} = useParams();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>(defaultAddress);
  const [currentEntrance, setCurrentEntrance] = useState<Entrance>(address.entrances[0] || null);
  const [moveClients, setMoveClients] = useState(false);

  const nullEntrance = useMemo(() => {
    return address.entrances.find((item) => item.entrance == null)
  }, [address.entrances]);

  const addEntrance = useCallback(() => {
    const lastEntrance = address.entrances[address.entrances.length - 1].entrance;
    setAddress({...address, entrances: [...address.entrances, {
      ...defaultEntrance,
        address_id: address.id,
        entrance: lastEntrance?(lastEntrance + 1):1,
    }]})
  }, [address])


  useEffect(() => {
    if(id) {
      setLoading(true);
      AddressesAPI.getSingle(id)
        .then(({data}: {data: Address}) => {
          setAddress(data);
          setCurrentEntrance(data.entrances.find((e) => e.entrance !== null) || data.entrances.find((e) => e.entrance == null) || null);
        })
        .catch(err)
        .finally(() => setLoading(false));
    }
  }, [id]);

  return <div className="relative">
    {loading && <LoadingArea />}
    <AddressContext.Provider value={{
      address, setAddress,
      currentEntrance, setCurrentEntrance
    }}>
      <div className="relative min-h-16">
        <div>
          <div className="flex justify-between">
            <h1 className="text-2xl mb-4">{address?.full || 'Новый адрес'}</h1>
            <div className="flex gap-x-3">
              <button className="btn btn-primary" type="button" onClick={() => setMoveClients(true)}><FaUsers/></button>
            </div>
          </div>
          <AddressObject />
          <div className="tab_triggers mt-4">
            {address.entrances.map((entrance) =>
              entrance.entrance?<div key={entrance.entrance || entrance.id} className={"tab_trigger "+(currentEntrance?.entrance == entrance.entrance?'current':'')} onClick={() => setCurrentEntrance(entrance)}>{entrance.entrance}</div>:null
            )}
            <div className="tab_trigger leading-4" onClick={addEntrance}><Icon icon="plus"/></div>
            {nullEntrance && <div className={"tab_trigger ml-3 "+(currentEntrance?.id == nullEntrance.id?'current':'')} onClick={() => setCurrentEntrance(nullEntrance)}>Не указан</div>}
          </div>
          {currentEntrance && <EntranceForm />}
        </div>
      </div>
      {moveClients && <ClientsEntrances close={() => setMoveClients(false)} />}
    </AddressContext.Provider>
  </div>
}

type sortedClients = {
  id: string
  entrance: number
  entrance_id: number
  items: {
    id: string
    content: ClientEntrance
  }[]
}[]
function ClientsEntrances({close}: {close: () => void}) {
  const {address} = useAddressContext();
  const [clients, setClients] = useState<ClientEntrance[]>([]);
  const [loading, setLoading] = useState(false);


  const sortedClients = useMemo(() => {
    const result: sortedClients = [];
    address.entrances.map((entrance) => {
      result.push({
        id: `column-${entrance.id}`,
        entrance: entrance.entrance,
        entrance_id: entrance.id,
        items: clients
          .filter((client) => client.entrance_id == entrance.id)
          .map((client) => ({id: `id-${client.id}`, content: client}))
      })
    });
    return result;
  }, [clients, address.entrances]);


  useEffect(() => {
    if(!address || !address.id)
      return;

    AddressesAPI.getClients(address.id)
      .then(({data}) => setClients(data.data))
      .catch(err);
  }, []);

  const save = () => {
    const data = [];
    sortedClients.forEach((column) => {
      data.push(...column.items.map((item) => ({client_id: item.content.id, entrance_id: item.content.entrance_id, entrance: item.content.entrance})));
    });
    setLoading(true);
    AddressesAPI.saveClients(address.id, data)
      .then(() => {
        toast.success('Порядок жителей сохранён')
        close();
      })
      .catch(err)
      .finally(() => setLoading(false));
  }



  const [draggingItem, setDraggingItem] = useState(null);

  const findColumn = (unique: string | null) => {
    if (!unique)
      return null;
    if (sortedClients.some((c) => c.id === unique))
      return sortedClients.find((c) => c.id === unique) ?? null;

    const id = String(unique);
    const itemWithColumnId = [];
    sortedClients.forEach(c => c.items.forEach((item) => itemWithColumnId.push({itemId: item.id, columnId: c.id})));
    const columnId = itemWithColumnId.find((i) => i.itemId === id)?.columnId;
    return sortedClients.find((c) => c.id === columnId) ?? null;
  };

  const handleDragStart = ({active}: DragOverEvent) => {
    setDraggingItem({id: active.id, data: active.data.current});
  };
  const handleDragOver = ({active, over, delta}: DragOverEvent) => {
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);


    if (!activeColumn || !overColumn || activeColumn === overColumn)
      return null;

    const activeItems = activeColumn.items;
    const overItems = overColumn.items;
    const activeIndex = activeItems.findIndex((i: any) => i.id === activeId);
    const overIndex = overItems.findIndex((i: any) => i.id === overId);
    const newIndex = () => {
      const putOnBelowLastItem = overIndex === overItems.length - 1 && delta.y > 0;
      const modifier = putOnBelowLastItem ? 1 : 0;
      return overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
    };

    sortedClients.forEach((c) => {
      if (c.id === activeColumn.id) {
        c.items = activeItems.filter((i: any) => i.id !== activeId);
        return c;
      } else if (c.id === overColumn.id) {
        const new_index = newIndex();
        c.items = [
          ...overItems.slice(0, new_index),
          activeItems[activeIndex],
          ...overItems.slice(new_index, overItems.length)
        ];
        return c;
      } else {
        return c;
      }
    });
  };

  const handleDragEnd = ({active, over}: DragEndEvent) => {
    setDraggingItem(null);
    const activeId = String(active.id);
    const overId = over ? String(over.id) : null;
    const activeColumn = findColumn(activeId);
    const overColumn = findColumn(overId);
    if (!activeColumn || !overColumn || activeColumn !== overColumn)
      return null;

    const activeIndex = activeColumn.items.findIndex((i: any) => i.id === activeId);
    const changedColumn = activeColumn.items[activeIndex].content.entrance_id != activeColumn.entrance_id;

    if (changedColumn) {
      activeColumn.items[activeIndex].content.entrance_id = activeColumn.entrance_id;
      activeColumn.items[activeIndex].content.entrance = activeColumn.entrance;
    }
  };




  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 400,
        tolerance: 20,
      }
    }),
  );


  return <div className="fixed inset-0 z-10 flex justify-center items-start p-5">
    <div className="bg-black bg-opacity-40 backdrop-blur-sm absolute inset-0" onClick={close}></div>
    <LoadingArea show={loading}/>
    <Save>
      <button type="button" className="btn btn-red" onClick={close}>Закрыть</button>
      <button type="button" className="btn btn-primary" onClick={save}>Сохранить</button>
    </Save>
    <div className="bg-white dark:bg-blue-950 rounded-md relative z-20 shadow-lg w-full p-6" style={{maxWidth: '1600px'}}>
      <div className="flex gap-x-3 overflow-auto justify-center">
        <ErrorBoundary>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
          >
            {sortedClients.map((entrance) => <EntranceColumn entrance={entrance} key={entrance.id}/>)}
            <DragOverlay zIndex={1000}>
              {draggingItem &&
                <ClientCard id={draggingItem.id} client={draggingItem.data}/>}
            </DragOverlay>
          </DndContext>
        </ErrorBoundary>
      </div>
    </div>
  </div>
}

function EntranceColumn({entrance}) {
  const { setNodeRef } = useDroppable({ id: entrance.id });

  return <div className="rounded-md flex flex-col">
    <div className="text-lg text-center mb-3">{entrance.entrance || 'Не определён'}</div>
    <div className="overflow-auto tiny-scrollbar flex-1 flex gap-y-2 flex-col p-3 bg-white bg-opacity-15 rounded-sm" style={{maxHeight: 'calc(100vh - 180px)', width: '300px'}} ref={setNodeRef}>
      <SortableContext id={entrance.id} items={entrance.items} strategy={rectSortingStrategy}>
        {entrance.items.map(({id, content: client}) => <ClientCard key={id} id={id} client={client}/>)}
      </SortableContext>
    </div>
  </div>
}

function ClientItem({id, data, children}) {
  const {active, attributes, transition, listeners, setNodeRef, transform} = useSortable({id, data});

  return <div ref={setNodeRef} {...attributes} {...listeners} style={{
    transform: CSS.Transform.toString(transform),
    position: "relative",
    transition,
    padding: "5px 0",
  }}>
    {(active && active.id == id) ?
      <ClientCardPlaceholder />
      : children}
  </div>
}

function ClientCard({id, client}) {
  return <ClientItem id={id} data={client}>
    <div className="bg-white text-gray-800 px-2 p-1 rounded">
      <div>
        <span className="text-base text-gray-500">{client.apartment} ({client.floor}) </span>
        <span className="text-orange-500 text-xs">{client.id}</span>
      </div>
      <div className="text-base">{client.name || <span className="text-gray-400">Пусто</span>}</div>
    </div>
  </ClientItem>
}
function ClientCardPlaceholder() {
  return <div className="bg-white text-white opacity-20">
    <div>
      <span className="text-base">1</span>
      <span className="text-xs">1</span>
    </div>
    <div className="text-base">1</div>
  </div>
}
