import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const versionDbResult = await database.query("SHOW server_version;");
  const versionDbValue = versionDbResult.rows[0].server_version;
  const maxConnectionsResult = await database.query("SHOW max_connections;");
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;
  const dataBaseName = process.env.POSTGRES_DB;
  const openConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [dataBaseName],
  });
  const openConnectionsValue = openConnectionsResult.rows[0].count;
  response.status(200).json({
    updated_at: updatedAt,
    dependecies: {
      database: {
        version: versionDbValue,
        max_connections: parseInt(maxConnectionsValue),
        opened_connections: openConnectionsValue,
      },
    },
  });
}

export default status;
