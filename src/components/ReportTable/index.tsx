import { AppDispatch, RootState } from "@/store"
import { connect } from "react-redux"
import { Table } from "antd"

interface ReportTableProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
    columns: any[];
}

const ReportTable = (props: ReportTableProps) => {
    const { columns } = props
    return <div className="w-full h-fit mt-6">
    <Table columns={columns} dataSource={[]} />
  </div>
}

const mapStateToProps = (state: RootState) => {
    return {}
}

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportTable)

