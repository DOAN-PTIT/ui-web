import apiClient from "@/service/auth";
import { AppDispatch, RootState } from "@/store";
import { Button, Divider, Input, Modal, Progress } from "antd";
import { cloneDeep, uniq } from "lodash";
import ExcelJS from "exceljs";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { saveAs } from "file-saver";
import moment from "moment";

interface CustomerExportExcelProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {
  open: boolean;
  onCancel: () => void;
}

const fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFF5F5F5" },
  bgColor: { argb: "FFF5F5F5" },
};

function CustomerExportExcel(props: CustomerExportExcelProps) {
  const { open, currentShop, onCancel } = props;
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("Khách hàng");
  const [percent, setPercent] = useState(0);

  let arrRows: any = [];
  let transformedExports: any = [];

  useEffect(() => {
    if (customers.length > 0) {
      handleDownload();
    }
  }, [customers]);

  const columns = [
    {
      title: "STT",
      label: "STT",
      disable: false,
      key: "stt",
    },
    {
      title: "Mã khách hàng",
      label: "Mã khách hàng",
      disable: false,
      key: "id",
    },
    {
      title: "Tên khách hàng",
      label: "Tên khách hàng",
      disable: false,
      key: "customer",
    },
    {
      title: "Số điện thoại",
      label: "Số điện thoại",
      disable: false,
      key: "phone",
    },
    {
      title: "Địa chỉ",
      label: "Địa chỉ",
      disable: false,
      key: "address",
    },
    {
      title: "Email",
      label: "Email",
      disable: false,
      key: "email",
    },
    {
      title: "Tổng đơn hàng",
      label: "Tổng đơn hàng",
      disable: false,
      key: "total_order",
    },
    {
      title: "Tổng tiền đã chi",
      label: "Tổng tiền chi",
      disable: false,
      key: "totalPrice",
    },
    {
      title: "Lần mua cuối",
      label: "Lần mua cuối",
      disable: false,
      key: "last_purchase",
    },
    {
      title: "Mã giới thiệu",
      label: "Mã giới thiệu",
      disable: false,
      key: "referral_code",
    },
    {
      title: "Số lần giới thiệu",
      label: "Số lần giới thiệu",
      disable: false,
      key: "number_referral_count",
    },
    {
      title: "Ngày tạo",
      label: "Ngày tạo",
      disable: false,
      key: "insertedAt",
    },
    {
      title: "Ngày cập nhật",
      label: "Ngày cập nhật",
      disable: false,
      key: "updatedAt",
    },
  ];

  const fetchListCustomers = async () => {
    let cloneParams = {
      page: 1,
      sortBy: "CREATED_AT_DESC",
    };
    const url = `shop/${currentShop.id}/customer/all`;
    let customersData: any = [];

    const sendRequest: any = async (params: any) => {
      return await apiClient.get(url, { params }).then((res) => {
        if (res.data) {
          let data = res.data.customers;
          customersData = customersData.concat(data);
          const percent = Math.round(customersData.length * 100 / res.data.totalCount);
            setPercent(percent);
          if (data.length == 0 || customersData.length >= res.data.totalCount) {
            return customersData;
          } else {
            params.page += 1;
            return sendRequest(params);
          }
        } else {
          return customersData;
        }
      });
    };

    setIsLoading(true);
    return await sendRequest(cloneParams)
      .then((res: any) => {
        if (res.length > 0) {
          setCustomers(res);
          setIsLoading(false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        setIsLoading(false);
      });
  };
  const handleDownload = () => {
    if (customers.length == 0) {
      fetchListCustomers();
    } else {
      let startLine: any;
      setTimeout(async () => {
        transformedExports = [];
        arrRows = [];
        transformExports(customers, 0);

        let writeExcel = async (
          fileName: string,
          header: any,
          content: any
        ) => {
          let wb = new ExcelJS.Workbook();
          let date = new Date();
          wb.modified = date;
          let ws = wb.addWorksheet("Sheet 1");
          ws.columns = header;

          if (Array.isArray(arrRows) && arrRows.length != content.length) {
            arrRows = uniq(arrRows);
          }

          for (let [index, item] of content.entries()) {
            ws.addRow(item);
          }

          const listStartLine = [];
          if (startLine) {
            for (let i = 0; i < startLine; i++) {
              listStartLine.push(2);
            }
          }

          arrRows = listStartLine.concat(arrRows);
          ws.eachRow((row, rowNumber) => {
            const cond = startLine ? rowNumber > startLine : rowNumber > 1;
            if (cond && arrRows[rowNumber - 2] % 2 != 0) {
              ws.getRow(rowNumber).fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "FFF5F5F5" },
                bgColor: { argb: "FFF5F5F5" },
              };
            }
          });

          return wb.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/octet-stream",
            });
            saveAs(blob, `${fileName}.xlsx`);
          });
        };

        let headers = columns.map((field) => {
          const value =
            transformedExports[0] && transformedExports[0][field.label];
          const px = value ? value.toString().length * 1.33 : 20;

          let getWidth = () => {
            if (px > 60) return 60;
            return px >= 30 ? px : 30;
          };

          return {
            header: field.label,
            key: field.key,
            width: field.label == "STT" ? 15 : getWidth(),
          };
        });

        writeExcel(fileName, headers, transformedExports);
      });
    }
  };

  const transformExports = (customers: any, currentIndex: number) => {
    const transformedExportArr: any = [];
    const formFields = columns;

    const takeRow = (order: any, exportIndex: number, itemIndex: number) => {
      let transformedExport = {};
      formFields.forEach(({ key, label }) => {
        transformedExport = {
          ...transformedExport,
          [key]: takeValue(key, order, exportIndex, itemIndex),
        };
      });
      if (!itemIndex) order.orderIndex = transformedExportArr.length;
      transformedExportArr.push(transformedExport);
    };

    let arrRow: any = [];
    customers.forEach((customer: any, exportIndex: number) => {
      arrRow.push(exportIndex + currentIndex + 1);

      takeRow(customer, exportIndex + currentIndex, 0);
    });

    transformedExports = transformedExports.concat(transformedExportArr);
    arrRows = arrRows.concat(arrRow);
  };

  const takeValue = (
    key: string,
    customer: any,
    exportIndex: number,
    itemIndex: number
  ) => {
    switch (key) {
      case "stt":
        return exportIndex + 1;
      case "id":
        return customer.id;
      case "customer":
        return customer.name;
      case "phone":
        return customer.phone_number;
      case "address":
        return customer.address;
      case "email":
        return customer.email;
      case "total_order":
        return customer.order_count;
      case "last_purchase":
        return customer.last_purchase;
      case "referral_code":
        return customer.referral_code;
      case "number_referral_count":
        return customer.number_referral_count;
      case "totalPrice":
        return customer.total_spent;
      case "insertedAt":
        return moment(customer.createdAt).format("DD/MM/YYYY");
      case "updatedAt":
        return moment(customer.updatedAt).format("DD/MM/YYYY");
      default:
        return "";
    }
  };

  const renderContent = () => {
    return (
      <div className="mt-4">
        <Divider />
        <div className="flex justify-between items-center">
          <p className="font-[600] w-1/2">Nhập tên file</p>
          <Input
            placeholder="Nhập tên file"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        {isLoading && (
            <div className="text-right">
                <Progress percent={percent} status="active" className="w-[120px] my-4" />
            </div>
        )}
        <div className="mt-4 text-right">
          <Button type="primary" onClick={handleDownload} disabled={isLoading}>
            Tải xuống
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={"Xuất Excel đơn hàng"}
      open={open}
      footer={null}
      onCancel={onCancel}
    >
      {renderContent()}
    </Modal>
  );
}

const mapStateToProps = (state: RootState) => {
  return {
    currentShop: state.shopReducer.shop,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomerExportExcel);
