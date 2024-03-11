import React, {HTMLAttributes} from "react";

export function ObjectStatus({status}: {status: string}) {
  switch (status.trim().toLowerCase()) {
    case 'online':
    case 'OK':
      return (<div className="bg-green-600 text-white status">Работает</div>);
    case 'unknown':
      return (<div className="bg-gray-500 text-white status">Неизвестно</div>);
    case 'offline':
    case 'unreachable':
      return (<div className="bg-red-500 text-white status">Недоступен</div>);
    default:
      return (<div className="status">{status}</div>)
  }
}

export function ObjectStatusDot({status, className = '', ...attributes}: HTMLAttributes<HTMLDivElement> & {status: string}) {
  let color = 'bg-gray-500';
  switch (status && status.trim().toLowerCase()) {
    case 'online': case 'OK':
      color = 'bg-green-500';
      break;
    case 'offline': case 'unreachable':
      color = 'bg-red-500';
      break;
  }
  return <div className={`h-full flex items-center justify-center ${className}`} {...attributes}><div className={`w-2 h-2 rounded-full ${color}`}></div></div>;
}
