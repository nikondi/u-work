import {Link, useLocation} from "react-router-dom";
import {twMerge} from "tailwind-merge";

export default function SidebarNavLink({className, to, children, activeOn, onClick = () => {}}) {
    const defaultClassName = 'sidebar-link';
    const activeClassName = 'active';
    const location = useLocation();

    let activeOnRegExp;
    if(activeOn)
        activeOnRegExp = new RegExp(activeOn.replace('/', '\/'));

    if(location.pathname === to || (activeOn && activeOnRegExp.test(location.pathname)))
        className = twMerge(defaultClassName, className, activeClassName);
    else
        className = twMerge(defaultClassName, className);

    return (
        <Link to={to ?? ''} className={className} onClick={onClick}>
            {children}
        </Link>
    )
}
