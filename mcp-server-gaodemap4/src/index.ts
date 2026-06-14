import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { getTools, findTool, callApi } from "./gaodeClient.js";

const server = new Server(
  { name: "mcp-server-gaodemap-gaodeapi", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: getTools() }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;
  const tool = findTool(name);
  if (!tool) throw new Error(`Unknown tool: ${name}`);
  for (const req of tool.required) {
    if (!args[req]) throw new Error(`${req} is required`);
  }
  const result = await callApi(tool, args as Record<string, unknown>);
  return { content: [{ type: tool.binary ? "image" : "json", data: result }] };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();
