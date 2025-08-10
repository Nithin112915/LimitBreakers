# MongoDB Atlas Setup Instructions

## What you need to do:

1. **Create New MongoDB Atlas Cluster**
   - Go to https://cloud.mongodb.com/
   - Create a new M0 (free) cluster
   - Name it: `limitbreakers-production`
   - Region: Choose closest to your users

2. **Database User**
   - Username: `limitbreakers_user`
   - Password: Generate a strong password (save it!)
   - Role: Read and write to any database

3. **Network Access**
   - Allow access from anywhere: `0.0.0.0/0`

4. **Connection String Format**
   Your connection string should look like:
   ```
   mongodb+srv://limitbreakers_user:<password>@limitbreakers-production.xxxxx.mongodb.net/limitbreakers?retryWrites=true&w=majority
   ```

5. **Database Name**
   - Use: `limitbreakers` (this will be created automatically)

## After you get the connection string:
1. Replace `<password>` with your actual password
2. Update the environment variables
3. Deploy to production

## Collections that will be created automatically:
- users
- habits
- posts  
- notifications
- achievements
