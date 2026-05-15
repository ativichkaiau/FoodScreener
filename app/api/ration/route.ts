import { NextResponse } from 'next/server';

// 📍 MED_CMU SUAN DOK COORDINATES
const BASE_LAT = 18.789617;
const BASE_LNG = 98.974003;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const maxDistance = parseFloat(searchParams.get('distance') || '3.0');
  const maxCost = parseInt(searchParams.get('cost') || '3');
  
  const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: "CRITICAL: Google Places API Key Missing in Cloud." }, { status: 500 });
  }

  try {
    const radiusMeters = Math.floor(maxDistance * 1000);

    const SEARCH_SECTORS = [
      { query: "Northern+Thai+food+OR+Khao+Soi", label: "Northern Thai (Lanna)" },
      { query: "Isan+food+OR+Som+Tum", label: "Isan & Spicy" },
      { query: "Street+food+OR+food+stall+OR+night+market", label: "Street Food" },
      { query: "Cafe+OR+Coffee+shop", label: "Cafe & Coffee" },
      { query: "Bakery+OR+Dessert+OR+Sweets", label: "Bakery & Dessert" },
      { query: "Shabu+OR+Hot+Pot+OR+Sukiyaki", label: "Shabu & Hot Pot" },
      { query: "Yakiniku+OR+BBQ+OR+Grill", label: "Yakiniku & BBQ" },
      { query: "Japanese+food+OR+Sushi+OR+Ramen", label: "Japanese Eateries" },
      { query: "Korean+food+OR+Korean+BBQ", label: "Korean Eateries" },
      { query: "Italian+food+OR+Pizza+OR+Pasta", label: "Italian & Pizza" },
      { query: "Fast+food+OR+Burger", label: "Fast Food" },
      { query: "Western+food+OR+Steakhouse", label: "Western & Steak" },
      { query: "Chinese+food+OR+Dim+Sum", label: "Chinese & Dim Sum" },
      { query: "Vegetarian+OR+Vegan+food", label: "Vegetarian & Vegan" },
      { query: "Seafood+restaurant", label: "Seafood" },
      { query: "restaurant", label: "Miscellaneous Eateries" }
    ];

    // 🚀 UPGRADE: Dual-Fetch Architecture
    const fetchSector = async (sector: { query: string, label: string }) => {
      // 1. Wide Search: Gets prominent places up to your max radius
      const urlWide = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${BASE_LAT},${BASE_LNG}&radius=${radiusMeters}&keyword=${sector.query}&maxprice=${maxCost}&key=${API_KEY}`;
      // 2. Local Search: Ignores radius and guarantees the 20 absolute closest spots are grabbed
      const urlLocal = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${BASE_LAT},${BASE_LNG}&rankby=distance&keyword=${sector.query}&maxprice=${maxCost}&key=${API_KEY}`;
      
      const safeFetch = async (url: string) => {
        try {
          const r = await fetch(url);
          const d = await r.json();
          return d.results || [];
        } catch (e) { return []; }
      };

      // Fire both simultaneously
      const [wideResults, localResults] = await Promise.all([safeFetch(urlWide), safeFetch(urlLocal)]);
      const combined = [...wideResults, ...localResults];
      
      return combined.map((place: any) => ({
        ...place,
        vestrippn_category: sector.label
      }));
    };

    // Execute 32 fetches concurrently
    const sectorPromises = SEARCH_SECTORS.map(sector => fetchSector(sector));
    const allSectorResults = await Promise.all(sectorPromises);
    const combinedGrid = allSectorResults.flat();

    // Priority Deduplication: Keeps the most specific category tags
    const uniqueTargetsMap = new Map();
    for (const item of combinedGrid) {
      if (!uniqueTargetsMap.has(item.place_id)) {
        uniqueTargetsMap.set(item.place_id, item);
      }
    }
    const uniqueTargets = Array.from(uniqueTargetsMap.values());

    if (uniqueTargets.length === 0) return NextResponse.json({ results: [] });

    const formattedResults = uniqueTargets.map((place: any) => {
      const distance = calculateDistance(BASE_LAT, BASE_LNG, place.geometry.location.lat, place.geometry.location.lng);
      return {
        id: place.place_id,
        name: place.name,
        type: place.vestrippn_category,
        cost: place.price_level || 2, 
        distance: Number(distance.toFixed(1)),
        location: place.vicinity ? place.vicinity.split(',')[0] : 'Chiang Mai Sector', 
        rating: place.rating || 'N/A',
        reviews: place.user_ratings_total || 0,
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}&query_place_id=${place.place_id}`
      };
    });

    // We allow a 10% distance buffer here just in case Google's bounding box grabs something at 10.2km
    const finalTargets = formattedResults
      .filter((r: any) => r.distance <= maxDistance * 1.1 && r.cost <= maxCost && r.rating !== 'N/A')
      .sort((a: any, b: any) => b.rating - a.rating);

    return NextResponse.json({ results: finalTargets });

  } catch (error: any) {
    console.error("[RATION_API_ERROR]", error);
    return NextResponse.json({ error: "Failed to establish Google Cloud link." }, { status: 500 });
  }
}