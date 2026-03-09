# Fix 404 Issue on Sales/Product Details Pages

## The Problem

When clicking "View Details" on sales or products pages, you get a 404 error:
- `/sales/1` → 404 Not Found
- `/products/1` → 404 Not Found

## Root Cause

The dynamic route pages (`[id]`) were created but the Next.js dev servers haven't been restarted to build them. The servers are still running with old cache that doesn't know about these new pages.

## The Solution

**You MUST restart the dev servers.** There's no way around this - Next.js needs to rebuild to recognize the new dynamic routes.

### Step-by-Step Fix

#### 1. Stop All Dev Servers

In your terminal where `npm run dev` is running:
- Press `Ctrl + C`
- Wait for all processes to stop
- You should see the terminal prompt return

#### 2. Clear the Cache

Run this command:
```bash
npm run clean
```

This will remove all `.next` directories from all apps.

#### 3. Restart Dev Servers

```bash
npm run dev
```

Wait for all 5 services to compile. You'll see messages like:
```
✓ Ready in 3.2s
- Local:        http://localhost:3000
- Local:        http://localhost:3001
- Local:        http://localhost:3002
- Local:        http://localhost:3003
- Local:        http://localhost:3004
```

#### 4. Test the Fix

1. Go to: http://localhost:3000/sales
2. Click "View Details" on any order
3. Should now load the order details page ✅

## Why Restart is Required

### What Happens During Restart

1. **Cache Cleared**: Old `.next` directories are deleted
2. **Routes Discovered**: Next.js scans for all page files including `[id]` folders
3. **Build Process**: Static assets are generated for all routes
4. **Server Ready**: Dev servers now know about the new dynamic routes

### What Doesn't Work Without Restart

- ❌ Dynamic routes (`/sales/[id]`, `/products/[id]`)
- ❌ Static assets for new pages
- ❌ Hot module replacement for new files
- ❌ API routes in new folders

## Verification Checklist

After restarting, verify these work:

### Sales Pages
- [ ] http://localhost:3000/sales - List page loads
- [ ] Click "View Details" - Goes to order details
- [ ] http://localhost:3000/sales/1 - Direct URL works
- [ ] Print button works
- [ ] Download button works

### Product Pages
- [ ] http://localhost:3000/products - List page loads
- [ ] Click "View Details" - Goes to product details
- [ ] http://localhost:3000/products/1 - Direct URL works
- [ ] Print button works
- [ ] Download button works

### Navigation
- [ ] All navigation links work
- [ ] Back buttons work
- [ ] Dashboard links work

## Common Mistakes

### ❌ Mistake 1: Not Stopping Servers First
**Wrong:**
```bash
npm run clean  # While servers are still running
```

**Right:**
```bash
# Stop servers first (Ctrl+C)
npm run clean
npm run dev
```

### ❌ Mistake 2: Only Clearing One App
**Wrong:**
```bash
Remove-Item apps/sales/.next  # Only sales
```

**Right:**
```bash
npm run clean  # Clears all apps
```

### ❌ Mistake 3: Not Waiting for Full Compilation
**Wrong:**
- Start servers
- Immediately try to access pages
- Get 404 because compilation isn't done

**Right:**
- Start servers
- Wait for "✓ Ready" messages for all 5 services
- Then access pages

## Alternative: Restart Individual Service

If you only want to restart the sales service:

```bash
# In a separate terminal
cd apps/sales
Remove-Item -Recurse -Force .next
npm run dev
```

But it's better to restart all services to ensure consistency.

## Still Getting 404?

If you still get 404 after restarting, check:

### 1. Verify File Exists
```bash
# Check if the file exists
ls apps/sales/app/sales/[id]/page.tsx
```

Should show the file. If not, the file wasn't created properly.

### 2. Check File Structure
```
apps/sales/app/sales/
├── page.tsx          ← List page
└── [id]/
    └── page.tsx      ← Details page (must be in [id] folder)
```

### 3. Verify Server is Running
Check terminal output - should see:
```
- Local:        http://localhost:3004
```

If not, the sales service didn't start.

### 4. Check Browser Console
Open DevTools (F12) and check for errors:
- Red errors indicate problems
- Look for specific error messages

### 5. Try Direct Access
Instead of clicking link, type URL directly:
```
http://localhost:3000/sales/1
```

If this works but clicking doesn't, there might be a JavaScript error.

### 6. Hard Refresh Browser
```
Ctrl + Shift + R  (Chrome/Edge)
Ctrl + F5         (Firefox)
```

This clears browser cache.

## Technical Explanation

### Why Dynamic Routes Need Restart

Next.js uses file-system based routing:
- `page.tsx` → `/sales`
- `[id]/page.tsx` → `/sales/:id`

When you create a new `[id]` folder:
1. Next.js doesn't automatically detect it while running
2. The build system needs to rescan the file structure
3. Static assets need to be generated
4. Route handlers need to be registered

This only happens during startup, not during hot reload.

### What Gets Built

For `/sales/[id]/page.tsx`, Next.js creates:
- Route handler for `/sales/:id`
- JavaScript chunks for the page
- CSS for the page
- Metadata for the route
- Type definitions

All of this requires a full rebuild.

## Prevention

To avoid this in the future:

### 1. Create Routes Before Starting
Create all your route files before running `npm run dev`

### 2. Use Turbo Watch
Turbo can watch for new files, but still requires restart for routes

### 3. Plan Route Structure
Design your routes upfront to minimize restarts

## Summary

**The fix is simple:**
1. Stop servers (Ctrl+C)
2. Run `npm run clean`
3. Run `npm run dev`
4. Wait for compilation
5. Test the pages

**This is required because:**
- Dynamic routes need to be discovered at build time
- Next.js doesn't hot-reload new route files
- Static assets must be generated
- The dev server must register the new routes

**After restart, everything will work!** 🎉
