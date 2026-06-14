import fs from 'fs';
import { KNOWLEDGE_BASE } from './knowledge.js';

function createId(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/(^_|_$)/g, '')
        .substring(0, 40);
}

function transformLibrary(oldData) {
    const flatNodes = [];

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

    if (oldData.scriptures) {
        Object.entries(oldData.scriptures).forEach(([book, content]) => {
            if (Array.isArray(content)) {
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

console.log("Starting data transformation to RAG Node Model...");
const databaseNodes = transformLibrary(KNOWLEDGE_BASE);

fs.writeFileSync('knowledge_nodes.json', JSON.stringify(databaseNodes, null, 2), 'utf8');

const jsContent = `export const KNOWLEDGE_NODES = ${JSON.stringify(databaseNodes, null, 4)};\n`;
fs.writeFileSync('knowledge_nodes.js', jsContent, 'utf8');

console.log(`Transformation complete! Generated ${databaseNodes.length} stable nodes.`);
console.log("Check 'knowledge_nodes.json' and 'knowledge_nodes.js'.");