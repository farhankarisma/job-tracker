# 🆓 FREE DEPLOYMENT GUIDE - Gawekeun Job Tracker

## 🎯 **TOTAL COST: $0/month** *(100% FREE)*

### **📊 FREE TIER BREAKDOWN:**
- ✅ **Frontend**: Vercel (Unlimited personal projects)
- ✅ **Backend**: Railway ($5 credit/month - enough for small apps)
- ✅ **Database**: Supabase (500MB database)
- ✅ **File Storage**: Cloudinary (25GB storage + 25GB bandwidth)
- ✅ **Domain**: Vercel provides free .vercel.app subdomain

---

## 🚀 **STEP-BY-STEP DEPLOYMENT**

### **STEP 1: Setup Cloudinary (Free File Storage)**

#### **1.1 Create Account**
```bash
1. Go to: https://cloudinary.com/users/register/free
2. Sign up with email/Google
3. Verify email
4. Go to Dashboard → Settings → Access Keys
5. Copy these credentials:
   - Cloud Name
   - API Key
   - API Secret
```

#### **1.2 Add to Environment**
Add to your `.env` file (server):
```env
CLOUDINARY_CLOUD_NAME="your_cloud_name_here"
CLOUDINARY_API_KEY="your_api_key_here"  
CLOUDINARY_API_SECRET="your_api_secret_here"
```

---

### **STEP 2: Deploy Backend to Railway**

#### **2.1 Create Railway Account**
```bash
1. Go to: https://railway.app
2. Sign up with GitHub
3. Get $5 free monthly credit
```

#### **2.2 Deploy Backend**
```bash
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your repository: farhankarisma/job-tracker
3. Choose "server" folder as root directory
4. Railway will auto-detect Node.js
```

#### **2.3 Configure Environment Variables**
In Railway dashboard, add these variables:
```env
DATABASE_URL=(Railway will auto-provide PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EMAIL_USER=your_gmail
EMAIL_PASS=your_app_password
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
NODE_ENV=production
```

#### **2.4 Add PostgreSQL Database**
```bash
1. In Railway project dashboard
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will auto-connect to your backend
4. Run migrations: npx prisma migrate deploy
```

---

### **STEP 3: Deploy Frontend to Vercel**

#### **3.1 Create Vercel Account**
```bash
1. Go to: https://vercel.com
2. Sign up with GitHub
3. Unlimited free deployments for personal projects
```

#### **3.2 Deploy Frontend**
```bash
1. Click "New Project"
2. Import from GitHub: farhankarisma/job-tracker
3. Framework Preset: Next.js
4. Root Directory: client
5. Click "Deploy"
```

#### **3.3 Configure Environment Variables**
In Vercel dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE_URL=https://your-railway-backend-url.up.railway.app
```

---

### **STEP 4: Configure Supabase (Already Free)**

Your Supabase is already configured! Just ensure:
```bash
1. Database is running
2. Auth is configured
3. RLS policies are set
```

---

## 🎉 **DEPLOYMENT COMPLETE!**

### **📱 Your Live URLs:**
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`
- **Files**: Hosted on Cloudinary CDN

### **🔧 Features Working:**
- ✅ Job application tracking
- ✅ Kanban board drag & drop
- ✅ File uploads to Cloudinary
- ✅ Email reminders
- ✅ User authentication
- ✅ Responsive mobile design

---

## 💰 **COST BREAKDOWN (Monthly):**

| Service | Free Tier | Usage Limit | Cost |
|---------|-----------|-------------|------|
| **Vercel** | Unlimited | Personal projects | **$0** |
| **Railway** | $5 credit | ~500MB RAM, 1GB storage | **$0** |
| **Supabase** | Free plan | 500MB DB, 50MB files | **$0** |
| **Cloudinary** | Free plan | 25GB storage, 25GB bandwidth | **$0** |
| **Domain** | .vercel.app | Subdomain included | **$0** |
| **TOTAL** | | | **$0/month** |

---

## 🚀 **NEXT STEPS AFTER DEPLOYMENT:**

### **1. Custom Domain (Optional)**
```bash
# Add custom domain in Vercel (if you have one)
# Or use free subdomain: your-app.vercel.app
```

### **2. Monitor Usage**
```bash
# Railway: Check credit usage in dashboard
# Cloudinary: Monitor bandwidth in dashboard
# Vercel: Check function invocations
```

### **3. Scale Up (When Needed)**
```bash
# Railway: $5/month for more resources
# Supabase: $25/month for Pro plan
# Cloudinary: $89/month for more storage
# Vercel: $20/month for Pro features
```

---

## 🛡️ **SECURITY CHECKLIST:**

- ✅ Environment variables are secure
- ✅ No credentials in Git repository
- ✅ HTTPS enabled by default
- ✅ Database access restricted
- ✅ File uploads validated

---

## 🎯 **CONGRATULATIONS!**

**Your Gawekeun Job Tracker is now LIVE and FREE!** 🎉

You've successfully deployed a production-ready full-stack application with:
- Modern architecture
- Scalable infrastructure  
- Professional features
- Zero monthly costs

Perfect for your portfolio and actual job hunting! 🚀

---

## 📞 **Support:**

If you encounter issues:
1. Check Railway logs for backend errors
2. Check Vercel logs for frontend errors
3. Verify all environment variables
4. Test API endpoints directly

**Happy job hunting with your own custom tracker!** 🎯
