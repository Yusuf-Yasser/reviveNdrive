import React, { useState, useRef, useEffect, useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Send, Car, Wrench, Clock, Truck, Info } from "lucide-react";

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

  const handleSendMessage = (e) => {
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

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = generateBotResponse(input);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateBotResponse = (userInput) => {
    const userMessage = userInput.toLowerCase();
    let botMessage = "";

    if (userMessage.includes("noise") || userMessage.includes("sound")) {
      botMessage =
        "Based on your description, it could be several things. Car noises can come from the engine, suspension, or brakes. Can you tell me when this noise occurs? (During acceleration, braking, or turning?)";
    } else if (
      userMessage.includes("oil change") ||
      userMessage.includes("maintenance")
    ) {
      botMessage =
        "Regular oil changes are crucial for your engine's health. For most modern cars, it's recommended every 7,500-10,000 miles. Would you like to book a maintenance service?";
    } else if (userMessage.includes("tire") || userMessage.includes("flat")) {
      botMessage =
        "Tire issues can be dangerous. If you have a flat tire, I can help you request a roadside assistance. Or if you need new tires, I can recommend service centers near you.";
    } else if (
      userMessage.includes("battery") ||
      userMessage.includes("won't start")
    ) {
      botMessage =
        "If your car won't start, it might be a battery issue. How old is your battery? Most car batteries last 3-5 years. Would you like information on jump-starting or a tow truck service?";
    } else if (
      userMessage.includes("brake") ||
      userMessage.includes("stopping")
    ) {
      botMessage =
        "Brake issues should never be ignored. If you're experiencing reduced braking power, unusual sounds, or vibrations when braking, I recommend scheduling an inspection immediately.";
    } else if (userMessage.includes("tow") || userMessage.includes("stuck")) {
      botMessage =
        "I can help you request a tow truck. Please share your location, and I'll find the nearest available service.";
    } else if (userMessage.includes("price") || userMessage.includes("cost")) {
      botMessage =
        "Prices vary depending on the service and your car's make and model. I can provide a cost estimate if you tell me more about the specific service you need.";
    } else if (
      userMessage.includes("book") ||
      userMessage.includes("appointment")
    ) {
      botMessage =
        "I'd be happy to help you book an appointment. What service do you need, and what's your preferred date and time?";
    } else {
      botMessage =
        "I'm here to help with any car-related questions or services. You can ask about maintenance, repairs, towing, spare parts, or book an inspection. How can I assist you today?";
    }

    return {
      id: messages.length + 2,
      text: botMessage,
      sender: "bot",
      timestamp: new Date(),
    };
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
