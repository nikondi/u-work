import React, {PropsWithChildren, useEffect} from "react";
import {SelectContextProvider, OptionValue, useSelectContext} from "./SelectContextProvider";
import useOutsideClick from "@/hooks/useOutsideClick.js";
import {useFormRowContext} from "@/components/Form";
import {mergeClass} from "@/helpers";

type Props = {
  onChange?: (v: OptionValue) => void,
  value?: OptionValue,
  label?: string | number,
  className?: string,
}

export function Select({
                         children, className = '', onChange = () => {
  }, value, label, ...props
                       }: PropsWithChildren<Props>) {
  return (
    <SelectContextProvider>
      <SelectInner className={className} onChange={onChange} value={value} label={label} {...props}>
        {children}
      </SelectInner>
    </SelectContextProvider>
  )
}

function SelectInner({
                       className, children, onChange = () => {
  }, value, label
                     }: PropsWithChildren<Props>) {
  const {setSelectedValue, setInitialValue, selectedOption, setOpened, opened} = useSelectContext();
  const selectRef = useOutsideClick(() => setOpened(false));

  const rowContext = useFormRowContext();
  label = (label || (label == '' && label)) || rowContext?.label;

  useEffect(() => {
    if (!selectedOption)
      return;
    setSelectedValue(selectedOption.value);
    if (selectedOption.dispatch)
      onChange(selectedOption.value);
  }, [selectedOption]);

  useEffect(() => {
    if (value || value === null)
      setInitialValue(value);
  }, [value]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape')
        setOpened(false);
    }
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, []);

  return (<div className={'relative ' + className} ref={selectRef}>
    <div className={`form-select-heading ${opened ? 'form-select-heading--opened' : ''}`}
         onClick={() => setOpened(!opened)}>
      <div className="form-select-label">{selectedOption?.label || label}</div>
      <svg width="18" height="18" viewBox="0 0 451.847 451.847"><path d="M225.923 354.706c-8.098 0-16.195-3.092-22.369-9.263L9.27 151.157c-12.359-12.359-12.359-32.397 0-44.751 12.354-12.354 32.388-12.354 44.748 0l171.905 171.915 171.906-171.909c12.359-12.354 32.391-12.354 44.744 0 12.365 12.354 12.365 32.392 0 44.751L248.292 345.449c-6.177 6.172-14.274 9.257-22.369 9.257z" fill="currentColor"></path></svg>
    </div>
    <div className="form-select-options">
      {children}
    </div>
  </div>)
}

type OptionProps = {
  value?: OptionValue,
  className?: string,
  index: number
}

export function Option({value, children, className = '', index}: PropsWithChildren<OptionProps>) {
  const {setOpened, setSelectedOption, initialValue} = useSelectContext();

  if (!value && value !== null)
    value = index;

  const option = {value, label: children};


  useEffect(() => {
    if (initialValue === value)
      setSelectedOption(option, false);
  }, [initialValue]);

  return (<div onClick={() => {
    setOpened(false);
    setSelectedOption(option)
  }} className={mergeClass("form-select-option", className)}>{children}</div>);
}
