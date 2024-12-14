'use client'

import Customer from "@/components/Settings/Customer";
import { marginStyle } from "@/styles/layoutStyle";

export default function SettingsPage() {
    return (
        <>
            <Customer />
            {marginStyle("go_shop_container")}
        </>
    )
}