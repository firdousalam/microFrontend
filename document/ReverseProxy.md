# 🔄 Reverse Proxy Architecture

## Overview

The Shell application acts as a **reverse proxy** that routes requests to different micro-frontend services. This provides a unified entry point where users only need to access `http://localhost:3000`, and the Shell handles routing to the appropriate service.

## What is a Reverse Proxy?

A reverse proxy sits between clients and backend servers, forwarding client requests to the appropriate backend service based on routing rules. In our architecture:

- **Client** → accesses `http://localhost:3000/dashboard`
- **Shell (Proxy)** → forwards to `http://localhost:3002/dashboard`
- **Dashboard Service** → processes request and returns response
- **Shell** → returns response to client
- **Client** → sees content, URL stays `http://localhost:3000/dashboard`

## Implementation

### Next.js Rewrites Configuration

The reverse proxy is implemented using Next.js `rewrites()` in `apps/shell/next.config.js`:

```javascript
async rewrites() {
    return [
        // Auth routes - proxy to port 3001
        {
            source: '/auth/:path*',
            destination: 'http://localhost:3001/auth/:path*',
        },
        // Dashboard routes - proxy to port 3002
        {
            source: '/dashboard/:path*',
            destination: 'http://localhost:3002/dashboard/:path*',
        },
        // Product routes - proxy to port 3003
        {
            source: '/products/:path*',
            destination: 'http://localhost:3003/products/:path*',
        },
        // Sales routes - proxy to port 3004
        {
            source: '/sales/:path*',
            destination: 'http://localhost:3004/sales/:path*',
        },
    ];
}
```

### How It Works

#### Route Matching

The `:path*` pattern matches any path segments after the base route:

- `/auth/login` → `http://localhost:3001/auth/login`
- `/auth/register` → `http://localhost:3001/auth/register`
- `/dashboard/analytics` → `http://localhost:3002/dashboard/analytics`
- `/products/123` → `http://localhost:3003/products/123`
- `/sales/orders/456` → `http://localhost:3004/sales/orders/456`

#### Request Flow

```
┌─────────┐
│ Browser │ http://localhost:3000/dashboard
└────┬────┘
     │
     ▼
┌─────────────────┐
│  Shell (3000)   │ Receives request
│  Reverse Proxy  │ Matches /dashboard/:path*
└────┬────────────┘
     │
     ▼ Forwards to http://localhost:3002/dashboard
┌─────────────────┐
│ Dashboard (3002)│ Processes request
└────┬────────────┘
     │
     ▼ Returns response
┌─────────────────┐
│  Shell (3000)   │ Forwards response
└────┬────────────┘
     │
     ▼
┌─────────┐
│ Browser │ Displays content
└─────────┘ URL: http://localhost:3000/dashboard
```

## Service Routing Table

| Service   | Port | Direct Access              | Via Shell Proxy                    |
|-----------|------|----------------------------|------------------------------------|
| Shell     | 3000 | http://localhost:3000      | N/A (main entry point)             |
| Auth      | 3001 | http://localhost:3001      | http://localhost:3000/auth/*       |
| Dashboard | 3002 | http://localhost:3002      | http://localhost:3000/dashboard/*  |
| Product   | 3003 | http://localhost:3003      | http://localhost:3000/products/*   |
| Sales     | 3004 | http://localhost:3004      | http://localhost:3000/sales/*      |

## Benefits

### 1. Single Entry Point
Users only need to remember one URL: `http://localhost:3000`

### 2. No CORS Issues
All requests appear to come from the same origin (localhost:3000), eliminating cross-origin resource sharing problems.

### 3. Unified Domain
In production, all services are accessible under one domain:
- `https://myapp.com/auth/login`
- `https://myapp.com/dashboard`
- `https://myapp.com/products`

### 4. Shared Authentication
Cookies set by the Auth service are accessible across all services since they share the same domain.

### 5. Simplified Client Code
Frontend code doesn't need to know about different ports or services:

```typescript
// Instead of:
fetch('http://localhost:3002/api/dashboard/stats')

// Simply use:
fetch('/dashboard/api/stats')
```

### 6. Production-Ready
The same routing pattern works in production with real domains, no code changes needed.

## Development Workflow

### Starting All Services

```bash
npm run dev
```

This starts all services on their respective ports. The Shell automatically proxies requests.

### Accessing Services

**Recommended (via Shell):**
- http://localhost:3000 - Shell home
- http://localhost:3000/auth/login - Auth login
- http://localhost:3000/dashboard - Dashboard
- http://localhost:3000/products - Products
- http://localhost:3000/sales - Sales

