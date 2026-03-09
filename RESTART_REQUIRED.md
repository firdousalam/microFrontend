# ⚠️ Dev Servers Need to be Restarted

## Current Issue

You're seeing this error:
```
GET http://localhost:3000/_next/static/chunks/app/sales/%5Bid%5D/page.js 
net::ERR_ABORTED 404 (Not Found)
```

## Why This Happens

This error occurs because:
1. New pages were created (`/sales/[id]` and `/products/[id]`)
2. The Next.js dev servers are still running with old build cache
3. The servers don't know about the new dynamic routes yet
4. Static assets for these new pages haven't been generated

## Solution

You need to restart all dev servers to rebuild the `.next` directories.

### Option 1: Quick Restart (Recommended)

```bash
# Stop all servers (Ctrl+C in terminal)
# Then run:
npm run clean
npm run dev
```

### Option 2: Manual Restart

```bash
# 1. Stop all dev servers (Ctrl+C)

# 2. Clear Next.js cache
Remove-Item -Recurse -Force apps/sales/.next
Remove-Item -Recurse -Force apps/product/.next
Remove-Item -Recurse -Force apps/dashboard/.next
Remove-Item -Recurse -Force apps/shell/.next

# 3. Restart servers
npm run dev
```

### Option 3: PowerShell Script

```powershell
.\restart-dev.ps1
```

## What Will Be Fixed

After restarting, these pages will work:
- ✅ http://localhost:3000/sales/1 (Order details with invoice)
- ✅ http://localhost:3000/sales/2 (Order details with invoice)
- ✅ http://localhost:3000/products/1 (Product details with spec sheet)
- ✅ http://localhost:3000/products/2 (Product details with spec sheet)
- ✅ All navigation links
- ✅ Print and download features

## New Features Added

Since the last restart, we've added:

### 1. Sales Order Details Page
- Full invoice display
- Print invoice button
- Download invoice button
- Customer information
- Order items table
- Navigation links

### 2. Product Details Page
- Complete product information
- Print spec sheet button
- Download spec sheet button
- Sales history table
- Stock status
- Navigation links

### 3. Navigation Links
- Dashboard → Products, Sales
- Products → Dashboard, Sales
- Sales → Dashboard, Products
- All detail pages have back links

## Verification Steps

After restarting, test these:

1. **Sales Order Details:**
   ```
   http://localhost:3000/sales
   Click "View Details" on any order
   Should load order details page
   ```

2. **Product Details:**
   ```
   http://localhost:3000/products
   Click "View Details" on any product
   Should load product details page
   ```

3. **Print Features:**
   - Click "🖨️ Print Invoice" on order details
   - Click "🖨️ Print Spec Sheet" on product details
   - Both should open print dialog

4. **Download Features:**
   - Click "📥 Download Invoice" on order details
   - Click "📥 Download Spec Sheet" on product details
   - Both should download text files

5. **Navigation:**
   - Test all navigation links
   - Verify they go to correct pages
   - Check breadcrumbs work

## Common Issues After Restart

### Issue: Port Already in Use

**Solution:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Repeat for ports 3001-3004 if needed
```

### Issue: Module Not Found

**Solution:**
```bash
# Reinstall dependencies
npm install

# Then restart
npm run dev
```

### Issue: Still Getting 404

**Solution:**
1. Make sure ALL servers are stopped
2. Clear browser cache (Ctrl+Shift+Delete)
3. Clear all .next directories
4. Restart servers
5. Hard refresh browser (Ctrl+F5)

## Expected Behavior

After successful restart:

### Sales List Page
- Shows 10 orders in table
- "View Details" links work
- Navigation links at top

### Order Details Page
- Shows complete invoice
- Print button works
- Download button works
- Back link works

### Products List Page
- Shows 10 products in table
- "View Details" links work
- Navigation links at top

### Product Details Page
- Shows complete product info
- Shows sales history
- Print button works
- Download button works
- Back link works

## Files Created/Modified

Since last restart:
- ✅ `apps/sales/app/sales/[id]/page.tsx` (NEW)
- ✅ `apps/product/app/products/[id]/page.tsx` (NEW)
- ✅ `apps/sales/app/sales/page.tsx` (UPDATED - table view)
- ✅ `apps/product/app/products/page.tsx` (UPDATED - table view)
- ✅ `apps/dashboard/app/page.tsx` (UPDATED - navigation)
- ✅ `apps/dashboard/app/dashboard/page.tsx` (UPDATED - navigation)

## Time to Restart

Typical restart time:
- Stopping servers: 5 seconds
- Clearing cache: 10 seconds
- Starting servers: 30-60 seconds
- Total: ~1-2 minutes

## After Restart

Once servers are running, you should see:
```
✓ Ready in 3.2s
- Local:        http://localhost:3000
- Local:        http://localhost:3001
- Local:        http://localhost:3002
- Local:        http://localhost:3003
- Local:        http://localhost:3004
```

Then navigate to:
- http://localhost:3000/dashboard
- http://localhost:3000/products
- http://localhost:3000/sales

Everything should work perfectly! 🎉

## Need Help?

See these documents:
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Detailed troubleshooting
- [START_HERE.md](START_HERE.md) - Quick start guide
- [QUICK_START.txt](QUICK_START.txt) - Visual guide
