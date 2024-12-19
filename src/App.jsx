import "./App.css";
import { useState } from "react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { requestToGroq } from "./utils/groq";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (message) => {
    const userMessage = {
      message: message,
      sentTime: new Date().toLocaleTimeString(),
      sender: "User",
      direction: "outgoing",
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await requestToGroq(message);
      const aiMessage = {
        message: aiResponse,
        sentTime: new Date().toLocaleTimeString(),
        sender: "AI",
        direction: "incoming",
      };


      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        message: "Oops! Something went wrong. Please try again.",
        sentTime: new Date().toLocaleTimeString(),
        sender: "System",
        direction: "incoming",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ position: "relative", height: "100vh", padding: "10px" }}>
      <MainContainer style={{ boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)", borderRadius: "8px" }}>
        <ChatContainer>
          <MessageList 
            typingIndicator={isTyping && <TypingIndicator content="AI is typing..." />}
          >
            <div>
              <div style={{ textAlign: "center", padding: "10px", color: "#999" }}>
                Chatbot
              </div>
            </div>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
                Hello there! How can I help you today? Im a chatbot. Ask me anything!
              </div>
            ) : (
              messages.map((msg, index) => (
                <Message key={index} model={msg} />
              ))
            )}
          </MessageList>
          <MessageInput
            placeholder="Type your message here..."
            onSend={handleSend}
            style={{ boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.1)" }}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default App;
