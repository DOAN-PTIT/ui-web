import { AppDispatch, RootState } from "@/store";
import { Layout, notification, Table } from "antd";
import type { TableProps } from "antd";
import { connect } from "react-redux";
import HeaderAction from "../HeaderAction/HeaderAction";
import { useEffect, useState } from "react";
import "../../styles/global.css";
import apiClient from "@/service/auth";
import ActionTools from "../ActionTools/ActionTools";
import DebtDetail from "../DebtDetail";
import { fetchDebts, updateDebt } from "@/action/debt.action";
import { Debt as DebtType } from "@/utils/type";
import moment from "moment";
import { debtStatus, formatNumber } from "@/utils/tools";
import "@/styles/global.css";
import CustomSelect from "@/container/ConfigSelect";

const { Content } = Layout;
const defaultParams = {
  page: 1,
  page_size: 30,
};

interface DebtProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

function Debt(props: DebtProps) {
  const { fetchDebts, currentShop, updateDebt } = props;
  const [modalVisiable, setModalVisiable] = useState(false);
  const [title, setTitle] = useState("Tạo công nợ");
  const [debts, setDebts] = useState<DebtType[]>([]);
  const [loading, setLoading] = useState(false);
  const [debtSelected, setDebtSelected] = useState<DebtType | null>(null);

  useEffect(() => {
    getListDebts();
  }, []);

  const columns: TableProps<any>["columns"] = [
    {
      title: "STT",
      dataIndex: "STT",
      key: "stt",
      render: (_: any, __: any, index: number) => {
        return <span className="text-blue-500 font-medium">{index + 1}</span>;
      },
    },
    {
      key: "name",
      dataIndex: "name",
      title: "Tên công nợ",
    },
    {
      key: "debt_type",
      dataIndex: "debt_type",
      title: "Loại công nợ",
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Mô tả",
    },
    {
      key: "purchase_date",
      dataIndex: "purchase_date",
      title: "Ngày mua",
    },
    {
      key: "deal_date",
      dataIndex: "deal_date",
      title: "Ngày đến hạn",
    },
    {
      key: "total_purchase",
      dataIndex: "total_purchase",
      title: "Cần trả",
    },
    {
      key: "supplier",
      dataIndex: "supplier",
      title: "Nhà cung cấp",
    },
    {
      key: "created_at",
      dataIndex: "created_at",
      title: "Ngày tạo",
    },
  ];

  columns.push({
    key: "status",
    dataIndex: "status",
    title: "Trạng thái",
    fixed: "right",
    render: (status: number, record: any) => {
      return (
        <CustomSelect
          data={debtStatus}
          currentStatus={status.toString()}
          handleClick={(e) => {
            e.stopPropagation();
            setModalVisiable(false);
            setDebtSelected(record.id);
          }}
          handleSelect={handleUpdateDebtStatus}
        />
      );
    },
  });

  const handleUpdateDebtStatus = async (value: any) => {
    setLoading(true);
    await updateDebt({
      id: debtSelected,
      data: {
        status: value
      },
      shop_id: currentShop.id,
    })
      .then((res) => {
        if (res.payload) {
          setLoading(false);
          setDebtSelected(null);
          getListDebts();
          notification.success({
            message: "Thành công",
            description: "Cập nhật trạng thái công nợ thành công",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        setDebtSelected(null);
        notification.error({
          message: "Thất bại",
          description: "Cập nhật trạng thái công nợ thất bại",
        });
      });
  };

  const getListDebts = async () => {
    setLoading(true);
    try {
      return await fetchDebts({ ...defaultParams, shop_id: currentShop.id })
        .then((res) => {
          setDebts(res.payload.data);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getData = () => {
    return debts.length > 0
      ? debts.map((debt) => {
          return {
            id: debt.id,
            name: debt.name,
            debt_type: (
              <span className="text-red-400 font-medium">Công nợ cần trả</span>
            ),
            description: debt.description,
            purchase_date: moment(debt.purchase_date).format("DD/MM/YYYY"),
            deal_date: moment(debt.deal_date).format("DD/MM/YYYY"),
            total_purchase: formatNumber(debt.money_must_pay) + " đ",
            supplier: debt.supplier?.name,
            created_at: moment(debt.created_at).format("DD/MM/YYYY"),
            status: debt.status,
          };
        })
      : [];
  };

  return (
    <Layout>
      <HeaderAction
        title="Công nợ"
        isShowSearch={true}
        inputPlaholder="Tìm kiếm công nợ theo têh, loại công nợ, nhà cung cấp,.."
      />
      <Content className="p-5 h-screen bg-gray-200 rounded-tl-xl order__table__container">
        <ActionTools
          callBack={() => setModalVisiable(true)}
          reloadCallBack={getListDebts}
        />
        <Table
          columns={columns}
          dataSource={getData()}
          pagination={{ size: "small" }}
          scroll={{ y: 500, x: 2200 }}
          loading={loading}
          onRow={(record) => {
            return {
              onClick: () => {
                setTitle("Chi tiết công nợ");
                setModalVisiable(true);
                setDebtSelected(record);
              },
              style: { cursor: "pointer" },
            };
          }}
        />
        {modalVisiable && (
          <DebtDetail
            open={modalVisiable}
            setOpen={setModalVisiable}
            title={title}
            fetchDebts={getListDebts}
            debt={debtSelected}
          />
        )}
      </Content>
    </Layout>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    fetchDebts: (params: any) => dispatch(fetchDebts(params)),
    updateDebt: (params: any) => dispatch(updateDebt(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Debt);
