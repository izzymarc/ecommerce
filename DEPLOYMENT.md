# 🚀 Deployment Guide

This guide covers deploying the E-Commerce Platform to production.

## Frontend Deployment (Netlify)

### Option 1: Netlify UI

1. Push your code to GitHub/GitLab/Bitbucket
2. Log in to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your repository
5. Netlify will auto-detect the `netlify.toml` configuration:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
6. Click "Deploy site"

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd client
netlify deploy --prod
```

### Environment Variables (Netlify)

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.com
```

## Backend Deployment

### Option 1: Railway

1. Push code to GitHub
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret-key
   STRIPE_SECRET_KEY=your-stripe-secret
   STRIPE_PUBLISHABLE_KEY=your-stripe-public-key
   ```
6. Deploy

### Option 2: Heroku

```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login
heroku login

# Create app
cd server
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set STRIPE_SECRET_KEY=your-stripe-secret

# Deploy
git push heroku main
```

### Option 3: DigitalOcean App Platform

1. Push code to GitHub
2. Go to DigitalOcean App Platform
3. Create new app from GitHub
4. Select `server` directory
5. Add environment variables
6. Deploy

## Database Setup (MongoDB)

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get connection string
6. Add to backend environment variables as `MONGODB_URI`

### Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

## Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and accessible
- [ ] Database connected
- [ ] Environment variables set
- [ ] CORS configured (update `CLIENT_URL` in backend)
- [ ] Stripe webhooks configured (if using payments)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic on Netlify/Railway)

## Monitoring

### Netlify

- View deploy logs in Netlify Dashboard
- Set up deploy notifications
- Enable Netlify Analytics (optional)

### Railway/Heroku

- View logs: `railway logs` or `heroku logs --tail`
- Set up uptime monitoring (e.g., UptimeRobot)
- Configure error tracking (e.g., Sentry)

## Troubleshooting

### Build Fails on Netlify

- Check Node version matches `netlify.toml` (Node 18)
- Verify `client/package.json` has all dependencies
- Check build logs for specific errors

### Backend Won't Start

- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure PORT is not hardcoded (use `process.env.PORT`)

### CORS Errors

Update backend `src/index.ts`:

```typescript
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
);
```

Set `CLIENT_URL` environment variable to your frontend URL.

## Custom Domain

### Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records with your registrar
4. SSL certificate is automatic

### Backend

Update your DNS to point to your backend hosting provider.

## Scaling

### Frontend

Netlify automatically scales. No action needed.

### Backend

- **Railway:** Upgrade to paid plan for more resources
- **Heroku:** Scale dynos: `heroku ps:scale web=2`
- **DigitalOcean:** Upgrade app plan

## Cost Estimate

- **Frontend (Netlify):** Free tier (100GB bandwidth)
- **Backend (Railway):** $5/month (500 hours)
- **Database (MongoDB Atlas):** Free tier (512MB storage)
- **Total:** ~$5/month for small to medium traffic

## Support

For issues, check:

- [Netlify Docs](https://docs.netlify.com)
- [Railway Docs](https://docs.railway.app)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
