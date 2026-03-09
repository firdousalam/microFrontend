# ⚠️ YOU MUST RESTART THE SERVERS NOW

## Current Error

```
GET http://localhost:3000/_next/static/chunks/app-pages-internals.js 
net::ERR_ABORTED 404 (Not Found)
```

## What This Means

The browser is trying to load Next.js internal files, but:
1. The Shell configuration was just updated
2. The servers are still running with OLD configuration
3. The `.next` build directories have OLD files
4. The new configuration hasn't taken effect yet

## Why You're Seeing This

You updated the Shell's `next.config.js` but **didn't restart the servers**. Configuration changes ONLY take effect after restart.

## The Fix (DO THIS NOW)

### 1. Stop ALL Servers
In your terminal where `npm run dev` is running:
```
Press Ctrl + C
```

Wait until you see the terminal prompt return.

### 2. Clear ALL Cache
```bash
npm run clean
```

This removes all `.next` directories.

### 3. Restart ALL Servers
```bash
npm run dev
```

### 4. Wait for Compilation
You MUST wait until you see:
```
✓ Ready in X.Xs
- Local:        http://localhost:3000
- Local:        http://localhost:3001
- Local:        http://localhost:3002
- Local:        http://localhost:3003
- Local:        http://localhost:3004
```

This takes 30-60 seconds. **DO NOT** try to access pages before this.

### 5. Hard Refresh Browser
After servers are ready:
```
Ctrl + Shift + R  (Chrome/Edge)
Ctrl + F5         (Firefox)
```

### 6. Test Again
```
http://localhost:3000/sales/1
```

Should work now with NO errors in console.

## Why Restart is MANDATORY

### Configuration Changes Require Restart

When you change `next.config.js`:
- Next.js needs to reload the configuration
- Build system needs to regenerate files
- Route handlers need to be re-registered
- Static assets need to be rebuilt

**None of this happens while servers are running.**

### What Happens During Restart

1. **Stop**: Servers shut down, release ports
2. **Clean**: Old `.next` directories deleted
3. **Start**: Servers start with NEW configuration
4. **Scan**: Next.js scans for all pages and routes
5. **Build**: Static assets generated for all routes
6. **Ready**: Servers ready to serve requests

## Common Mistakes

### ❌ Mistake: Updating config without restart
```bash
# Edit next.config.js
# Try to access page immediately
# Get 404 errors
```

### ✅ Correct: Update config then restart
```bash
# Edit next.config.js
# Stop servers (Ctrl+C)
npm run clean
npm run dev
# Wait for "Ready"
# Access page
```

### ❌ Mistake: Not waiting for compilation
```bash
npm run dev
# Immediately try http://localhost:3000/sales/1
# Get errors because compilation not done
```

### ✅ Correct: Wait for "Ready" message
```bash
npm run dev
# Wait for "✓ Ready" for ALL 5 services
# Then access pages
```

## How to Know Restart Worked

### Check Terminal Output
You should see:
```
✓ Ready in 3.2s
○ Compiling /sales/[id] ...
✓ Compiled /sales/[id] in 1.2s
```

### Check Browser Console (F12)
- Network tab shows 200 OK for all files
- No 404 errors
- No red errors in console

### Check Page Loads
- Page displays correctly
- No error messages
- All features work (print, download, etc.)

## If Still Getting Errors After Restart

### 1. Verify All Servers Stopped
```bash
# Check if any process is using ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3002
netstat -ano | findstr :3003
netstat -ano | findstr :3004
```

If you see any output, kill those processes:
```bash
taskkill /PID <PID> /F
```

### 2. Verify Cache Cleared
```bash
# Check if .next directories exist
ls apps/shell/.next
ls apps/sales/.next
ls apps/product/.next
ls apps/dashboard/.next
ls apps/auth/.next
```

If they exist, delete them:
```bash
Remove-Item -Recurse -Force apps/*/.next
```

### 3. Verify Configuration Saved
Open `apps/shell/next.config.js` and verify it has:
```javascript
async rewrites() {
    return {
        beforeFiles: [
            // Sales _next assets
            {
                source: '/sales/_next/:path*',
                destination: 'http://localhost:3004/sales/_next/:path*',
            },
            // ... other services
        ],
        afterFiles: [
            // ... routes
        ],
    };
}
```

### 4. Clear Browser Cache
```
Ctrl + Shift + Delete
Select "Cached images and files"
Clear data
```

### 5. Try Incognito/Private Window
Open a new incognito window and test:
```
http://localhost:3000/sales/1
```

This ensures no browser cache interference.

## Timeline

Here's what should happen:

**T+0s**: Stop servers (Ctrl+C)
**T+5s**: Run `npm run clean`
**T+15s**: Run `npm run dev`
**T+45s**: See "✓ Ready" for all services
**T+50s**: Access http://localhost:3000/sales/1
**T+52s**: Page loads successfully ✅

Total time: ~1 minute

## After Successful Restart

You should be able to:
- ✅ Access all sales order details pages
- ✅ Access all product details pages
- ✅ Print invoices and spec sheets
- ✅ Download invoices and spec sheets
- ✅ Navigate between all pages
- ✅ See NO errors in browser console

## Bottom Line

**The configuration change WILL NOT work until you restart.**

There is no way around this. You must:
1. Stop servers
2. Clear cache
3. Restart servers
4. Wait for compilation
5. Test

Do it now, and everything will work! 🎉
