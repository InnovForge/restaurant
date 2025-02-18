import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function UserUpdateInfoForm() {
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
                  <Input id="username" defaultValue="ABC" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò: </Label>
                  <Input id="role" defaultValue="admin/staff" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gioitinh">Giới tính: </Label>
                  <Input id="gioitinh" defaultValue="Nam" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ngaysinh">Ngày sinh :</Label>
                  <Input id="ngaysinh" defaultValue="1/1/1111" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email :</Label>
                  <Input id="email" defaultValue="ABC@gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Điện thoại :</Label>
                  <Input id="phone" defaultValue="0202020" />
                </div>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="w-48 h-48 bg-gray-200 relative">
                  {image ? (
                    <img src={image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-400"></div>
                  )}
                </div>
                <Button className="w-32" onClick={() => document.getElementById("picture").click()}>
                  Thay đổi ảnh
                </Button>
                <Input id="picture" type="file" style={{ display: "none" }} onChange={handleFileChange} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Địa chỉ</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">address_line1 :</Label>
                <Input id="street" defaultValue="Da Nang" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">address_line2 :</Label>
                <Input id="ward" defaultValue="70 Cao Ba Quat" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">longitude :</Label>
                <Input id="longitude" defaultValue="106.70089700" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Quốc gia :</Label>
                <Input id="country" defaultValue="VN" />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <Button className="w-32">Sửa</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
