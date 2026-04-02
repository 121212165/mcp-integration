import fetch from "node-fetch";
import { GAODE_API_KEY } from "./config.js";

interface ApiParams {
  [key: string]: string | number | undefined;
}

export class GaodeClient {
  private static async callApi(endpoint: string, params: ApiParams): Promise<any> {
    const queryParams = new URLSearchParams({
      key: GAODE_API_KEY,
      ...Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][]
      ),
    });
    
    const url = `https://restapi.amap.com/${endpoint}?${queryParams.toString()}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  }

  static async staticMap({ location, width, height }: { location: string; width: number; height: number }): Promise<Buffer> {
    const url = `https://restapi.amap.com/v3/staticmap?location=${encodeURIComponent(location)}&size=${width}*${height}&key=${GAODE_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Static map API error");
    return await res.buffer();
  }
  
  static async trafficStatus({ region, type }: { region: string; type: string }) {
    return this.callApi(`v3/traffic/status/${type}`, { region });
  }

  static async weather({ region }: { region: string }) {
    return this.callApi("v3/weather/weatherInfo", { city: region });
  }

  static async geocode({ address }: { address: string }) {
    return this.callApi("v3/geocode/geo", { address });
  }

  static async regeocode({ location }: { location: string }) {
    return this.callApi("v3/geocode/regeo", { location });
  }

  static async poiSearch({ keyword, region }: { keyword: string; region?: string }) {
    return this.callApi("v3/place/text", { keywords: keyword, city: region });
  }

  static async aroundSearch({ center, radius, polygon }: { center: string; radius?: number; polygon?: string }) {
    return this.callApi("v3/place/around", { location: center, radius, polygon });
  }

  static async inputTips({ keyword, region }: { keyword: string; region?: string }) {
    return this.callApi("v3/assistant/inputtips", { keywords: keyword, city: region });
  }

  static async routePlan({ origin, destination, mode }: { origin: string; destination: string; mode: string }) {
    return this.callApi(`v3/direction/${mode}`, { origin, destination });
  }

  static async coordConvert({ coords, from, to }: { coords: string; from: string; to: string }) {
    return this.callApi("v3/assistant/coordinate/convert", { locations: coords, coordsys: from });
  }

  static async ipLocate({ ip }: { ip: string }) {
    return this.callApi("v3/ip", { ip });
  }

  static async districtQuery({ keyword }: { keyword: string }) {
    return this.callApi("v3/config/district", { keywords: keyword });
  }

  static async geofence({ region, action }: { region: string; action: string }) {
    // 伪实现，具体 API 需根据高德开放平台文档调整
    return { region, action, status: "not_implemented" };
  }

  static async idQuery({ id }: { id: string }) {
    return this.callApi("v3/place/detail", { id });
  }

  static async falconTrack({ device_id, start_time, end_time }: { device_id: string; start_time?: string; end_time?: string }) {
    // 伪实现，具体 API 需根据高德开放平台文档调整
    return { device_id, start_time, end_time, status: "not_implemented" };
  }
}
