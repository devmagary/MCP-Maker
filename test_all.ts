
/**
 * Verification Script for All New Database Tools
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

    // 1. Create State (MP Regen)
    send("tools/call", {
        name: "create_state", arguments: {
            name: "MP Regen Test",
            regenerateMpRate: 10,
            minTurns: 3,
            maxTurns: 5
        }
    }, 1);

    // 2. Create Enemy
    send("tools/call", {
        name: "create_enemy", arguments: {
            name: "Test Goblin",
            maxHp: 500,
            atk: 50,
            exp: 100,
            gold: 50
        }
    }, 2);

    // 3. Create Armor
    send("tools/call", {
        name: "create_armor", arguments: {
            name: "Test Shield",
            def: 20,
            price: 500,
            etypeId: 2
        }
    }, 3);

    // 4. Create Class
    send("tools/call", {
        name: "create_class", arguments: {
            name: "Test Class",
            expBase: 20,
            expAccel: 20
        }
    }, 4);

    // 5. Create Actor
    send("tools/call", {
        name: "create_actor", arguments: {
            name: "Test Hero",
            nickname: "Tester",
            classId: 1,
            initialLevel: 5
        }
    }, 5);
};

let responses = 0;
server.stdout.on("data", (data) => {
    const str = data.toString();
    console.log(`[RESPONSE] ${str}`);
    responses++;
    if (responses >= 5) {
        console.log("All tests completed.");
        server.kill();
        process.exit(0);
    }
});

setTimeout(runTest, 1000);
setTimeout(() => { server.kill(); process.exit(0); }, 8000);
