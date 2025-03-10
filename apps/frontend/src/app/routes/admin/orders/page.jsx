import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Eye, Search, Filter, CalendarDays, Clock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableCell, TableHead, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";

const statusMap = {
  ChuaThanhToan: { label: "Chưa Thanh Toán", variant: "warning" },
  DaThanhToan: { label: "Đã Thanh Toán", variant: "success" },
};

const OrdersPage = () => {
  const { restaurantId } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        // Gọi API để lấy danh sách hóa đơn
        const response = await api.get(`/v1/restaurants/${restaurantId}/bills`, {
          params: { status: statusFilter, searchTerm },
        });
        setBills(response.data.bills);
      } catch (error) {
        console.error("Error fetching bills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [restaurantId, statusFilter, searchTerm]);

  const filteredData = bills.filter((item) => {
    const matchesSearch = Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const matchesStatus = statusFilter === "all" || item.order_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      <Card className="border-none shadow-lg">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b bg-gradient-to-r from-gray-50 to-transparent">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Quản Lý Hóa Đơn</h1>
              <p className="text-muted-foreground mt-1">Quản lý và theo dõi hóa đơn của nhà hàng</p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              <span className="font-medium">Tổng số: {filteredData.length} hóa đơn</span>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="p-6 sm:p-8 border-b bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10 h-11"
                placeholder="Tìm kiếm theo mã hóa đơn, bàn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-11">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="p-6 sm:p-8">
          <div className="rounded-lg border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="w-[100px]">Mã hóa đơn</TableHead>
                  <TableHead>Tên bàn</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Thời gian</span>
                    </div>
                  </TableHead>
                  <TableHead className="w-[140px]">Tổng tiền</TableHead>
                  <TableHead className="w-[140px]">Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.bill_id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium">{item.bill_id}</TableCell>
                    <TableCell>{item.table_name}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-center font-medium">{item.total_amount.toLocaleString()} VNĐ</TableCell>
                    <TableCell>
                      <Badge
                        variant={item.order_status === "Đã thanh toán" ? "default" : "destructive"}
                        className="px-2.5 py-0.5"
                      >
                        {item.order_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Link to={`/d/restaurants/${restaurantId}/hoadon/chitiet/${item.bill_id}`}>
                          <Button variant="outline" size="sm" className="h-8">
                            <Eye className="h-4 w-4 mr-2" />
                            Chi tiết
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
            <span className="text-sm text-muted-foreground order-2 sm:order-1">
              Hiển thị {startIndex + 1} đến {Math.min(startIndex + itemsPerPage, filteredData.length)} trong số{" "}
              {filteredData.length} hóa đơn
            </span>
            <div className="flex gap-2 order-1 sm:order-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="icon"
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                    className="h-9 w-9"
                  >
                    {page}
                  </Button>
                ))}
              </div>
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
      </Card>
    </div>
  );
};

export default OrdersPage;
