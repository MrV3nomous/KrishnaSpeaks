package krishna;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Main extends JFrame {

    private JTextArea chatArea;
    private JTextField inputField;
    private JButton sendButton;
    private KrishnaBot bot;

    public Main() {
        bot = new KrishnaBot();
        initializeUI();
    }

    private void initializeUI() {
        setTitle("🌸 Krishna Speaks (Groq Edition) 🌸");
        setSize(600, 700);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        Color bgDark = new Color(18, 24, 38);
        Color panelDark = new Color(30, 41, 59);
        Color textColor = new Color(241, 245, 249);
        Color accentColor = new Color(234, 179, 8);
        Font font = new Font("SansSerif", Font.PLAIN, 14);
        chatArea = new JTextArea();
        chatArea.setEditable(false);
        chatArea.setLineWrap(true);
        chatArea.setWrapStyleWord(true);
        chatArea.setBackground(bgDark);
        chatArea.setForeground(textColor);
        chatArea.setFont(font);
        chatArea.setMargin(new Insets(15, 15, 15, 15));

        JScrollPane scrollPane = new JScrollPane(chatArea);
        scrollPane.setBorder(null);
        JPanel inputPanel = new JPanel(new BorderLayout(10, 0));
        inputPanel.setBackground(panelDark);
        inputPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        inputField = new JTextField();
        inputField.setBackground(bgDark);
        inputField.setForeground(textColor);
        inputField.setCaretColor(textColor);
        inputField.setFont(font);
        inputField.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(71, 85, 105)),
                BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));

        sendButton = new JButton("Send");
        sendButton.setBackground(accentColor);
        sendButton.setForeground(Color.BLACK);
        sendButton.setFont(new Font("SansSerif", Font.BOLD, 14));
        sendButton.setFocusPainted(false);
        sendButton.setBorder(BorderFactory.createEmptyBorder(8, 20, 8, 20));

        inputPanel.add(inputField, BorderLayout.CENTER);
        inputPanel.add(sendButton, BorderLayout.EAST);

        setLayout(new BorderLayout());
        add(scrollPane, BorderLayout.CENTER);
        add(inputPanel, BorderLayout.SOUTH);

        chatArea.append("🌸 Hare Krishna! Welcome, dear soul. Type your thoughts below...\n\n");

        ActionListener sendAction = e -> processMessage();
        sendButton.addActionListener(sendAction);
        inputField.addActionListener(sendAction);
    }

    private void processMessage() {
        String text = inputField.getText().trim();
        if (text.isEmpty()) return;

        inputField.setText("");
        chatArea.append("You: " + text + "\n\n");


        if (!SecurityFilter.isValidInput(text)) {
            animateText("Krishna: Please speak clearly from the heart, dear soul. I cannot accept these words.\n\n");
            return;
        }

        setLoadingState(true);
        chatArea.append("Krishna: ⚖️ Contemplating eternal truths... Please wait.\n");
        int loadingPlaceholderIndex = chatArea.getText().lastIndexOf("Krishna: ⚖️");

        SwingWorker<String, Void> worker = new SwingWorker<>() {
            @Override
            protected String doInBackground() {
                return bot.getResponse(text);
            }

            @Override
            protected void done() {
                try {
                    String response = get();
                    String currentText = chatArea.getText();
                    if (loadingPlaceholderIndex != -1 && loadingPlaceholderIndex < currentText.length()) {
                        chatArea.setText(currentText.substring(0, loadingPlaceholderIndex));
                    }
                    
                    chatArea.append("Krishna: ");
                    animateText(response + "\n\n");
                } catch (Exception ex) {
                    chatArea.append("Krishna: The material energy disrupts our connection. Try again.\n\n");
                } finally {
                    setLoadingState(false);
                }
            }
        };
        worker.execute();
    }

    private void setLoadingState(boolean isLoading) {
        inputField.setEnabled(!isLoading);
        sendButton.setEnabled(!isLoading);
        if (!isLoading) {
            inputField.requestFocusInWindow();
        }
    }

    private void animateText(String fullText) {
        Timer timer = new Timer(10, null);
        final int[] index = {0};

        timer.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                if (index[0] < fullText.length()) {
                    chatArea.append(String.valueOf(fullText.charAt(index[0])));
                    index[0]++;
                    chatArea.setCaretPosition(chatArea.getDocument().getLength());
                } else {
                    timer.stop();
                }
            }
        });
        timer.start();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            System.setProperty("file.encoding", "UTF-8");
            new Main().setVisible(true);
        });
    }
}