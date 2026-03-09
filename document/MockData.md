# Mock Data Documentation

This document describes the mock JSON data used across the micro-frontend platform for development and testing purposes.

## Overview

The platform uses JSON files to simulate backend data storage. This approach allows for:
- Rapid development without a real backend
- Consistent test data across all services
- Easy data modification and testing
- No database setup required

## Mock Data Files

### 1. Users Data (`apps/auth/data/users.json`)

Contains 10 test user accounts with different roles:

| ID | Email | Password | Name | Role | Created |
|----|-------|----------|------|------|---------|
| 1 | admin@example.com | admin123 | Admin User | admin | 2024-01-15 |
| 2 | john.doe@example.com | john123 | John Doe | user | 2024-02-20 |
| 3 | jane.smith@example.com | jane123 | Jane Smith | manager | 2024-03-10 |
| 4 | bob.wilson@example.com | bob123 | Bob Wilson | user | 2024-04-05 |
| 5 | alice.brown@example.com | alice123 | Alice Brown | user | 2024-05-12 |
| 6 | charlie.davis@example.com | charlie123 | Charlie Davis | manager | 2024-06-18 |
| 7 | diana.miller@example.com | diana123 | Diana Miller | user | 2024-07-22 |
| 8 | edward.jones@example.com | edward123 | Edward Jones | user | 2024-08-30 |
| 9 | fiona.garcia@example.com | fiona123 | Fiona Garcia | manager | 2024-09-14 |
| 10 | george.martinez@example.com | george123 | George Martinez | user | 2024-10-08 |

**User Structure:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "password": "admin123",
  "name": "Admin User",
  "role": "admin",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**Roles:**
- `admin` - Full system access (1 user)
- `manager` - Management privileges (3 users)
- `user` - Standard user access (6 users)

### 2. Products Data (`apps/product/data/products.json`)

Contains 10 products across different categories:

| ID | Product Name | Price | Category | Stock |
|----|--------------|-------|----------|-------|
| 1 | Wireless Bluetooth Headphones | $149.99 | Electronics | 45 |
| 2 | Smart Fitness Watch | $299.99 | Electronics | 32 |
| 3 | Ergonomic Office Chair | $399.99 | Furniture | 18 |
| 4 | 4K Ultra HD Webcam | $89.99 | Electronics | 67 |
| 5 | Mechanical Gaming Keyboard | $129.99 | Electronics | 54 |
| 6 | Portable Power Bank 20000mAh | $49.99 | Electronics | 120 |
| 7 | Standing Desk Converter | $249.99 | Furniture | 28 |
| 8 | Wireless Gaming Mouse | $79.99 | Electronics | 89 |
| 9 | USB-C Docking Station | $159.99 | Electronics | 41 |
| 10 | LED Desk Lamp | $39.99 | Furniture | 95 |

**Product Structure:**
```json
{
  "id": 1,
  "name": "Wireless Bluetooth Headphones",
  "description": "Premium noise-cancelling headphones with 30-hour battery life",
  "price": 149.99,
  "category": "Electronics",
  "stock": 45,
  "image": "/products/headphones.jpg",
  "createdAt": "2024-01-10T08:00:00Z"
}
```

**Categories:**
- Electronics (7 products)
- Furniture (3 products)

**Price Range:** $39.99 - $399.99

### 3. Orders Data (`apps/sales/data/orders.json`)

Contains 10 sample orders with different statuses:

| Order # | Customer | Items | Total | Status | Date |
|---------|----------|-------|-------|--------|------|
| ORD-2024-001 | John Doe | 2 items | $249.97 | completed | 2024-05-15 |
| ORD-2024-002 | Bob Wilson | 1 item | $299.99 | shipped | 2024-06-20 |
| ORD-2024-003 | Alice Brown | 2 items | $649.98 | completed | 2024-07-10 |
| ORD-2024-004 | Diana Miller | 2 items | $309.97 | pending | 2024-08-05 |
| ORD-2024-005 | Edward Jones | 2 items | $119.98 | completed | 2024-09-12 |
| ORD-2024-006 | John Doe | 1 item | $159.99 | shipped | 2024-10-01 |
| ORD-2024-007 | George Martinez | 2 items | $449.95 | completed | 2024-10-15 |
| ORD-2024-008 | Alice Brown | 2 items | $379.98 | pending | 2024-11-02 |
| ORD-2024-009 | Bob Wilson | 2 items | $209.97 | completed | 2024-11-18 |
| ORD-2024-010 | Diana Miller | 3 items | $649.97 | shipped | 2024-12-05 |

**Order Structure:**
```json
{
  "id": 1,
  "orderNumber": "ORD-2024-001",
  "customerId": 2,
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 1,
      "price": 149.99
    }
  ],
  "totalPrice": 249.97,
  "status": "completed",
  "orderDate": "2024-05-15T10:30:00Z",
  "shippingAddress": "123 Main St, New York, NY 10001"
}
```

**Order Statuses:**
- `pending` - Order placed, awaiting processing (2 orders)
- `shipped` - Order shipped, in transit (3 orders)
- `completed` - Order delivered successfully (5 orders)

**Total Revenue:** $3,479.75

## How Mock Data is Used

### Auth Service

The Auth service reads from `apps/auth/data/users.json` to validate login credentials:

