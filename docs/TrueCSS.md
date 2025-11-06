# TrueCSS Styling Guide

## Design Philosophy
A clean, minimal design system using only black, white, and gray colors. This creates a sophisticated, distraction-free user experience that works across all True apps.

## Color Palette

### Primary Colors
- **Background**: `#000000` (Pure Black)
- **Surface**: `#000000` (Black for cards, modals, inputs)
- **Primary Text**: `#FFFFFF` (Pure White)
- **Secondary Text**: `#808080` (Medium Gray)
- **Borders**: `#808080` (Medium Gray)
- **Accent/Interactive**: `#FFFFFF` (White for buttons, highlights)

### Semantic Colors
- **Success**: Not applicable (minimal theme)
- **Warning**: Not applicable (minimal theme)  
- **Error/Destructive**: `#FF3B30` (Red - use sparingly)
- **Info**: Not applicable (minimal theme)

## Typography System

### Font Weights
- **Light**: `300` (for large display text)
- **Normal**: `400` (body text)
- **Medium**: `500` (button text, subtitles)
- **Semibold**: `600` (headings, important text)

### Font Sizes
- **Display**: 32px (app headers, main titles)
- **Large**: 20px (modal titles, section headers)
- **Medium**: 18px (card titles, important labels)
- **Normal**: 16px (body text, input text)
- **Small**: 14px (secondary text, descriptions)
- **XSmall**: 12px (captions, progress text)

## Spacing System

### Base Unit: 4px
- **XS**: 4px, 8px
- **SM**: 12px, 16px
- **MD**: 20px, 24px
- **LG**: 32px, 40px
- **XL**: 48px, 56px

### Common Patterns
- **Card Padding**: 20px
- **Screen Padding**: 24px
- **Gap Between Elements**: 16px
- **Modal Padding**: 24px
- **Input Padding**: 12px

## Border Radius System

### Rounded Corners
- **Small**: 8px (buttons, inputs, cards)
- **Medium**: 12px (modals, larger containers)
- **Large**: 28px (floating action buttons)
- **Pill**: 16px (small circular elements)

## Component Patterns

### Container
```css
.container {
  flex: 1;
  background-color: #000000;
}
```

### Header
```css
.header {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  paddingHorizontal: 24;
  paddingVertical: 20;
  borderBottomWidth: 1;
  borderBottomColor: #808080;
}
```

### Card/Surface
```css
.card {
  background-color: #000000;
  borderWidth: 1;
  borderColor: #808080;
  borderRadius: 8;
  padding: 20;
  marginBottom: 16;
}
```

### Primary Button (White on Black)
```css
.primaryButton {
  background-color: #FFFFFF;
  borderRadius: 8;
  padding: 14;
  alignItems: center;
}

.primaryButtonText {
  color: #000000;
  fontSize: 16;
  fontWeight: '500';
}
```

### Secondary Button (Black with Border)
```css
.secondaryButton {
  background-color: #000000;
  borderWidth: 1;
  borderColor: #808080;
  borderRadius: 8;
  padding: 14;
  alignItems: center;
}

.secondaryButtonText {
  color: #FFFFFF;
  fontSize: 16;
  fontWeight: '500';
}
```

### Input Field
```css
.input {
  background-color: #000000;
  borderWidth: 1;
  borderColor: #808080;
  borderRadius: 8;
  padding: 12;
  fontSize: 16;
  color: #FFFFFF;
}
```

### Modal
```css
.modalOverlay {
  flex: 1;
  background-color: 'rgba(0, 0, 0, 0.85)';
  justify-content: 'center';
  alignItems: 'center';
}

.modalContent {
  background-color: #000000;
  borderWidth: 1;
  borderColor: #808080;
  borderRadius: 12;
  padding: 24;
  width: '80%';
  maxWidth: 400;
}
```

### Progress Bar
```css
.progressBarBackground {
  height: 4;
  background-color: #808080;
  borderRadius: 2;
}

.progressBarFill {
  height: '100%';
  background-color: #FFFFFF;
  borderRadius: 2;
}
```

### Floating Action Button
```css
.fab {
  position: 'absolute';
  right: 24;
  bottom: 40;
  width: 56;
  height: 56;
  borderRadius: 28;
  background-color: #FFFFFF;
  alignItems: 'center';
  justifyContent: 'center';
  shadowColor: '#FFFFFF';
  shadowOffset: { width: 0, height: 2 };
  shadowOpacity: 0.3;
  shadowRadius: 4;
}
```

## Text Styles

### Headings
```css
.headingLarge {
  fontSize: 32;
  fontWeight: '600';
  color: #FFFFFF;
}

.headingMedium {
  fontSize: 20;
  fontWeight: '600';
  color: #FFFFFF;
}

.headingSmall {
  fontSize: 18;
  fontWeight: '600';
  color: #FFFFFF;
}
```

### Body Text
```css
.bodyPrimary {
  fontSize: 16;
  fontWeight: '400';
  color: #FFFFFF;
}

.bodySecondary {
  fontSize: 14;
  fontWeight: '400';
  color: #808080;
}

.caption {
  fontSize: 12;
  fontWeight: '400';
  color: #808080;
}
```

## Interactive States

### Pressed/Active States
- Slightly reduce opacity: `opacity: 0.8`
- Maintain colors (no color changes)

### Disabled States
- Reduce opacity: `opacity: 0.5`
- Keep same colors

### Focus States (Web)
- Add subtle white outline: `borderColor: #FFFFFF`

## Shadow System
Use sparingly for emphasis:

### White Shadow (for dark backgrounds)
```css
.shadowWhite {
  shadowColor: '#FFFFFF';
  shadowOffset: { width: 0, height: 2 };
  shadowOpacity: 0.3;
  shadowRadius: 4;
}
```

## Animation Guidelines
- Keep animations subtle and fast
- Use fade transitions for modals: `0.2s`
- Use gentle scale for button presses: `0.95`
- Avoid complex animations that distract from content

## Accessibility Guidelines
- Ensure sufficient contrast (already built into this system)
- Use semantic font weights and sizes
- Maintain consistent touch targets (minimum 44px)
- Provide focus indicators for keyboard navigation

## Implementation Notes

### React Native
- Use `StyleSheet.create()` for performance
- Define colors as constants at the top of files
- Reuse common styles through style inheritance

### Web CSS
- Use CSS custom properties for colors:
```css
:root {
  --color-bg: #000000;
  --color-surface: #000000;
  --color-primary: #FFFFFF;
  --color-secondary: #808080;
  --color-border: #808080;
}
```

## File Organization
```
styles/
├── colors.js      # Color constants
├── typography.js  # Text styles
├── spacing.js    # Spacing constants
├── components.js  # Component styles
└── index.js      # Exports all styles
```

## Remember
- **Less is more** - avoid unnecessary visual elements
- **Consistency is key** - use the same patterns across all apps
- **Content first** - design should serve the content, not distract from it
- **Test on real devices** - ensure the minimal design works well in different lighting conditions