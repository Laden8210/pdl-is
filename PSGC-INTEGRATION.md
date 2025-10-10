# PSGC API Integration for PDL Management System

This document describes the integration of the Philippine Standard Geographic Code (PSGC) API for location management in the PDL (Person Deprived of Liberty) Management System.

## Overview

The PSGC API integration replaces hardcoded location data with dynamic, real-time data from the official Philippine government API. This ensures accurate and up-to-date location information for all provinces, cities/municipalities, and barangays across the Philippines.

## API Endpoints Used

- **Provinces**: `https://psgc.gitlab.io/api/provinces.json`
- **Cities/Municipalities**: `https://psgc.gitlab.io/api/cities-municipalities.json`
- **Barangays**: `https://psgc.gitlab.io/api/cities-municipalities/{cityCode}/barangays.json`

## Implementation

### 1. Custom Hook: `usePSGCLocation`

Location: `resources/js/hooks/usePSGCLocation.ts`

This custom React hook manages all PSGC API interactions and provides:

- **State Management**: Provinces, cities/municipalities, barangays, and loading states
- **API Calls**: Automatic fetching of location data
- **Error Handling**: Comprehensive error management
- **Cascading Selection**: Province → City → Barangay dependency handling

#### Key Features:

```typescript
const {
    provinces,                    // Array of all provinces
    citiesMunicipalities,        // Array of cities/municipalities for selected province
    barangays,                   // Array of barangays for selected city/municipality
    selectedProvince,            // Currently selected province code
    selectedCityMunicipality,    // Currently selected city/municipality code
    selectedBarangay,            // Currently selected barangay code
    loading,                     // Loading states for each API call
    error,                       // Error message if any
    handleProvinceChange,        // Function to handle province selection
    handleCityMunicipalityChange, // Function to handle city/municipality selection
    handleBarangayChange,        // Function to handle barangay selection
    getSelectedLocationNames,    // Function to get human-readable location names
    resetSelections,             // Function to reset all selections
} = usePSGCLocation();
```

### 2. Updated Components

#### Create PDL Information (`create-pdl-information.tsx`)

- Removed hardcoded South Cotabato location data
- Integrated PSGC hook for dynamic location selection
- Added loading states and error handling
- Updated form validation and submission

#### Update PDL Information (`update-pdl-information.tsx`)

- Integrated PSGC hook with existing data initialization
- Added automatic location selection based on existing PDL data
- Maintained backward compatibility with existing records

## Features

### 1. Dynamic Location Loading

- **Provinces**: Loaded automatically on component mount
- **Cities/Municipalities**: Loaded when a province is selected
- **Barangays**: Loaded when a city/municipality is selected

### 2. Loading States

- Visual indicators for each loading state
- Disabled dropdowns during loading
- Loading spinners and progress messages

### 3. Error Handling

- Network error detection and user-friendly messages
- Fallback options when API is unavailable
- Graceful degradation of functionality

### 4. User Experience

- Cascading dropdowns (Province → City → Barangay)
- Clear dependency messaging
- Intuitive selection flow
- Form validation integration

## Data Structure

### Province Object
```typescript
interface Province {
    code: string;        // PSGC code (e.g., "126300000")
    name: string;        // Province name (e.g., "South Cotabato")
    regionCode: string;  // Region code
}
```

### City/Municipality Object
```typescript
interface CityMunicipality {
    code: string;        // PSGC code (e.g., "126301000")
    name: string;        // City/Municipality name (e.g., "Koronadal City")
    provinceCode: string; // Parent province code
    regionCode: string;  // Region code
}
```

### Barangay Object
```typescript
interface Barangay {
    code: string;        // PSGC code (e.g., "126301001")
    name: string;        // Barangay name (e.g., "Assumption")
    cityMunicipalityCode: string; // Parent city/municipality code
    provinceCode: string; // Parent province code
    regionCode: string;  // Region code
}
```

## Usage Examples

### Basic Usage in Create Form

```typescript
const {
    provinces,
    citiesMunicipalities,
    barangays,
    selectedProvince,
    selectedCityMunicipality,
    selectedBarangay,
    loading,
    error,
    handleProvinceChange,
    handleCityMunicipalityChange,
    handleBarangayChange,
    getSelectedLocationNames,
} = usePSGCLocation();

// Handle location changes
const handleLocationChange = (type: 'province' | 'city' | 'barangay', code: string) => {
    const locationNames = getSelectedLocationNames();
    
    if (type === 'province') {
        handleProvinceChange(code);
        setData('province', locationNames.province);
        setData('city', '');
        setData('brgy', '');
    } else if (type === 'city') {
        handleCityMunicipalityChange(code);
        setData('city', locationNames.cityMunicipality);
        setData('brgy', '');
    } else if (type === 'barangay') {
        handleBarangayChange(code);
        setData('brgy', locationNames.barangay);
    }
};
```

### Usage in Update Form with Existing Data

```typescript
// Initialize location selections based on existing data
useEffect(() => {
    if (pdl.province && provinces.length > 0) {
        const province = provinces.find(p => p.name === pdl.province);
        if (province) {
            handleProvinceChange(province.code);
        }
    }
}, [provinces, pdl.province, handleProvinceChange]);
```

## Error Handling

The integration includes comprehensive error handling:

1. **Network Errors**: API endpoint failures
2. **Data Errors**: Invalid or missing data
3. **User Errors**: Invalid selections or dependencies

Error messages are displayed to users with actionable guidance.

## Performance Considerations

1. **Caching**: API responses are cached in component state
2. **Lazy Loading**: Data is loaded only when needed
3. **Efficient Updates**: Minimal re-renders and API calls
4. **Memory Management**: Proper cleanup of event listeners and state

## Testing

A test script is provided (`test-psgc-api.js`) to verify API connectivity:

```javascript
// Run in browser console
testPSGCAPI();
```

This tests all three endpoints and provides feedback on API status.

## Migration Notes

### From Hardcoded Data

The migration from hardcoded South Cotabato data to PSGC API:

1. **Removed**: Static location data object
2. **Added**: Dynamic API integration
3. **Enhanced**: Error handling and loading states
4. **Improved**: User experience with cascading dropdowns

### Backward Compatibility

- Existing PDL records continue to work
- Location names are preserved in the database
- Update forms automatically populate with existing data

## Future Enhancements

1. **Caching**: Implement local storage caching for better performance
2. **Search**: Add search functionality for large location lists
3. **Validation**: Enhanced location validation
4. **Offline Support**: Fallback data for offline scenarios

## Troubleshooting

### Common Issues

1. **API Not Loading**: Check network connectivity and CORS settings
2. **Slow Loading**: Consider implementing caching or pagination
3. **Location Not Found**: Verify PSGC codes are correct
4. **Form Validation**: Ensure proper form state management

### Debug Mode

Enable debug logging by adding console logs in the hook:

```typescript
console.log('PSGC API Debug:', { provinces, citiesMunicipalities, barangays });
```

## Support

For issues related to:
- **PSGC API**: Contact Philippine Statistics Authority
- **Integration**: Check component state and API responses
- **Performance**: Monitor network requests and component renders
