import React, {ChangeEventHandler, Fragment, useMemo} from "react";
import Icon from "@/Components/Icon";

type RepeaterConfig = {
  renderRow?: (row: string | number | null, onChange: ChangeEventHandler<HTMLInputElement>, addRow: (value: string) => void, removeRow: () => void) => React.ReactElement
}

type RepeaterProps = {
  value: string,
  setValue?: Function,
  separator?: string,
  config?: RepeaterConfig
}

export function Repeater({value, setValue, separator = ',', config = {}}: RepeaterProps) {
  const values = useMemo(() => {
    return (value && value.split(separator)) || [''];
  }, [value, separator]);

  const onChange = (index:number, value: string) => {
    const tmp = [...values];
    tmp[index] = value;
    if(setValue)
      setValue(tmp.join(separator));
  }

  const addRow = (value = '', i = 0) => {
    setValue([...values.slice(0, i+1), value, ...values.slice(i+1)].join(separator));
  }
  const removeRow = (i: number) => {
    const tmp = [...values];
    tmp.splice(i, 1);
    setValue(tmp.join(separator));
  }

  return <>
    {values.length > 0
        ? values.map((row: string|number|null, i: number) => <Fragment key={i}>
          {config.renderRow
              ? config.renderRow(row,
                  (e: string|any) => (typeof e === 'string')?onChange(i, e):onChange(i, e.target.value),
                  (value: string|null) => addRow(value, i),
                  () => removeRow(i)
              )
              : <RepeaterSimpleRow
                  row={row}
                  onChange={(e: string|any) => (typeof e === 'string')?onChange(i, e):onChange(i, e.target.value)}
                  addRow={(value: string|null) => addRow(value, i)}
                  removeRow={() => removeRow(i)}
              />
          }
        </Fragment>)
        : <div className="cursor-pointer" onClick={() => addRow('')}><Icon icon="plus"/> Добавить</div>
    }
  </>;
}


export function RepeaterSimpleRow({row, onChange, addRow, removeRow}) {
  return <div className="flex gap-x-2 mb-1">
    <input value={row} onChange={onChange} className="repeater-input" />
    <button className="icon-btn" type="button" onClick={() => addRow('')}>+</button>
    <button className="icon-btn" type="button" onClick={removeRow}>-</button>
  </div>
}
