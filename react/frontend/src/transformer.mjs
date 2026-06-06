import fs from 'fs';
import { KNOWLEDGE_BASE } from './knowledge.js';

// Helper function to create clean, database-friendly, stable IDs
function createId(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric chars with underscores
        .replace(/(^_|_$)/g, '')     // Remove leading or trailing underscores
        .substring(0, 40);           // Keep it reasonably short
}

function transformLibrary(oldData) {
    const flatNodes = [];

    // 1. Process Philosophy
    if (oldData.philosophy) {
        oldData.philosophy.forEach((topic, index) => {
            flatNodes.push({
                id: `phi_${createId(topic)}_${index}`,
                label: topic,
                type: "topic",
                category: "Philosophy",
                path: ["Philosophy"]
            });
        });
    }

    // 2. Process Gita
    if (oldData.gita) {
        Object.entries(oldData.gita).forEach(([chapter, topics]) => {
            topics.forEach((topic, index) => {
                flatNodes.push({
                    id: `gita_${createId(chapter)}_${index}`,
                    label: topic,
                    type: "topic",
                    category: "Gita",
                    path: ["Gita", chapter]
                });
            });
        });
    }

    // 3. Process Scriptures (Handling both Arrays and Nested Objects)
    if (oldData.scriptures) {
        Object.entries(oldData.scriptures).forEach(([book, content]) => {
            if (Array.isArray(content)) {
                // Flat array case (e.g., Revealed Scriptures)
                content.forEach((topic, index) => {
                    flatNodes.push({
                        id: `scr_${createId(book)}_${index}`,
                        label: topic,
                        type: "topic",
                        category: "Library",
                        path: ["Library", book]
                    });
                });
            } else {
                // Nested Sub-section case (e.g., Mahabharata, Bhagavatam)
                Object.entries(content).forEach(([section, topics]) => {
                    topics.forEach((topic, index) => {
                        flatNodes.push({
                            id: `scr_${createId(book)}_${createId(section)}_${index}`,
                            label: topic,
                            type: "topic",
                            category: "Library",
                            path: ["Library", book, section]
                        });
                    });
                });
            }
        });
    }

    return flatNodes;
}

// ---------------------------------------------------------
// EXECUTE THE TRANSFORMATION
// ---------------------------------------------------------
console.log("Starting data transformation to RAG Node Model...");
const databaseNodes = transformLibrary(KNOWLEDGE_BASE);

// Write to a pure JSON file (Perfect for importing into PostgreSQL / Supabase)
fs.writeFileSync('knowledge_nodes.json', JSON.stringify(databaseNodes, null, 2), 'utf8');

// Write to a JS file so you can still easily import it into your React app
const jsContent = `export const KNOWLEDGE_NODES = ${JSON.stringify(databaseNodes, null, 4)};\n`;
fs.writeFileSync('knowledge_nodes.js', jsContent, 'utf8');

console.log(`Transformation complete! Generated ${databaseNodes.length} stable nodes.`);
console.log("Check 'knowledge_nodes.json' and 'knowledge_nodes.js'.");