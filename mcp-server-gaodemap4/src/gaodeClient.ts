import fetch from "node-fetch";

const API_KEY = process.env.GAODE_API_KEY || "";

export class GaodeClient {
  static async staticMap({ location, width, height }: { location: string; width: number; height: number }) {
    const url = `https://restapi.amap.com/v3/staticmap?location=${encodeURIComponent(location)}&size=${width}*${height}&key=${API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Static map API error");
    return await res.buffer();
  }

  static async trafficStatus({ region, type }: { region: string; type: string }) {
    const url = `https://restapi.amap.com/v3/traffic/status/${type}?region=${encodeURIComponent(region)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async weather({ region }: { region: string }) {
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${encodeURIComponent(region)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async geocode({ address }: { address: string }) {
    const url = `https://restapi.amap.com/v3/geocode/geo?address=${encodeURIComponent(address)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async regeocode({ location }: { location: string }) {
    const url = `https://restapi.amap.com/v3/geocode/regeo?location=${encodeURIComponent(location)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async poiSearch({ keyword, region }: { keyword: string; region?: string }) {
    const url = `https://restapi.amap.com/v3/place/text?keywords=${encodeURIComponent(keyword)}${region ? `&city=${encodeURIComponent(region)}` : ""}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async aroundSearch({ center, radius, polygon }: { center: string; radius?: number; polygon?: string }) {
    let url = `https://restapi.amap.com/v3/place/around?location=${encodeURIComponent(center)}&key=${API_KEY}`;
    if (radius) url += `&radius=${radius}`;
    if (polygon) url += `&polygon=${encodeURIComponent(polygon)}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async inputTips({ keyword, region }: { keyword: string; region?: string }) {
    let url = `https://restapi.amap.com/v3/assistant/inputtips?keywords=${encodeURIComponent(keyword)}&key=${API_KEY}`;
    if (region) url += `&city=${encodeURIComponent(region)}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async routePlan({ origin, destination, mode }: { origin: string; destination: string; mode: string }) {
    const url = `https://restapi.amap.com/v3/direction/${mode}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async coordConvert({ coords, from, to }: { coords: string; from: string; to: string }) {
    const url = `https://restapi.amap.com/v3/assistant/coordinate/convert?locations=${encodeURIComponent(coords)}&coordsys=${from}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async ipLocate({ ip }: { ip: string }) {
    const url = `https://restapi.amap.com/v3/ip?ip=${encodeURIComponent(ip)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async districtQuery({ keyword }: { keyword: string }) {
    const url = `https://restapi.amap.com/v3/config/district?keywords=${encodeURIComponent(keyword)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async geofence({ region, action }: { region: string; action: string }) {
    // 伪实现，具体API需根据高德开放平台文档调整
    return { region, action, status: "not_implemented" };
  }

  static async idQuery({ id }: { id: string }) {
    const url = `https://restapi.amap.com/v3/place/detail?id=${encodeURIComponent(id)}&key=${API_KEY}`;
    const res = await fetch(url);
    return await res.json();
  }

  static async falconTrack({ device_id, start_time, end_time }: { device_id: string; start_time?: string; end_time?: string }) {
    // 伪实现，具体API需根据高德开放平台文档调整
    return { device_id, start_time, end_time, status: "not_implemented" };
  }
}