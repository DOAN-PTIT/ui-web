import { AppDispatch, RootState } from "@/store";
import { connect } from "react-redux";
import { Table } from "antd";
import { formatNumber } from "@/utils/tools";
import '@/styles/global.css';

interface ReportTableProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  columns: any[];
  dataSource: any[];
  loading: boolean;
}

const ReportTable = (props: ReportTableProps) => {
  const { columns, dataSource, loading } = props;
  return (
    <div className="w-full mt-6">
      {loading ? (
        <div>Loading..</div>
      ) : (
        <Table
          columns={columns}
          dataSource={dataSource}
          className="order__table__container"
          loading={loading}
          pagination={false}
          scroll={{
            x: 1500,
          }}
          summary={() => {
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} className="font-bold">
                  Tổng
                </Table.Summary.Cell>
                {columns.map((column, index) => {
                  if (index == 0) return null;
                  return (
                    <Table.Summary.Cell
                      key={index}
                      index={index}
                      className="text-right font-bold"
                    >
                      {formatNumber(
                        (dataSource || [])
                          .map((item) => item[column.dataIndex])
                          .reduce(
                            (prev, curr) => parseInt(prev) + parseInt(curr),
                            0
                          )
                      )}
                    </Table.Summary.Cell>
                  );
                })}
              </Table.Summary.Row>
            );
          }}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {};
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportTable);
