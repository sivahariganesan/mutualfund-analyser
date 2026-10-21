/**
 * AMFI Open API Service
 * Backed by https://api.mfapi.in (open-source mirror of Association of Mutual Funds in India data)
 * Covers 10,000+ Indian mutual fund schemes with NAV, category, AMC, and ISIN.
 */

export interface AmfiSearchResult {
  schemeCode: number;
  schemeName: string;
}

export interface AmfiSchemeDetails {
  meta: {
    fund_house: string;
    scheme_type: string;
    scheme_category: string;
    scheme_code: number;
    scheme_name: string;
    isin_growth?: string;
  };
  data: Array<{
    date: string;
    nav: string;
  }>;
}

/**
 * Searches 10,000+ schemes from the free AMFI Open API.
 */
export async function searchAmfiSchemes(query: string): Promise<AmfiSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  try {
    const encoded = encodeURIComponent(query.trim());
    const response = await fetch(`https://api.mfapi.in/mf/search?q=${encoded}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch schemes: ${response.status}`);
    }
    const data: AmfiSearchResult[] = await response.json();
    return data.slice(0, 30); // Return top 30 matching schemes
  } catch (error) {
    console.error('Error searching AMFI schemes:', error);
    return [];
  }
}

/**
 * Fetches real-time scheme metadata and latest NAV from AMFI API.
 */
export async function getAmfiSchemeDetails(schemeCode: number): Promise<AmfiSchemeDetails | null> {
  try {
    const response = await fetch(`https://api.mfapi.in/mf/${schemeCode}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch scheme ${schemeCode}`);
    }
    const data: AmfiSchemeDetails = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching scheme details for ${schemeCode}:`, error);
    return null;
  }
}
