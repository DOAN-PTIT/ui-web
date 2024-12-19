import { RootState } from "@/store";
import { Supplier } from "@/utils/type";
import { Select } from "antd";
import { useState } from "react";
import { connect } from "react-redux";

interface SupplierSearchBarProps extends ReturnType<typeof mapStateToProps> {
    onChange?: (value: string) => void;
    defaultSupplier?: Supplier
}

const SupplierSearchBar = (props: SupplierSearchBarProps) => {
  const { suppliers, onChange } = props;

  return (
    <Select 
        placeholder="Chọn nhà cung cấp" 
        style={{ width: "100%" }} 
        onChange={onChange}
        defaultValue={props.defaultSupplier?.id}
    >
      {suppliers.map((supplier) => {
        return (
          <Select.Option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </Select.Option>
        );
      })}
    </Select>
  );
};

const mapStateToProps = (state: RootState) => {
  return {
    suppliers: state.shopReducer.shop.suppliers,
  };
};

export default connect(mapStateToProps, {})(SupplierSearchBar);
