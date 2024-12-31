import { Card, Checkbox, Divider } from "antd";
import { useState } from "react";
import classNames from "classnames";
interface DataRow {
    id: string;
    name: string;
}

interface Props {
    title: string;
    dataRow: DataRow[];
    role?: string;
}

export default function AuthCard({ title, dataRow, role }: Props) {
    return (
        <div>
            <div style={{
                // opacity: role ? 0.7 : 1,
                cursor: role ? "no-drop" : "auto",
                // backgroundColor: role ? "#f5f5f5" : "white",
            }} className="rounded-lg border bg-white">
                <div className={`flex items-center rounded-t-lg py-4 px-4  ${role ? "opacity-80 border-b bg-slate-200" : "bg-slate-100"}`}>
                    <div className="font-medium px-2">
                        {title}
                    </div>
                </div>
                <div className={`p-4 ${role ? "opacity-80 bg-gray-100" : ""}`}>
                    {dataRow.map(i => (
                        <div key={i.id}>
                            <div className="flex items-center py-1">
                                <div className={`px-2 font-medium ${role ? " text-gray-900" : ""}`}>
                                    {i.name}
                                </div>
                            </div>
                            <Divider className="my-2" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="italic text-gray-500 mt-2">
                {role && ('*Ghi chú: Nhân viên không có quyền quản lý.')}
            </div>
        </div>
    );
}
