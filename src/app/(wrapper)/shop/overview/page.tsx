"use client";

import Overview from "@/components/Overview/Overview";
import { marginStyle } from "@/styles/layoutStyle";

export default function OverviewPage() {
  return (
    <>
      <Overview />
      {marginStyle("go_shop_container")}
    </>
  );
}
