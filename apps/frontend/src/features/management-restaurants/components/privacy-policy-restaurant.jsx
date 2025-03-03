import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SquareCheck, Square } from "lucide-react";

const PrivacyPolicy = ({ terms, setTerms }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div
        onClick={() => {
          if (terms) {
            setTerms(false);
          } else {
            setOpen(true);
          }
        }}
        className="flex items-center space-x-2 cursor-pointer"
      >
        {terms ? <SquareCheck className="w-6 h-6 text-primary" /> : <Square className="w-6 h-6 text-primary" />}

        <Label className="cursor-pointer">Đồng ý với điều khoản và dịch vụ</Label>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl md:h-fit h-full">
          <DialogHeader>
            <DialogTitle>Điều khoản và dịch vụ</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[70vh] w-full rounded-md">
            <div className="terms-and-conditions px-8 py-4">
              <h1 className="text-3xl font-bold mb-4">Điều Khoản và Dịch Vụ Dành Cho Nhà Hàng</h1>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">1. Giới Thiệu</h2>
                <p>
                  Khi đăng ký và sử dụng dịch vụ của <strong>[Tên Website]</strong> (“chúng tôi”), nhà hàng (“bạn”) đồng
                  ý tuân thủ và bị ràng buộc bởi các Điều Khoản và Dịch Vụ này. Nếu không đồng ý, vui lòng không tiếp
                  tục sử dụng dịch vụ của chúng tôi.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">2. Điều Kiện Đăng Ký</h2>
                <ul className="list-disc ml-6">
                  <li>
                    Nhà hàng phải cung cấp thông tin chính xác và hợp pháp, bao gồm tên nhà hàng, địa chỉ, giấy phép
                    kinh doanh hợp lệ và thông tin liên hệ.
                  </li>
                  <li>
                    Bạn phải chịu trách nhiệm về tính chính xác và cập nhật của thông tin đã cung cấp trên hệ thống của
                    chúng tôi.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">3. Sử Dụng Dịch Vụ</h2>
                <ul className="list-disc ml-6">
                  <li>
                    Bạn có quyền sử dụng nền tảng của chúng tôi để quản lý đặt bàn, đặt món và quảng bá nhà hàng của
                    mình.
                  </li>
                  <li>
                    Bạn không được sử dụng hệ thống cho mục đích bất hợp pháp hoặc gây hại đến uy tín của chúng tôi hoặc
                    các nhà hàng khác trên hệ thống.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">4. Quản Lý Đặt Bàn và Đặt Món</h2>
                <ul className="list-disc ml-6">
                  <li>
                    Bạn phải thường xuyên cập nhật tình trạng chỗ trống và thực đơn của nhà hàng để tránh tình trạng quá
                    tải hoặc hết món.
                  </li>
                  <li>Bạn chịu trách nhiệm xác nhận hoặc hủy bỏ đơn đặt bàn và đặt món trong thời gian hợp lý.</li>
                  <li>Mọi thay đổi về giá cả hoặc khuyến mãi phải được cập nhật trên hệ thống ngay khi có hiệu lực.</li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">5. Thanh Toán và Phí Dịch Vụ</h2>
                <ul className="list-disc ml-6">
                  <li>
                    Chúng tôi sẽ tính phí dịch vụ dựa trên tỷ lệ phần trăm doanh thu từ các đơn đặt bàn và đặt món thông
                    qua hệ thống của chúng tôi.
                  </li>
                  <li>Phí dịch vụ sẽ được trừ tự động trước khi thanh toán cho nhà hàng.</li>
                  <li>
                    Chi tiết về tỷ lệ phần trăm và chu kỳ thanh toán sẽ được cung cấp trong hợp đồng riêng với từng nhà
                    hàng.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">6. Trách Nhiệm của Nhà Hàng</h2>
                <ul className="list-disc ml-6">
                  <li>Đảm bảo chất lượng món ăn và dịch vụ đúng như thông tin đã đăng trên hệ thống.</li>
                  <li>Đảm bảo an toàn vệ sinh thực phẩm và tuân thủ các quy định pháp luật về an toàn thực phẩm.</li>
                  <li>
                    Chịu trách nhiệm giải quyết các khiếu nại của khách hàng liên quan đến dịch vụ hoặc món ăn của nhà
                    hàng.
                  </li>
                </ul>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">7. Giới Hạn Trách Nhiệm của Chúng Tôi</h2>
                <p>
                  Chúng tôi không chịu trách nhiệm về chất lượng món ăn hoặc dịch vụ do nhà hàng cung cấp. Chúng tôi
                  cũng không chịu trách nhiệm về bất kỳ tranh chấp nào phát sinh giữa nhà hàng và khách hàng.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">8. Sở Hữu Trí Tuệ</h2>
                <p>
                  Bạn đồng ý cho phép chúng tôi sử dụng hình ảnh, logo và nội dung của nhà hàng trên nền tảng của chúng
                  tôi để quảng bá và tiếp thị. Bạn đảm bảo rằng bạn có quyền sử dụng tất cả các nội dung đã cung cấp và
                  không vi phạm bản quyền của bên thứ ba.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">9. Bảo Mật Thông Tin</h2>
                <p>
                  Chúng tôi cam kết bảo vệ thông tin kinh doanh và dữ liệu cá nhân của bạn. Bạn không được phép tiết lộ
                  bất kỳ thông tin nào về hệ thống hoặc khách hàng của chúng tôi cho bên thứ ba khi chưa có sự đồng ý
                  của chúng tôi.
                </p>
              </section>

              <section className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">10. Liên Hệ</h2>
                <p>
                  Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào về các Điều Khoản và Dịch Vụ này, vui lòng liên hệ với
                  chúng tôi qua
                  <strong> [Thông Tin Liên Hệ của Bạn]</strong>.
                </p>
              </section>
            </div>
          </ScrollArea>
          <footer className="flex justify-end gap-2">
            <DialogClose>
              <Button variant="destructive">Không đồng ý</Button>
            </DialogClose>
            <DialogClose>
              <Button onClick={() => setTerms(true)}>Tôi Đồng ý</Button>
            </DialogClose>
          </footer>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivacyPolicy;
