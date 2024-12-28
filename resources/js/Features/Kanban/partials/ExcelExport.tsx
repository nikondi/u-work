import React, {ChangeEventHandler, PropsWithChildren, useState} from "react";
import {FaFileExcel} from "react-icons/fa6";
import {AxiosForm, FormHandler, useFormContext} from "@/Components/Form";

type TExcelForm = {
  range: string
}

export default function ExcelExport(){
  const [opened, setOpened] = useState(false);

  const onSubmit: FormHandler<TExcelForm> = (form) => {
    window.location.href = route('api.requests.export', {range: form.data.range})
  }

  return <AxiosForm initialData={{
    range: 'week'
  }} onSubmit={onSubmit} action={route('api.requests.export')} className="mb-6">
    <div className="flex gap-x-3">
      <button type="button" className="btn btn-blue !inline-flex items-center gap-x-2" onClick={() => setOpened((v) => !v)}><FaFileExcel /> Выгрузка в excel</button>
    </div>
    {opened && <div className="flex gap-x-3 py-3 border-b border-b-gray-500 items-center">
      <ExportCheckbox value="day">За день</ExportCheckbox>
      <ExportCheckbox value="week">За неделю</ExportCheckbox>
      <ExportCheckbox value="month">За месяц</ExportCheckbox>
      <ExportCheckbox value="year">За год</ExportCheckbox>
      <button type="submit" className="btn btn-rose">Загрузить</button>
    </div>}
  </AxiosForm>
}

function ExportCheckbox({value, children}: PropsWithChildren<{value:string}>) {
  const {data, setData} = useFormContext<TExcelForm>();
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => e.target.checked && setData('range', value)

  return <label className={"cursor-pointer px-2 py-1 items-center transition-colors hover:bg-gray-300 dark:hover:bg-gray-600 rounded relative"+(value == data.range?' bg-gray-300 dark:bg-gray-600':'')}>
    <input type="radio" className="absolute opacity-0 -z-10" name="export_date" value={value} checked={data.range == value} onChange={onChange}/>
    {children}
  </label>
}
