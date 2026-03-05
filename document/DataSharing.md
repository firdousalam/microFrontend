# 🔄 Data Sharing Between Services

## Overview

In a micro-frontend architecture, services are independent but need to share data. Here are the recommended patterns for data sharing between services, ordered from most to least recommended.

## 1. API Calls (Recommended)

Services communicate through well-defined REST APIs. This is the most decoupled approach.

### Implementation

#### Product Service - Expose API

Create `apps/product/app/api/products/route.ts`:

```typescript
import { NextResponse } from 'next/server';

// Mock data - replace with database
const products = [
    { id: 1, name: 'Laptop', price: 999, stock: 10 },
    { id: 2, name: 'Mouse', price: 29, stock: 50 },
    { id: 3, name: 'Keyboard', price: 79, stock: 30 },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const product = products.find(p => p.id === parseInt(id));
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    }

    return NextResponse.json(products);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newProduct = {
        id: products.length + 1,
        ...body,
    };
    products.push(newProduct);
    return NextResponse.json(newProduct, { status: 201 });
}
```

#### Dashboard Service - Consume API

Create `apps/dashboard/lib/api.ts`:

```typescript
// API client for calling other services
const API_BASE_URLS = {
    product: process.env.NEXT_PUBLIC_PRODUCT_API || 'http://localhost:3003',
    sales: process.env.NEXT_PUBLIC_SALES_API || 'http://localhost:3004',
    auth: process.env.NEXT_PUBLIC_AUTH_API || 'http://localhost:3001',
};

export async function getProducts() {
    const response = await fetch(`${API_BASE_URLS.product}/api/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
}

export async function getProduct(id: number) {
    const response = await fetch(`${API_BASE_URLS.product}/api/products?id=${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

export async function getSalesStats() {
    const response = await fetch(`${API_BASE_URLS.sales}/api/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch sales stats');
    }
    return response.json();
}
```

Update `apps/dashboard/app/dashboard/page.tsx`:

```typescript
import { getProducts, getSalesStats } from '@/lib/api';

export default async function DashboardPage() {
    // Fetch data from other services
    const products = await getProducts();
    const salesStats = await getSalesStats();

    return (
        <main>
            <h1>📊 Analytics Dashboard</h1>
            
            <div style={{ marginTop: '2rem' }}>
                <h2>Product Summary</h2>
                <p>Total Products: {products.length}</p>
                <ul>
                    {products.map((product: any) => (
                        <li key={product.id}>
                            {product.name} - ${product.price} (Stock: {product.stock})
                        </li>
                    ))}
                </ul>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h2>Sales Summary</h2>
                <p>Total Revenue: ${salesStats.totalRevenue}</p>
                <p>Total Orders: {salesStats.totalOrders}</p>
            </div>
        </main>
    );
}
```

### Benefits
- ✅ True service independence
- ✅ Can scale services separately
- ✅ Clear API contracts
- ✅ Works across different domains
- ✅ Easy to version and evolve

### When to Use
- Cross-service data fetching
- Real-time data needs
- Services in different domains/servers

---

## 2. Shared State via Cookies (Authentication)

Use cookies for authentication state that needs to be shared across all services.

### Implementation

#### Auth Service - Set Cookie

Create `apps/auth/lib/auth.ts`:

```typescript
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export function setAuthCookie(user: User) {
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    
    cookies().set('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

export function getAuthCookie(): User | null {
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET) as User;
    } catch {
        return null;
    }
}

export function clearAuthCookie() {
    cookies().delete('auth_token');
}
```

#### Any Service - Read Cookie

Create `apps/dashboard/lib/auth.ts`:

```typescript
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export function getCurrentUser(): User | null {
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_SECRET) as User;
    } catch {
        return null;
    }
}
```

Use in any service:

```typescript
import { getCurrentUser } from '@/lib/auth';

