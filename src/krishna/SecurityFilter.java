package krishna;

public class SecurityFilter {

    private static final int MAX_CHARS = 400;

    public static boolean isValidInput(String input) {
        if (input == null || input.trim().isEmpty() || input.length() > MAX_CHARS) {
            return false;
        }
        if (!input.matches(".*[aeiouAEIOU].*")) {
            return false;
        }
        if (input.matches(".*(.)\\1{4,}.*")) {
            return false;
        }
        String alphaNumeric = input.replaceAll("[^a-zA-Z0-9 ]", "");
        return alphaNumeric.length() >= (input.length() / 2);
    }

    public static String sanitize(String input) {
        return input.replaceAll("[\\p{Cntrl}&&[^\r\n\t]]", "").trim();
    }
}