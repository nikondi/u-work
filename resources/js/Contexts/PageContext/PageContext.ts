import {createContext, useContext} from "react";
import {TPageContext} from "@/Contexts/PageContext/types";

export const PageContext = createContext<TPageContext>(null);
const usePageContext = () => useContext(PageContext);
export default usePageContext;
