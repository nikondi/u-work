import React, {useCallback, useEffect, useRef, useState} from "react";
import {TableServer} from "@/components/Table/Table.jsx";
import LoadingArea from "@/components/LoadingArea";
import {ResourceFetchFunction} from "@/hooks/useResource";
import SearchInput from "@/components/SearchInput";
import toast from "react-hot-toast";
import {useDelayedState} from "@/hooks";
import {AddressesAPI} from "@/features/addresses";
import {Option, Select} from "@/components/Form";
import {err} from "@/helpers";

export function Addresses() {
  const [loading, setLoading] = useState(false);

  const [word, setWord] = useState('');
  const [_word, _setWord] = useDelayedState(setWord, 500, '');
  const lastWord = useRef('');
  const [city, setCity] = useState();

  const fetchAddresses: ResourceFetchFunction = useCallback((page, setPage) => {
    if(word.trim() !== '') {
      const pg = word == lastWord.current?page:1;
      setPage(pg, pg != page);
      lastWord.current = word.trim();
      return AddressesAPI.search(30, pg, word, true, city?{city}:{});
    }
    else
      return AddressesAPI.get(30, page, city?{city}:{});
  }, [word, city]);

  return (
      <div>
        <div className="relative">
          <div className="flex gap-x-3 items-center">
            <SearchInput value={_word} setValue={_setWord} />
            Город:
            <Select className="w-56" value={null} onChange={(v) => setCity(v)}>
              <CitySelect/>
            </Select>
          </div>
          <div className="relative">
            <LoadingArea show={loading}/>
            <TableServer config={{
              pagination: true,
              resourceConfig: {
                fetch: fetchAddresses,
                onFetchError: (e) => toast.error('Произошла ошибка: ' + e.message)
              },
              tableConfig: {
                linkTo: value => `/addresses/${value.id}`,
                columns: [
                  { key: 'full', label: 'Адрес', linked: true,
                    filter(value: string) {
                      return value || <span className="text-gray-400 dark:text-gray-500">Пусто</span>;
                    }
                  },
                ],
              }
            }}
             setLoading={setLoading}/>
          </div>
        </div>
      </div>
  )
}

function CitySelect() {
  const [cities, setCities] = useState<{city: string}[]>([]);

  useEffect(() => {
    AddressesAPI.getCities().then(({data}) => setCities(data) ).catch(err)
  }, []);

  return <>
    <Option value={null} index={-1000}>Не выбран</Option>
    {cities.map((city, i) => <Option key={i} index={i} value={city.city}>{city.city}</Option>)}
  </>
}
