import { useState, useEffect, useCallback } from 'react';

// PSGC API Base URL
const PSGC_BASE_URL = 'https://psgc.gitlab.io/api';

// Types for PSGC API responses
interface Province {
    code: string;
    name: string;
    regionCode: string;
}

interface CityMunicipality {
    code: string;
    name: string;
    provinceCode: string;
    regionCode: string;
}

interface Barangay {
    code: string;
    name: string;
    cityMunicipalityCode: string;
    provinceCode: string;
    regionCode: string;
}

interface LocationState {
    provinces: Province[];
    citiesMunicipalities: CityMunicipality[];
    barangays: Barangay[];
    selectedProvince: string;
    selectedCityMunicipality: string;
    selectedBarangay: string;
    loading: {
        provinces: boolean;
        citiesMunicipalities: boolean;
        barangays: boolean;
    };
    error: string | null;
}

export const usePSGCLocation = () => {
    const [state, setState] = useState<LocationState>({
        provinces: [],
        citiesMunicipalities: [],
        barangays: [],
        selectedProvince: '',
        selectedCityMunicipality: '',
        selectedBarangay: '',
        loading: {
            provinces: false,
            citiesMunicipalities: false,
            barangays: false,
        },
        error: null,
    });

    // Fetch provinces
    const fetchProvinces = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: { ...prev.loading, provinces: true },
            error: null,
        }));

        try {
            const response = await fetch(`${PSGC_BASE_URL}/provinces.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch provinces: ${response.status}`);
            }
            
            const provinces: Province[] = await response.json();
            // ascending order by name
            provinces.sort((a, b) => a.name.localeCompare(b.name));
            
            setState(prev => ({
                ...prev,
                provinces,
                loading: { ...prev.loading, provinces: false },
            }));
        } catch (error) {
            console.error('Error fetching provinces:', error);
            setState(prev => ({
                ...prev,
                loading: { ...prev.loading, provinces: false },
                error: error instanceof Error ? error.message : 'Failed to fetch provinces',
            }));
        }
    }, []);

    // Fetch cities/municipalities for a province
    const fetchCitiesMunicipalities = useCallback(async (provinceCode: string) => {
        if (!provinceCode) return;

        setState(prev => ({
            ...prev,
            loading: { ...prev.loading, citiesMunicipalities: true },
            error: null,
        }));

        try {
            const response = await fetch(`${PSGC_BASE_URL}/cities-municipalities.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch cities/municipalities: ${response.status}`);
            }
            
            const allCitiesMunicipalities: CityMunicipality[] = await response.json();
                // ascending order by name
            // Filter cities/municipalities by province
            const filteredCitiesMunicipalities = allCitiesMunicipalities.filter(
                city => city.provinceCode === provinceCode
            );
            filteredCitiesMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
            setState(prev => ({
                ...prev,
                citiesMunicipalities: filteredCitiesMunicipalities,
                loading: { ...prev.loading, citiesMunicipalities: false },
            }));
        } catch (error) {
            console.error('Error fetching cities/municipalities:', error);
            setState(prev => ({
                ...prev,
                loading: { ...prev.loading, citiesMunicipalities: false },
                error: error instanceof Error ? error.message : 'Failed to fetch cities/municipalities',
            }));
        }
    }, []);

    // Fetch barangays for a city/municipality
    const fetchBarangays = useCallback(async (cityMunicipalityCode: string) => {
        if (!cityMunicipalityCode) return;

        setState(prev => ({
            ...prev,
            loading: { ...prev.loading, barangays: true },
            error: null,
        }));

        try {
            const response = await fetch(`${PSGC_BASE_URL}/cities-municipalities/${cityMunicipalityCode}/barangays.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch barangays: ${response.status}`);
            }
            
            const barangays: Barangay[] = await response.json();
                // ascending order by name
            barangays.sort((a, b) => a.name.localeCompare(b.name));
            setState(prev => ({
                ...prev,
                barangays,
                loading: { ...prev.loading, barangays: false },
            }));
        } catch (error) {
            console.error('Error fetching barangays:', error);
            setState(prev => ({
                ...prev,
                loading: { ...prev.loading, barangays: false },
                error: error instanceof Error ? error.message : 'Failed to fetch barangays',
            }));
        }
    }, []);

    // Handle province selection
    const handleProvinceChange = useCallback((provinceCode: string) => {
        setState(prev => ({
            ...prev,
            selectedProvince: provinceCode,
            selectedCityMunicipality: '',
            selectedBarangay: '',
            citiesMunicipalities: [],
            barangays: [],
        }));

        if (provinceCode) {
            fetchCitiesMunicipalities(provinceCode);
        }
    }, [fetchCitiesMunicipalities]);

    // Handle city/municipality selection
    const handleCityMunicipalityChange = useCallback((cityMunicipalityCode: string) => {
        setState(prev => ({
            ...prev,
            selectedCityMunicipality: cityMunicipalityCode,
            selectedBarangay: '',
            barangays: [],
        }));

        if (cityMunicipalityCode) {
            fetchBarangays(cityMunicipalityCode);
        }
    }, [fetchBarangays]);

    // Handle barangay selection
    const handleBarangayChange = useCallback((barangayCode: string) => {
        setState(prev => ({
            ...prev,
            selectedBarangay: barangayCode,
        }));
    }, []);

    // Get selected location names
    const getSelectedLocationNames = useCallback(() => {
        const selectedProvince = state.provinces.find(p => p.code === state.selectedProvince);
        const selectedCityMunicipality = state.citiesMunicipalities.find(c => c.code === state.selectedCityMunicipality);
        const selectedBarangay = state.barangays.find(b => b.code === state.selectedBarangay);

        return {
            province: selectedProvince?.name || '',
            cityMunicipality: selectedCityMunicipality?.name || '',
            barangay: selectedBarangay?.name || '',
        };
    }, [state.provinces, state.citiesMunicipalities, state.barangays, state.selectedProvince, state.selectedCityMunicipality, state.selectedBarangay]);

    // Reset all selections
    const resetSelections = useCallback(() => {
        setState(prev => ({
            ...prev,
            selectedProvince: '',
            selectedCityMunicipality: '',
            selectedBarangay: '',
            citiesMunicipalities: [],
            barangays: [],
        }));
    }, []);

    // Load provinces on mount
    useEffect(() => {
        fetchProvinces();
    }, [fetchProvinces]);

    return {
        // State
        provinces: state.provinces,
        citiesMunicipalities: state.citiesMunicipalities,
        barangays: state.barangays,
        selectedProvince: state.selectedProvince,
        selectedCityMunicipality: state.selectedCityMunicipality,
        selectedBarangay: state.selectedBarangay,
        loading: state.loading,
        error: state.error,
        
        // Actions
        handleProvinceChange,
        handleCityMunicipalityChange,
        handleBarangayChange,
        getSelectedLocationNames,
        resetSelections,
        refetchProvinces: fetchProvinces,
    };
};
