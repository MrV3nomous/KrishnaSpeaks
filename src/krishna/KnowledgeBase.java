package krishna;

import java.io.*;
import java.util.*;

public class KnowledgeBase {

    private Map<String, List<String>> knowledge;
    private Random random;

    public KnowledgeBase() {
        knowledge = new HashMap<>();
        random = new Random();
        loadAllKnowledge();
    }

    private void loadAllKnowledge() {
        File folder = new File("knowledge");
        File[] files = folder.listFiles();

        if (files != null) {
            for (File file : files) {
                if (file.isFile() && file.getName().endsWith(".txt")) {
                    String topic = file.getName().replace(".txt", "");
                    knowledge.put(topic, loadFileLines(file));
                }
            }
        }
    }

    private List<String> loadFileLines(File file) {
        List<String> lines = new ArrayList<>();
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) lines.add(line.trim());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return lines;
    }

    public String getKnowledgeForTopic(String topic, ContextMemory memory) {
        List<String> lines = knowledge.getOrDefault(topic, knowledge.get("wisdom"));
        if (lines.isEmpty()) return "Hmm... Krishna is thinking!";

        // Ensure no repetition using last used index
        int lastIndex = memory.getLastUsedIndex(topic);
        int nextIndex = (lastIndex + 1) % lines.size();
        memory.setLastUsedIndex(topic, nextIndex);

        return lines.get(nextIndex);
    }

    public void addKnowledge(String topic, String entry) {
        knowledge.putIfAbsent(topic, new ArrayList<>());
        knowledge.get(topic).add(entry);

        // Append to file for persistence
        try (BufferedWriter bw = new BufferedWriter(new FileWriter("knowledge/" + topic + ".txt", true))) {
            bw.write(entry);
            bw.newLine();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
