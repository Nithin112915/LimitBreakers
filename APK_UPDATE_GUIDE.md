# 📱 APK Update Management Guide

## 🔄 Update Strategies Overview

### **1. Automatic Web Updates (Already Working)**
Your current hybrid app setup provides automatic updates:
- ✅ **UI/UX changes** update instantly
- ✅ **New features** appear without user action
- ✅ **Bug fixes** deploy automatically
- ✅ **Database changes** work immediately

### **2. In-App Update Notifications (Just Added)**
Shows update banners to APK users:
- 🔔 **Automatic detection** when new APK is available
- 📱 **Direct download link** to latest version
- ⚠️ **Required updates** for critical fixes
- ❌ **Dismissible notifications** for optional updates

### **3. Version Management System**

#### **To Release a New APK:**
1. **Update version in** `/src/app/api/app/version/route.ts`
2. **Build new APK** with updated version number
3. **Deploy web changes** to Netlify
4. **Upload new APK** to download page
5. **Users get notification** automatically

#### **Version Configuration:**
```typescript
const APP_VERSION = {
  version: '1.0.1',           // Increment for new APK
  isRequired: false,          // true = forced update
  minimumVersion: '1.0.0',    // Oldest supported version
  downloadUrl: 'https://limitbreakers.netlify.app/download.html'
};
```

## 🚀 **Update Workflow**

### **For Minor Updates (No APK needed):**
1. Make changes to web code
2. Deploy to Netlify
3. Users get updates instantly
4. No action required from users

### **For Major Updates (New APK required):**
1. **Update version number** in `capacitor.config.ts`
2. **Update API version** in `/src/app/api/app/version/route.ts`
3. **Build new APK** using: `./build-mobile.sh`
4. **Upload new APK** to `public/` directory
5. **Deploy to Netlify**
6. **Users see update notification**

## 📋 **Update Types**

### **Type 1: Hot Updates (Instant)**
- Content changes
- UI improvements
- Bug fixes
- New web features
- API updates

### **Type 2: APK Updates (Manual Download)**
- Native feature changes
- Plugin updates
- Permission changes
- Performance optimizations
- Security updates

## 🛠 **Update Management Commands**

### **Check Current Version:**
```bash
# In APK
localStorage.getItem('app_version') || '1.0.0'

# In API
curl https://limitbreakers.netlify.app/api/app/version
```

### **Force Update Check:**
```javascript
// In browser console (APK users)
window.location.reload();
```

### **Build New APK Version:**
```bash
# 1. Update version in capacitor.config.ts
vim capacitor.config.ts

# 2. Update API version
vim src/app/api/app/version/route.ts

# 3. Build new APK
./build-mobile.sh

# 4. Upload to public directory
cp android/app/build/outputs/apk/debug/app-debug.apk public/LimitBreakers-v1.1.0.apk

# 5. Deploy
git add . && git commit -m "feat: Release v1.1.0" && git push origin main
npx netlify deploy --prod
```

## 📊 **Update Analytics**

### **Track Update Adoption:**
```javascript
// Add to your analytics
const trackUpdate = (fromVersion, toVersion) => {
  // Send to your analytics service
  console.log(`Updated from ${fromVersion} to ${toVersion}`);
};
```

### **Monitor Update Success:**
```javascript
// Check update completion
const checkUpdateSuccess = () => {
  const currentVersion = '1.0.1'; // From API
  const installedVersion = localStorage.getItem('app_version');
  
  if (currentVersion !== installedVersion) {
    // Show update notification
    showUpdateNotification();
  }
};
```

## 🔐 **Update Security**

### **Secure Download Links:**
- ✅ Serve APKs from your domain
- ✅ Use HTTPS for all downloads
- ✅ Add integrity checks
- ✅ Version verification

### **Update Verification:**
```javascript
// Verify update authenticity
const verifyUpdate = async (version) => {
  const response = await fetch(`/api/app/verify/${version}`);
  return response.ok;
};
```

## 📱 **User Communication**

### **Update Messages:**
- **Optional:** "New features available! Update for the best experience."
- **Required:** "Security update required. Please update to continue."
- **Feature:** "🎉 New: AI coaching, dark mode, and performance improvements!"

### **Update Instructions:**
1. **Download** new APK from notification link
2. **Install** by opening downloaded file
3. **Allow** installation from unknown sources if prompted
4. **Open** updated app
5. **Enjoy** new features!

## 🎯 **Best Practices**

### **Release Schedule:**
- **Major updates:** Monthly (new APK)
- **Minor updates:** Weekly (web-only)
- **Hotfixes:** As needed (instant)
- **Security updates:** Immediate (required)

### **Version Numbering:**
- **Major:** 1.0.0 → 2.0.0 (breaking changes)
- **Minor:** 1.0.0 → 1.1.0 (new features)
- **Patch:** 1.0.0 → 1.0.1 (bug fixes)

### **Update Testing:**
1. Test on multiple Android versions
2. Verify backward compatibility
3. Check update notification system
4. Validate download links
5. Test rollback procedures

## 🚨 **Emergency Updates**

### **Critical Security Fix:**
```typescript
// Set in API version route
const EMERGENCY_UPDATE = {
  version: '1.0.2',
  isRequired: true,
  message: 'Critical security update required',
  downloadUrl: 'https://limitbreakers.netlify.app/download.html',
  blockOldVersions: true
};
```

This comprehensive system ensures your users always have the latest features while maintaining control over critical updates! 🚀
