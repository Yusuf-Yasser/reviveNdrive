import React, { useState, useRef, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Send, Car, Wrench, Clock, Truck, Info } from "lucide-react";
import axios from "axios";

const SYSTEM_PROMPT = `You are an expert automotive mechanic AI assistant. You have deep knowledge of car mechanics, diagnostics, maintenance, and repairs. Your role is to:
1. Help diagnose car problems based on symptoms
2. Provide maintenance advice and schedules
3. Explain repair procedures and estimated costs
4. Offer safety tips and best practices
5. Guide users on whether an issue requires immediate professional attention

Keep responses focused on automotive topics. If you're unsure about something, err on the side of recommending professional inspection for safety.`;

const ChatBot = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI Mechanic Assistant. How can I help you with your car today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateBotResponse = async (userInput) => {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct:free", // A good balance of performance and cost
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            ...messages.map(msg => ({
              role: msg.sender === "user" ? "user" : "assistant",
              content: msg.text
            })),
            {
              role: "user",
              content: userInput
            }
          ]
        },
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer": window.location.origin,
            "X-Title": "Car Service AI Mechanic",
          }
        }
      );

      const botMessage = response.data.choices[0].message.content;
      return {
        id: messages.length + 2,
        text: botMessage,
        sender: "bot",
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Error generating response:", error);
      return {
        id: messages.length + 2,
        text: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add user message
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const botResponse = await generateBotResponse(input);
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error in chat:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-3/4">
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {/* Chat header */}
            <div
              className={`p-4 border-b ${
                isDarkMode
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-gray-50"
              } flex items-center justify-between`}
            >
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Wrench
                    size={20}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">AI Mechanic Assistant</h2>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-1">
                <Clock size={16} />
                <span>24/7 Support</span>
              </div>
            </div>

            {/* Chat messages */}
            <div className="h-[500px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : isDarkMode
                        ? "bg-gray-700 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p
                      className={`text-xs text-right mt-1 ${
                        message.sender === "user"
                          ? "text-blue-200"
                          : isDarkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`flex-grow px-4 py-2 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ask about your car issues..."
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-6">
          <div
            className={`rounded-xl shadow-lg p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="font-semibold text-lg mb-3">Suggested Topics</h3>
            <div className="space-y-2">
              <button
                onClick={() => setInput("My car is making a strange noise")}
                className={`w-full text-left p-2 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                My car is making a strange noise
              </button>
              <button
                onClick={() => setInput("When should I change my oil?")}
                className={`w-full text-left p-2 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                When should I change my oil?
              </button>
              <button
                onClick={() => setInput("I need a tow truck")}
                className={`w-full text-left p-2 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                I need a tow truck
              </button>
              <button
                onClick={() => setInput("What's the cost of a basic service?")}
                className={`w-full text-left p-2 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                } transition-colors duration-200`}
              >
                What's the cost of a basic service?
              </button>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-4 ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h3 className="font-semibold text-lg mb-3">Quick Services</h3>
            <div className="space-y-2">
              <a
                href="/inspection"
                className="flex items-center space-x-2 p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                <Car size={18} />
                <span>Book Car Inspection</span>
              </a>
              <a
                href="/tow-truck"
                className="flex items-center space-x-2 p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                <Truck size={18} />
                <span>Request Tow Truck</span>
              </a>
              <a
                href="/spare-parts"
                className="flex items-center space-x-2 p-2 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              >
                <Wrench size={18} />
                <span>Find Spare Parts</span>
              </a>
            </div>
          </div>

          <div
            className={`rounded-xl shadow-lg p-4 ${
              isDarkMode ? "bg-gray-800 bg-opacity-50" : "bg-blue-50"
            }`}
          >
            <div className="flex items-start space-x-2">
              <Info size={18} className="text-blue-600 mt-1 flex-shrink-0" />
              <p className="text-sm">
                Our AI assistant can help diagnose issues, but for critical
                safety concerns, please consult with a certified mechanic
                immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
