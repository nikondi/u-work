import {Config} from 'ziggy-js';
import React from "react";
import {IUser} from "./auth";

export type stateFunction<T = any> = React.Dispatch<React.SetStateAction<T>>

export * from "./LaravelResponse"
export * from "./ReactChildrens"

export type Role = 'admin' | 'manager' | 'tomoru' | 'worker';

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
  flash: any;
  ziggy: Config & { location: string };
  auth: {
    user: IUser
  }
  breadcrumbs: Breadcrumb[],
  title: string
  h1: string
};


export interface Breadcrumb {
  link?: string,
  text: string
}

export type StateFunction<T = any> = React.Dispatch<React.SetStateAction<T>>

export interface ResourceCollection<T> {
  data: T[],
  links: {
    first: string,
    last: string,
    next: string,
    prev: string,
  },
  meta: {
    current_page: number,
    from: number,
    last_page: number,
    links: {
      url: string | null,
      label: "pagination.previous" | "pagination.next" | string,
      active: boolean
    }[],
    path: string,
    per_page: number,
    to: number,
    total: number
  }
}
