# Preserve - Deployment Guide

## Deploying to Vercel

Vercel is the recommended hosting platform for this Next.js application. Here's how to deploy:

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Preserve property preservation app"
   git branch -M main
   git remote add origin https://github.com/yourusername/preserve.git
   git push -u origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Done!** Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variables

When you add database or API integrations, configure these in Vercel:

### Required Variables (Future):
```bash
DATABASE_URL=postgresql://user:password@host:5432/preserve
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_S3_BUCKET=preserve-photos
```

### Setting Environment Variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable for Production, Preview, and Development
4. Redeploy for changes to take effect

## Custom Domain

1. In Vercel project settings, go to "Domains"
2. Add your custom domain (e.g., `preserve-nc.com`)
3. Update your DNS records as instructed
4. SSL certificate will be automatically provisioned

## Continuous Deployment

Once connected to GitHub, Vercel will automatically:
- Deploy on every push to `main` branch
- Create preview deployments for pull requests
- Run build checks before deployment

## Build Configuration

The project is pre-configured with `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Database Setup (Future)

When ready to add PostgreSQL:

1. **Vercel Postgres** (Recommended)
   - Go to your project's Storage tab
   - Create a Postgres database
   - Connection string is automatically added to environment variables

2. **External Database**
   - Use Supabase, Neon, or Railway
   - Add connection string to environment variables

3. **Run Migrations**
   ```bash
   # Use the schema.sql file in /database folder
   psql $DATABASE_URL -f database/schema.sql
   ```

## Performance Optimization

- Images: Use Next.js `<Image>` component (already configured)
- Caching: Vercel Edge Network caches static assets
- Analytics: Enable Vercel Analytics in project settings

## Monitoring

Enable in Vercel Dashboard:
- **Vercel Analytics**: Real-time performance metrics
- **Speed Insights**: Core Web Vitals monitoring
- **Logs**: Runtime and build logs

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Community: https://vercel.com/community
