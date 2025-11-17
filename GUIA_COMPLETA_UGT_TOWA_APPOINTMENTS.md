# 🏥 UGT TOWA - Complete Portal with Functional Appointments System

## 📦 Complete Project Package
Your **UGT_TOWA_PROYECTO_COMPLETO_VERCEL_READY.zip** contains the full UGT TOWA portal with:

### ✅ Complete Features Included:
- **🏥 Appointments System (Citas)** - Fully functional
- **📱 PWA (Progressive Web App)** - Installable on mobile/desktop
- **👥 User Management** - Authentication & profiles
- **📋 Admin Panel** - Complete management dashboard
- **📰 Newsletter System** - Email marketing automation
- **📄 Document Management** - File uploads and organization
- **💬 Comments System** - User engagement
- **📊 Analytics Dashboard** - Statistics and reports
- **🔔 Push Notifications** - Real-time alerts
- **🎨 Modern UI** - Professional design with dark/light themes

## 🏥 Appointments System - Complete Setup

### Features:
- **Slot Management**: Admin creates available time slots
- **User Booking**: Users can reserve appointments
- **File Attachments**: Users can upload documents to appointments
- **Email Notifications**: Automated confirmations and alerts
- **Admin Controls**: Approve, cancel, manage all appointments
- **Status Tracking**: Pending, confirmed, completed, cancelled
- **Type Support**: Union delegates, Safety, etc.

### Database Schema:
```sql
-- Appointment slots (managed by admin)
appointment_slots:
  - id, delegate_type, appointment_date
  - start_time, end_time, status
  - created_at

-- User appointments (created by users)
appointments:
  - id, user_id, slot_id, delegate_type
  - status, comments, questions
  - attachments, created_at
```

### Edge Functions (Supabase):
1. **`notify-appointment`**: Sends email notifications
2. **`process-appointment-notification`**: Handles notification queue
3. **`delete-appointment`**: Clean deletion management

## 🚀 Complete Setup Instructions

### 1. Create New GitHub Repository
1. Go to **github.com** and create a new repository
2. Name: `ugt-towa-portal` (or your preferred name)
3. Upload the **complete ZIP** contents to your new repository

