import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isWindows = process.platform === "win32";
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");
const tsxBin = path.join(root, "node_modules", "tsx", "dist", "cli.mjs");

const processes = [
  {
    name: "api",
    command: process.execPath,
    args: [tsxBin, "watch", "apps/api/src/main.ts"],
    env: { PORT: "4000" }
  },
  {
    name: "web",
    command: process.execPath,
    args: [viteBin, "apps/web", "--host", "127.0.0.1", "--port", "5173"],
    env: {}
  }
];

const children = processes.map((entry) => {
  const child = spawn(entry.command, entry.args, {
    cwd: root,
    env: { ...process.env, ...entry.env },
    shell: false,
    stdio: ["inherit", "pipe", "pipe"],
    windowsHide: isWindows
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[${entry.name}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${entry.name}] ${chunk}`));
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[${entry.name}] process exited with code ${code}`);
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
};

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});
