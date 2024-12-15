'use client'

import General from "@/components/Settings/General";
import { marginStyle } from "@/styles/layoutStyle";

export default function SettingsPage() {
    return (
        <>
            <General />
            {marginStyle("go_shop_container")}
        </>
    )
}