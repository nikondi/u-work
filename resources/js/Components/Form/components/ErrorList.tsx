import useFormContext from "../contexts/FormContext";


export default function ErrorList() {
  const {errors} = useFormContext();
  return errors && <div className="mt-3">
    {Object.entries(errors).map(([key, error]) =>
      /* @ts-ignore */
      <div key={key} className="errordiv mt-2">{error}</div>
    )}
  </div>;

}
