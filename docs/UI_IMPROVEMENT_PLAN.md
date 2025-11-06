# True Calendar UI Improvement Plan

## Current Issues
- Calendar appears small on iPhone devices
- White area at the top of the screen (status bar/safe area issue)
- Overall unbalanced and ugly appearance
- Basic functionality lacking genuine calendar features

## Goals
- Create a balanced, full-screen calendar view optimized for mobile
- Fix safe area handling for consistent black background
- Add essential calendar features for a functional app
- Maintain TrueCSS minimal design philosophy

## UI Fixes

### 1. Safe Area and Status Bar
- Ensure SafeAreaView has black background
- Set StatusBar style to light-content for white text on black
- Handle iPhone notch and home indicator properly

### 2. Calendar Layout Improvements
- Remove ScrollView from calendar grid to allow natural sizing
- Adjust day cell dimensions: increase height, maintain aspect ratio
- Improve header spacing and typography
- Add proper padding and margins for mobile screens

### 3. Visual Balance
- Center calendar content vertically when possible
- Improve touch targets for navigation buttons
- Enhance selected/today date styling
- Add subtle shadows or borders for depth

## Feature Additions

### 1. Event Management
- Add event creation modal
- Store events locally (AsyncStorage)
- Display events on calendar dates
- Event details view

### 2. Multiple Views
- Month view (current)
- Week view
- Day view with agenda

### 3. Enhanced Navigation
- Today button to jump to current date
- Year/month picker
- Swipe gestures for month navigation

### 4. Additional Features
- Recurring events
- Event categories/colors
- Search functionality
- Settings screen

## Technical Considerations

### Library Integration
- Evaluate react-native-calendars for better calendar component
- Consider date-fns for date manipulation
- Add AsyncStorage for data persistence

### Performance
- Optimize calendar rendering for large date ranges
- Implement virtualized lists for event lists
- Minimize re-renders with proper state management

## Implementation Phases

### Phase 1: UI Fixes (High Priority)
- Fix safe area and status bar styling
- Improve calendar grid layout and sizing
- Enhance visual balance and spacing

### Phase 2: Core Features (Medium Priority)
- Add event creation and storage
- Implement event display on calendar
- Add week/day views

### Phase 3: Polish (Low Priority)
- Add advanced features (recurring events, search)
- Performance optimizations
- Settings and customization

## Testing
- Test on various iPhone models (SE, 12, 14 Pro Max)
- Verify landscape orientation
- Check accessibility features
- Performance testing with many events

## Design Principles
- Maintain TrueCSS: black/white/gray only
- Keep minimal, distraction-free interface
- Prioritize content and functionality over decoration
- Ensure consistent spacing and typography</content>
<parameter name="filePath">/Users/cohn/Personal Projects/True Calendar/UI_IMPROVEMENT_PLAN.md