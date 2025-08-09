# 🚀 LimitBreakers - Live Deployment

## Quick Deploy to Netlify

**One-Click Deploy**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Nithin112915/LimitBreakers)

## Manual Deployment Steps

1. **Go to Netlify**: Visit [https://netlify.com](https://netlify.com)
2. **Connect GitHub**: Log in and select "New site from Git"
3. **Choose Repository**: `Nithin112915/LimitBreakers`
4. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Environment Variables** (Add in Netlify dashboard):
   ```
   MONGODB_URI=mongodb+srv://limitbreakers:LimitBreakers123@cluster0.mongodb.net/limitbreakers?retryWrites=true&w=majority
   NEXTAUTH_SECRET=yctmXGAO+a6WEW/YGEaoixz9frh4f4DuzaxBG7iHz/E=
   NEXTAUTH_URL=https://limitbreakers-app.netlify.app
   ```

## 🔗 Live App URL
After deployment, your app will be available at:
**https://limitbreakers-app.netlify.app**

## 🎯 Ready to Share!
- ✅ Cloud Database Connected
- ✅ Production Build Tested
- ✅ Environment Variables Configured
- ✅ Ready for Live Users

Share the link with your friends and start building habits together!
