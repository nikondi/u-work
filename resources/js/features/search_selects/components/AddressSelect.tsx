import {Address, AddressesAPI} from "@/features/addresses";
import React, {useEffect, useRef, useState} from "react";
import {Input, Option, useSelectContext} from "@/components/Form";
import {err} from "@/helpers";
import {useDelayedState} from "@/hooks";

export function AddressSelect({address}: {address: Address}) {
  const [word, setWord] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const {opened} = useSelectContext();
  const searchInput = useRef<HTMLInputElement>();

  useEffect(() => {
    (opened)?searchInput.current.focus():searchInput.current.blur();
  }, [opened]);

  useEffect(() => {
    if(word.trim() !== '') {
      AddressesAPI
          .search(5, 1, word, false)
          .then(({data}) => setAddresses(data.data))
          .catch(() => err());
    }
    else
      setAddresses([]);
  }, [word]);

  const addressLabel = (address: Address) => {
    return address.full;
  }

  const [_word, _setWord] = useDelayedState(setWord, 400, '');

  return <>
    {address && <>
        <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mb-0.5"></div>
        <Option index={-1} value={address}>
          {addressLabel(address)}
        </Option>
        <div style={{height: '1px', backgroundColor: 'currentColor'}} className="text-gray-400 dark:text-gray-400 mt-0.5 mb-2"></div>
    </>}
    <div className="px-2">
      <Input label="Поиск..." value={_word} setValue={_setWord} inputRef={searchInput} />
    </div>
    {addresses.length > 0 && <div className="h-2"></div>}
    {addresses.map((_address: Address, i: number) => <Option index={i} key={i} value={_address}>
      {addressLabel(_address)}
    </Option>)}
  </>
}
