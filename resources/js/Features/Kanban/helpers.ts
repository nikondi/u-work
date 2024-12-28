
const COLUMN_COLORS: Record<string, string> = {
  simple: "bg-orange-500",
  order: "bg-orange-500",
  call: "bg-rose-400",
  done: "bg-green-600",
  suggest: "bg-gray-500",
}

export const getColumnColor = (column_name: string): string => {
  return COLUMN_COLORS[column_name] || 'bg-gray-400';
}
