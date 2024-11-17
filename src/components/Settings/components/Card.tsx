import { Checkbox } from "antd";
import { useState } from "react";

interface DataRow {
    id: string;
    name: string;
}

interface Props {
    title: string;
    dataRow: DataRow[];
}

export default function AuthCard({ title, dataRow }: Props) {
    const [checkedList, setCheckedList] = useState<string[]>([]);
    const isAllChecked = checkedList.length === dataRow.length;

    const handleCheckAll = (checked: boolean) => {
        if (checked) {
            setCheckedList(dataRow.map(item => item.id));
        } else {
            setCheckedList([]);
        }
    };

    const handleCheckboxChange = (id: string, checked: boolean) => {
        setCheckedList(prev =>
            checked ? [...prev, id] : prev.filter(item => item !== id)
        );
    };

    return (
        <div className="rounded-lg border bg-white">
            <div>
                <div className="flex items-center rounded-t-lg py-2 px-4 bg-slate-100">
                    <Checkbox
                        checked={isAllChecked}
                        onChange={(e) => handleCheckAll(e.target.checked)}
                    />
                    <div className="font-medium px-2">
                        {title}
                    </div>
                </div>
            </div>
            <div className="p-4">
                {dataRow.map(i => (
                    <div key={i.id} className="flex items-center py-1">
                        <Checkbox
                            className="size-4"
                            checked={checkedList.includes(i.id)}
                            onChange={(e) => handleCheckboxChange(i.id, e.target.checked)}
                        />
                        <div className="px-2">
                            {i.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
