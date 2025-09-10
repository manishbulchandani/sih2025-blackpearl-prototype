import { motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

interface LogViewerProps {
  logs: string[];
  isVisible: boolean;
  onToggle: () => void;
}

const LogViewer = ({ logs, isVisible, onToggle }: LogViewerProps) => {
  if (!isVisible) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={onToggle}
        className="fixed bottom-8 right-8 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-40"
      >
        <Terminal className="w-6 h-6" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-gray-900 text-green-400 font-mono text-sm z-50"
      style={{ height: '300px' }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Terminal className="w-5 h-5" />
          <span className="text-white font-semibold">Pipeline Logs</span>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 h-full overflow-y-auto" style={{ height: 'calc(300px - 64px)' }}>
        <div className="space-y-1">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-green-400"
            >
              {log}
            </motion.div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500">Waiting for pipeline execution...</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogViewer;
