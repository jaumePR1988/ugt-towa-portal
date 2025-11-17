# 🚀 UGT TOWA Portal - Deploy Instructions

## ✅ Changes Applied Successfully
- **Fixed appointment booking start_time constraint error**
- **Removed annoying PWA installation popup**
- **Changes committed locally** (commit: 0fed185)

## 📋 Next Steps to Deploy

### Step 1: Push to GitHub
Run these commands in your local repository:

```bash
cd /path/to/your/ugt-towa-portal
git remote add origin https://github.com/jaumePR1988/ugt-towa-portal.git
git push -u origin master
```

**Alternative - GitHub Desktop:**
1. Open GitHub Desktop
2. Select your UGT TOWA repository
3. Click "Push origin" to sync changes

### Step 2: Redeploy on Vercel

#### Option A: Automatic Redeploy
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find your UGT TOWA project
3. Click "Redeploy" or the project will auto-deploy from GitHub

#### Option B: Manual Deploy
1. Go to [Vercel New Project](https://vercel.com/new)
2. Import from GitHub → Select UGT TOWA repository
3. Configure environment variables:

```env
VITE_SUPABASE_URL=https://zaxdscclkeytakcowgww.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheGRzY2Nsa2V5dGFrY293Z3d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTUxMTIsImV4cCI6MjA3NzU5MTExMn0.MQMePYqEhW9xhCipC-MeU8Z_dXqvyBKH5e0vtgaS9xQ
```

4. Click "Deploy"

### Step 3: Test the Fixes
After deployment, test these functionalities:

#### ✅ Test Appointment Booking
1. Go to the Citas (Appointments) section
2. Select a delegate type
3. Choose a time slot
4. Fill in required information
5. **Should NOT see:** "Error al reservar cita: null value in column 'start_time'"
6. **Should see:** Successful booking confirmation

#### ✅ Test No PWA Popup
1. Load the website
2. **Should NOT see:** PWA installation popup appearing
3. **Should see:** Clean interface without installation prompts

### Step 4: Create Admin User (if needed)
To test the admin interface:

1. Register a new account at: https://your-vercel-url.vercel.app/register
2. Then manually update the database (contact me for details)

## 🔧 What Was Fixed

### Fix 1: Appointment Booking Error
- **Problem:** Database required `start_time` and `end_time` fields but code only provided `appointment_date` and `appointment_time`
- **Solution:** Properly extract time from slot data and create valid ISO timestamps
- **Location:** `src/pages/CitasPage.tsx`

### Fix 2: PWA Installation Popup
- **Problem:** Annoying PWA install popup appearing automatically
- **Solution:** Disabled PWA install prompt component in main App
- **Location:** `src/App.tsx`

## 📞 Support
If you encounter any issues:
1. Check the Vercel deployment logs
2. Verify environment variables are correct
3. Test the appointment booking flow thoroughly
4. Report any remaining errors

---
**Ready to deploy! 🚀**