export default async function DashboardPage() {
    const user = getCurrentUser();

    if (!user) {
        redirect('/auth/login');
    }

    return (
        <main>
            <h1>Welcome, {user.name}!</h1>
            <p>Role: {user.role}</p>
        </main>
    );
}
```

### Benefits
- ✅ Automatic sharing across same domain
- ✅ Secure (httpOnly prevents XSS)
- ✅ No additional API calls needed
- ✅ Works with reverse proxy

### When to Use
- Authentication state
- User preferences
- Session data

---

## 3. Local Storage / Session Storage (Client-Side)

Share data on the client side using browser storage APIs.

### Implementation

#### Service A - Write Data

Create `apps/product/components/ProductSelector.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function ProductSelector() {
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    const selectProduct = (product: any) => {
        setSelectedProduct(product);
        
        // Store in localStorage for other services to access
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('productSelected', {
            detail: product
        }));
    };

    return (
        <div>
            <button onClick={() => selectProduct({ id: 1, name: 'Laptop', price: 999 })}>
                Select Laptop
            </button>
        </div>
    );
}
```

#### Service B - Read Data

Create `apps/sales/components/OrderForm.tsx`:

```typescript
'use client';

import { useState, useEffect } from 'react';

export default function OrderForm() {
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        // Read from localStorage
        const stored = localStorage.getItem('selectedProduct');
        if (stored) {
            setProduct(JSON.parse(stored));
        }

        // Listen for changes from other services
        const handleProductSelected = (event: any) => {
            setProduct(event.detail);
        };

        window.addEventListener('productSelected', handleProductSelected);

        return () => {
            window.removeEventListener('productSelected', handleProductSelected);
        };
    }, []);

    if (!product) {
        return <p>No product selected</p>;
    }

    return (
        <div>
            <h2>Create Order</h2>
            <p>Product: {product.name}</p>
            <p>Price: ${product.price}</p>
            <button>Place Order</button>
        </div>
    );
}
```

### Benefits
- ✅ No server calls needed
- ✅ Fast access
- ✅ Persists across page reloads
- ✅ Simple implementation

### Limitations
- ❌ Only works client-side
- ❌ Not secure (visible in DevTools)
- ❌ Limited to same domain
- ❌ Storage limits (5-10MB)

### When to Use
- UI state (selected items, filters)
- User preferences
- Temporary data
- Non-sensitive information

---

## 4. Query Parameters / URL State

Pass data through URL parameters when navigating between services.

### Implementation

#### Service A - Navigate with Data

```typescript
'use client';

import { useRouter } from 'next/navigation';

export default function ProductList() {
    const router = useRouter();

    const viewProduct = (productId: number) => {
        // Navigate to sales service with product ID
        router.push(`/sales/create-order?productId=${productId}&source=products`);
    };

    return (
        <div>
            <button onClick={() => viewProduct(123)}>
                Order This Product
            </button>
        </div>
    );
}
```

#### Service B - Read from URL

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CreateOrder() {
    const searchParams = useSearchParams();
    const [product, setProduct] = useState<any>(null);

    useEffect(() => {
        const productId = searchParams.get('productId');
        const source = searchParams.get('source');

        if (productId) {
            // Fetch product details
            fetch(`/api/products?id=${productId}`)
                .then(res => res.json())
                .then(data => setProduct(data));
        }
    }, [searchParams]);

    return (
        <div>
            <h2>Create Order</h2>
            {product && (
                <div>
                    <p>Product: {product.name}</p>
                    <p>Price: ${product.price}</p>
                </div>
            )}
        </div>
    );
}
```

### Benefits
- ✅ Shareable URLs
- ✅ Bookmarkable
- ✅ SEO friendly
- ✅ Works with SSR

### Limitations
- ❌ Limited data size
- ❌ Visible in URL
- ❌ Not suitable for sensitive data

### When to Use
- Navigation context
- Filter/search parameters
- Shareable state
- Deep linking

---

## 5. Shared Package (@repo/shared-state)

Create a shared package for common data structures and utilities.

### Implementation

#### Create Shared Package

Create `packages/shared-state/package.json`:

```json
{
  "name": "@repo/shared-state",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
```

Create `packages/shared-state/src/index.ts`:

```typescript
// Shared types
export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface Order {
    id: number;
    productId: number;
    quantity: number;
    totalPrice: number;
    status: 'pending' | 'completed' | 'cancelled';
}

export interface User {
    id: number;
    email: string;
    name: string;
    role: 'admin' | 'user';
}

// Shared utilities
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}

export function calculateOrderTotal(price: number, quantity: number): number {
    return price * quantity;
}

// Shared constants
export const API_ENDPOINTS = {
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    AUTH: '/api/auth',
} as const;
```

#### Use in Services

```typescript
import { Product, formatPrice, API_ENDPOINTS } from '@repo/shared-state';

export default async function ProductPage() {
    const response = await fetch(API_ENDPOINTS.PRODUCTS);
    const products: Product[] = await response.json();

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price)}</p>
                </div>
            ))}
        </div>
    );
}
```

