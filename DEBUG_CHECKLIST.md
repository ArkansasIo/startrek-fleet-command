# Star Trek Fleet Command - Debug Checklist

## 🔍 Current Status
- **Build Status**: ✅ No compilation errors
- **Dev Server**: ✅ Running on port 3000
- **Component Structure**: ✅ Fixed (UniverseMaps Tabs layout corrected)
- **Imports**: ✅ All verified and working

---

## 🧪 Testing Guide

### 1. **Browser Console Check**
Open Dev Tools (F12) and check:
- [ ] No red console errors
- [ ] No network request failures (check Network tab)
- [ ] Audio context initializes properly
- [ ] No undefined variable warnings

**Console Test Commands:**
```javascript
// Test page is loaded
console.log('App loaded:', document.readyState);

// Check if React is mounted
console.log('Root element:', document.getElementById('root'));

// Verify no runtime errors
window.addEventListener('error', (e) => console.error('Runtime Error:', e.message));
```

---

### 2. **Component Load Tests**

#### SplashScreen
- [ ] Splash screen displays on initial load
- [ ] Loading progress bar animates (0-100%)
- [ ] Phase transitions: Engine → Credits → Complete
- [ ] Skip button works
- [ ] Mute button toggles audio
- [ ] "Begin Your Journey" button completes splash

#### Login/Title Menu
- [ ] StarTrek Title Menu displays after splash
- [ ] Sample officer login works (demo credentials)
- [ ] New Game button shows prolog
- [ ] Login form validation works

#### Universe Maps
- [ ] Tabs render correctly (Overview, Quadrants, Sectors, Systems, Routes, Game)
- [ ] Overview tab shows statistics
- [ ] Quadrants tab displays map
- [ ] Systems tab searches and filters
- [ ] Game tab shows player resources, buildings, fleet

#### Dashboard
- [ ] Navigation menu loads
- [ ] All menu items are clickable
- [ ] Menu doesn't cause crashes

---

### 3. **Data/State Tests**

#### MMORPG Game Engine
- [ ] `createInitialPlayer()` creates valid player object
- [ ] Player has all required fields (resources, buildings, fleets, log)
- [ ] `processTurnArray()` processes turns without errors
- [ ] GameStateArray structure is valid

#### OGame Mechanics
- [ ] `BUILDINGS` array is populated (should have 7+ items)
- [ ] `FLEET_UNITS` array is populated (should have 4+ items)
- [ ] `RESEARCHES` array is populated
- [ ] `initialResources` has all resource types

**Test in Console:**
```javascript
// Import and test (if accessible from console)
import { BUILDINGS, FLEET_UNITS } from './lib/OGameMechanics';
console.log('Buildings:', BUILDINGS);
console.log('Fleet Units:', FLEET_UNITS);
```

---

### 4. **UI/UX Tests**

#### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Sidebar collapses on mobile
- [ ] Footer displays correctly on all sizes

#### Dark Mode (Trek Theme)
- [ ] Colors match Star Trek LCARS design
- [ ] Text contrast is readable (WCAG AA)
- [ ] Trek blue, gold, red colors are present
- [ ] No harsh white backgrounds

#### Accessibility
- [ ] Tab navigation works
- [ ] Buttons are keyboard accessible
- [ ] Tooltips appear on hover
- [ ] Icons have alt text or labels

---

### 5. **Audio System Tests**

#### Splash Screen Audio
- [ ] Audio file loads without CORS errors
- [ ] Mute button silences audio
- [ ] Volume control visible
- [ ] Audio plays when not muted

#### Background Audio
- [ ] Navigation audio plays (if implemented)
- [ ] Combat audio effects work
- [ ] Audio doesn't loop excessively

---

### 6. **Performance Tests**

#### Load Time
- [ ] Page loads in under 3 seconds
- [ ] Initial render completes quickly
- [ ] No layout shift after load

#### Runtime Performance
- [ ] No excessive re-renders
- [ ] Smooth animations and transitions
- [ ] No memory leaks (check Task Manager)
- [ ] Responsive to user input

**Chrome DevTools Lighthouse Test:**
```
Performance: >90
Accessibility: >90
Best Practices: >90
SEO: >90
```

---

### 7. **Common Issues to Check**

#### Import/Module Errors
- [ ] All `@/` imports resolve correctly
- [ ] Component imports use correct paths
- [ ] UI components import from `/ui/`
- [ ] Library imports use `/lib/`

**Check Browser Console for:**
```
Module not found: Can't resolve '@/...'
Cannot find module './...'
Import does not exist in ...
```

