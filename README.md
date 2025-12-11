# RPG Maker MZ MCP Server 🎮✨

A powerful **Model Context Protocol (MCP)** server that allows AI agents (like Claude, Gemini, or Copilot) to directly manipulate **RPG Maker MZ** projects.

With this tool, you can ask your AI to "Create a fire sword", "Make a potion that regenerates mana", or "Generate a new map", and it will modify the game files directly!

## 🚀 Features

### 📦 Database Management (Full CRUD)
Create, Read, and Update almost any database asset:
- **Items:** Create potions, keys, and hidden items. Support for HP/MP recovery and state application.
- **Weapons & Armors:** Create equipment with stats, prices, and elemental effects.
- **Enemies:** Define stats (HP/MP/ATK...), drops, and rewards (EXP/Gold).
- **States:** Create status effects (e.g., Poison, Regen, Stun) with traits.
- **Actors & Classes:** Create new heroes and classes with level curves and traits.
- **Skills:** Define magic and special attacks.

### 🗺️ Map & World
- **Create Maps:** Generate new map files (`MapXXX.json`) with metadata (size, tileset, BGM).
- **List Maps:** See all maps in your project hierarchy.

### 🧩 Plugin & Resources
- **Plugin Installer:** Automatically creates `.js` files in `js/plugins` and registers them in `plugins.js`.
- **Resource Scanner:** List available graphics (`img/`), audio (`audio/`), and DLC packages.

### 🛡️ Safety First
- **Atomic Writes:** Uses a `SafeWriter` to prevent data corruption.
- **Editor Sync:** Automatically updates `System.json` version ID, forcing the RPG Maker MZ editor to reload data and preventing conflicts.

---

## 🛠️ Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/devmagary/MCP-Maker.git
    cd MCP-Maker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Build the project:**
    ```bash
    npm run build
    ```

---

## ⚙️ Configuration

You need to tell the MCP client where your RPG Maker MZ project and engine are located.

### Environment Variables
- `RPGMAKER_PROJECT_PATH`: Full path to your game project (where `game.rmmzproject` is).
- `RPGMAKER_ENGINE_PATH`: Full path to RPG Maker MZ installation (usually Steam folder).

### configuration Examples

#### VS Code (Claude Dev / Copilot)
Add to your settings or MCP config:
```json
{
  "mcpServers": {
    "rpgmaker-mz": {
      "command": "node",
      "args": ["C:/path/to/MCP-Maker/dist/index.js"],
      "env": {
        "RPGMAKER_PROJECT_PATH": "C:/Users/You/Documents/RMMZ/MyGame",
        "RPGMAKER_ENGINE_PATH": "C:/Program Files (x86)/Steam/steamapps/common/RPG Maker MZ"
      }
    }
  }
}
```

#### Claude Desktop
Edit `%APPDATA%\Claude\claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "rpgmaker-mz": {
      "command": "node",
      "args": ["C:\\path\\to\\MCP-Maker\\dist\\index.js"],
      "env": {
        "RPGMAKER_PROJECT_PATH": "C:\\Users\\You\\Documents\\RMMZ\\MyGame",
        "RPGMAKER_ENGINE_PATH": "C:\\Program Files (x86)\\Steam\\steamapps\\common\\RPG Maker MZ"
      }
    }
  }
}
```

---

## 💻 Tech Stack
- **TypeScript**: Strictly typed for robustness.
- **Zod**: Runtime schema validation for all tool inputs.
- **MCP SDK**: Official Model Context Protocol SDK.
- **Node.js**: Runtime environment.

## 🤝 Contributing
Feel free to open issues or submit PRs if you want to add more features (e.g., Event creation support)!

---

Created with ❤️ by **DevMagary** & **Antigravity**.
