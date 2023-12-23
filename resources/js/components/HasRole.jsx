import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function HasRole({roles = [], showAdmin = true, children}) {
    const {user} = useStateContext();

    if(typeof roles === 'string')
        roles = [roles];

    return <>{(user.hasRole(...roles) || (showAdmin && user.hasRole('admin'))) && children}</>;
}
