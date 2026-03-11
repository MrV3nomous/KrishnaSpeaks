package krishna;

public class EmotionAnalyzer {

    public String analyzeEmotion(String input) {
        String text = input.toLowerCase();
        if (text.contains("happy") || text.contains("joy")) return "happy";
        if (text.contains("sad") || text.contains("lonely")) return "sad";
        if (text.contains("curious") || text.contains("wonder")) return "curious";
        return "neutral";
    }
}
