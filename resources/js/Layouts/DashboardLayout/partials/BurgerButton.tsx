import React, {ButtonHTMLAttributes} from "react";
import {twMerge} from "tailwind-merge";
import {usePageContext} from "@/Contexts/PageContext";

type Props = ButtonHTMLAttributes<HTMLButtonElement>

export default function BurgerButton({className = '', ...attributes}: Props) {
  const {sideBarOpened, openSideBar, closeSideBar} = usePageContext();
  const toggle = () => sideBarOpened?closeSideBar():openSideBar();

  return (
    <button className={twMerge('burger-button sidebar-link', className)} onClick={toggle} title={sideBarOpened ? 'Скрыть меню' : 'Открыть меню'} {...attributes}>
      {sideBarOpened
        ? <svg width="20" viewBox="0 0 128 128" className="h-5">
          <path d="M84 108a3.988 3.988 0 0 1-2.828-1.172l-40-40a3.997 3.997 0 0 1 0-5.656l40-40c1.563-1.563 4.094-1.563 5.656 0s1.563 4.094 0 5.656L49.656 64l37.172 37.172a3.997 3.997 0 0 1 0 5.656A3.988 3.988 0 0 1 84 108z" fill="currentColor"></path>
        </svg>
        : <svg className="h-5" width="20" viewBox="0 0 64 64">
          <path d="M53 21H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3zM53 35H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3zM53 49H11c-1.7 0-3-1.3-3-3s1.3-3 3-3h42c1.7 0 3 1.3 3 3s-1.3 3-3 3z" fill="currentColor"></path>
        </svg>
      }
    </button>
  )
}
