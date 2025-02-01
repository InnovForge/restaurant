import React from 'react'


const Table = ({ children }) => <table className="w-full border-collapse">{children}</table>;

const TableHeader = ({ children }) => <thead className="bg-gray-100">{children}</thead>;

const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;

const TableCell = ({ children, className = "" }) => <td className={`p-3 ${className}`}>{children}</td>;

const TableHead = ({ children, className = "" }) => (
  <th className={`p-3 text-left font-semibold ${className}`}>{children}</th>
);

const data = [
  { tenmon: "Cá mập nướng sốt trung hoa", soluong: 4, gia: "100.000", ghichu: "Không" },
  { tenmon: "Vi cá japan", soluong: 6, gia: "100.000", ghichu: "Không"  },
  { tenmon: "Mì xào hải sản full topping", soluong: 8, gia: "100.000", ghichu: "Không"  },
  { tenmon: "Rau dâng chúa", soluong: 2, gia: "100.000", ghichu: "Không"  },
];

const OrderDetail = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-md shadow-md bg-white">
        <div className="border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Chi Tiết Hóa Đơn Số 1</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <h3>Ngày: 1/1/1111</h3>
          <h3>Giờ: 8:32 PM</h3>
          <h3>Số bàn: 2</h3>
          <h3>Mã khách hàng: 1</h3>
          <h3>Số lượng khách: 5</h3>
          <h3>Tên nhân viên PV: Đức Thắng</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">STT</TableHead>
                <TableHead className="text-left">Tên Món</TableHead>
                <TableHead className="text-center">Số lượng</TableHead>
                <TableHead className="text-right">Giá</TableHead>
                <TableHead className="text-right">Ghi chú</TableHead>
              </TableRow>
            </TableHeader>
            <tbody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.tenmon}</TableCell>
                  <TableCell className="text-center">{item.soluong}</TableCell>
                  <TableCell className="text-right">{item.gia}</TableCell>
                  <TableCell className="text-right">{item.ghichu}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="p-4 flex justify-end">
          <h3>Tổng tiền: 400.000</h3>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
