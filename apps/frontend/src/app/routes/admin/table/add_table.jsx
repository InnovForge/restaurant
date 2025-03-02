import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRestaurant } from "@/context/restaurant";
import { api } from "@/lib/api-client";
import { toast } from "sonner";

const AddTable = () => {
  const [loading, setLoading] = useState(false);
  const { restaurantId } = useRestaurant();

  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.target);
      const addTable = {
        tableName: formData.get("tableName"),
        seatCount: formData.get("seatCount"),
      };

      if (!addTable.tableName || !addTable.seatCount) {
        toast.error("Vui lòng điền đầy đủ thông tin");
        return;
      }

      const res = await api.post(`/v1/restaurants/${restaurantId}/tables`, addTable);
      toast.success("Thêm bàn ăn thành công!");

      // Reset form
      e.target.reset();
    } catch (err) {
      console.error("Lỗi thêm bàn:", err);
      toast.error(err.response?.data?.message || "Thêm bàn ăn thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link to={`/d/restaurants/${restaurantId}/ban`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Thêm Bàn Ăn Mới</h1>
            <p className="text-muted-foreground">Thêm bàn ăn vào nhà hàng</p>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Thông tin Bàn Ăn</CardTitle>
            <CardDescription>Điền thông tin chi tiết về bàn ăn mới</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdd} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="tableName">Tên bàn</Label>
                    <Input id="tableName" name="tableName" placeholder="VD: Bàn 1" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Số lượng chỗ ngồi</Label>
                    <div className="relative">
                      <Input
                        id="seatCount"
                        name="seatCount"
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="VD: 5"
                        className="h-11 pl-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" asChild>
                  <Link to={`/d/restaurants/${restaurantId}/ban`}>Hủy</Link>
                </Button>
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                  {loading ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Đang thêm...
                    </>
                  ) : (
                    "Thêm bàn"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddTable;
