# 🚀 UGT TOWA - Vercel Deployment Guide

## ✅ Supabase Backend Status: COMPLETE
Your UGT TOWA backend is fully configured with:
- ✅ Database tables (appointments, newsletter, profiles, etc.)
- ✅ Edge functions (notifications, file uploads, newsletter processing)
- ✅ Storage buckets (document uploads, images)
- ✅ Row Level Security (RLS) policies
- ✅ Test account created

## 🔑 Supabase Credentials
**These are your Supabase connection details:**
```
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

## 🧪 Test Account Created
**Use this to test the system:**
```
📧 Email: izikqzla@minimax.com
🔑 Password: rIiDeVXcud
👤 User ID: 463670a2-48eb-4f99-b4c3-a8c2500f451d
```

## 🚀 Vercel Deployment Steps

### Step 1: Connect GitHub to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your UGT TOWA GitHub repository

### Step 2: Configure Environment Variables
In Vercel project settings, add these environment variables:
```
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

### Step 3: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete (2-3 minutes)
3. Vercel will provide a URL like: `https://your-project.vercel.app`

### Step 4: Test the System
1. Visit your Vercel URL
2. Log in with the test account: `izikqzla@minimax.com` / `rIiDeVXcud`
3. Navigate to "Citas" section
4. Test the appointments system:
   - Check available slots
   - Book an appointment
   - Upload a document
5. Access admin panel (if you upgrade test account to admin)

## 🏥 Appointments System Features Ready

### ✅ What's Working:
- **User Booking**: Users can browse and book appointments
- **Admin Management**: Full admin panel for managing appointments
- **Time Slots**: Admin creates available time slots
- **Document Upload**: Users can attach documents to appointments
- **Email Notifications**: Automated confirmations via edge functions
- **Status Tracking**: Pending, confirmed, completed, cancelled states
- **File Storage**: Document storage in Supabase
- **Responsive UI**: Works on mobile and desktop

### 📱 PWA Features:
- **Installable**: Users can install as app on mobile/desktop
- **Offline Support**: Basic functionality works offline
- **Push Notifications**: Real-time appointment alerts

## 🔧 Next Steps After Deployment

### To Create Admin Account:
1. Register a new account on the portal
2. Update role in Supabase:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@domain.com';
```

### To Test Appointments:
1. Admin creates time slots via "Citas → Disponibilidad"
2. Users book appointments via "Citas" menu
3. Test document upload functionality
4. Verify email notifications (if configured)

## 📞 System Architecture

### Frontend (React + TypeScript):
- **Vite**: Build system
- **Tailwind CSS**: Styling
- **Supabase Client**: Backend integration
- **React Router**: Navigation
- **Context API**: State management

### Backend (Supabase):
- **PostgreSQL**: Database with RLS policies
- **Edge Functions**: Serverless functions for:
  - Email notifications
  - File processing
  - Newsletter generation
  - Document uploads
- **Storage**: File management with public/private buckets
- **Auth**: User authentication and authorization

## 🎯 Expected Results

After deployment, your UGT TOWA portal will have:
- ✅ **Complete appointments system**
- ✅ **Admin dashboard** with full management
- ✅ **User authentication** and profiles
- ✅ **Document management** with file uploads
- ✅ **Newsletter system** (backend ready)
- ✅ **PWA functionality** (installable app)
- ✅ **Professional design** with dark/light themes
- ✅ **Mobile responsive** interface

## 🆘 Troubleshooting

### Common Issues:
1. **Build Fails**: Check environment variables are set correctly
2. **Supabase Connection**: Verify URL and keys match exactly
3. **Appointments Not Loading**: Check RLS policies and table permissions
4. **File Uploads Fail**: Verify storage buckets exist and have correct permissions

### Need Help?
If you encounter any issues during deployment, just let me know with the specific error and I'll help you resolve it!

---
**Your UGT TOWA portal is production-ready! 🎉**