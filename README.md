# BÀI ÔN TẬP TRẮC NGHIỆM TIN HỌC 8

## Hướng dẫn triển khai lên mạng miễn phí

### Cách 1: Triển khai trên Render.com (Khuyên dùng nhất - Miễn phí 100%)
Render.com hỗ trợ chạy máy chủ Node.js Express đầy đủ và lưu trữ bài nộp của học sinh an toàn:
1. Đăng nhập vào [render.com](https://render.com) (chọn Login with GitHub).
2. Bấm nút **New +** ➔ chọn **Web Service**.
3. Chọn kho GitHub chứa mã nguồn này.
4. Cài đặt các thông số (hầu hết Render tự điền):
   - **Runtime**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Bấm **Create Web Service**. Chờ 1-2 phút bạn sẽ có link công khai `https://xxx.onrender.com` để gửi cho học sinh!

### Lưu ý về cấu trúc thư mục trên GitHub:
Khi tải lên GitHub, đảm bảo các file sau nằm ngay ở ngoài cùng (thư mục gốc của kho):
- `index.html`
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `server.ts`
- Thư mục `src/` (chứa `main.tsx`, `App.tsx`, `types.ts`, `data/`, `components/`,...)
