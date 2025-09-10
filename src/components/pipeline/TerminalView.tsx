import React, { useState, useEffect } from "react";
import { Terminal, Maximize2, Minimize2 } from "lucide-react";
import type { PipelineStep } from "../../types/pipeline";

interface TerminalViewProps {
  step: PipelineStep | null;
  isRunning: boolean;
  currentLogIndex: number;
}

const TerminalView: React.FC<TerminalViewProps> = ({ step, isRunning }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedLogs, setDisplayedLogs] = useState<
    Array<{
      text: string;
      timestamp: string;
      type: "info" | "success" | "warning" | "error" | "loading";
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Loading text animation
  useEffect(() => {
    if (isLoading) {
      const loadingMessages = [
        "Initializing analysis modules",
        "Loading reference databases",
        "Allocating memory buffers",
        "Validating input parameters",
        "Configuring parallel processing",
        "Establishing database connections",
        "Optimizing computational resources",
      ];

      let messageIndex = 0;
      let dotCount = 0;

      const interval = setInterval(() => {
        const baseMessage =
          loadingMessages[messageIndex % loadingMessages.length];
        const dots = ".".repeat(dotCount % 4);
        setLoadingText(`${baseMessage}${dots}`);

        dotCount++;
        if (dotCount % 8 === 0) {
          messageIndex++;
        }
      }, 300);

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  // Process step logs with realistic delays and loading states
  useEffect(() => {
    if (!step || !isRunning) {
      setDisplayedLogs([]);
      return;
    }

    const logs = step.logs || [];
    if (logs.length === 0) return;

    // Process logs one by one with realistic delays
    const processLogs = async () => {
      setDisplayedLogs([]);

      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];

        // Show loading state before displaying log
        if (i > 0) {
          setIsLoading(true);
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 2000 + 1000)
          ); // 1-3 second delay
        }

        setIsLoading(false);

        // Add the log entry
        setDisplayedLogs((prev) => [
          ...prev,
          {
            text: log,
            timestamp: new Date().toLocaleTimeString(),
            type: getLogType(log),
          },
        ]);

        // Wait before next log
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    processLogs();
  }, [step, isRunning]);

  const getLogType = (
    log: string
  ): "info" | "success" | "warning" | "error" | "loading" => {
    if (
      log.includes("error") ||
      log.includes("failed") ||
      log.includes("ERROR")
    )
      return "error";
    if (log.includes("warning") || log.includes("WARNING")) return "warning";
    if (
      log.includes("completed") ||
      log.includes("success") ||
      log.includes("PASSED") ||
      log.includes("finished")
    )
      return "success";
    return "info";
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case "error":
        return "text-red-400";
      case "warning":
        return "text-yellow-400";
      case "success":
        return "text-green-400";
      case "loading":
        return "text-blue-400";
      default:
        return "text-slate-300";
    }
  };

  return (
    <div
      className={`bg-slate-900 border-t border-slate-700 transition-all duration-300 ${
        isExpanded ? "h-96" : "h-48"
      }`}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-slate-300">
            Pipeline Terminal
          </span>
          <span className="text-xs text-slate-500">
            {step ? `- ${step.name}` : "- Ready"}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-slate-700 rounded"
        >
          {isExpanded ? (
            <Minimize2 className="w-4 h-4 text-slate-400" />
          ) : (
            <Maximize2 className="w-4 h-4 text-slate-400" />
          )}
        </button>
      </div>

      {/* Terminal Content */}
      <div className="p-4 font-mono text-sm overflow-y-auto h-full bg-slate-900 terminal-output">
        {/* System initialization */}
        {!isRunning && (
          <div className="space-y-1 mb-4">
            <div className="text-green-400">
              edna-pipeline@bioserver:~$ conda activate edna-analysis
            </div>
            <div className="text-slate-300">
              (edna-analysis) Environment activated successfully
            </div>
            <div className="text-slate-300">Python 3.9.18 | Conda 23.7.4</div>
            <div className="text-slate-300">
              GPU: NVIDIA RTX 4090 (24GB) - Available
            </div>
            <div className="text-slate-300">Memory: 64GB DDR4 - Available</div>
            <div className="text-blue-400">
              System ready for bioinformatics processing...
            </div>
          </div>
        )}

        {/* Pipeline logs */}
        {displayedLogs.map((log, index) => (
          <div key={index} className="mb-1 animate-fadeIn">
            <span className="text-slate-500 mr-2">[{log.timestamp}]</span>
            <span className={getLogColor(log.type)}>{log.text}</span>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="mb-1 animate-pulse">
            <span className="text-slate-500 mr-2">
              [{new Date().toLocaleTimeString()}]
            </span>
            <span className="text-blue-400">{loadingText}</span>
          </div>
        )}

        {/* Active cursor */}
        {!isRunning && (
          <div className="flex items-center mt-2">
            <span className="text-green-400 mr-2">
              (edna-analysis) edna-pipeline@bioserver:~$
            </span>
            {showCursor && (
              <span className="text-green-400 animate-pulse">|</span>
            )}
          </div>
        )}

        {/* Running indicator */}
        {isRunning && !isLoading && (
          <div className="flex items-center mt-2">
            <span className="text-yellow-400 mr-2">[PROCESSING]</span>
            <span className="text-yellow-400">
              Pipeline step {step?.name || "Unknown"} in progress...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalView;
