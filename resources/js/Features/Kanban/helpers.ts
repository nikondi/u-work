const COLUMN_COLORS: Record<string, string> = {
  simple: "bg-orange-500",
  order: "bg-orange-500",
  call: "bg-rose-400",
  done: "bg-green-600",
  suggest: "bg-gray-500",
}

const COLUMN_LABELS: Record<string, string> = {
  simple: "Новые обращения",
  order: "Заказы",
  call: "Звонки",
  done: "Завершены",
  suggest: "Новые предложения",
}

const REQUEST_SOURCE_LABELS: Record<string, string> = {
  uniwork: 'Добавлено оператором',
  unisite: 'С сайта uniphone.su',
  tomoru: 'Звонок Tomoru',
}

export const getColumnColor = (column_name: string): string => {
  return COLUMN_COLORS[column_name] || 'bg-gray-400';
}

export const getColumnLabel = (column_name: string): string => {
  return COLUMN_LABELS[column_name] || column_name;
}

export const getRequestSourceLabel = (source: string): string => {
  return REQUEST_SOURCE_LABELS[source] || source;
}
