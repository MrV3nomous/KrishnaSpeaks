package krishna;

public class LearningModule {

    private KnowledgeBase knowledgeBase;

    public LearningModule(KnowledgeBase kb) {
        knowledgeBase = kb;
    }

    public void learnFromConversation(String userInput, String topic) {
        // Only learn if input is meaningful
        if (userInput.length() > 30 && !userInput.toLowerCase().contains("exit") && !userInput.toLowerCase().contains("quit")) {
            // Save to the correct topic
            knowledgeBase.addKnowledge(topic, userInput);
        }
    }
}
