'use client'

import Settings from "@/components/Settings/Settings";
import { marginStyle } from "@/styles/layoutStyle";

export default function SettingsPage() {
    return (
        <div className="w-full">
            <Settings />
            {marginStyle("go_shop_container")}
        </div>
    )
}