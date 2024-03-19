import React, {createContext, useContext, useEffect, useState} from "react";
import {Client, ClientEntrance} from "@/features/clients";
import {useAddressContext} from "../contexts/AddressForm";
import {AddressesAPI} from "../api";
import {err} from "@/helpers";
import toast from "react-hot-toast";
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
import LoadingArea from "@/components/LoadingArea";
import Save from "@/components/Save";
import ErrorBoundary from "@/components/ErrorBoundary";
import {rectSortingStrategy, SortableContext, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {FaUserPlus} from "react-icons/fa6";

type sortedClientsItem = {
  id: string
  content: ClientEntrance
}

type sortedClients = {
  id: string
  entrance: number
  entrance_id: number
  items: sortedClientsItem[]
}[]

type AddingEntrance = {
  id: number,
  entrance: number
}

type AddClients = {
  entrance: AddingEntrance,
  clients: Client[]
}

type ClientsEntrancesContext = {
  addingEntrance: AddingEntrance,
  setAddingEntrance: (v: AddingEntrance) => void
  addClients: AddClients
  setAddClients: (v: AddClients) => void
  close: () => void
}
const ClientsEntrancesContext = createContext<ClientsEntrancesContext>(null);
const useClientsEntrancesContext = () => useContext(ClientsEntrancesContext);

const makeClientSortable = (client: ClientEntrance | Client) : sortedClientsItem => {
  return {id: `id-${client.id}`, content: (client as ClientEntrance)};
}

export function ClientsEntrances({close}) {
  const [addingEntrance, setAddingEntrance] = useState(null);
  const [addClients, setAddClients] = useState<AddClients>(null);

  return <ClientsEntrancesContext.Provider value={{
    addingEntrance, setAddingEntrance,
    addClients, setAddClients,
    close
  }}>
    <div className="fixed inset-0 z-10 flex justify-center items-start p-5">
      <div className="bg-black bg-opacity-40 backdrop-blur-sm absolute inset-0" onClick={close}></div>
      <ClientsList/>
    </div>
  </ClientsEntrancesContext.Provider>
}

function ClientsList() {
  const {address, fetchAddress} = useAddressContext();
  const [clients, setClients] = useState<ClientEntrance[]>([]);
  const [loading, setLoading] = useState(false);
  const {close, addClients} = useClientsEntrancesContext();

  const sortedClients: sortedClients = [];
  address.entrances.map((entrance) => {
    sortedClients.push({
      id: `column-${entrance.id}`,
      entrance: entrance.entrance,
      entrance_id: entrance.id,
      items: clients
          .filter((client) => client.entrance_id == entrance.id)
          .map(makeClientSortable)
    })
  });

  useEffect(() => {
    if(!address || !address.id)
      return;

    AddressesAPI.getClients(address.id)
        .then(({data}) => setClients(data.data))
        .catch(err);
  }, [address]);

  const save = () => {
    const data = [];
    sortedClients.forEach((column) => {
      data.push({entrance_id: column.entrance_id, entrance: column.entrance, items: column.items.map((item) => item.content.id)});
    });
    setLoading(true);
    AddressesAPI.saveClients(address.id, data)
        .then(() => {
          toast.success('Порядок жителей сохранён')
          fetchAddress();
          close();
        })
        .catch(err)
        .finally(() => setLoading(false));
  }


  useEffect(() => {
    if(!addClients)
      return;

    const column = sortedClients.find((column) => column.entrance_id?(column.entrance_id == addClients.entrance.id):(column.entrance == addClients.entrance.entrance));
    if(column) {
      column.items = [...addClients.clients.map(makeClientSortable), ...column.items];
    }
  }, [addClients]);


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


  return <>
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
            {draggingItem && <DragOverlay zIndex={1000}>
              <ClientCard id={draggingItem.id} client={draggingItem.data}/>
            </DragOverlay>}
          </DndContext>
        </ErrorBoundary>
      </div>
    </div>
  </>;
}

function EntranceColumn({entrance}) {
  const { setNodeRef } = useDroppable({ id: entrance.id });
  const {setAddingEntrance} = useClientsEntrancesContext();

  return <div className="rounded-md flex flex-col">
    <div className="text-lg mb-3 flex gap-x-3 items-center">
      {entrance.entrance || 'Не определён'}
      <button type="button" className="transition-colors duration-300 hover:text-orange-500" onClick={() => setAddingEntrance({id: entrance.entrance_id, entrance: entrance.entrance})}><FaUserPlus /></button>
    </div>
    <div className="overflow-auto tiny-scrollbar flex-1 flex gap-y-2 flex-col p-3 bg-gray-600 dark:bg-white bg-opacity-15 dark:bg-opacity-15 rounded-sm" style={{maxHeight: 'calc(100vh - 180px)', width: '300px'}} ref={setNodeRef}>
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
