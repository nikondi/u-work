export default function ErrorList({errors}) {
    return errors && <div className="mt-3">{
        Object.keys(errors).map(key =>
            Array.isArray(errors[key])
                ? errors[key].map((e, i) => <div key={key+i} className="errordiv mt-2">{e}</div>)
                : <div key={key} className="errordiv mt-2">{errors[key]}</div>
        )}
    </div>;

}
