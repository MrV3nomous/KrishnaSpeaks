package krishna;

import java.util.*;

public class ResponseGenerator {

    private Map<String, List<String>> templates;

    public ResponseGenerator() {
        templates = new HashMap<>();
        initTemplates();
    }

    private void initTemplates() {
        // Default templates for topics and emotions
        templates.put("happy", Arrays.asList(
            "Ah, joy fills the heart! %s",
            "Happiness is beautiful. Remember: %s",
            "Delight in Krishna’s pastimes: %s"
        ));
        templates.put("sad", Arrays.asList(
            "Fear not, devotee. %s",
            "Patience and devotion are key. %s",
            "Let Krishna’s wisdom guide you: %s"
        ));
        templates.put("curious", Arrays.asList(
            "Ah, you seek knowledge! %s",
            "Curiosity leads to devotion: %s",
            "Let me tell you: %s"
        ));
        templates.put("neutral", Arrays.asList(
            "%s",
            "Indeed: %s",
            "Consider this: %s"
        ));
    }

    public String generateResponse(String knowledgeLine, String userInput) {
        EmotionAnalyzer emotionAnalyzer = new EmotionAnalyzer();
        String emotion = emotionAnalyzer.analyzeEmotion(userInput);

        List<String> selectedTemplates = templates.getOrDefault(emotion, templates.get("neutral"));
        Random rand = new Random();
        String template = selectedTemplates.get(rand.nextInt(selectedTemplates.size()));

        return String.format(template, knowledgeLine);
    }
}
