// Test script to verify PSGC API integration
// This can be run in the browser console to test the API endpoints

const PSGC_BASE_URL = 'https://psgc.gitlab.io/api';

async function testPSGCAPI() {
    console.log('Testing PSGC API integration...');
    
    try {
        // Test provinces endpoint
        console.log('1. Testing provinces endpoint...');
        const provincesResponse = await fetch(`${PSGC_BASE_URL}/provinces.json`);
        if (!provincesResponse.ok) {
            throw new Error(`Provinces API failed: ${provincesResponse.status}`);
        }
        const provinces = await provincesResponse.json();
        console.log(`✅ Provinces loaded: ${provinces.length} provinces`);
        console.log('Sample provinces:', provinces.slice(0, 3).map(p => p.name));
        
        // Test cities/municipalities endpoint
        console.log('2. Testing cities/municipalities endpoint...');
        const citiesResponse = await fetch(`${PSGC_BASE_URL}/cities-municipalities.json`);
        if (!citiesResponse.ok) {
            throw new Error(`Cities API failed: ${citiesResponse.status}`);
        }
        const cities = await citiesResponse.json();
        console.log(`✅ Cities/Municipalities loaded: ${cities.length} cities/municipalities`);
        console.log('Sample cities:', cities.slice(0, 3).map(c => c.name));
        
        // Test barangays endpoint for a specific city
        console.log('3. Testing barangays endpoint...');
        const testCity = cities.find(c => c.name.includes('Manila'));
        if (testCity) {
            const barangaysResponse = await fetch(`${PSGC_BASE_URL}/cities-municipalities/${testCity.code}/barangays.json`);
            if (!barangaysResponse.ok) {
                throw new Error(`Barangays API failed: ${barangaysResponse.status}`);
            }
            const barangays = await barangaysResponse.json();
            console.log(`✅ Barangays loaded for ${testCity.name}: ${barangays.length} barangays`);
            console.log('Sample barangays:', barangays.slice(0, 3).map(b => b.name));
        } else {
            console.log('⚠️ No test city found for barangays test');
        }
        
        console.log('🎉 All PSGC API endpoints are working correctly!');
        
    } catch (error) {
        console.error('❌ PSGC API test failed:', error);
    }
}

// Run the test
testPSGCAPI();
