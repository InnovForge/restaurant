import { useState } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Search } from "lucide-react";
import { Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// dữ liệu giả
const data = [
  { id: "1", seats: 4, status: "Sẵn sàng" },
  { id: "2", seats: 6, status: "Đang sử dụng" },
  { id: "3", seats: 8, status: "Sẵn sàng" },
  { id: "4", seats: 2, status: "Đang sử dụng" },
];

const TableManagement = () => {
  const [editItem, setEditItem] = useState({});

  const handleEditClick = (item) => {
    setEditItem(item);
  };
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
      <div className="border rounded-md shadow-md bg-white">
        <div className="border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Quản Lý Bàn Ăn</h2>
          <Link to="/admin/ban/themban">
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Thêm bàn
            </Button>
          </Link>
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
                  <TableHead>ID Bàn</TableHead>
                  <TableHead>Số Lượng Chỗ Ngồi</TableHead>
                  <TableHead>Tình Trạng</TableHead>
                  <TableHead className="text-right">Sửa / Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.seats}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Sẵn sàng" ? "Sẵn sàng" : "Đang sử dụng"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Sửa</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Sửa bàn</DialogTitle>
                            <DialogDescription>
                              Thực hiện thay đổi bàn của bạn tại đây. Nhấp vào sửa khi bạn hoàn tất.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="soluong" className="text-right">
                                Số lượng
                              </Label>
                              <Input
                                id="soluong"
                                type="number"
                                value={editItem.quanlity || ""}
                                onChange={(e) => setEditItem({ ...editItem, quanlity: e.target.value })}
                                className="col-span-3"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Sửa</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline" className="text-red-500 ml-2">
                        Xóa
                      </Button>
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

export default TableManagement;
