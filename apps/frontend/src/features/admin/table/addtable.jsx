import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddTable = () => {
    return (
        <div className="container mx-auto p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-semibold mb-4">Thêm bàn mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Số lượng chỗ ngồi:</Label>
                                <Input id="name" placeholder="Nhập số lượng chỗ ngồi" />
                            </div>
                        </div>

                    </div>


                    <div className="mt-6">
                        <Button className="w-full">
                            Thêm bàn
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddTable;
