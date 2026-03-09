# 🚀 Vercel Deployment Guide

## Overview

This guide covers deploying the Turborepo Micro-Frontend Commerce Platform to Vercel. Vercel is optimized for Next.js applications and offers excellent support for monorepos.

## Architecture Overview

Our application consists of 5 Next.js applications:
- **Shell** (Port 3000) - Main entry point with reverse proxy
- **Auth** (Port 3001) - Authentication service
- **Dashboard** (Port 3002) - Dashboard service
- **Product** (Port 3003) - Product catalog service
- **Sales** (Port 3004) - Sales management service

## Deployment Strategy

For Vercel deployment with Turborepo, we have two main approaches:

### Approach 1: Deploy Shell Only (Recommended for Vercel)
Deploy the Shell application which acts as a reverse proxy to other services. This is the simplest approach for Vercel's free tier.

### Approach 2: Deploy All Services Separately
Deploy each service independently with its own Vercel project. This maintains true micro-frontend independence but requires more configuration.

---

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Push your code to GitHub
3. **Vercel CLI** (Optional): Install globally
   ```bash
   npm install -g vercel
   ```

---

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Prepare Your Repository

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Ensure `.gitignore` is properly configured**:
   ```
   node_modules
   .next
   .turbo
   dist
   .env*.local
   ```

### Step 2: Import Project to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Turborepo monorepo

### Step 3: Configure Shell Application

When configuring the project:

**Framework Preset**: Next.js

**Root Directory**: `apps/shell`

**Build Command**:
```bash
cd ../.. && npx turbo run build --filter=shell
```

**Output Directory**: `.next` (default)

**Install Command**:
```bash
npm install
```

**Environment Variables**: (Add if needed)
```
NODE_ENV=production
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (2-5 minutes)
3. Your app will be live at `https://your-project.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy Shell Application

Navigate to the shell directory and deploy:

```bash
cd apps/shell
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account
- **Link to existing project**: No
- **Project name**: Accept default or customize
- **Directory**: `./` (current directory)
- **Override settings**: Yes
  - **Build Command**: `cd ../.. && npx turbo run build --filter=shell`
  - **Output Directory**: `.next`
  - **Development Command**: `npm run dev`

### Step 4: Production Deployment

For production deployment:

```bash
vercel --prod
```

---

## Method 3: Deploy All Services Separately

If you want to deploy each service independently:

### Step 1: Create vercel.json for Each App

Create `vercel.json` in each app directory:

**apps/shell/vercel.json**:
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=shell",
  "devCommand": "cd ../.. && npx turbo run dev --filter=shell",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**apps/auth/vercel.json**:
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=auth",
  "devCommand": "cd ../.. && npx turbo run dev --filter=auth",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**apps/dashboard/vercel.json**:
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=dashboard",
  "devCommand": "cd ../.. && npx turbo run dev --filter=dashboard",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**apps/product/vercel.json**:
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=product",
  "devCommand": "cd ../.. && npx turbo run dev --filter=product",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**apps/sales/vercel.json**:
```json
{
  "buildCommand": "cd ../.. && npx turbo run build --filter=sales",
  "devCommand": "cd ../.. && npx turbo run dev --filter=sales",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

### Step 2: Deploy Each Service

Deploy each service from its directory:

```bash
# Deploy Shell
cd apps/shell
vercel --prod

# Deploy Auth
cd ../auth
vercel --prod

# Deploy Dashboard
cd ../dashboard
vercel --prod

# Deploy Product
cd ../product
vercel --prod

# Deploy Sales
cd ../sales
vercel --prod
```

### Step 3: Update Shell Configuration

After deploying all services, update `apps/shell/next.config.js` with production URLs:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui'],
    reactStrictMode: true,
    async rewrites() {
        const isDev = process.env.NODE_ENV === 'development';
        
        const authUrl = isDev ? 'http://localhost:3001' : 'https://your-auth.vercel.app';
        const dashboardUrl = isDev ? 'http://localhost:3002' : 'https://your-dashboard.vercel.app';
        const productUrl = isDev ? 'http://localhost:3003' : 'https://your-product.vercel.app';
        const salesUrl = isDev ? 'http://localhost:3004' : 'https://your-sales.vercel.app';

        return {
            beforeFiles: [
                {
                    source: '/auth/:path*',
                    destination: `${authUrl}/auth/:path*`,
                },
                {
                    source: '/dashboard/:path*',
                    destination: `${dashboardUrl}/dashboard/:path*`,
                },
                {
                    source: '/products/:path*',
                    destination: `${productUrl}/products/:path*`,
                },
                {
                    source: '/sales/:path*',
                    destination: `${salesUrl}/sales/:path*`,
                },
            ],
            afterFiles: [
                {
                    source: '/_next/static/:path*',
                    has: [{ type: 'header', key: 'referer', value: '.*/auth/.*' }],
                    destination: `${authUrl}/_next/static/:path*`,
                },
                {
                    source: '/_next/static/:path*',
                    has: [{ type: 'header', key: 'referer', value: '.*/dashboard/.*' }],
                    destination: `${dashboardUrl}/_next/static/:path*`,
                },
                {
                    source: '/_next/static/:path*',
                    has: [{ type: 'header', key: 'referer', value: '.*/products/.*' }],
                    destination: `${productUrl}/_next/static/:path*`,
                },
                {
                    source: '/_next/static/:path*',
                    has: [{ type: 'header', key: 'referer', value: '.*/sales/.*' }],
                    destination: `${salesUrl}/_next/static/:path*`,
                },
            ],
        };
    },
}

