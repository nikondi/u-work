import React, {PropsWithChildren} from "react";
import {Head, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";

export default function DefaultLayout({children}: PropsWithChildren) {
  const {title} = usePage<PageProps>().props;
  return <>
    <Head>
      <title>{title}</title>
    </Head>
    {children}
  </>
}
