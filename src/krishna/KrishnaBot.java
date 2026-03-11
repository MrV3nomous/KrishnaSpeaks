package krishna;

public class KrishnaBot {

    private KnowledgeBase knowledgeBase;
    private IntentDetector intentDetector;
    private ResponseGenerator responseGenerator;
    private ContextMemory contextMemory;
    private LearningModule learningModule;

    public KrishnaBot() {
        knowledgeBase = new KnowledgeBase();
        intentDetector = new IntentDetector();
        responseGenerator = new ResponseGenerator();
        contextMemory = new ContextMemory();
        learningModule = new LearningModule(knowledgeBase);
    }

    public String getResponse(String userInput) {
        // 1. Detect intent/topic
        String intent = intentDetector.detectIntent(userInput);

        // 2. Update context memory with topic
        contextMemory.setLastTopic(intent);

        // 3. Fetch knowledge from the right topic
        String knowledgeLine = knowledgeBase.getKnowledgeForTopic(intent, contextMemory);

        // 4. Generate natural response
        String response = responseGenerator.generateResponse(knowledgeLine, userInput);

        // 5. Store conversation
        contextMemory.addConversation(userInput, response);

        // 6. Optional learning
        learningModule.learnFromConversation(userInput, intent);

        return response;
    }
}
