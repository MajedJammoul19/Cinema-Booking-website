import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react' // التصحيح: المسار الصحيح للمكتبة

// مفتاح Clerk الخاص بك - يجب وضعه في ملف .env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

// تأكد من وجود المفتاح، وإلا أوقف التطبيق مبكراً
if (!PUBLISHABLE_KEY) {
  throw new Error("نقص مفتاح Clerk Publishable Key. تأكد من إضافته في ملف .env.local")
}

createRoot(document.getElementById('root')).render(
  <ClerkProvider 
    publishableKey={PUBLISHABLE_KEY} // التصحيح: تمرير المفتاح كخاصية إجبارية
    afterSignOutUrl="/" // خاصية إضافية لتحديد مكان التوجيه بعد تسجيل الخروج
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
)