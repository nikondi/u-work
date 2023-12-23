export default function ErrorList({errors}) {
    return errors &&
        (<div className="mt-6">{Object.keys(errors).map(key => (
            <div key={key} className="errordiv">
                {errors[key]}
            </div>
        ))}</div>)

}
