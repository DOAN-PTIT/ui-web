import { AppDispatch, RootState } from "@/store";
import { Select } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { connect } from "react-redux";
import { DisplayChart } from "@/utils/type";
import {
  selectDisplayType,
  selectMoth,
  selectYear,
} from "@/reducer/report.reducer";

interface ReportActionProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

const ReportAction = (props: ReportActionProps) => {
  const { year, selectMonth, selectYear, month, selectDisplayType, type } =
    props;

  return (
    <div className="flex items-center gap-4">
      <div className="font-medium">Hiển thị</div>
      <Select
        defaultValue={"month"}
        value={type}
        className="w-[120px]"
        onChange={(value: DisplayChart) => {
          if (value == "year") {
            selectMonth(null);
          }
          selectDisplayType(value);
        }}
      >
        <Select.Option value="year">Theo năm</Select.Option>
        <Select.Option value="month">Theo tháng</Select.Option>
      </Select>
      {type == "month" && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <p className="font-medium">Chọn năm</p>
            <Select
              className="w-[120px]"
              defaultValue={"2021"}
              onChange={(value: any) => selectYear(value)}
              value={year}
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
          <div className="flex items-center gap-4">
            <p className="font-medium">Chọn tháng</p>
            <Select
              className="w-[120px]"
              defaultValue={"2021"}
              onChange={(value: any) => selectMonth(value)}
              value={month}
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <Select.Option key={month} value={month}>
                  {month}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      )}
      {type == "year" && (
        <div className="flex items-center gap-4">
          <p className="font-medium">Chọn năm</p>
          <Select
            className="w-[120px]"
            defaultValue={"2021"}
            onChange={(value: any) => selectYear(value)}
            value={year}
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
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    year: state.reportReducer.year,
    month: state.reportReducer.month,
    type: state.reportReducer.displayType,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    selectYear: (year: number) => dispatch(selectYear(year)),
    selectMonth: (month: number) => dispatch(selectMoth(month)),
    selectDisplayType: (type: DisplayChart) =>
      dispatch(selectDisplayType(type)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ReportAction);