### 2. Vercel Deployment
1. Connect your GitHub repo to **Vercel**
2. Vercel will auto-detect it's a React/Vite project
3. **Environment Variables** needed:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RESEND_API_KEY=your_resend_key (optional)
   ```

### 3. Supabase Backend Setup
1. Create a new **Supabase project**
2. Run the **database migrations** in order:
   - `1762031000_create_newsletter_subscribers_table.sql`
   - `1762032000_create_newsletter_content_table.sql`
   - `1762033000_create_newsletters_sent_table.sql`
   - `1762623233_create_qr_codes_table.sql`
3. Deploy **Edge Functions** to Supabase
4. Configure **Storage Buckets**:
   - `newsletter-images`
   - `appointment-documents`
   - `communique-images`
   - `delegate-photos`

### 4. Create Admin User
1. Register normally on the portal
2. Update your user role in Supabase:
   ```sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@domain.com';
   ```

## 🏥 Using the Appointments System

### For Users:
1. **Navigate to "Citas"** in the main menu
2. **Select appointment type**:
   - **Sindical**: Union delegate appointments
   - **Prevención**: Safety appointments
3. **Choose date** from calendar
4. **Select available time slot**
5. **Fill booking form**:
   - Comments and questions
   - Upload relevant documents
6. **Confirm reservation**

### For Admins:
1. **Access Admin Panel** → "Citas"
2. **Manage appointments**:
   - View all bookings
   - Confirm/cancel appointments
   - See user details and attachments
   - Generate reports and statistics
3. **Configure availability**:
   - Create new time slots
   - Block specific times
   - Set appointment types

## 🔧 Technical Features

### Frontend (React + TypeScript):
- **Modern UI**: Tailwind CSS + Lucide icons
- **State Management**: React Context API
- **Date Handling**: date-fns library
- **File Uploads**: Supabase Storage integration
- **Notifications**: Toast notifications
- **PWA Support**: Service worker for offline functionality

### Backend (Supabase):
- **Database**: PostgreSQL with RLS policies
- **Authentication**: Supabase Auth
- **Storage**: File management with RLS
- **Edge Functions**: Serverless backend logic
- **Real-time**: Live updates and notifications

### Key Edge Functions:
- **Notifications**: Email alert system
- **Newsletter**: PDF generation and sending
- **File Management**: Upload/download handling
- **Analytics**: Data processing and reports

## 📱 PWA Features

The portal works as a **Progressive Web App**:
- **Installable**: Add to home screen on mobile/desktop
- **Offline Support**: Works without internet (basic features)
- **Push Notifications**: Real-time alerts
- **App-like Experience**: Full-screen, native feel

## 🎯 User Types & Permissions

### 👤 Regular Users:
- Book appointments
- View personal dashboard
- Access documents and news
- Receive notifications
- Comment on posts

### 👨‍💼 Admin Users:
- Full dashboard access
- Manage all content
- Configure appointments
- User management
- System analytics
- Newsletter management

### 👥 Affiliate Users:
- Special dashboard section
- Reduced feature set
- Benefits and resources access

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure user sessions
- **File Upload Security**: Validated and scanned uploads
- **CORS Protection**: API security headers
- **Environment Variables**: Secure configuration

## 📊 Analytics & Reports

Admin dashboard includes:
- **Appointment statistics**: Daily/weekly/monthly reports
- **User engagement**: Most active users and features
- **System health**: Database performance and usage
- **Email analytics**: Newsletter open rates and clicks

## 🌍 Multi-language Support

- **Interface**: Spanish (primary)
- **Date formatting**: Spanish locale
- **Time zones**: Europe/Madrid
- **Currency**: EUR

## 🔄 Maintenance & Updates

### Regular Tasks:
1. **Clean old files** from storage
2. **Monitor database performance**
3. **Update user permissions**
4. **Backup user data**
5. **Monitor notification delivery**

### Content Updates:
- **News posts**: Regular syndicate updates
- **Documents**: Upload new policies and forms
- **Events**: Add upcoming meetings and activities

## 🚀 Deployment Checklist

### ✅ Pre-Deployment:
- [ ] Supabase project configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] Storage buckets created
- [ ] Environment variables set
- [ ] Admin user created
- [ ] Test appointment booking works

### ✅ Post-Deployment:
- [ ] Portal accessible at custom domain
- [ ] User registration/login working
- [ ] Appointments system functional
- [ ] PWA installation working
- [ ] Email notifications sending
- [ ] File uploads working
- [ ] Admin panel accessible

## 📞 Support & Troubleshooting

### Common Issues:
1. **Appointment slots not showing**:
   - Check database has slot records
   - Verify date filter in queries
   - Ensure RLS policies allow access

2. **File uploads failing**:
   - Check Supabase storage permissions
   - Verify bucket exists and is accessible
   - Ensure file size limits are appropriate

3. **Notifications not sending**:
   - Check edge function logs
   - Verify email service configuration
   - Test notification queue processing

### Performance Optimization:
- Enable **database indexing** for appointments
- Configure **CDN** for static assets
- Set up **caching** for frequently accessed data
- Monitor **API response times**

---

## 🎉 Ready to Launch!

Your UGT TOWA portal is a **complete syndicate management system** with:

- ✅ **Full appointments booking system**
- ✅ **Professional admin dashboard**
- ✅ **Modern PWA interface**
- ✅ **Complete user management**
- ✅ **Document and newsletter systems**
- ✅ **Real-time notifications**
- ✅ **Analytics and reporting**

**The complete project package is ready for immediate deployment on Vercel with a Supabase backend!**

---

**Project Status**: ✅ **PRODUCTION READY**  
**Last Updated**: November 17, 2025  
**Version**: UGT TOWA Portal v2.0 - Complete Edition
