import { useEffect, useState } from "react";
import { FaYoutube, FaPlayCircle, FaPauseCircle } from "react-icons/fa";
import { MdSettings } from "react-icons/md";

export default function App() {
  const [enabled, setEnabled] = useState(true);

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
    const newValue = !enabled;
    setEnabled(newValue);
    chrome.storage.sync.set({ autoPauseEnabled: newValue });

    // 🔥 Get all open YouTube tabs
    chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
      for (const tab of tabs) {
        // ✅ 1. Dynamically inject content script (if not already)
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id, allFrames: false }, // ✅ only main frame
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
    <div className="p-5 bg-gray-900 text-white w-72 shadow-xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaYoutube className="text-red-500 text-2xl" />
          <h1 className="text-lg font-semibold tracking-wide">
            YouTube AutoPause
          </h1>
        </div>
        <MdSettings className="text-gray-400 hover:text-gray-300 cursor-pointer text-xl" />
      </div>

      {/* Status Card */}
      <div
        className={`rounded-lg flex flex-col items-center justify-center py-4 mb-4 transition-colors ${enabled ? "bg-green-600/20" : "bg-gray-700/40"
          }`}
      >
        {enabled ? (
          <FaPlayCircle className="text-green-400 text-4xl mb-1" />
        ) : (
          <FaPauseCircle className="text-gray-400 text-4xl mb-1" />
        )}
        <p className="text-sm font-medium">
          {enabled ? "AutoPause is Active" : "AutoPause is Disabled"}
        </p>
      </div>

      {/* Toggle Switch */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-xl mb-3">
        <span className="text-sm font-medium">Enable AutoPause</span>
        <button
          onClick={toggle}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 cursor-pointer ${enabled ? "bg-green-500" : "bg-gray-500"
            }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${enabled ? "translate-x-6" : ""
              }`}
          ></span>
        </button>
      </div>

      {/* Footer Note */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Automatically pauses YouTube when you leave the tab and resumes when
        you return.
      </p>
    </div>
  );
}
