/**
 * Create "Hayuasaka Perfeita" - Potion with MP Regen State
 */
import { spawn } from "node:child_process";

const projectPath = "C:\\Users\\Mags\\Documents\\RMMZ\\Teste";
const enginePath = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\RPG Maker MZ";

const server = spawn("node", ["dist/index.js"], {
    env: { ...process.env, RPGMAKER_PROJECT_PATH: projectPath, RPGMAKER_ENGINE_PATH: enginePath },
    stdio: ["pipe", "pipe", "pipe"],
});

server.stderr.on("data", (data) => console.log(`[STDERR] ${data}`));

const runTest = async () => {
    const send = (method: string, params: any, id: number) => {
        const req = JSON.stringify({ jsonrpc: "2.0", id, method, params });
        server.stdin.write(req + "\n");
    };

    console.log("1. Creating State: Mana Regen (10%)...");
    // Create state first to get its ID
    // Note: State logic updates are in stateTools.ts
    // create_state args: name, regenerateMpRate, minTurns, maxTurns
    send("tools/call", {
        name: "create_state",
        arguments: {
            name: "Mana Regen",
            regenerateMpRate: 10,
            minTurns: 3,
            maxTurns: 5,
            iconIndex: 14 // Potion/Status icon
        }
    }, 1);
};

let stateId = 0;

server.stdout.on("data", (data) => {
    const str = data.toString();
    console.log(`[RESPONSE] ${str}`);

    try {
        const json = JSON.parse(str);
        if (json.id === 1) {
            // Parse State ID from result text "Created state "Mana Regen" with ID 15"
            const content = json.result.content[0].text;
            const match = content.match(/ID (\d+)/);
            if (match) {
                stateId = parseInt(match[1]);
                console.log(`State created with ID: ${stateId}`);

                console.log("2. Creating Item: Hayuasaka Perfeita...");
                // Now create item using this state ID
                const req = JSON.stringify({
                    jsonrpc: "2.0",
                    id: 2,
                    method: "tools/call",
                    params: {
                        name: "create_item",
                        arguments: {
                            name: "Hayuasaka Perfeita",
                            description: "Poção lendária que recupera MP a cada turno.",
                            price: 2500,
                            addStateId: stateId, // THE NEW FEATURE
                            iconIndex: 176, // Potion icon
                            consumable: true
                        }
                    }
                });
                server.stdin.write(req + "\n");
            }
        } else if (json.id === 2) {
            console.log("Item creation check complete.");
            server.kill();
            process.exit(0);
        }
    } catch (e) {
        // partial data
    }
});

setTimeout(runTest, 1000);
setTimeout(() => { server.kill(); process.exit(1); }, 10000);
