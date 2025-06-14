import {useState} from "react";

export default function useFetching(callback: Function) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetching = async function () {
    try {
      setIsLoading(true);
      await callback();
    } catch (e) {
      // @ts-ignore
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }


  return [fetching, isLoading, error];
}
