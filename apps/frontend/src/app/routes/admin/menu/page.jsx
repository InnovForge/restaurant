import { useState, useEffect } from "react";
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, PlusCircle, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

const MenuPage = () => {
  const [editItem, setEditItem] = useState(null);
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { restaurantId } = useRestaurant();

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`v1/restaurants/${restaurantId}/foods`);
        console.log("Data from API:", res.data.data); // Log dữ liệu từ API
        setFoods(res.data.data);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }
    fetchData();
  }, [restaurantId]);

  const itemsPerPage = 8;
  const filteredData = foods.filter((item) =>
    Object.values(item).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false,
    ),
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleUpdateFood = async (idFood) => {
    console.log("idmon: " + idFood);
    try {
      const { name, price, description, image } = editItem;
      const updatedData = { name, price, description };

      let newImageUrl = null;

      await api.patch(`/v1/restaurants/${restaurantId}/foods/${idFood}`, updatedData);

      if (image && image instanceof File) {
        const imageData = new FormData();
        imageData.append("image", image);

        const res = await api.patch(`/v1/restaurants/${restaurantId}/foods/${idFood}/image`, imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        newImageUrl = res.data.imageUrl;
      }

      setFoods((prevFoods) =>
        prevFoods.map((food) =>
          food.id === idFood ? { ...food, ...updatedData, imageUrl: newImageUrl || food.imageUrl } : food,
        ),
      );

      toast("Thành công", { description: "Cập nhật món ăn thành công" });
      window.location.reload();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      toast("Lỗi cập nhật", { description: err.response?.data?.message || "Cập nhật thất bại" });
    }
  };

  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      <div className="border-none shadow-lg">
        {/* Header Section */}
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-gray-50 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản Lý Món Ăn</h1>
              <p className="text-muted-foreground mt-1">Quản lý danh sách món ăn của nhà hàng</p>
            </div>
            <Link to={`/d/restaurants/${restaurantId}/menu/themmon`}>
              <Button size="lg" className="shadow-sm">
                <PlusCircle className="h-5 w-5 mr-2" />
                Thêm món ăn
              </Button>
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-6 sm:p-8 border-b bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-11"
                placeholder="Tìm kiếm theo tên món ăn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="p-6 sm:p-8">
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[120px]">Hình ảnh</TableHead>
                  <TableHead>Tên Món Ăn</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="w-[150px]">Giá</TableHead>
                  <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.foodId} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="relative h-16 w-16 rounded-lg border overflow-hidden shadow-sm">
                        <img
                          src={item.imageUrl || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{item.description}</TableCell>
                    <TableCell className="font-medium">{item.price + " " + item.priceType} </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditItem({ ...item })}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Sửa món ăn</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Tên món ăn</Label>
                                <Input
                                  value={editItem?.name || ""}
                                  onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Hình ảnh</Label>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => setEditItem({ ...editItem, image: e.target.files[0] })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Giá</Label>
                                <Input
                                  type="number"
                                  value={editItem?.price || ""}
                                  onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Mô tả</Label>
                                <Input
                                  value={editItem?.description || ""}
                                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                                />
                              </div>
                            </div>
                            <Button type="submit" className="w-full" onClick={() => handleUpdateFood(item.foodId)}>
                              Cập nhật
                            </Button>
                          </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Hiển thị trang {currentPage} trên {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
