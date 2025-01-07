import { InputNumber } from "antd";

interface CustomInputNumberProps {
  value: any;
  onChange: (value: number | null) => void;
  placeholder?: string;
  type?: "price" | "quantity" | "percent";
  className?: string;
  variant?: "outlined" | "filled";
  defaultValue?: number;
  name?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function CustomInputNumber(props: CustomInputNumberProps) {
  const {
    value,
    onChange,
    placeholder,
    type,
    className,
    variant,
    defaultValue,
    name,
    min,
    max,
    disabled,
  } = props;
  return (
    <InputNumber
      formatter={(value) =>
        `${value}`
          .replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          .replace(/\.(?=\d{0,2}$)/g, ",")
      }
      parser={(value) =>
        Number.parseFloat(
          (value || "").replace(/\$\s?|(\.*)/g, "").replace(/(\,{1})/g, ".")
        )
      }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      step={type === "price" ? 1000 : 1}
      suffix={type === "price" ? "đ" : type === "percent" ? "%" : ""}
      variant={variant}
      defaultValue={defaultValue}
      name={name}
      min={min ? min : type == "price" || type == "percent" ? 0 : 1}
      max={max}
      disabled={disabled}
    />
  );
}
