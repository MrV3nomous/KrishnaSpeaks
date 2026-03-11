package krishna;

import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        intro();
        Scanner scanner = new Scanner(System.in);
        KrishnaBot bot = new KrishnaBot();

        while (true) {
            System.out.print("You: ");
            String input = scanner.nextLine().trim();

            if (input.equalsIgnoreCase("exit") || input.equalsIgnoreCase("quit")) {
                System.out.println("🙏 Hare Krishna! May Krishna bless you.");
                break;
            }

            String response = bot.getResponse(input);
            System.out.println("Krishna: " + response);
        }

        scanner.close();
    }

    private static void intro() {
        final String BLUE = "\u001B[34m";
        final String CYAN = "\u001B[36m";
        final String YELLOW = "\u001B[33m";
        final String MAGENTA = "\u001B[35m";
        final String RESET = "\u001B[0m";

        System.out.println("\n" + CYAN + "          🌸  Krishna Speaks  🌸" + RESET);
        System.out.println(YELLOW +  "           ————————————————————" + RESET);
        System.out.println(MAGENTA + "           🕉️  Chant, Listen, Reflect  🎵" + RESET);
        System.out.println(CYAN + "\n      Welcome, dear devotee, to a serene space\n      where Krishna’s wisdom unfolds." + RESET);
        System.out.println(YELLOW + "\n śrī-kṛṣṇa-caitanya prabhu-nityānanda śrī-advaita gadādhara śrīvāsādi" + RESET);
        System.out.println(CYAN + "\n Type 'exit' to leave this divine conversation.\n" + RESET);
        System.out.println(MAGENTA + "               ॐ   ॐ   ॐ" + RESET);
        System.out.println(MAGENTA + "            🌸     🌸     🌸" + RESET);
        System.out.println();
    }
}
