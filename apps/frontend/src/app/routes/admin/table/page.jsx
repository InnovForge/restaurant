import { useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRestaurant } from "@/context/restaurant";

const data = [
  { id: "1", TenKhachHang: "Tom", SoLuongBan: 4, ThoiGianDat: "18:35 PM 3/3/2025", status: "pending" },
  { id: "2", TenKhachHang: "Hy", SoLuongBan: 4, ThoiGianDat: "18:35 PM 3/3/2025", status: "pending" },
  { id: "3", TenKhachHang: "Vy", SoLuongBan: 4, ThoiGianDat: "18:35 PM 3/3/2025", status: "pending" },
  { id: "4", TenKhachHang: "Thang", SoLuongBan: 4, ThoiGianDat: "18:35 PM 3/3/2025", status: "pending" },
];

const TableManagement = () => {
  const { restaurantId } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <Card className="shadow-lg p-6">
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-2xl font-bold">Quản Lý Đặt Bàn</h2>
        </div>

        <div className="my-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Tìm kiếm đơn đặt bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Mã đặt bàn</TableHead>
                <TableHead className="text-left">Tên Khách Hàng</TableHead>
                <TableHead className="text-left">Số Lượng Bàn</TableHead>
                <TableHead className="text-left">Thời gian đặt</TableHead>
                <TableHead className="text-left">Tình trạng</TableHead>
                <TableHead className="text-left">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-left">{item.id}</TableCell>
                  <TableCell className="text-left">{item.TenKhachHang}</TableCell>
                  <TableCell className="text-left">{item.SoLuongBan}</TableCell>
                  <TableCell className="text-left">{item.ThoiGianDat}</TableCell>
                  <TableCell className="text-left">
                    <Badge variant={item.status === "Đã thanh toán" ? "default" : "destructive"}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Link to={`/d/restaurants/${restaurantId}/hoadon/chitiet`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-sm">
            Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredData.length)} trong số{" "}
            {filteredData.length} hóa đơn
          </span>
          <div className="flex gap-2">
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
      </Card>
    </div>
  );
};

export default TableManagement;
