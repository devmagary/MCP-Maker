/**
 * Create Lascadora - Fire sword weapon
 */
import { spawn } from "node:child_process";

const projectPath = "C:\\Users\\Mags\\Documents\\RMMZ\\Teste";
const enginePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\RPG Maker MZ";

console.log("Creating Lascadora weapon...");

const server = spawn("node", ["dist/index.js"], {
    env: { ...process.env, RPGMAKER_PROJECT_PATH: projectPath, RPGMAKER_ENGINE_PATH: enginePath },
    stdio: ["pipe", "pipe", "pipe"],
});

server.stderr.on("data", (data) => {
    console.log("[SERVER]", data.toString().trim());
});

setTimeout(() => {
    const request = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
            name: "create_weapon",
            arguments: {
                name: "Lascadora",
                description: "Espada flamejante que causa dano de fogo.",
                price: 800,
                wtypeId: 2, // Sword
                attack: 10,
                elementId: 2, // Fire
                iconIndex: 97, // Sword icon
                animationId: 6, // Slash animation
            },
        },
    };

    console.log("[REQUEST] Creating Lascadora fire sword...");
    server.stdin.write(JSON.stringify(request) + "\n");
}, 500);

let responseBuffer = "";
server.stdout.on("data", (data) => {
    responseBuffer += data.toString();
    try {
        const response = JSON.parse(responseBuffer);
        console.log("\n[SUCCESS]", response.result?.content?.[0]?.text || JSON.stringify(response));
        server.kill();
        process.exit(0);
    } catch { /* keep collecting */ }
});

setTimeout(() => { server.kill(); process.exit(1); }, 5000);