### Benefits
- ✅ Type safety across services
- ✅ Shared business logic
- ✅ Single source of truth
- ✅ Easy to maintain

### Limitations
- ❌ Creates coupling
- ❌ Requires rebuild on changes
- ❌ Not for runtime data

### When to Use
- Shared TypeScript types
- Common utilities
- Constants and enums
- Validation schemas

---

## 6. Server-Sent Events (SSE) / WebSockets

Real-time data streaming between services.

### Implementation

#### Service A - SSE Endpoint

Create `apps/product/app/api/events/route.ts`:

```typescript
export async function GET(request: Request) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            // Send updates every 5 seconds
            const interval = setInterval(() => {
                const data = {
                    type: 'stock_update',
                    productId: 123,
                    stock: Math.floor(Math.random() * 100),
                    timestamp: new Date().toISOString(),
                };

                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            }, 5000);

            // Cleanup
            request.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}
```

#### Service B - Listen to Events

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function StockMonitor() {
    const [stockData, setStockData] = useState<any>(null);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3003/api/events');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStockData(data);
        };

        eventSource.onerror = () => {
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, []);

    return (
        <div>
            <h2>Real-time Stock Updates</h2>
            {stockData && (
                <div>
                    <p>Product ID: {stockData.productId}</p>
                    <p>Stock: {stockData.stock}</p>
                    <p>Updated: {new Date(stockData.timestamp).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}
```

### Benefits
- ✅ Real-time updates
- ✅ Server push capability
- ✅ Efficient for live data

### Limitations
- ❌ More complex setup
- ❌ Requires persistent connections
- ❌ Scaling challenges

### When to Use
- Live notifications
- Real-time dashboards
- Stock/inventory updates
- Chat features

---

## Comparison Matrix

| Method | Coupling | Performance | Security | Use Case |
|--------|----------|-------------|----------|----------|
| API Calls | Low | Medium | High | Primary data exchange |
| Cookies | Low | High | High | Authentication |
| LocalStorage | Medium | High | Low | UI state |
| URL Params | Low | High | Low | Navigation context |
| Shared Package | High | High | N/A | Types & utilities |
| SSE/WebSocket | Medium | High | Medium | Real-time data |

## Best Practices

### 1. Prefer API Calls
Use REST APIs as the primary communication method between services.

### 2. Use Cookies for Auth
Store authentication tokens in httpOnly cookies for security.

### 3. Avoid Tight Coupling
Don't import code directly between services. Use APIs or shared packages.

### 4. Version Your APIs
Use API versioning to allow independent service evolution:
```typescript
fetch('/api/v1/products')
```

### 5. Handle Failures Gracefully
Services should work even if other services are down:
```typescript
try {
    const products = await getProducts();
} catch (error) {
    // Show cached data or fallback UI
    return <div>Products temporarily unavailable</div>;
}
```

### 6. Use Environment Variables
Configure service URLs via environment variables:
```bash
NEXT_PUBLIC_PRODUCT_API=http://localhost:3003
NEXT_PUBLIC_SALES_API=http://localhost:3004
```

### 7. Implement Caching
Cache API responses to reduce load:
```typescript
export const revalidate = 60; // Revalidate every 60 seconds

export default async function Page() {
    const products = await getProducts();
    // ...
}
```

## Recommended Architecture

```
┌─────────────────────────────────────────────────┐
│                    Browser                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │LocalStore│  │  Cookies │  │URL Params│      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                      ↕
┌─────────────────────────────────────────────────┐
│              Shell (Reverse Proxy)               │
└─────────────────────────────────────────────────┘
         ↕              ↕              ↕
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Product    │ │  Dashboard   │ │    Sales     │
│   Service    │ │   Service    │ │   Service    │
│              │ │              │ │              │
│  API Routes  │ │  API Routes  │ │  API Routes  │
└──────────────┘ └──────────────┘ └──────────────┘
         ↕              ↕              ↕
    API Calls ←────────┴──────────────┘
```

## Conclusion

For a production micro-frontend architecture:

1. **Primary**: Use API calls for data exchange
2. **Authentication**: Use httpOnly cookies
3. **UI State**: Use localStorage/sessionStorage
4. **Navigation**: Use URL parameters
5. **Types**: Use shared packages
6. **Real-time**: Use SSE or WebSockets when needed

This approach maintains service independence while enabling effective communication.
