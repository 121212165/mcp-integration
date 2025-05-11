# mcp-server-gaodemap4 MCP Server

A Model Context Protocol server

本项目为基于 TypeScript 的 MCP（Model Context Protocol）服务器，集成了高德地图 API 工具，支持多种地理信息服务能力。

## 特性

### 地图与地理信息工具
- `static_map`：生成指定位置的静态地图图片
- `traffic_status`：获取区域或路线的实时交通状况
- `weather`：获取区域实时天气及预报
- `geocode`：地址转坐标
- `regeocode`：坐标转可读地址
- `poi_search`：关键字搜索兴趣点（POI）
- `around_search`：指定点或多边形范围内搜索 POI
- `input_tips`：搜索关键字输入建议
- `route_plan`：两点间路线规划（驾车/步行/骑行）
- `coord_convert`：坐标系转换
- `ip_locate`：IP 定位
- `district_query`：行政区划查询
- `geofence`：设置与监控地理围栏
- `id_query`：根据唯一 ID 查询 POI
- `falcon_track`：专业轨迹追踪服务

### 工具接口参数说明

| 工具名           | 必填参数（部分可选）                | 描述                       |
|------------------|-------------------------------------|----------------------------|
| static_map       | location, width, height             | 生成静态地图图片           |
| traffic_status   | region, type                        | 获取实时交通状况           |
| weather          | region                              | 获取天气信息               |
| geocode          | address                             | 地址转坐标                 |
| regeocode        | location                            | 坐标转地址                 |
| poi_search       | keyword, region?                    | 关键字搜索 POI             |
| around_search    | center, radius?, polygon?           | 周边/多边形范围 POI 搜索   |
| input_tips       | keyword, region?                    | 输入建议                   |
| route_plan       | origin, destination, mode            | 路线规划                   |
| coord_convert    | coords, from, to                    | 坐标系转换                 |
| ip_locate        | ip                                  | IP 定位                    |
| district_query   | keyword                             | 行政区划查询               |
| geofence         | region, action                      | 地理围栏操作               |
| id_query         | id                                  | 根据 ID 查询 POI           |
| falcon_track     | device_id, start_time?, end_time?    | 轨迹追踪                   |

### 使用示例

#### 获取静态地图图片
```json
{
  "name": "static_map",
  "arguments": {
    "location": "116.481488,39.990464",
    "width": 600,
    "height": 400
  }
}
```

#### 查询实时天气
```json
{
  "name": "weather",
  "arguments": {
    "region": "北京"
  }
}
```

#### 路线规划（驾车）
```json
{
  "name": "route_plan",
  "arguments": {
    "origin": "116.481488,39.990464",
    "destination": "116.434446,39.90816",
    "mode": "driving"
  }
}
```

## 开发与运行

安装依赖：
```bash
npm install
```

构建服务：
```bash
npm run build
```

开发模式自动编译：
```bash
npm run watch
```

## 配置高德 API Key

请在环境变量中设置 `GAODE_API_KEY`，否则相关接口无法正常访问。

## 与 Claude Desktop 集成

在 Windows 下，将如下配置添加到 `%APPDATA%/Claude/claude_desktop_config.json`：
```json
{
  "mcpServers": {
    "mcp-server-gaodemap4": {
      "command": "/path/to/mcp-server-gaodemap4/build/index.js"
    }
  }
}
```

## 调试

建议使用 [MCP Inspector](https://github.com/modelcontextprotocol/inspector) 进行调试：
```bash
npm run inspector
```

Inspector 启动后会提供浏览器访问的调试工具页面。

---

如需更多接口参数说明或使用示例，请参考源码 `src/index.ts` 和 `src/gaodeClient.ts` 文件。
