# 🎨 BẢN KẾ HOẠCH TÁI THIẾT KẾ UI/UX - PINK. NAIL ART STUDIO

## I. TỔNG QUAN (OVERALL IMPROVEMENTS)

- Để nâng cấp từ một website cơ bản thành một Nail Art Studio cao cấp, các thay đổi cốt lõi bao gồm:

  - Hình ảnh (Visuals): Loại bỏ 100% ảnh stock phong cảnh/động vật. Thay bằng ảnh chụp Macro (cận cảnh) các mẫu móng thực tế của tiệm. Ảnh phải có cùng một tone màu và phong cách ánh sáng.

  - Bảng màu (Color Palette):
    - Màu chủ đạo: Hồng đất (Dusty Rose - #D1948B).
    - Màu nền: Trắng kem hoặc Hồng Nude cực nhạt (#FDF8F5) thay cho trắng tinh.
    - Màu chữ: Xám than (#333333) để tạo độ sang trọng thay cho đen thuần.

  - Đồ họa & Bo góc:
    - Tất cả các Card, Button, Input field bo góc 16px - 20px (tạo sự mềm mại, nữ tính).
    - Sử dụng đổ bóng nhẹ (Soft Shadows) thay vì viền (Border) dày.

  - Typography:
    - Tiêu đề: Font Serif (có chân) như Playfair Display (tạo cảm giác high-fashion).
    - Nội dung: Font Sans-serif (không chân) như Be Vietnam Pro (dễ đọc, hiện đại).

## II. CHI TIẾT CÁC TRANG (PAGE SPECIFICATIONS)

### 1. Trang Dashboard (Trang Chủ)

- Cấu trúc theo dòng chảy cảm xúc của khách hàng:

  - Section 1: Hero Section (Mối tình đầu)
    - Visual: Video background hoặc Slider ảnh siêu nét (Macro) về đôi tay đang được vẽ nghệ thuật.
    - Content: Tiêu đề dùng Font Serif lớn: "Nơi bộ móng trở thành tác phẩm."
    - Action: Một nút "Khám phá Lookbook" nằm giữa, hiệu ứng đổ bóng lan tỏa (Glow effect).

  - Section 2: Lookbook Highlight (Cửa sổ tâm hồn)
    - Layout: Hiển thị 6 mẫu móng đẹp nhất theo dạng lưới không đều.
    - Content: Tiêu đề "Bộ sưu tập mới nhất".
    - Action: Nút "Xem toàn bộ Lookbook" với hiệu ứng mũi tên trượt khi hover.

  - Section 3: About Us (Câu chuyện thương hiệu)
    - Visual: Ảnh nghệ nhân đang làm việc + Không gian tiệm màu trung tính sang trọng.
    - Content: "Chúng tôi không chỉ đắp móng, chúng tôi tạo ra sự tự tin."
    - Thông tin: Tập trung vào: Nguyên liệu cao cấp - Kỹ thuật vẽ tay - Vệ sinh chuẩn y khoa.

### 2. Trang Lookbook (Thư Viện Nghệ Thuật, là trang gallery cũ)

- Đây là trang quan trọng nhất để khách hàng "chốt đơn".

  - Layout & Interaction:

  - Hệ thống Filter (Bộ lọc): Đặt ở phía trên dạng các "viên thuốc" (Pills):
    - Dáng móng: Almond, Coffin, Square, Stiletto.
    - Phong cách: Vẽ 3D, Tráng gương, Đính đá, Ombre.

  - Masonry Layout: Các ảnh móng tay có độ dài khác nhau xếp xen kẽ (như Pinterest). Điều này giúp các bộ móng dài (Coffin/Stiletto) và móng ngắn (Square) đều có không gian hiển thị tốt nhất.

  - Hiệu ứng Hover (Di chuột):
    - Ảnh hơi phóng to (Zoom in 1.1x) mượt mà.
    - Một lớp phủ (Overlay) màu hồng đất mờ (Opacity 40%) hiện lên.
    - Xuất hiện nút nhanh: "Xem chi tiết" và biểu tượng "Lưu mẫu".

  - Hiệu ứng Click (Pop-up Detail):
    - Mở một cửa sổ Modal giữa màn hình.
    - Bên trái: Ảnh phóng to cực đại để khách xem rõ nét vẽ.
    - Bên phải: Thông tin: Tên thợ, Loại sơn sử dụng, Thời gian thực hiện, Giá dự kiến.
    - Dưới cùng: Nút to màu hồng đất: "Đặt lịch theo mẫu này".

### 3. Trang Booking (Quy Trình Đặt Lịch)

- Thanh tiến trình (Progress Bar): Chuyển từ các icon thô sang một đường line mảnh với các chấm tròn tinh tế.

- Chia làm 3 giai đoạn trực quan:

  - Giai đoạn 1 (Chọn Concept): Khách hàng chọn "Dáng móng" và "Mức độ nghệ thuật" (Vẽ đơn giản / Vẽ phức tạp / Masterpiece). Mỗi lựa chọn đều có ảnh minh họa đi kèm thay vì chỉ có chữ.

  - Giai đoạn 2 (Chọn Nghệ nhân & Thời gian): * Avatar thợ làm móng được thiết kế tròn, có rating 5 sao.
    - Lịch chọn giờ hiện đại, các khung giờ đã hết chỗ sẽ được làm mờ (Disabled) tinh tế.

  - Giai đoạn 3 (Xác nhận):
    - Thiết kế dạng một "Tấm thiệp điện tử".
    - Có QR Code để khách check-in nhanh khi đến tiệm.
    - Gửi một hiệu ứng pháo hoa giấy (Confetti) nhẹ khi hoàn tất để chúc mừng.

### 4. Trang Contact (Liên Hệ)

- Trái (Thông tin): Thay các icon mặc định bằng icon nét mảnh (Line icons) màu hồng đất. Hiển thị trạng thái "Đang mở cửa" hoặc "Đã đóng cửa" theo thời gian thực.

- Phải (Form liên hệ):
  - Bỏ các ô vuông có nền xám cũ kỹ. Thay bằng các ô nhập liệu chỉ có đường kẻ dưới (Underline) hoặc nền hồng cực nhạt.
  - Nút gửi tin nhắn: Chuyển thành nút lớn, bo góc tròn hoàn toàn (Pill shape).

- Bản đồ: Tùy chỉnh màu bản đồ (Map Styles) với phong cách "Muted/Retro" để màu bản đồ hòa hợp với màu hồng của website.

## III. CHI TIẾT GIAO DIỆN MẪU (UI SPECS)

| Thành phần | Thuộc tính UI đề xuất |
| ------- | ------- |
| Card (Thẻ) | "Background: #FFFFFF, Border-radius: 20px, Shadow: 0 10px 30px rgba(209, 148, 139, 0.1)" |
| Primary Button | "Background: #D1948B, Color: #FFFFFF, Font-weight: 600, Padding: 12px 32px" |
| Secondary Button | "Background: Transparent, Border: 1px solid #D1948B, Color: #D1948B" |
| Input Fields | "Background: #FDF8F5, Border-radius: 12px, Border: 1px solid #EAEAEA" |

## IV. CÁC QUY TẮC CẦN LƯU Ý CHO DEVELOPER

- Chuyển cảnh (Transitions): Tất cả các trang phải có hiệu ứng "Fade-in" nhẹ khi tải.
- Độ phản hồi (Mobile): Trên điện thoại, trang Gallery phải chuyển sang dạng 2 cột để ảnh đủ lớn cho khách xem chi tiết.
- Khoảng trắng (White Space): Luôn giữ khoảng cách giữa các section ít nhất là 100px trên Desktop để tạo cảm giác "sang chảnh" và không bị ngộp thông tin.
