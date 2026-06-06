package krishna;

public class KrishnaBot {

    private final GroqService groqService;
    private final ContextMemory contextMemory;

    public KrishnaBot() {
        this.groqService = new GroqService();
        this.contextMemory = new ContextMemory();
    }

    public String getResponse(String rawUserInput) {
        String userInput = SecurityFilter.sanitize(rawUserInput);
        String context = contextMemory.getCompiledContext();

        // Step 1: Query Persona Core
        String aiResponse = groqService.fetchKrishnaResponse(context, userInput);

        // Step 2: Background Summarization Pass
        String summary = groqService.generateTurnSummary(userInput, aiResponse);
        contextMemory.addSummary(summary);

        return aiResponse;
    }
}