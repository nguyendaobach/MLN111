# ⚠️ IMPORTANT - Environment Variables Setup

## Bước 1: Tạo file .env.local
File `.env.local` đã được tạo với template. Bạn cần:

1. **Thay thế API key** trong file `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_API_KEY=your-actual-api-key-here
```

2. **Khởi động lại server** để load environment variables:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

## Bước 2: Bảo mật
- ✅ File `.env.local` đã được thêm vào `.gitignore` 
- ✅ API key không còn hardcode trong source code
- ✅ Chỉ có `NEXT_PUBLIC_*` variables mới accessible từ client-side

## Bước 3: Deploy lên Vercel

### Cách 1: Qua Vercel Dashboard (Khuyến nghị)
1. Vào [vercel.com](https://vercel.com) → Your Project → Settings → Environment Variables
2. Thêm biến môi trường:
   - **Name**: `NEXT_PUBLIC_GOOGLE_API_KEY`
   - **Value**: `your-actual-api-key-here`
   - **Environment**: Production (hoặc tất cả)
3. Redeploy project

### Cách 2: Qua Vercel CLI
```bash
vercel env add NEXT_PUBLIC_GOOGLE_API_KEY
# Nhập value khi được hỏi
# Chọn environment: Production

# Redeploy
vercel --prod
```

### Cách 3: Trong vercel.json
Tạo file `vercel.json` (không khuyến nghị cho sensitive data):
```json
{
  "env": {
    "NEXT_PUBLIC_GOOGLE_API_KEY": "your-api-key"
  }
}
```

## Files đã được cập nhật:
- ✅ `components/chatbox.tsx` - Sử dụng env variable
- ✅ `service/script.js` - Cập nhật với placeholder
- ✅ `public/service/script.js` - Cập nhật với placeholder  
- ✅ `lib/utils.ts` - Thêm utility functions
- ✅ `.env.local` - Template được tạo
- ✅ `.gitignore` - Đã có .env* protection

## ⚠️ Security Note:
Client-side scripts trong `service/` và `public/service/` folders không thể access server-side environment variables trực tiếp. Consider moving API calls to API routes for better security.