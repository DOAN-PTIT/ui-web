import { Checkbox } from "antd";
interface DataRow {
    id: string;
    name: string;
}
interface Props {
    title: string;
    dataRow: DataRow[]
}
export default function AuthCard({ title, dataRow }: Props) {
    return (

        <div className="rounded-lg border bg-white">
            <div>
                <div className="flex items-center rounded-t-lg py-2 px-4  bg-slate-100">
                    <Checkbox />
                    <div className="font-medium px-2">
                        {title}
                    </div>
                </div>
            </div>
            <div className="p-4">
                {dataRow.map(i => (
                        <div key={i.id} className="flex items-center py-1">
                            <Checkbox className="size-4"/>
                            <div className="px-2">
                                {i.name}
                            </div>
                        </div>
                ))}
            </div>
        </div>

    )
}