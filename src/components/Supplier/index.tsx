import { AppDispatch, RootState } from "@/store";
import { Layout, Table } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import "../../styles/global.css";
import ActionTools from "../ActionTools/ActionTools";
import type { TableProps } from "antd";
import { useEffect, useState } from "react";
import apiClient from "@/service/auth";
import SupplierDetail from "../SupplierDetail";
import { getListSupplier, updateSupplier } from "@/action/supplier.action";
import { Supplier as SupplierType } from "@/utils/type";

const { Content } = Layout;
const defaultParams = {
  page: 1,
  page_size: 30,
};

interface SupplierProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Supplier(props: SupplierProps) {
  const { fetchListSupplier, currentShop } = props;
  const [modalVisiable, setModalVisiable] = useState(false);
  const [title, setTitle] = useState("Thêm mới nhà cung cấp");
  const [loading, setLoading] = useState(false);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [supplierSelected, setSupplierSelected] = useState(0);

  useEffect(() => {
    getListSupplier()
  }, []);

  const columns: TableProps<any>["columns"] = [
    {
      key: "supplier_code",
      dataIndex: "supplier_code",
      title: "Mã nhà cung cấp",
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên nhà cung cấp",
    },
    {
      key: "phone_number",
      dataIndex: "phone_number",
      title: "Số điện thoại",
    },
    {
      key: "address",
      dataIndex: "address",
      title: "Địa chỉ",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Mô tả",
    },
    {
      key: "debt",
      dataIndex: "debt",
      title: "Nợ cần trả",
    },
    {
      key: "total_purchase",
      dataIndex: "total_purchase",
      title: "Tổng mua",
    },
  ];

  const getListSupplier = async () => {
    try {
      setLoading(true);
      const shop_id = currentShop.id;
      const params = { ...defaultParams, shop_id };
      const url = `shop/${shop_id}/suppliers`;
      return await apiClient
        .get(url, { params })
        .then((res) => {
          if (res.data) {
            setSuppliers(res.data.data);
            setTotalEntries(res.data.total_entries);
            setLoading(false);
          }
          return [];
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getData = () => {
    return suppliers.length > 0 ? suppliers.map((supplier: SupplierType) => {
      return {
        key: supplier.id,
        supplier_code: supplier.supplier_code,
        name: supplier.name,
        phone_number: supplier.phone_number || <span className="text-red-400 font-medium">Chưa có thông tin</span>,
        address: supplier.address || <span className="text-red-400 font-medium">Chưa có thông tin</span>,
        description: supplier.description,
        debt: 0,
        total_purchase: 0,
      };
    }) : [];
  }

  return (
    <Layout className="w-full h-screen">
      <HeaderAction
        title="Nhà cung cấp"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm nhà cung cấp theo tên, mã,.."
      />
      <Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={() => setModalVisiable(true)}
          reloadCallBack={getListSupplier}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          loading={loading}
          pagination={{
            size: "small",
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                setTitle("Chi tiết nhà cung cấp");
                setModalVisiable(true);
                setSupplierSelected(record.key);
              },
              style: { cursor: "pointer" }
            };
          }}
        />
        {modalVisiable && (
          <SupplierDetail
            open={modalVisiable}
            setOpen={setModalVisiable}
            title={title}
            supplierId={supplierSelected}
            fetchSupplier={getListSupplier}
          />
        )}
      </Content>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
    loadingProps: state.supplierReducer.loading,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchListSupplier: (params: any) => dispatch(getListSupplier(params)),
    updateSupplier: (params: any) => dispatch(updateSupplier(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Supplier);
