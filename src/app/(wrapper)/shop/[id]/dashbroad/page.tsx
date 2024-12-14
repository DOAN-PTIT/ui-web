'use client'

import Dashbroad from "@/components/Dashbroad";
import { marginStyle } from "@/styles/layoutStyle";

export default function DashbroadPage() {
    return (
        <>
            <Dashbroad />
            {marginStyle("go_shop_container")}
        </>
    )
}