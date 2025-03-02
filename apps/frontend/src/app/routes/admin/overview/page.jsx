"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Utensils, TrendingUp, Users, Calendar, Clock } from "lucide-react";

export default function Overview() {
  return (
    <div className="container mx-auto px-4 lg:pl-8 lg:pr-20 min-h-[calc(100vh-4rem)] py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Thống kê tổng quan</h1>
        <p className="text-muted-foreground mt-1">Xem thống kê hoạt động của nhà hàng</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123.456.789đ</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-emerald-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +20.1%
              </div>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.350</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-emerald-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +180.1%
              </div>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Món ăn</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Utensils className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-emerald-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +3 món
              </div>
              <span className="text-xs text-muted-foreground">trong tháng này</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.234</div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-emerald-600 text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5%
              </div>
              <span className="text-xs text-muted-foreground">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Today's Stats */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Thống kê hôm nay</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date().toLocaleDateString("vi-VN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Doanh thu</p>
              <p className="text-xl font-bold mt-1">4.567.890đ</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Đơn hàng</p>
              <p className="text-xl font-bold mt-1">24</p>
            </div>
          </CardContent>
        </Card>

        {/* Peak Hours */}
        <Card className="border-none shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-sm font-medium">Giờ cao điểm</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">Thời gian đông khách nhất</p>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Buổi trưa</p>
              <p className="text-xl font-bold mt-1">11:30 - 13:30</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Buổi tối</p>
              <p className="text-xl font-bold mt-1">18:00 - 20:00</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
