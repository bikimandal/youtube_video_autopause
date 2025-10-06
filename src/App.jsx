import React, { useEffect, useState } from "react";
import { FaYoutube } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { IoMdCheckmarkCircle } from "react-icons/io";

export default function App() {
  const [enabled, setEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const portfolioUrl = "https://bikimandalportfolio.netlify.app";

  useEffect(() => {
    chrome.storage.sync.get(["autoPauseEnabled"], (result) => {
      const storedValue = result.autoPauseEnabled;
      if (storedValue === undefined) {
        chrome.storage.sync.set({ autoPauseEnabled: true });
        setEnabled(true);
      } else {
        setEnabled(storedValue);
      }
    });
  }, []);

  const toggle = () => {
    setIsAnimating(true);
    const newValue = !enabled;
    setEnabled(newValue);
    chrome.storage.sync.set({ autoPauseEnabled: newValue });
    
    setTimeout(() => setIsAnimating(false), 600);

    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id, allFrames: false },
            files: ["content.js"],
          },
          () => {
            chrome.tabs.sendMessage(tab.id, {
              type: "TOGGLE_AUTOPAUSE",
              enabled: newValue,
            });
          }
        );
      }
    });
  };

  return (
    <div className="w-80 h-auto bg-gray-950 shadow-2xl overflow-hidden font-sans select-none border border-gray-800">
      {/* Compact header with gradient */}
      <div className="relative h-20 bg-gradient-to-r from-red-600 via-red-700 to-pink-700 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-pink-300 rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        {/* Logo and title in one line */}
        <div className="relative z-10 flex items-center justify-between h-full px-5">
          <div className="flex items-center gap-3">
            <div className={`bg-gray-950 rounded-lg p-2 shadow-lg transform transition-all duration-500 ${isAnimating ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
              <FaYoutube className="text-red-500 w-8 h-8" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">YouTube AutoPause</h2>
              <p className="text-red-100 text-xs opacity-90">Smart tab management</p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-all duration-300 ${
            enabled ? 'bg-green-900/50 text-green-400 border border-green-800' : 'bg-gray-800/50 text-gray-400 border border-gray-700'
          }`}>
            <div className={`w-1.5 h-1.5 rounded-full ml-2 ${enabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
            {enabled ? 'ON' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Main content - compact */}
      <div className="p-4 space-y-3">
        {/* Compact features in a row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
            <IoMdCheckmarkCircle className="text-green-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-gray-300 font-medium">Auto Pause</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
            <IoMdCheckmarkCircle className="text-green-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-gray-300 font-medium">Auto Resume</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-2 border border-gray-800">
            <IoMdCheckmarkCircle className="text-green-500 mx-auto mb-1" size={20} />
            <p className="text-xs text-gray-300 font-medium">Save Battery</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 text-center px-2 leading-relaxed">
          Automatically pauses videos when you switch tabs and resumes when you return
        </p>

        {/* Toggle button */}
        <button
          onClick={toggle}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
            enabled 
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-red-900/50' 
              : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 shadow-gray-900/50'
          }`}
        >
          <div className="flex items-center justify-center gap-2 cursor-pointer">
            <div className={`relative ${isAnimating ? 'animate-spin' : ''}`}>
              <HiSparkles size={18} />
            </div>
            <span className="text-sm">{enabled ? 'Disable AutoPause' : 'Enable AutoPause'}</span>
          </div>
        </button>
      </div>

      {/* Compact footer */}
      <div className="border-t border-gray-800 px-4 py-2 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">v1.0.0</span>
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-red-500 transition-colors duration-200 font-medium flex items-center gap-1"
          >
            By Biki Mandal
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}