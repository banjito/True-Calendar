# Plan: Gesture‑Based Time‑Frame Selector (Bottom Section)

### Goal
Add a gesture‑controlled, "clicky" time‑frame selector at the bottom of the screen that lets users swipe to zoom between:
- **Month** (current default)
- **2 weeks** 
- **Week**
- **Day**

Swipe **right → left** = zoom **in** (Month → 2 weeks → Week → Day)  
Swipe **left → right** = zoom **out** (Day → Week → 2 weeks → Month)

The selected view should persist across app restarts.

---

### High‑level approach

1. **Add a new state** for the current view mode (`'month' | 'twoweeks' | 'week' | 'day'`) and persist it in `AsyncStorage`.
2. **Create a gesture handler** using `react-native-gesture-handler`'s `PanGestureHandler` (or `Swipeable` if preferred) attached to the bottom info area.
3. **Render different calendar layouts** based on the view mode:
   - Month: current grid (no change)
   - 2 weeks: two rows of 7 days
   - Week: single row of 7 days
   - Day: detailed hourly view for the selected date
4. **Add visual feedback**:
   - Small dots/indicators showing current level
   - Haptic feedback on level change
   - Smooth animation between views
5. **Update the bottom info area** to always show the current date range for the selected view.

---

### Detailed implementation plan

#### 1. Types & storage
- Add `ViewMode` type to `utils/storage.ts`
- Add `saveViewMode` / `loadViewMode` helpers (similar to events)

#### 2. State & persistence in `CalendarScreen`
- Add `viewMode` state with persistence via `useEffect`
- Load on mount, save on change

#### 3. Gesture handling
- Wrap the bottom `selectedDateInfo` area in `PanGestureHandler`
- Detect horizontal swipe direction and velocity
- On swipe right→left: zoom in if not already at 'day'
- On swipe left→right: zoom out if not already at 'month'
- Trigger haptic feedback (`expo-haptics`)

#### 4. View‑mode rendering
- Create helper functions:
  - `getDaysForView(mode, currentDate)` → returns array of dates to display
  - `getViewTitle(mode, dates)` → returns string like "Jan 2025", "Jan 1–14, 2025", etc.
- Conditionally render:
  - Month: existing `daysGrid`
  - 2 weeks/Week: similar grid but fewer rows
  - Day: new hourly timeline component

#### 5. Visual indicators
- No visible indicators - this is a hidden gesture
- Use haptic feedback to provide tactile confirmation when switching views
- Add subtle visual feedback in the bottom area during swipe (e.g., slight opacity change or border highlight)

#### 6. UI polish
- Keep the existing FAB and modal unchanged
- Ensure the bottom area expands/contracts smoothly
- Add subtle borders/dividers to make the gesture area obvious

---

### Files to modify/create

| File | Change |
|------|--------|
| `utils/storage.ts` | Add `ViewMode` type + persistence helpers |
| `screens/CalendarScreen.tsx` | Add gesture handler, view state, conditional rendering |
| `package.json` | Add `expo-haptics` if not already present |
| `styles/` (optional) | Add styles for day view, indicators, transitions |

---

### Risks & mitigations

- **Gesture conflicts** with existing touchables → limit gesture area to the bottom info section only.
- **Performance** with day view (many hour slots) → virtualize if needed later.
- **State sync** between view mode and selected date → ensure `currentDate` updates appropriately when switching views.

---

### Success criteria

- Swiping right→left in the bottom area cycles: Month → 2 weeks → Week → Day
- Swiping left→right cycles back
- The selected view persists after app restart
- Haptic feedback clearly indicates view changes
- The interaction feels "clicky" with haptic feedback and smooth transitions

---

### Next steps

1. Create this markdown file in `/docs/GESTURE_TIMEFRAME_SELECTOR.md`
2. Begin implementation with storage helpers
3. Add gesture handling to `CalendarScreen`
4. Implement view‑mode rendering logic
5. Add haptic feedback and subtle swipe visual polish

Ready to proceed with implementation?