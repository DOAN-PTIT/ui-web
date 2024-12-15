"use client";

import Personnel from "@/components/Settings/Personnel";
import { marginStyle } from "@/styles/layoutStyle";

export default function SettingsPage() {
  return (
    <>
      <Personnel />
      {marginStyle("go_shop_container")}
    </>
  );
}
