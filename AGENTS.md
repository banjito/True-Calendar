# AGENTS.md - True Calendar

## Build/Lint/Test Commands
- **Start dev server**: `npm start`
- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`
- **Type check**: `npx tsc --noEmit`
- **No dedicated lint/test scripts** - use TypeScript strict checking
- **Note**: Current code has fontWeight type issues - use string literals like '400' instead of variables

## Code Style Guidelines

### Imports
- Single quotes for all imports
- Order: React → third-party → local imports
- Group related imports together

### Types & Interfaces
- Use TypeScript with strict mode enabled
- Define interfaces for complex objects
- Use union types for enums (e.g., `'none' | 'daily' | 'weekly'`)

### Components
- Functional components with hooks
- PascalCase naming
- Destructure props at component level
- Use `export default` for components

### Styling
- Use `StyleSheet.create()` for all styles
- Import from centralized style files: `colors`, `typography`, `spacing`, `borderRadius`
- Follow TrueCSS: black/white/gray color palette only
- Consistent spacing using base unit of 4px

### Naming Conventions
- camelCase: variables, functions, hooks
- PascalCase: components, interfaces, types
- UPPER_CASE: constants (rare)

### Error Handling
- Basic form validation with early returns
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- TypeScript strict null checks prevent most runtime errors

### Code Structure
- Keep components focused and single-responsibility
- Extract complex logic into custom hooks
- No comments - code should be self-documenting</content>
<parameter name="filePath">/Users/cohn/Personal Projects/True Calendar/AGENTS.md