import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { GaodeClient } from "./gaodeClient.js";

// Tool definitions
const TOOLS = [
  {
    name: "static_map",
    description: "Generate a static map image for a given location.",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "Location or coordinates" },
        width: { type: "number", description: "Image width" },
        height: { type: "number", description: "Image height" }
      },
      required: ["location", "width", "height"]
    }
  },
  {
    name: "traffic_status",
    description: "Get real-time traffic status for a region or route.",
    inputSchema: {
      type: "object",
      properties: {
        region: { type: "string", description: "Region or coordinates" },
        type: { type: "string", description: "Type: rectangle/circle/route" }
      },
      required: ["region", "type"]
    }
  },
  {
    name: "weather",
    description: "Get real-time weather and forecast for a region.",
    inputSchema: {
      type: "object",
      properties: {
        region: { type: "string", description: "Region name or code" }
      },
      required: ["region"]
    }
  },
  {
    name: "geocode",
    description: "Convert address to coordinates.",
    inputSchema: {
      type: "object",
      properties: {
        address: { type: "string", description: "Address to geocode" }
      },
      required: ["address"]
    }
  },
  {
    name: "regeocode",
    description: "Convert coordinates to readable address.",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string", description: "Coordinates" }
      },
      required: ["location"]
    }
  },
  {
    name: "poi_search",
    description: "Search POI by keyword.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Search keyword" },
        region: { type: "string", description: "Region or city" }
      },
      required: ["keyword"]
    }
  },
  {
    name: "around_search",
    description: "Search POI around a point or in a polygon.",
    inputSchema: {
      type: "object",
      properties: {
        center: { type: "string", description: "Center coordinates" },
        radius: { type: "number", description: "Radius in meters" },
        polygon: { type: "string", description: "Polygon coordinates (optional)" }
      },
      required: ["center"]
    }
  },
  {
    name: "input_tips",
    description: "Get input suggestions for search keywords.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "Partial keyword" },
        region: { type: "string", description: "Region or city (optional)" }
      },
      required: ["keyword"]
    }
  },
  {
    name: "route_plan",
    description: "Plan route between two points.",
    inputSchema: {
      type: "object",
      properties: {
        origin: { type: "string", description: "Origin coordinates" },
        destination: { type: "string", description: "Destination coordinates" },
        mode: { type: "string", description: "Mode: driving/walking/cycling" }
      },
      required: ["origin", "destination", "mode"]
    }
  },
  {
    name: "coord_convert",
    description: "Convert between coordinate systems.",
    inputSchema: {
      type: "object",
      properties: {
        coords: { type: "string", description: "Coordinates" },
        from: { type: "string", description: "Source system" },
        to: { type: "string", description: "Target system" }
      },
      required: ["coords", "from", "to"]
    }
  },
  {
    name: "ip_locate",
    description: "Locate by IP address.",
    inputSchema: {
      type: "object",
      properties: {
        ip: { type: "string", description: "IP address" }
      },
      required: ["ip"]
    }
  },
  {
    name: "district_query",
    description: "Query administrative districts.",
    inputSchema: {
      type: "object",
      properties: {
        keyword: { type: "string", description: "District keyword or code" }
      },
      required: ["keyword"]
    }
  },
  {
    name: "geofence",
    description: "Set and monitor geofence.",
    inputSchema: {
      type: "object",
      properties: {
        region: { type: "string", description: "Region or coordinates" },
        action: { type: "string", description: "Action: create/query/delete" }
      },
      required: ["region", "action"]
    }
  },
  {
    name: "id_query",
    description: "Query POI by unique ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "POI unique ID" }
      },
      required: ["id"]
    }
  },
  {
    name: "falcon_track",
    description: "Professional trajectory tracking service.",
    inputSchema: {
      type: "object",
      properties: {
        device_id: { type: "string", description: "Device ID" },
        start_time: { type: "string", description: "Start time (optional)" },
        end_time: { type: "string", description: "End time (optional)" }
      },
      required: ["device_id"]
    }
  }
];

