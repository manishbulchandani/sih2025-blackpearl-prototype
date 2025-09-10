import React from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import type { PipelineStep } from '../../types/pipeline';

interface TerminalLogsProps {
  step: PipelineStep | undefined;
  currentLogIndex: number;
  isRunning: boolean;
  datasetId: string | undefined;
}

const TerminalLogs: React.FC<TerminalLogsProps> = ({ 
  step, 
  currentLogIndex, 
  isRunning, 
  datasetId 
}) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Terminal className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-bold">Process Logs</h3>
      </div>
      <div className="bg-black rounded p-4 font-mono text-sm h-96 overflow-y-auto">
        <div className="text-green-400 mb-2">$ edna-pipeline --dataset {datasetId}</div>
        <div className="text-blue-400 mb-2">eDNA Biodiversity Analysis Pipeline v2.1.0</div>
        <div className="text-gray-300 mb-2">Initialized at {new Date().toLocaleString()}</div>
        <div className="text-gray-300 mb-4">Working directory: /data/edna/{datasetId}</div>
        
        {step?.logs.slice(0, currentLogIndex + 1).map((log, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-300 mb-1"
          >
            <span className="text-blue-400">[{new Date().toLocaleTimeString()}]</span>{' '}
            <span className="text-cyan-400">[{step.id}]</span>{' '}
            {log}
          </motion.div>
        ))}
        
        {isRunning && (
          <div className="flex items-center">
            <div className="text-yellow-400 animate-pulse inline-block mr-2">█</div>
            <div className="text-yellow-400">Processing...</div>
          </div>
        )}
        
        {step?.status === 'completed' && (
          <div className="text-green-400 mt-2">
            ✓ {step.name} completed successfully
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalLogs;
