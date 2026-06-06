package krishna;

import java.util.ArrayList;
import java.util.List;

public class ContextMemory {

    private final List<String> turnSummaries;
    private static final int MAX_MEMORY_TURNS = 10; 

    public ContextMemory() {
        this.turnSummaries = new ArrayList<>();
    }

    public void addSummary(String summary) {
        turnSummaries.add(summary);
        if (turnSummaries.size() > MAX_MEMORY_TURNS) {
            turnSummaries.remove(0); 
        }
    }

    public String getCompiledContext() {
        if (turnSummaries.isEmpty()) {
            return "No prior context.";
        }
        return String.join(" | ", turnSummaries);
    }
}