// Tool handlers
interface ToolHandler {
  (args: any): Promise<{ type: string; data: any }>;
}

const TOOL_HANDLERS: Record<string, ToolHandler> = {
  static_map: async ({ location, width, height }: any) => {
    if (!location || !width || !height) throw new Error("location, width, height are required");
    const result = await GaodeClient.staticMap({ location, width, height });
    return { type: "image", data: result };
  },
  
  traffic_status: async ({ region, type }: any) => {
    if (!region || !type) throw new Error("region, type are required");
    const result = await GaodeClient.trafficStatus({ region, type });
    return { type: "json", data: result };
  },
  
  weather: async ({ region }: any) => {
    if (!region) throw new Error("region is required");
    const result = await GaodeClient.weather({ region });
    return { type: "json", data: result };
  },
  
  geocode: async ({ address }: any) => {
    if (!address) throw new Error("address is required");
    const result = await GaodeClient.geocode({ address });
    return { type: "json", data: result };
  },
  
  regeocode: async ({ location }: any) => {
    if (!location) throw new Error("location is required");
    const result = await GaodeClient.regeocode({ location });
    return { type: "json", data: result };
  },
  
  poi_search: async ({ keyword, region }: any) => {
    if (!keyword) throw new Error("keyword is required");
    const result = await GaodeClient.poiSearch({ keyword, region });
    return { type: "json", data: result };
  },
  
  around_search: async ({ center, radius, polygon }: any) => {
    if (!center) throw new Error("center is required");
    const result = await GaodeClient.aroundSearch({ center, radius, polygon });
    return { type: "json", data: result };
  },
  
  input_tips: async ({ keyword, region }: any) => {
    if (!keyword) throw new Error("keyword is required");
    const result = await GaodeClient.inputTips({ keyword, region });
    return { type: "json", data: result };
  },
  
  route_plan: async ({ origin, destination, mode }: any) => {
    if (!origin || !destination || !mode) throw new Error("origin, destination, mode are required");
    const result = await GaodeClient.routePlan({ origin, destination, mode });
    return { type: "json", data: result };
  },
  
  coord_convert: async ({ coords, from, to }: any) => {
    if (!coords || !from || !to) throw new Error("coords, from, to are required");
    const result = await GaodeClient.coordConvert({ coords, from, to });
    return { type: "json", data: result };
  },
  
  ip_locate: async ({ ip }: any) => {
    if (!ip) throw new Error("ip is required");
    const result = await GaodeClient.ipLocate({ ip });
    return { type: "json", data: result };
  },
  
  district_query: async ({ keyword }: any) => {
    if (!keyword) throw new Error("keyword is required");
    const result = await GaodeClient.districtQuery({ keyword });
    return { type: "json", data: result };
  },
  
  geofence: async ({ region, action }: any) => {
    if (!region || !action) throw new Error("region, action are required");
    const result = await GaodeClient.geofence({ region, action });
    return { type: "json", data: result };
  },
  
  id_query: async ({ id }: any) => {
    if (!id) throw new Error("id is required");
    const result = await GaodeClient.idQuery({ id });
    return { type: "json", data: result };
  },
  
  falcon_track: async ({ device_id, start_time, end_time }: any) => {
    if (!device_id) throw new Error("device_id is required");
    const result = await GaodeClient.falconTrack({ device_id, start_time, end_time });
    return { type: "json", data: result };
  }
};

const server = new Server(
  {
    name: "mcp-server-gaodemap-gaodeapi",
    version: "0.1.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const handler = TOOL_HANDLERS[toolName];
  
  if (!handler) {
    throw new Error(`Unknown tool: ${toolName}`);
  }
  
  const args = request.params.arguments || {};
  const result = await handler(args);
  
  return { content: [{ type: result.type, data: result.data }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
