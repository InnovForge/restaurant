import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useRestaurant } from "@/context/restaurant";
import { useEffect } from "react";
import { api } from "@/lib/api-client";

const MenuPage = () => {
  // http://localhost:3001/api/v1/food?latitude=16.060035&longitude=108.209648
  const [editItem, setEditItem] = useState({});
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { restaurantId } = useRestaurant();
  const handleEditClick = (item) => {
    setEditItem(item);
  };
  useEffect(() => {
    async function fetchRestaurantData() {
      try {
        const res = await api.get(`v1/food?latitude=16.060035&longitude=108.209648`);
        console.log(res.data.data[0].foods);
        setFoods(res.data.data[0].foods);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }

    fetchRestaurantData();
  }, []);
  const itemsPerPage = 4;

  const filteredData = foods.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <div className="border rounded-md shadow-md bg-white">
        <div className="border-b p-4 flex justify-between">
          <h2 className="text-xl font-bold">Quản Lý Món Ăn</h2>
          <Link to={`/d/restaurants/${restaurantId}/menu/themmon`}>
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Thêm món ăn
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
          {/* bảng */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead>Tên Món Ăn</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead className="text-right">Sửa / Xóa</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Còn" ? "Tạm hết" : "Hết"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price + " VNĐ"}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => handleEditClick(item)}>
                            Sửa
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Sửa món ăn</DialogTitle>
                            <DialogDescription>
                              Thực hiện thay đổi cho món ăn của bạn tại đây. Nhấp vào sửa khi bạn hoàn tất.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="hinhanh" className="text-right">
                                Chọn ảnh
                              </Label>
                              <Input
                                id="hinhanh"
                                value={editItem.image || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    image: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="monan" className="text-right">
                                Tên món ăn
                              </Label>
                              <Input
                                id="monan"
                                value={editItem.name || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    name: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="tinhtrang" className="text-right">
                                Tình trạng
                              </Label>
                              <select
                                id="tinhtrang"
                                value={editItem.status || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    status: e.target.value,
                                  })
                                }
                                className="col-span-3 border rounded-md px-3 py-2"
                              >
                                <option value="Còn">Còn</option>
                                <option value="Hết">Hết</option>
                              </select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="mota" className="text-right">
                                Mô tả
                              </Label>
                              <Input
                                id="mota"
                                value={editItem.description || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    description: e.target.value,
                                  })
                                }
                                className="col-span-3"
                              />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="gia" className="text-right">
                                Giá
                              </Label>
                              <Input
                                id="gia"
                                type="number"
                                value={editItem.price || ""}
                                onChange={(e) =>
                                  setEditItem({
                                    ...editItem,
                                    price: e.target.value,
                                  })
                                }
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
          {/* trang hiển thị */}
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

export default MenuPage;
