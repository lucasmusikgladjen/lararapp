/* import axios from "axios";

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface Coordinates {
  lat: number;
  lng: number;
}

type TravelMode = "walking" | "bicycling" | "transit" | "driving";

interface TravelTimeResult {
  duration: number; // minutes
  distance: number; // meters
  durationText: string;
  distanceText: string;
}

export const googleMapsService = {
  async getTravelTime(
    origin: Coordinates,
    destination: Coordinates,
    mode: TravelMode = "transit"
  ): Promise<TravelTimeResult> {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key not configured");
    }

    const url = "https://maps.googleapis.com/maps/api/directions/json";

    const response = await axios.get(url, {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode,
        key: GOOGLE_MAPS_API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error(`Google Maps API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      duration: Math.round(leg.duration.value / 60), // Convert seconds to minutes
      distance: leg.distance.value,
      durationText: leg.duration.text,
      distanceText: leg.distance.text,
    };
  },

  calculateBirdDistance(origin: Coordinates, destination: Coordinates): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (origin.lat * Math.PI) / 180;
    const φ2 = (destination.lat * Math.PI) / 180;
    const Δφ = ((destination.lat - origin.lat) * Math.PI) / 180;
    const Δλ = ((destination.lng - origin.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },
};
 */