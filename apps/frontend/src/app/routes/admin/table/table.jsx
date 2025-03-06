import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";
import { Link } from "react-router";

const TableManagement = () => {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const { restaurantId } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get(`v1/tables/${restaurantId}/`);
        setTables(res.data.message);
        console.log("res.data.data :>> ", res.data.message);
      } catch (err) {
        console.error("Lỗi lấy dữ liệu:", err);
      }
    }
    fetchData();
  }, [restaurantId]);

  const itemsPerPage = 8;
  const filteredData = tables.filter((item) =>
    Object.values(item).some((value) =>
      value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false,
    ),
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = tables.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      <div className="border-none shadow-lg">
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-gray-50 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản Lý Bàn Ăn</h1>
              <p className="text-muted-foreground mt-1">Quản lý bàn ăn của nhà hàng</p>
            </div>
            <Link to={`/d/restaurants/${restaurantId}/ban/themban`}>
              <Button size="lg" className="shadow-sm">
                <PlusCircle className="h-5 w-5 mr-2" />
                Thêm bàn
              </Button>
            </Link>
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-lg border shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead>Tên Bàn</TableHead>
                  <TableHead>Số chỗ ngồi</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50">
                    <TableCell>{item.tableName}</TableCell>
                    <TableCell>{item.seatCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

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

export default TableManagement;
