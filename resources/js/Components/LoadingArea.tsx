import React from "react";
import {twMerge} from "tailwind-merge";

export default function LoadingArea({show = false}) {
  return <div className={twMerge('loading-area', show && 'loading-area--loading')}></div>
}