**Direct Access (for debugging):**
- http://localhost:3001 - Auth service directly
- http://localhost:3002 - Dashboard service directly
- http://localhost:3003 - Product service directly
- http://localhost:3004 - Sales service directly

## Navigation

The Shell includes a navigation bar that links to all services:

```typescript
<nav>
    <Link href="/">🏠 Shell</Link>
    <Link href="/auth/login">🔐 Auth</Link>
    <Link href="/dashboard">📊 Dashboard</Link>
    <Link href="/products">📦 Products</Link>
    <Link href="/sales">💰 Sales</Link>
</nav>
```

All navigation happens through the Shell proxy, maintaining the unified URL structure.

## Production Deployment

### Option 1: Next.js Rewrites (Current)
Keep the same configuration. Next.js handles proxying in production.

### Option 2: Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name myapp.com;

    location /auth/ {
        proxy_pass http://auth-service:3001/auth/;
    }

    location /dashboard/ {
        proxy_pass http://dashboard-service:3002/dashboard/;
    }

    location /products/ {
        proxy_pass http://product-service:3003/products/;
    }

    location /sales/ {
        proxy_pass http://sales-service:3004/sales/;
    }

    location / {
        proxy_pass http://shell-service:3000/;
    }
}
```

### Option 3: Kubernetes Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: micro-frontend-ingress
spec:
  rules:
  - host: myapp.com
    http:
      paths:
      - path: /auth
        pathType: Prefix
        backend:
          service:
            name: auth-service
            port:
              number: 3001
      - path: /dashboard
        pathType: Prefix
        backend:
          service:
            name: dashboard-service
            port:
              number: 3002
      - path: /products
        pathType: Prefix
        backend:
          service:
            name: product-service
            port:
              number: 3003
      - path: /sales
        pathType: Prefix
        backend:
          service:
            name: sales-service
            port:
              number: 3004
      - path: /
        pathType: Prefix
        backend:
          service:
            name: shell-service
            port:
              number: 3000
```

## Troubleshooting

### Service Not Responding

If a proxied route returns 503 or connection errors:

1. Verify the target service is running:
```bash
curl http://localhost:3001/auth/login
```

2. Check all services are started:
```bash
npm run dev
```

3. Verify ports are not blocked by firewall

### Proxy Not Working

If requests aren't being proxied:

1. Restart the Shell service:
```bash
cd apps/shell
npm run dev
```

2. Clear Next.js cache:
```bash
rm -rf apps/shell/.next
npm run dev
```

3. Check `next.config.js` syntax is correct

### CORS Errors

If you see CORS errors despite using the proxy:

1. Ensure you're accessing via Shell (port 3000), not directly
2. Check that services don't have restrictive CORS headers
3. Verify cookies have correct domain settings

## Advanced Configuration

### Adding New Services

To add a new service to the proxy:

1. Add rewrite rule in `apps/shell/next.config.js`:
```javascript
{
    source: '/newservice/:path*',
    destination: 'http://localhost:3005/newservice/:path*',
}
```

2. Add navigation link in `apps/shell/app/layout.tsx`:
```typescript
<Link href="/newservice">New Service</Link>
```

### Environment-Based Configuration

For different environments:

```javascript
const isDev = process.env.NODE_ENV === 'development';

const serviceUrls = isDev ? {
    auth: 'http://localhost:3001',
    dashboard: 'http://localhost:3002',
    products: 'http://localhost:3003',
    sales: 'http://localhost:3004',
} : {
    auth: 'https://auth.myapp.com',
    dashboard: 'https://dashboard.myapp.com',
    products: 'https://products.myapp.com',
    sales: 'https://sales.myapp.com',
};

async rewrites() {
    return [
        {
            source: '/auth/:path*',
            destination: `${serviceUrls.auth}/auth/:path*`,
        },
        // ... other routes
    ];
}
```

## Comparison with Alternatives

### vs. Direct Service Access
- ❌ Multiple URLs to remember
- ❌ CORS configuration needed
- ❌ Cookie sharing issues
- ✅ Simpler for debugging individual services

### vs. API Gateway
- ✅ Simpler setup for development
- ✅ No additional infrastructure
- ❌ Less features (rate limiting, auth, etc.)
- ❌ Not as scalable for production

### vs. Module Federation
- ✅ Simpler architecture
- ✅ True service isolation
- ❌ No runtime code sharing
- ❌ Separate deployments needed

## Conclusion

The reverse proxy pattern in the Shell application provides a production-ready architecture that:
- Simplifies development with a single entry point
- Eliminates CORS issues
- Enables seamless navigation between services
- Maintains service independence
- Scales to production environments

This approach is used by major platforms like Netflix, Amazon, and Spotify for their micro-frontend architectures.
