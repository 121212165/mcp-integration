const BASE = "https://restapi.amap.com";
const KEY = process.env.GAODE_API_KEY || "";

type Arg = [userArg: string, queryParam: string, type: string, desc: string];

interface ToolDef {
  name: string;
  desc: string;
  required: string[];
  endpoint: string;
  args: Arg[];
  binary?: boolean;
}

const K: Arg = ["_key", "key", "string", ""];

const TOOLS: ToolDef[] = [
  { name: "static_map",     desc: "Generate a static map image for a given location.", required: ["location","width","height"], endpoint: "/v3/staticmap",
    args: [["location","location","string","Location coordinates"],["width","size","number","Image width"],["height","","number","Image height"],K], binary: true },
  { name: "traffic_status", desc: "Get real-time traffic status for a region or route.", required: ["region","type"], endpoint: "/v3/traffic/status/{type}",
    args: [["region","region","string","Region or coordinates"],["type","type","string","Type: rectangle/circle/route"],K] },
  { name: "weather",        desc: "Get real-time weather and forecast for a region.", required: ["region"], endpoint: "/v3/weather/weatherInfo",
    args: [["region","city","string","Region name or code"],K] },
  { name: "geocode",        desc: "Convert address to coordinates.", required: ["address"], endpoint: "/v3/geocode/geo",
    args: [["address","address","string","Address to geocode"],K] },
  { name: "regeocode",      desc: "Convert coordinates to readable address.", required: ["location"], endpoint: "/v3/geocode/regeo",
    args: [["location","location","string","Coordinates"],K] },
  { name: "poi_search",     desc: "Search POI by keyword.", required: ["keyword"], endpoint: "/v3/place/text",
    args: [["keyword","keywords","string","Search keyword"],["region","city","string","Region or city"],K] },
  { name: "around_search",  desc: "Search POI around a point or in a polygon.", required: ["center"], endpoint: "/v3/place/around",
    args: [["center","location","string","Center coordinates"],["radius","radius","number","Radius in meters"],["polygon","polygon","string","Polygon coordinates"],K] },
  { name: "input_tips",     desc: "Get input suggestions for search keywords.", required: ["keyword"], endpoint: "/v3/assistant/inputtips",
    args: [["keyword","keywords","string","Partial keyword"],["region","city","string","Region or city"],K] },
  { name: "route_plan",     desc: "Plan route between two points.", required: ["origin","destination","mode"], endpoint: "/v3/direction/{mode}",
    args: [["origin","origin","string","Origin coordinates"],["destination","destination","string","Destination coordinates"],K] },
  { name: "coord_convert",  desc: "Convert between coordinate systems.", required: ["coords","from","to"], endpoint: "/v3/assistant/coordinate/convert",
    args: [["coords","locations","string","Coordinates"],["from","coordsys","string","Source system"],["to","to","string","Target system"],K] },
  { name: "ip_locate",      desc: "Locate by IP address.", required: ["ip"], endpoint: "/v3/ip",
    args: [["ip","ip","string","IP address"],K] },
  { name: "district_query", desc: "Query administrative districts.", required: ["keyword"], endpoint: "/v3/config/district",
    args: [["keyword","keywords","string","District keyword or code"],K] },
  { name: "geofence",       desc: "Set and monitor geofence.", required: ["region","action"], endpoint: "", args: [["region","region","string","Region"],["action","action","string","Action: create/query/delete"]] },
  { name: "id_query",       desc: "Query POI by unique ID.", required: ["id"], endpoint: "/v3/place/detail",
    args: [["id","id","string","POI unique ID"],K] },
  { name: "falcon_track",   desc: "Professional trajectory tracking service.", required: ["device_id"], endpoint: "",
    args: [["device_id","device_id","string","Device ID"],["start_time","start_time","string","Start time"],["end_time","end_time","string","End time"]] },
];

function buildUrl(tool: ToolDef, a: Record<string, unknown>): string {
  const ep = tool.endpoint.replace(/\{(\w+)\}/g, (_, k) => String(a[k] || ""));
  const parts = tool.args
    .map(([arg, param]) => {
      const val = param === "size" ? `${a.width}*${a.height}` : a[arg];
      return val != null && val !== "" ? `${param || arg}=${encodeURIComponent(String(val))}` : null;
    })
    .filter(Boolean);
  parts.push(`key=${KEY}`);
  return `${BASE}${ep}?${parts.join("&")}`;
}

export async function callApi(tool: ToolDef, a: Record<string, unknown>): Promise<unknown> {
  if (!tool.endpoint) return { ...a, status: "not_implemented" };
  const res = await fetch(buildUrl(tool, a));
  if (!res.ok) throw new Error(`${tool.name} API error: ${res.status}`);
  return tool.binary ? Buffer.from(await res.arrayBuffer()) : await res.json();
}

export function getTools() {
  return TOOLS.map(({ name, desc, required, args }) => ({
    name,
    description: desc,
    inputSchema: {
      type: "object",
      properties: Object.fromEntries(
        args.filter(([a]) => a !== "_key").map(([a, , t, d]) => [a, { type: t, description: d }])
      ),
      required,
    },
  }));
}

export function findTool(name: string) {
  return TOOLS.find((t) => t.name === name);
}
