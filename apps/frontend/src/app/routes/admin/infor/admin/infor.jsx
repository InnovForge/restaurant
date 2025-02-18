import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Link } from "react-router";

export default function UserInfoForm() {
  // lay anh
  const [image, setImage] = useState(null);
  // xu ly anh khi an vao nut thay doi anh
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Tên người dùng :</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò: </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Giới tính: </Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Ngày sinh :</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :</Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">address_line1 :</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">address_line2 :</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">longitude :</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">latitude :</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Quốc gia :</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Link to="/admin/suathongtin">
              <Button className="w-32">Sửa thông tin</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
