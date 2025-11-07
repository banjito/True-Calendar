# True Calendar

A clean, minimal calendar app designed for productivity. Stay organized with recurring events, smart notifications, and gesture-based navigation - all in a distraction-free interface.

## ✨ Features

- **Multiple Calendar Views**: Monthly, 2-week, and weekly views with smooth gesture navigation
- **Recurring Events**: Daily, weekly, monthly patterns with flexible end dates
- **Smart Notifications**: Configurable reminders with snooze options (5min, 15min, 1hour)
- **Persistent Storage**: All events saved locally and synced across app sessions
- **TrueCSS Design**: Pure black, white, and gray minimal aesthetic
- **Mobile Optimized**: Clean interface designed for iPhone and iPad

## 📱 Screenshots

*Coming soon - check App Store for screenshots*

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- iOS Simulator or Android Emulator

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/cohn/true-calendar.git
   cd true-calendar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## 📖 Documentation

- [Support & FAQ](SUPPORT.md)
- [Privacy Policy](PRIVACY.md)
- [App Store Submission Guide](APP_STORE_SUBMISSION.md)

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