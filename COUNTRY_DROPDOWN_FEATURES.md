u
1# Country Dropdown Feature

## Overview
The country dropdown component has been implemented to replace the simple text input for country selection in the profile section. This provides a better user experience with search functionality and validation.

## Features

### 1. Comprehensive Country List
- Includes 195+ countries from around the world
- Countries are sorted alphabetically for easy navigation
- Covers all major countries and territories

### 2. Search Functionality
- **Real-time filtering**: As you type, countries are filtered instantly
- **Case-insensitive search**: Works regardless of capitalization
- **Partial matching**: Finds countries that contain the search term anywhere in the name
- **Auto-focus**: Search input is automatically focused when dropdown opens

### 3. User Experience
- **Click outside to close**: Dropdown closes when clicking outside
- **Keyboard navigation**: Full keyboard support for accessibility
- **Visual feedback**: Selected country is highlighted with a checkmark
- **Responsive design**: Works well on all screen sizes

### 4. Search Behavior
- When you type "I", all countries starting with "I" will be shown:
  - Iceland
  - India
  - Indonesia
  - Iran
  - Iraq
  - Ireland
  - Israel
  - Italy
  - Ivory Coast

## Implementation Details

### Component Location
- **File**: `components/ui/country-dropdown.tsx`
- **Usage**: Integrated into `components/cybersecurity-assessment-form.tsx`

### Props
```typescript
interface CountryDropdownProps {
  value: string;                    // Current selected value
  onChange: (value: string) => void; // Callback when selection changes
  className?: string;               // Optional CSS classes
  placeholder?: string;             // Placeholder text (default: "Select your country")
}
```

### Integration
The dropdown is integrated with React Hook Form for proper form validation and state management.

## Testing
A comprehensive test suite is included in `components/ui/country-dropdown.test.tsx` that covers:
- Rendering with placeholder text
- Displaying selected values
- Dropdown opening/closing
- Search functionality
- Selection callbacks

## Styling
The component uses Tailwind CSS classes and matches the existing design system:
- Primary color: `#3B3FA1`
- Consistent with other form elements
- Hover and focus states
- Smooth transitions and animations 