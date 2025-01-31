import React, { useState } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

const Input = ({ className = "", ...props }) => (
  <input
    className={`block w-full border border-gray-300 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
    {...props}
  />
);

const Badge = ({ children, variant = "default" }) => {
  const style = variant === "Đã thanh toán" ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700";
  return <span className={`inline-block px-2 py-1 text-xs rounded ${style}`}>{children}</span>;
};

const Table = ({ children }) => <table className="w-full border-collapse">{children}</table>;

const TableHeader = ({ children }) => <thead className="bg-gray-100">{children}</thead>;

const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;

const TableCell = ({ children, className = "" }) => <td className={`p-3 ${className}`}>{children}</td>;

const TableHead = ({ children, className = "" }) => (
  <th className={`p-3 text-left font-semibold ${className}`}>{children}</th>
);

// dữ liệu giả
const data = [
  { id: "1", seats: 4, status: "Đã thanh toán" },
  { id: "2", seats: 6, status: "Đã thanh toán" },
  { id: "3", seats: 8, status: "Chưa thanh toán" },
  { id: "4", seats: 2, status: "Đã thanh toán" },
];

const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-md shadow-md bg-white">
        <div className="border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Quản Lý Hóa đơn</h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã hóa đơn</TableHead>
                  <TableHead className="text-center">Tình Trạng</TableHead>
                  <TableHead className="text-right">Chi tiết</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell  className="text-center">
                      <Badge variant={item.status === "Đã thanh toán" ? "Đã thanh toán" : "Chưa thanh toán"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to="/admin/hoadon/chitiet">
                        <Button>
                          <PlusCircle cclassName="w-25" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm">
              Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredData.length)} trong số{" "}
              {filteredData.length} mục
            </span>
            <div className="flex items-center">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="icon"
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
