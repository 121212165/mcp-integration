import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema
} from "@modelcontextprotocol/sdk/types.js";
import { GaodeClient } from "./gaodeClient.js";

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
  return {
    tools: [
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
    ]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "static_map": {
      const { location, width, height } = request.params.arguments || {};
      if (!location || !width || !height) throw new Error("location, width, height are required");
      const result = await GaodeClient.staticMap({ location, width, height });
      return { content: [{ type: "image", data: result }] };
    }
    case "traffic_status": {
      const { region, type } = request.params.arguments || {};
      if (!region || !type) throw new Error("region, type are required");
      const result = await GaodeClient.trafficStatus({ region, type });
      return { content: [{ type: "json", data: result }] };
    }
    case "weather": {
      const { region } = request.params.arguments || {};
      if (!region) throw new Error("region is required");
      const result = await GaodeClient.weather({ region });
      return { content: [{ type: "json", data: result }] };
    }
    case "geocode": {
      const { address } = request.params.arguments || {};
      if (!address) throw new Error("address is required");
      const result = await GaodeClient.geocode({ address });
      return { content: [{ type: "json", data: result }] };
    }
    case "regeocode": {
      const { location } = request.params.arguments || {};
      if (!location) throw new Error("location is required");
      const result = await GaodeClient.regeocode({ location });
      return { content: [{ type: "json", data: result }] };
    }
    case "poi_search": {
      const { keyword, region } = request.params.arguments || {};
      if (!keyword) throw new Error("keyword is required");
      const result = await GaodeClient.poiSearch({ keyword, region });
      return { content: [{ type: "json", data: result }] };
    }
    case "around_search": {
      const { center, radius, polygon } = request.params.arguments || {};
      if (!center) throw new Error("center is required");
      const result = await GaodeClient.aroundSearch({ center, radius, polygon });
      return { content: [{ type: "json", data: result }] };
    }
    case "input_tips": {
      const { keyword, region } = request.params.arguments || {};
      if (!keyword) throw new Error("keyword is required");
      const result = await GaodeClient.inputTips({ keyword, region });
      return { content: [{ type: "json", data: result }] };
    }
    case "route_plan": {
      const { origin, destination, mode } = request.params.arguments || {};
      if (!origin || !destination || !mode) throw new Error("origin, destination, mode are required");
      const result = await GaodeClient.routePlan({ origin, destination, mode });
      return { content: [{ type: "json", data: result }] };
    }
    case "coord_convert": {
      const { coords, from, to } = request.params.arguments || {};
      if (!coords || !from || !to) throw new Error("coords, from, to are required");
      const result = await GaodeClient.coordConvert({ coords, from, to });
      return { content: [{ type: "json", data: result }] };
    }
    case "ip_locate": {
      const { ip } = request.params.arguments || {};
      if (!ip) throw new Error("ip is required");
      const result = await GaodeClient.ipLocate({ ip });
      return { content: [{ type: "json", data: result }] };
    }
    case "district_query": {
      const { keyword } = request.params.arguments || {};
      if (!keyword) throw new Error("keyword is required");
      const result = await GaodeClient.districtQuery({ keyword });
      return { content: [{ type: "json", data: result }] };
    }
    case "geofence": {
      const { region, action } = request.params.arguments || {};
      if (!region || !action) throw new Error("region, action are required");
      const result = await GaodeClient.geofence({ region, action });
      return { content: [{ type: "json", data: result }] };
    }
    case "id_query": {
      const { id } = request.params.arguments || {};
      if (!id) throw new Error("id is required");
      const result = await GaodeClient.idQuery({ id });
      return { content: [{ type: "json", data: result }] };
    }
    case "falcon_track": {
      const { device_id, start_time, end_time } = request.params.arguments || {};
      if (!device_id) throw new Error("device_id is required");
      const result = await GaodeClient.falconTrack({ device_id, start_time, end_time });
      return { content: [{ type: "json", data: result }] };
    }
    default:
      throw new Error("Unknown tool");
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();