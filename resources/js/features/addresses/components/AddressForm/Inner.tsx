import React, {useState} from "react";
import LoadingArea from "@/components/LoadingArea";
import {FaUsers} from "react-icons/fa";
import {useAddressContext} from "../../contexts/AddressForm";
import {AddressObject} from "../AddressObject";
import {ClientsEntrances} from "../MoveClients";
import AddressTabs from "./Tabs";

export default function AddressInner() {
  const {address, loading} = useAddressContext();
  const [moveClients, setMoveClients] = useState(false);

  return <div>
    {loading && <LoadingArea />}
    <div className="relative min-h-16">
      <div>
        <div className="flex justify-between">
          <h1 className="text-2xl mb-4">{address?.full || 'Новый адрес'}</h1>
          <div className="flex gap-x-3">
            <button className="btn btn-primary" type="button" onClick={() => setMoveClients(true)}><FaUsers/></button>
          </div>
        </div>
        {address.object && <AddressObject address={address} />}
        {address.entrances.length > 0 && <AddressTabs entrances={address.entrances} address_id={address.id}/>}
      </div>
    </div>
    {moveClients && <ClientsEntrances close={() => setMoveClients(false)} />}
  </div>
}

