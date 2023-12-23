import {Link, useLocation} from "react-router-dom";
import {twMerge} from "tailwind-merge";

export default function SidebarNavLink({className, to, children, activeOn}) {
    const defaultClassName = 'h-10 duration-300 transition-colors rounded-md flex items-center px-4 gap-x-3 text-blue-600 hover:bg-blue-50 dark:text-gray-400 dark:bg-none dark:hover:bg-gray-800';
    const activeClassName = 'bg-blue-100 text-blue-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-700';
    const location = useLocation();

    let activeOnRegExp;
    if(activeOn)
        activeOnRegExp = new RegExp(activeOn);

    if(location.pathname == to || (activeOn && activeOnRegExp.test(location.pathname)))
        className = twMerge(defaultClassName, className, activeClassName);
    else
        className = twMerge(defaultClassName, className);

    return (
        <Link to={to ?? ''} className={className}>
            {children}
        </Link>
    )
}
