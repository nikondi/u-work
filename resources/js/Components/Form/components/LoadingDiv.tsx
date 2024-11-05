import useFormContext from "../contexts/FormContext";

export default function LoadingDiv() {
  const {processing} = useFormContext();
  return processing && <div className="text-center p-4 bg-gray-100 text-gray-800 dark:text-white dark:bg-gray-600 rounded-md">Загрузка...</div>
}
