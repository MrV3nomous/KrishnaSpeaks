package krishna;

import java.util.*;

public class IntentDetector {

    private Map<String, List<String>> keywords;

    public IntentDetector() {
        keywords = new HashMap<>();
        // Map keywords to knowledge topics
        keywords.put("greetings", Arrays.asList("hello", "hare krishna", "hi", "radhe"));
        keywords.put("vrindavan", Arrays.asList("vrindavan", "gokul", "barsana", "mathura", "braj"));
        keywords.put("gita_quotes", Arrays.asList("gita", "bhagavad gita", "verse"));
        keywords.put("stories", Arrays.asList("story", "leela", "childhood", "govardhan", "flute"));
        keywords.put("wisdom", Arrays.asList("wisdom", "knowledge", "life", "peace", "devotion"));
        keywords.put("janmashtami", Arrays.asList("janmashtami", "birthday"));
        keywords.put("holi", Arrays.asList("holi", "festival"));
        keywords.put("radhashtami", Arrays.asList("radhashtami", "radha"));
        keywords.put("mathura", Arrays.asList("mathura"));
        keywords.put("braj_regions", Arrays.asList("braj", "braj regions"));
        keywords.put("bhakti", Arrays.asList("bhakti", "devotion", "chanting"));
        keywords.put("karma", Arrays.asList("karma", "duty", "action"));
        keywords.put("maya", Arrays.asList("maya", "illusion", "material"));
        keywords.put("food", Arrays.asList("prasadam", "food"));
        keywords.put("animals", Arrays.asList("cow", "bull", "peacock", "animal"));
        keywords.put("art_music", Arrays.asList("music", "flute", "art", "song"));
        keywords.put("chants", Arrays.asList("chant", "mantra", "bhajan"));
        keywords.put("meditation", Arrays.asList("meditate", "meditation", "yoga", "mindfulness"));
    }

    public String detectIntent(String input) {
        String text = input.toLowerCase();

        for (String topic : keywords.keySet()) {
            for (String key : keywords.get(topic)) {
                if (text.contains(key)) {
                    return topic;
                }
            }
        }

        // Fallback to general wisdom
        return "wisdom";
    }
}
