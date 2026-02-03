const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const root = path.join(__dirname, "..");
const contentDir = path.join(root, "src", "content");
const files = fs.readdirSync(contentDir);
const entries = files
  .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
  .map((f) => f.replace(/\.(ts|js)x?$/, ""));

for (const name of entries) {
  const r = spawnSync(
    "npx",
    ["vite", "build", "--config", "vite.content.config.ts"],
    {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, VITE_CONTENT_ENTRY: name },
    },
  );
  if (r.status !== 0) process.exit(r.status || 1);
}
