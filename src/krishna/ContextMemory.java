package krishna;

import java.util.*;

public class ContextMemory {

    private Map<String, Integer> lastUsedIndex;
    private List<String> conversationHistory;
    private String lastTopic;

    public ContextMemory() {
        lastUsedIndex = new HashMap<>();
        conversationHistory = new ArrayList<>();
        lastTopic = "wisdom";
    }

    public void addConversation(String user, String bot) {
        conversationHistory.add("User: " + user + " | Bot: " + bot);
    }

    public int getLastUsedIndex(String topic) {
        return lastUsedIndex.getOrDefault(topic, -1);
    }

    public void setLastUsedIndex(String topic, int index) {
        lastUsedIndex.put(topic, index);
    }

    public String getLastTopic() {
        return lastTopic;
    }

    public void setLastTopic(String topic) {
        lastTopic = topic;
    }
}
