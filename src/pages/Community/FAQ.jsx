import React, { useState, useContext } from 'react';
import { ThemeContext } from "../../contexts/ThemeContext";
import { Search, ChevronDown, ChevronUp, Wrench, Car, Clock, DollarSign, AlertTriangle } from 'lucide-react';

const FAQ = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: Wrench },
    { id: 'maintenance', name: 'Maintenance', icon: Car },
    { id: 'services', name: 'Services', icon: Clock },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'emergency', name: 'Emergency', icon: AlertTriangle }
  ];

  const faqs = [
    {
      id: 1,
      category: 'maintenance',
      question: "How often should I change my car's oil?",
      answer: "For most modern cars, it's recommended to change the oil every 7,500-10,000 miles or once a year, whichever comes first. However, if you frequently drive in severe conditions (extreme temperatures, dusty roads, frequent short trips), you might need more frequent changes. Always check your owner's manual for specific recommendations."
    },
    {
      id: 2,
      category: 'services',
      question: "What's included in a basic car inspection?",
      answer: "A basic car inspection typically includes checking: brake system, tire condition and pressure, fluid levels (oil, coolant, brake fluid, etc.), battery health, lights and signals, windshield wipers, and basic engine diagnostics. Our certified mechanics will provide a detailed report of findings and recommendations."
    },
    {
      id: 3,
      category: 'pricing',
      question: "How are service prices calculated?",
      answer: "Service prices are calculated based on several factors: type of service required, parts needed, labor time, and your vehicle's make and model. We provide transparent pricing with no hidden fees, and you'll always receive a detailed quote before any work begins."
    },
    {
      id: 4,
      category: 'emergency',
      question: "What should I do if my car breaks down on the road?",
      answer: "If your car breaks down: 1) Pull over safely to the shoulder 2) Turn on hazard lights 3) Stay in your car if it's unsafe to exit 4) Call our 24/7 emergency service or use our app to request immediate assistance. Our tow truck service will arrive within 30-45 minutes in most areas."
    }
  ];

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => 
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const filteredFaqs = faqs.filter(faq => 
    (activeCategory === 'all' || faq.category === activeCategory) &&
    (searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Find answers to common questions about our services and car maintenance
        </p>
      </div>

      {/* Search Bar */}
      <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-8`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for questions..."
            className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300'
            } focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-4 mb-8">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 hover:bg-gray-700'
                    : 'bg-white hover:bg-gray-100'
              }`}
            >
              <Icon size={18} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFaqs.map(faq => (
          <div
            key={faq.id}
            className={`rounded-xl shadow-lg overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <button
              onClick={() => toggleQuestion(faq.id)}
              className="w-full px-6 py-4 flex items-center justify-between"
            >
              <span className="font-medium text-left">{faq.question}</span>
              {expandedQuestions.includes(faq.id) ? (
                <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {expandedQuestions.includes(faq.id) && (
              <div className={`px-6 pb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className={`mt-12 rounded-xl shadow-lg p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <h2 className="text-xl font-semibold mb-4">Can't find what you're looking for?</h2>
        <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Our support team is here to help you with any questions you might have
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/contact" 
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Contact Support
          </a>
          <a 
            href="/chatbot" 
            className={`px-6 py-3 ${
              isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            } font-medium rounded-lg transition-colors duration-200`}
          >
            Chat with AI Assistant
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;