module.exports = nextConfig
```

---

## Configuration for Turborepo on Vercel

### Root vercel.json (Optional)

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/shell/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/shell/$1"
    }
  ]
}
```

### Turbo Configuration

Ensure `turbo.json` is properly configured:

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Environment Variables

### Setting Environment Variables on Vercel

1. Go to your project dashboard on Vercel
2. Navigate to **Settings** → **Environment Variables**
3. Add variables for each environment:
   - **Production**
   - **Preview**
   - **Development**

Example variables:
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api.vercel.app
```

### Using Environment Variables

Access them in your code:
```javascript
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## Troubleshooting

### Build Fails with "Module not found"

**Solution**: Ensure all dependencies are in the root `package.json` or the specific app's `package.json`.

```bash
# Install missing dependencies
npm install <package-name> -w apps/shell
```

### Turbo Build Command Not Found

**Solution**: Add turbo as a dependency:

```bash
npm install turbo --save-dev
```

### Static Assets 404 Errors

**Solution**: Verify `basePath` and `assetPrefix` in `next.config.js` match your deployment structure.

### Rewrites Not Working in Production

**Solution**: Vercel's rewrites work differently in production. Consider using environment variables to switch between local and production URLs.

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: When you create a pull request

### Manual Deployments

Trigger manual deployments:

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Deployment Hooks

Set up deployment hooks in Vercel dashboard:
1. Go to **Settings** → **Git**
2. Configure branch deployments
3. Set up deployment protection rules

---

## Performance Optimization

### Enable Edge Functions

For better performance, consider using Vercel Edge Functions:

```javascript
// apps/shell/middleware.ts
export const config = {
  matcher: ['/api/:path*'],
}

export function middleware(request) {
  // Your middleware logic
}
```

### Enable ISR (Incremental Static Regeneration)

For pages with dynamic data:

```javascript
export async function getStaticProps() {
  return {
    props: { /* your props */ },
    revalidate: 60, // Revalidate every 60 seconds
  }
}
```

### Enable Image Optimization

Configure Next.js Image Optimization:

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

---

## Monitoring and Analytics

### Vercel Analytics

Enable Vercel Analytics:

1. Go to your project dashboard
2. Navigate to **Analytics** tab
3. Click **Enable Analytics**

### Speed Insights

Enable Speed Insights:

```bash
npm install @vercel/speed-insights
```

```javascript
// apps/shell/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
```

---

## Cost Considerations

### Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Build Execution**: 100 hours/month
- **Serverless Function Execution**: 100 GB-hours/month
- **Edge Middleware Invocations**: 1 million/month

### Optimization Tips

1. **Use Static Generation** where possible
2. **Optimize images** with Next.js Image component
3. **Enable caching** for API routes
4. **Use Edge Functions** for faster response times

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] All dependencies installed
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables configured
- [ ] `vercel.json` created (if needed)
- [ ] Turbo configuration verified
- [ ] Domain configured (optional)
- [ ] Analytics enabled (optional)
- [ ] Test deployment in preview environment
- [ ] Deploy to production

---

## Useful Commands

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Remove deployment
vercel rm <deployment-name>

# Link local project to Vercel
vercel link

# Pull environment variables
vercel env pull
```

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Turborepo on Vercel](https://vercel.com/docs/monorepos/turborepo)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

## Support

For issues or questions:
- Vercel Support: https://vercel.com/support
- Turborepo Discord: https://turbo.build/discord
- Next.js GitHub: https://github.com/vercel/next.js

---

**Last Updated**: March 2026