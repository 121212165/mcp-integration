# Reconstruction Plan

## Problem
426 lines across 3 files. 15 static methods + 15 switch cases all doing: build URL → fetch → return JSON.

## Solution
One `TOOL_CONFIG` array drives everything:
- Tool metadata (name, description, schema) → MCP registration
- API endpoint + param mapping → generic fetch function
- Required args → validation

## Files
| Action | File | LOC |
|--------|------|-----|
| DELETE | `src/config.ts` | 0 (unused) |
| REWRITE | `src/gaodeClient.ts` | ~85 |
| REWRITE | `src/index.ts` | ~35 |
| CREATE | `RECONSTRUCTION-PLAN.md` | this file |

## Result
~120 lines in 2 files. Zero repetition.
