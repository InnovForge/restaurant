import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, PlusCircle, Search, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";

const MenuPage = () => {
  const [editItem, setEditItem] = useState({});
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { restaurantId } = useRestaurant();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`v1/food?latitude=16.060035&longitude=108.209648`);
        setFoods(res.data.data[0].foods);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }
    fetchData();
  }, []);

  const itemsPerPage = 5;
  const filteredData = foods.filter((item) =>
    Object.values(item).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="border rounded-xl shadow-lg bg-white">
        <div className="flex justify-between items-center border-b p-6 bg-gray-100">
          <h2 className="text-2xl font-bold">Quản Lý Món Ăn</h2>
          <Link to={`/d/restaurants/${restaurantId}/menu/themmon`}>
            <Button>
              <PlusCircle className="h-5 w-5 mr-2" />
              Thêm món ăn
            </Button>
          </Link>
        </div>

        {/* Search & Table */}
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Tìm kiếm món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Bảng danh sách món ăn */}
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
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Còn" ? "default" : "destructive"}>{item.status}</Badge>
                    </TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.price.toLocaleString()} VNĐ</TableCell>
                    <TableCell className="text-right flex gap-2">
                      {/* Sửa món ăn */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Sửa món ăn</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Tên món ăn</Label>
                              <Input
                                value={editItem.name || ""}
                                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Hình ảnh</Label>
                              <Input
                                value={editItem.image || ""}
                                onChange={(e) => setEditItem({ ...editItem, image: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label>Tình trạng</Label>
                              <Select
                                value={editItem.status || ""}
                                onValueChange={(value) => setEditItem({ ...editItem, status: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tình trạng" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Còn">Còn</SelectItem>
                                  <SelectItem value="Hết">Hết</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Giá</Label>
                              <Input
                                type="number"
                                value={editItem.price || ""}
                                onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                              />
                            </div>
                          </div>
                          <Button type="submit" className="w-full mt-4">
                            Cập nhật
                          </Button>
                        </DialogContent>
                      </Dialog>

                      {/* Xóa món ăn */}
                      <Button variant="destructive" size="sm">
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm">
              Hiển thị {currentPage} / {totalPages}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
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
