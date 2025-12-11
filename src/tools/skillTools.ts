/**
 * Skill Tools - create_skill, get_skills
 */

import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { FileHandler } from "../utils/fileHandler.js";
import { SafeWriter } from "../utils/safeWriter.js";
import type { RPGSkill, RPGDamage } from "../utils/types.js";
import { Scope, Occasion, DamageType } from "../utils/types.js";

const createSkillSchema = z.object({
    name: z.string().describe("Skill name"),
    description: z.string().describe("Skill description"),
    mpCost: z.number().int().min(0).default(0).describe("MP cost"),
    tpCost: z.number().int().min(0).default(0).describe("TP cost"),
    iconIndex: z.number().int().min(0).default(0).describe("Icon index"),
    scope: z.number().int().min(0).max(11).default(1).describe("Skill scope"),
    damageType: z.number().int().min(0).max(6).default(1).describe("Damage type"),
    damageFormula: z.string().default("a.atk * 4 - b.def * 2").describe("Damage formula"),
});

function createDefaultDamage(): RPGDamage {
    return {
        type: DamageType.HPDamage,
        elementId: 0,
        formula: "a.atk * 4 - b.def * 2",
        variance: 20,
        critical: false,
    };
}

function createDefaultSkill(id: number): RPGSkill {
    return {
        id,
        name: "",
        description: "",
        iconIndex: 0,
        stypeId: 1,
        scope: Scope.OneEnemy,
        occasion: Occasion.Battle,
        mpCost: 0,
        tpCost: 0,
        damage: createDefaultDamage(),
        effects: [],
        requiredWtypeId1: 0,
        requiredWtypeId2: 0,
        speed: 0,
        successRate: 100,
        repeats: 1,
        tpGain: 0,
        hitType: 1,
        animationId: 0,
        message1: "",
        message2: "",
        note: "",
    };
}

export function registerSkillTools(server: McpServer, fileHandler: FileHandler, safeWriter: SafeWriter) {
    // get_skills - List all skills
    server.tool(
        "get_skills",
        "Get all skills from the database",
        {},
        async () => {
            try {
                const skills = await fileHandler.readJson<(RPGSkill | null)[]>("data/Skills.json");
                const skillList = skills
                    .filter((s): s is RPGSkill => s !== null && s.name !== "")
                    .map((s) => ({
                        id: s.id,
                        name: s.name,
                        description: s.description,
                        mpCost: s.mpCost,
                        tpCost: s.tpCost,
                        iconIndex: s.iconIndex,
                    }));

                return {
                    content: [{ type: "text" as const, text: JSON.stringify(skillList, null, 2) }],
                };
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error: ${error}` }],
                    isError: true,
                };
            }
        }
    );

    // create_skill - Create a new skill
    server.tool(
        "create_skill",
        "Create a new skill in the database",
        createSkillSchema.shape,
        async (args) => {
            try {
                const { name, description, mpCost, tpCost, iconIndex, scope, damageType, damageFormula } = args;

                const skills = await fileHandler.readJson<(RPGSkill | null)[]>("data/Skills.json");
                const newId = skills.length;

                const newSkill = createDefaultSkill(newId);
                newSkill.name = name;
                newSkill.description = description;
                newSkill.mpCost = mpCost;
                newSkill.tpCost = tpCost;
                newSkill.iconIndex = iconIndex;
                newSkill.scope = scope;
                newSkill.damage.type = damageType;
                newSkill.damage.formula = damageFormula;

                skills.push(newSkill);
                await safeWriter.writeToDatabase("Skills.json", skills);

                return {
                    content: [
                        {
                            type: "text" as const,
                            text: `Created skill "${name}" with ID ${newId}`,
                        },
                    ],
                };
            } catch (error) {
                return {
                    content: [{ type: "text" as const, text: `Error: ${error}` }],
                    isError: true,
                };
            }
        }
    );
}