#### State Management Issues
- [ ] Player state initializes with empty object check
- [ ] Game state updates properly on turn
- [ ] Resources update without errors
- [ ] Building/research queues work

#### Null/Undefined Errors
- [ ] Check `getCurrentQuadrant()` returns valid object
- [ ] Check `getCurrentSector()` returns valid object
- [ ] Array `.map()` calls have valid items
- [ ] Optional chaining `?.` used where needed

---

### 8. **Network/API Tests**

#### Dev Server
- [ ] `http://localhost:3000` loads the app
- [ ] `/health` endpoint returns 200
- [ ] `/api/ping` endpoint works
- [ ] Static files serve correctly

**Test Endpoints:**
```bash
curl http://localhost:3000/health
curl http://localhost:3000/api/ping
```

#### Database
- [ ] App works in mock mode (no DB required)
- [ ] Database connection errors are logged
- [ ] Fallback to mock mode works

---

### 9. **Feature-Specific Tests**

#### Fleet Combat
- [ ] Fleet selection works
- [ ] Combat calculation doesn't error
- [ ] Battle results display correctly

#### Procedural Generation
- [ ] Universe seeds generate consistently
- [ ] Planet generation completes
- [ ] Biome map generation works

#### Character Database
- [ ] Characters load and display
- [ ] Search/filter works
- [ ] Character details modal opens

#### Talent Tree
- [ ] Professions load
- [ ] Talent points can be allocated
- [ ] Restrictions are enforced

---

### 10. **Browser Compatibility**

Test on:
- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Known Issues:**
- IE 11: Not supported (ES6+ features used)
- Mobile browsers: Test on actual devices if possible

---

## 🐛 Common Fixes

### Issue: "Cannot read property 'x' of undefined"
**Cause:** Missing null check  
**Fix:** Use optional chaining `object?.property`
```typescript
// ❌ Bad
const x = object.property.x;

// ✅ Good
const x = object?.property?.x;
```

### Issue: "BUILDINGS is not defined"
**Cause:** Import not found  
**Fix:** Check import path in OGameMechanics
```typescript
import { BUILDINGS, FLEET_UNITS } from '../../lib/OGameMechanics';
```

### Issue: Audio not playing
**Cause:** Browser autoplay policy  
**Fix:** Add user interaction first
```typescript
// Move audio play to button click
button.onClick = () => audioRef.current?.play();
```

### Issue: Tabs content not showing
**Cause:** Tab value mismatch  
**Fix:** Ensure TabsContent value matches TabsTrigger value
```typescript
<TabsTrigger value="game" />
<TabsContent value="game" /> // Must match!
```

---

## 📊 Performance Metrics to Track

- **First Contentful Paint (FCP)**: < 2s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Memory Usage**: < 100MB
- **CPU Usage**: < 50% at rest

---

## 📝 Logging Strategy

### Enable Debug Logging
Add to console for diagnostics:
```typescript
// Client-side debugging
localStorage.setItem('debug', 'true');

// Server-side debugging (Node)
process.env.DEBUG = 'true';
```

### Key Log Points
1. App initialization
2. Component mounting/unmounting
3. State changes
4. API calls
5. Error boundaries
6. Performance metrics

---

## ✅ Pre-Launch Checklist

- [ ] All tests pass
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] All features working
- [ ] Responsive design verified
- [ ] Audio system functional
- [ ] Database fallback working
- [ ] Error handling in place
- [ ] Security checks passed
- [ ] Version bumped if needed

---

## 🆘 Emergency Troubleshooting

### App won't load
1. Check browser console (F12)
2. Check dev server is running
3. Clear browser cache (Ctrl+Shift+Del)
4. Restart dev server

### Components not rendering
1. Check imports are correct
2. Verify component paths exist
3. Check React DevTools for component tree
4. Look for error boundaries

### State not updating
1. Check useState dependencies
2. Verify state setter is called
3. Check for immutability issues
4. Use React DevTools Profiler

### Styles not showing
1. Check Tailwind CSS compilation
2. Verify CSS classes exist
3. Check for class name conflicts
4. Review z-index stacking

---

## 📞 Debug Commands

```bash
# Start dev server with verbose logging
pnpm dev --verbose

# Run TypeScript type check
pnpm tsc --noEmit

# Check for unused code
pnpm build

# Lint code
pnpm lint

# Test build
pnpm build && pnpm preview
```

---

**Last Updated:** February 3, 2026  
**Status:** ✅ All systems operational