```typescript
// apps/auth/app/api/login/route.ts
import { readFileSync } from 'fs';
import { join } from 'path';

function getUsers() {
    const filePath = join(process.cwd(), 'data', 'users.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function POST(request: Request) {
    const { email, password } = await request.json();
    const users = getUsers();
    
    const user = users.find(
        (u: any) => u.email === email && u.password === password
    );
    
    if (user) {
        return NextResponse.json({ 
            success: true, 
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    }
    
    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
```

### Product Service

The Product service reads from `apps/product/data/products.json`:

```typescript
// apps/product/app/api/products/route.ts
import { readFileSync } from 'fs';
import { join } from 'path';

function getProducts() {
    const filePath = join(process.cwd(), 'data', 'products.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function GET(request: Request) {
    const products = getProducts();
    
    // Get specific product by ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
        const product = products.find((p: any) => p.id === parseInt(id));
        return NextResponse.json(product || null);
    }
    
    // Return all products
    return NextResponse.json(products);
}
```

### Sales Service

The Sales service reads from `apps/sales/data/orders.json`:

```typescript
// apps/sales/app/api/orders/route.ts
import { readFileSync } from 'fs';
import { join } from 'path';

function getOrders() {
    const filePath = join(process.cwd(), 'data', 'orders.json');
    const fileContents = readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
}

export async function GET(request: Request) {
    const orders = getOrders();
    
    // Get specific order by ID
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
        const order = orders.find((o: any) => o.id === parseInt(id));
        return NextResponse.json(order || null);
    }
    
    // Return all orders
    return NextResponse.json(orders);
}
```

## Data Relationships

### User → Orders
Orders reference users via `customerId`:
```json
{
  "customerId": 2,
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com"
}
```

### Orders → Products
Order items reference products via `productId`:
```json
{
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 1,
      "price": 149.99
    }
  ]
}
```

### Product Sales Count
To calculate how many times a product was sold, count occurrences in order items:
```typescript
const salesCount = orders.reduce((count, order) => {
  return count + order.items.filter(item => item.productId === productId).length;
}, 0);
```

## Testing Scenarios

### Login Testing
Test different user roles:
```bash
# Admin access
Email: admin@example.com
Password: admin123

# Manager access
Email: jane.smith@example.com
Password: jane123

# Regular user
Email: john.doe@example.com
Password: john123
```

### Product Browsing
- View all products at `/products`
- View product details at `/products/1` (IDs 1-10)
- Check stock levels (varies from 18 to 120 units)
- Filter by category (Electronics or Furniture)

### Order Management
- View all orders at `/sales`
- View order details at `/sales/1` (IDs 1-10)
- Filter by status (pending, shipped, completed)
- Check order totals ($119.98 to $649.98)

## Modifying Mock Data

### Adding New Users
Edit `apps/auth/data/users.json`:
```json
{
  "id": 11,
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "user",
  "createdAt": "2024-12-15T10:00:00Z"
}
```

### Adding New Products
Edit `apps/product/data/products.json`:
```json
{
  "id": 11,
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "category": "Electronics",
  "stock": 50,
  "image": "/products/new-product.jpg",
  "createdAt": "2024-12-15T10:00:00Z"
}
```

### Adding New Orders
Edit `apps/sales/data/orders.json`:
```json
{
  "id": 11,
  "orderNumber": "ORD-2024-011",
  "customerId": 2,
  "customerName": "John Doe",
  "customerEmail": "john.doe@example.com",
  "items": [
    {
      "productId": 1,
      "productName": "Wireless Bluetooth Headphones",
      "quantity": 1,
      "price": 149.99
    }
  ],
  "totalPrice": 149.99,
  "status": "pending",
  "orderDate": "2024-12-15T10:00:00Z",
  "shippingAddress": "123 Main St, City, State 12345"
}
```

## Important Notes

### Security Warning
⚠️ **This is mock data for development only!**

- Passwords are stored in plain text
- No encryption or hashing
- No authentication tokens
- No session management
- **Never use this approach in production**

### File System Access
The mock data uses Node.js `fs.readFileSync()` which:
- Only works in API routes (server-side)
- Cannot be used in client components
- Requires files to be in the app's working directory
- Is synchronous (blocks execution)

### Production Replacement
In production, replace with:
- Real database (PostgreSQL, MongoDB, etc.)
- Authentication service (Auth0, Firebase, etc.)
- API endpoints with proper security
- Data validation and sanitization
- Error handling and logging

## Statistics

### Current Data Summary
- **Users:** 10 accounts (1 admin, 3 managers, 6 users)
- **Products:** 10 items (7 electronics, 3 furniture)
- **Orders:** 10 orders (5 completed, 3 shipped, 2 pending)
- **Total Revenue:** $3,479.75
- **Average Order Value:** $347.98
- **Total Stock Value:** $17,589.10

### Popular Products (by order count)
1. Wireless Bluetooth Headphones - 3 orders
2. Portable Power Bank - 2 orders
3. Smart Fitness Watch - 2 orders
4. Ergonomic Office Chair - 2 orders
5. Others - 1 order each

### Top Customers (by order count)
1. John Doe - 2 orders ($409.96)
2. Alice Brown - 2 orders ($1,029.96)
3. Bob Wilson - 2 orders ($509.96)
4. Diana Miller - 2 orders ($959.94)
5. Others - 1 order each

## See Also

- [Data Sharing Between Services](DataSharing.md)
- [API Routes Documentation](../apps/*/app/api/README.md)
- [Authentication Flow](Authentication.md)
