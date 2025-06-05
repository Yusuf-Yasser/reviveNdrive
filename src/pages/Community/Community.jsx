import React, { useState, useContext } from 'react';
import { ThemeContext } from "../../contexts/ThemeContext";
import { Search, MessageSquare, ThumbsUp, User, Clock, Tag, Filter, Plus } from 'lucide-react';

const Community = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    'All Topics',
    'General Discussion',
    'Maintenance Tips',
    'Troubleshooting',
    'Car Reviews',
    'DIY Guides'
  ];

  const discussions = [
    {
      id: 1,
      title: "Strange noise when starting car in cold weather",
      author: "John Smith",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Troubleshooting",
      content: "Every morning when it's below 40°F, my 2019 Toyota Camry makes a weird clicking sound when starting. Anyone else experienced this?",
      timestamp: "2 hours ago",
      replies: 8,
      likes: 12,
      tags: ["Toyota", "Starting Issues", "Cold Weather"]
    },
    {
      id: 2,
      title: "Complete guide to changing brake pads",
      author: "Sarah Chen",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "DIY Guides",
      content: "I've put together a step-by-step guide for changing brake pads, including tools needed and safety precautions.",
      timestamp: "1 day ago",
      replies: 15,
      likes: 45,
      tags: ["DIY", "Brakes", "Maintenance"]
    },
    {
      id: 3,
      title: "2025 Tesla Model 3 Long Range Review",
      author: "Mike Rodriguez",
      avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      category: "Car Reviews",
      content: "After 6 months with the new Model 3, here's my detailed review covering range, performance, and build quality.",
      timestamp: "3 days ago",
      replies: 32,
      likes: 89,
      tags: ["Tesla", "EV", "Review"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-grow">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Community Discussions</h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Plus size={20} />
              <span>New Discussion</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} mb-6`}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300'
                  } focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="replies">Most Replies</option>
              </select>
            </div>
          </div>

          {/* Discussions */}
          <div className="space-y-6">
            {discussions.map(discussion => (
              <div
                key={discussion.id}
                className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={discussion.avatar}
                    alt={discussion.author}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{discussion.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        isDarkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {discussion.category}
                      </span>
                    </div>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {discussion.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`px-2 py-1 rounded-full text-sm ${
                            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare size={16} className="text-gray-400" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp size={16} className="text-gray-400" />
                          <span>{discussion.likes} likes</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <User size={16} />
                        <span>{discussion.author}</span>
                        <span>•</span>
                        <Clock size={16} />
                        <span>{discussion.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-6">
          {/* Categories */}
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="font-semibold mb-4">Categories</h2>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                    activeCategory === category
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Tags */}
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="font-semibold mb-4">Popular Tags</h2>
            <div className="flex flex-wrap gap-2">
              {['Maintenance', 'DIY', 'Repairs', 'Toyota', 'Honda', 'Tesla', 'Tips', 'Safety'].map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Community Guidelines */}
          <div className={`rounded-xl shadow-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="font-semibold mb-4">Community Guidelines</h2>
            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>• Be respectful and helpful</li>
              <li>• Stay on topic</li>
              <li>• No spam or self-promotion</li>
              <li>• Use appropriate tags</li>
              <li>• Report inappropriate content</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;