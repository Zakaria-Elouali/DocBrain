# DocBrain SCSS Structure

This document outlines the optimized SCSS structure for the DocBrain application, designed to improve compilation speed and maintainability.

## Key Improvements

1. **Fixed Bootstrap Variables**: Added missing theme-colors-rgb variable definition
2. **Simplified Import Structure**: Reduced the number of import statements and file dependencies
3. **Consolidated Component Groups**: Merged views with components to reduce import chain length
4. **Optimized Layout Structure**: Moved structure imports from app.scss to layout/index.scss
5. **Reduced File Size**: Eliminated redundant imports and simplified the structure
6. **Modern Sass Syntax**: Updated from @import to @use/@forward for better performance
7. **Updated Color Functions**: Replaced deprecated functions like darken() with color.adjust()
8. **Optimized Vite Configuration**: Enhanced Sass processing settings for faster compilation

## Directory Structure

```
scss/
├── config/
│   └── minimal/
│       ├── _root.scss             # CSS variables for theming
│       ├── _variables-cleaned.scss # Base variables
│       ├── _variables-custom.scss  # Light mode variables
│       ├── _variables-dark.scss    # Dark mode variables
│       ├── app.scss               # Main app styles (simplified)
│       └── bootstrap.scss         # Bootstrap configuration with fixes
├── docBrain/
│   ├── layout/                    # Layout styles
│   │   └── _index.scss           # Imports all layout and structure styles
│   ├── _index.scss           # Imports all component and view styles
│   ├── _base.scss                # Base element styling
│   └── _utils.scss               # Utility mixins and functions
└── main.scss                     # Main entry point
```

## Changes Made to Improve Compilation Speed

1. **Fixed Bootstrap Variable Issue**:
   - Added proper definition for $theme-colors-rgb in bootstrap.scss
   - Fixed the error that was causing slow compilation
   - Ensured compatibility with Bootstrap's utilities

2. **Merged Views with Components**:
   - Combined view-specific styles into components/_index.scss
   - Eliminated the separate views/_index.scss file
   - Reduced the number of import chains

3. **Consolidated Layout Imports**:
   - Moved structure imports from app.scss to layout/_index.scss
   - Centralized all layout-related styles in one place
   - Simplified app.scss to reduce duplicate processing

4. **Simplified Main Entry Point**:
   - Reduced the number of imports in main.scss
   - Organized imports by functionality
   - Improved clarity and maintainability

5. **Optimized Build Process**:
   - Added load-path parameter to Sass compilation
   - Improved path resolution for imports
   - Configured Vite to handle SCSS compilation better

## Usage Guidelines

### Adding New Components

1. Create your component SCSS file in the appropriate directory
2. Add it to the components/_index.scss file using @import
3. No need to modify main.scss

Example:
```scss
// In docBrain/_index.scss
@import "../NewFeature/_newComponent";
```

### Adding New Layout Elements

1. Create your layout SCSS file in the appropriate directory
2. Add it to the layout/_index.scss file using @import
3. Group related imports together with comments

Example:
```scss
// In docBrain/layout/_index.scss
// New layout section
@import "../NewLayout/_newLayout";
```

## Best Practices for Fast Compilation

1. **Minimize Nesting**: Keep nesting to 3 levels or less
2. **Reduce File Size**: Split large files into smaller, focused files
3. **Group Related Styles**: Keep related styles together in the same file
4. **Avoid Deep Import Chains**: Import directly from the source when possible
5. **Use Comments**: Document the purpose of each file and section
6. **Avoid Duplicate Imports**: Don't import the same file multiple times
7. **Use CSS Variables**: For values that change with theme
8. **Minimize Mixins**: Use mixins only when necessary
9. **Use Modern Sass Syntax**: Use @use and @forward instead of @import
10. **Use Modern Color Functions**: Use color.adjust() instead of darken()/lighten()
11. **Disable Source Maps**: For faster development compilation
12. **Use Sass Modules**: Organize code into modules with clear namespaces

## Build Commands

```bash
# CSS compilation
npm run build:css         # Build CSS for production
npm run watch:css         # Watch CSS for development

# Sass migration
npm run sass:migrate      # Migrate Sass files to modern syntax

# Vite commands
npm run dev               # Start Vite development server
npm run build             # Build for production
```

### Development Workflow

1. Run `npm run dev` to start Vite in development mode
2. Vite will automatically compile your SCSS files
3. For manual SCSS compilation, use `npm run watch:css`
4. For production builds, run `npm run build:css` before `npm run build`

## Troubleshooting

### If you encounter slow compilation:

1. **Check for circular dependencies**: Look for files importing each other
2. **Check for deeply nested selectors**: Keep nesting to 3 levels or less
3. **Identify large files**: Split files larger than 300 lines
4. **Verify imports**: Make sure files aren't imported multiple times
5. **Check bootstrap.scss**: Ensure the theme-colors-rgb variable is properly defined
6. **Check for deprecated syntax**: Make sure all @import statements are replaced with @use/@forward
7. **Check for deprecated functions**: Replace darken()/lighten() with color.adjust()
8. **Disable source maps**: Use --no-source-map flag for faster compilation
9. **Check Vite config**: Ensure CSS preprocessing options are optimized

### If you encounter styling issues:

1. **Missing styles**: Check that the component is properly imported in components/_index.scss
2. **Layout issues**: Make sure layout/_index.scss is imported
3. **Theme issues**: Verify that _root.scss is being imported
4. **Bootstrap issues**: Check that bootstrap.scss is properly importing all necessary components
