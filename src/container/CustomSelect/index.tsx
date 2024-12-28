import { ConfigProvider, Select } from "antd";
import "@/styles/global.css";
import { MouseEventHandler } from "react";

interface CustomSelectProps {
  data: any;
  handleSelect?: (value: any) => any;
  currentStatus?: string;
  handleClick?: (e: any) => void;
}

const CustomSelect = (props: CustomSelectProps) => {
  const { data, handleSelect, currentStatus, handleClick } = props;
  const listStatus = Object.entries(data).map(([key, value]) => {
    return {
      key: key,
      value: value,
    };
  });
  const statusItem: any = listStatus.find((item: any) => item.key == currentStatus);

  return (
    <div
      onClick={handleClick}
      className={`custom_select custom_select_antd text-white bg-${statusItem?.value.color}-500  w-[150px] rounded-lg`}
    >
      <ConfigProvider
        theme={{
          components: {
            Select: {
              selectorBg: "unset",
            },
          },
        }}
      >
        <Select className="w-full" onSelect={handleSelect} value={statusItem?.key}>
          {listStatus.map((item: any) => {
            return (
              <Select.Option key={item.key} value={item.key}>
                <span className="font-medium">{item.value.label}</span>
              </Select.Option>
            );
          })}
        </Select>
      </ConfigProvider>
    </div>
  );
};

export default CustomSelect;
