import { AppDispatch, RootState } from "@/store";
import { Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { connect } from "react-redux";
import { DisplayChart } from "@/utils/type";

interface ReportActionProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  displayChart: DisplayChart;
  setDisplayChart?: Dispatch<SetStateAction<DisplayChart>>;
  handleSelectedChart: (value: DisplayChart) => void;
}

const ReportAction = (props: ReportActionProps) => {
  const { displayChart, setDisplayChart, handleSelectedChart } = props;

  return (
    <div className="flex items-center gap-4">
      <div className="font-medium">Hiển thị</div>
      <Select
        defaultValue={"month"}
        value={displayChart}
        className="w-[120px]"
        onChange={(value: DisplayChart) => handleSelectedChart(value)}
      >
        <Select.Option value="year">Theo năm</Select.Option>
        <Select.Option value="month">Theo tháng</Select.Option>
      </Select>
      {displayChart == "month" && (
        <div className="flex items-center gap-4">
          <p className="font-medium">Chọn năm</p>
          <Select
            className="w-[120px]"
            defaultValue={"2021"}
            onChange={(value: any) => console.log(value)}
          >
            {Array.from(
              { length: 10 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {displayChart == "year" && (
        <div className="font-medium">
            <i>( Dữ liệu của 10 năm gần nhất )</i>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportAction);
