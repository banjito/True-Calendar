# True Calendar

A clean, minimal calendar app following the TrueCSS design system.

## Features

- Monthly calendar view
- Date selection
- Event creation and management
- Event indicators on calendar dates
- Dark theme with black, white, and gray colors
- Clean, distraction-free interface
- Optimized for mobile devices

## Design System

This app follows the TrueCSS design philosophy:
- Pure black background (#000000)
- White primary text (#FFFFFF)
- Gray secondary elements (#808080)
- Minimal, consistent styling

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## File Structure

```
True Calendar/
├── App.tsx                 # Main app component
├── index.js               # App entry point
├── screens/
│   └── CalendarScreen.tsx # Calendar screen component
├── styles/
│   ├── colors.js         # Color constants
│   ├── typography.js     # Text styles
│   ├── spacing.js        # Spacing constants
│   ├── borderRadius.js   # Border radius values
│   └── index.js          # Style exports
├── assets/               # App assets
├── app.json             # Expo configuration
├── package.json         # Dependencies
└── tsconfig.json        # TypeScript config
```

## TrueCSS Guidelines

- **Colors**: Only black (#000000), white (#FFFFFF), and gray (#808080)
- **Typography**: System fonts with weights 300-600, sizes 12-32px
- **Spacing**: Base unit of 4px, consistent padding and margins
- **Minimalism**: Clean, distraction-free design
- **Consistency**: Same patterns across all components