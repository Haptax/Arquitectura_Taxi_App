/**
 * MCP Server for Taxi App PostgreSQL Database (taxi_db)
 * Supports tables: drivers, profiles, trips, users
 */

const { Pool } = require('pg');
const readline = require('readline');

// Database configuration
const config = {
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || '1423miki',
  database: process.env.PGDATABASE || 'taxi_db',
};

const pool = new Pool(config);

const KNOWN_TABLES = ['drivers', 'profiles', 'trips', 'users'];

const TOOLS = [
  {
    name: 'list_tables',
    description: 'List all tables available in the taxi_db database (including drivers, profiles, trips, users)',
    inputSchema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'describe_table',
    description: 'Get schema, columns, data types, and nullability for a table (drivers, profiles, trips, users)',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Name of the table to describe (e.g. drivers, profiles, trips, users)',
        },
      },
      required: ['table_name'],
    },
  },
  {
    name: 'query_database',
    description: 'Execute a SQL query on taxi_db PostgreSQL database',
    inputSchema: {
      type: 'object',
      properties: {
        sql: {
          type: 'string',
          description: 'The SQL query to execute',
        },
        params: {
          type: 'array',
          description: 'Optional query parameters for prepared statement',
          items: {},
        },
      },
      required: ['sql'],
    },
  },
  {
    name: 'get_sample_data',
    description: 'Fetch the most recent sample records from a table (drivers, profiles, trips, users)',
    inputSchema: {
      type: 'object',
      properties: {
        table_name: {
          type: 'string',
          description: 'Table name (drivers, profiles, trips, users)',
        },
        limit: {
          type: 'number',
          description: 'Maximum number of rows to retrieve (default: 10)',
        },
      },
      required: ['table_name'],
    },
  },
];

async function handleToolCall(name, args) {
  switch (name) {
    case 'list_tables': {
      const res = await pool.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              database: config.database,
              tables: res.rows.map(r => r.table_name),
              known_entities: KNOWN_TABLES,
            }, null, 2),
          },
        ],
      };
    }

    case 'describe_table': {
      const tableName = args.table_name;
      const res = await pool.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position;
      `, [tableName]);

      if (res.rows.length === 0) {
        return {
          isError: true,
          content: [
            {
              type: 'text',
              text: `Table '${tableName}' not found in database '${config.database}'.`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              table: tableName,
              columns: res.rows,
            }, null, 2),
          },
        ],
      };
    }

    case 'query_database': {
      const sql = args.sql;
      const params = args.params || [];
      const res = await pool.query(sql, params);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              command: res.command,
              rowCount: res.rowCount,
              rows: res.rows,
            }, null, 2),
          },
        ],
      };
    }

    case 'get_sample_data': {
      const tableName = args.table_name.replace(/[^a-zA-Z0-9_]/g, '');
      const limit = Math.min(Math.max(parseInt(args.limit || 10, 10), 1), 100);
      const res = await pool.query(`SELECT * FROM "${tableName}" LIMIT $1`, [limit]);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              table: tableName,
              count: res.rowCount,
              rows: res.rows,
            }, null, 2),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// JSON-RPC stdio protocol loop
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function sendResponse(response) {
  process.stdout.write(JSON.stringify(response) + '\n');
}

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const request = JSON.parse(line);
    const { id, method, params } = request;

    if (method === 'initialize') {
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
          },
          serverInfo: {
            name: 'taxi-db-mcp-server',
            version: '1.0.0',
          },
        },
      });
    } else if (method === 'notifications/initialized') {
      // Notification, no response required
    } else if (method === 'tools/list') {
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {
          tools: TOOLS,
        },
      });
    } else if (method === 'tools/call') {
      const toolName = params.name;
      const toolArgs = params.arguments || {};
      try {
        const result = await handleToolCall(toolName, toolArgs);
        sendResponse({
          jsonrpc: '2.0',
          id,
          result,
        });
      } catch (err) {
        sendResponse({
          jsonrpc: '2.0',
          id,
          result: {
            isError: true,
            content: [
              {
                type: 'text',
                text: `Database Error: ${err.message}`,
              },
            ],
          },
        });
      }
    } else if (method === 'ping') {
      sendResponse({
        jsonrpc: '2.0',
        id,
        result: {},
      });
    } else {
      sendResponse({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
      });
    }
  } catch (err) {
    sendResponse({
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: `Parse error: ${err.message}`,
      },
    });
  }
});

process.on('SIGTERM', async () => {
  await pool.end();
  process.exit(0);
});
process.on('SIGINT', async () => {
  await pool.end();
  process.exit(0);
});
