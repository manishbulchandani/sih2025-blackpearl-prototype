import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { PipelineStep } from '../../types/pipeline';

interface StepDetailsProps {
  step: PipelineStep | undefined;
  stepIndex: number;
  stepProgress: number;
  allSteps: PipelineStep[];
}

const StepDetails: React.FC<StepDetailsProps> = ({ step, stepIndex, stepProgress, allSteps }) => {
  if (!step) return null;

  return (
    <div className="space-y-6">
      <motion.div
        key={stepIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6"
      >
        <div className="flex items-center mb-4">
          {step.icon}
          <div className="ml-3">
            <h3 className="text-xl font-bold">{step.name}</h3>
            <p className="text-slate-400 text-sm">{step.description}</p>
          </div>
        </div>

        {/* Step Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Step Progress</span>
            <span className="text-sm text-slate-400">{Math.round(stepProgress)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Current Message */}
        <div className="mb-4">
          <span className="text-sm text-slate-300">Current Task:</span>
          <p className="text-yellow-400 font-medium">
            {step.currentMessage || 'Initializing...'}
          </p>
        </div>

        {/* Step Details */}
        <div>
          <span className="text-sm text-slate-300 mb-2 block">Process Steps:</span>
          <ul className="space-y-1">
            {step.details.map((detail, idx) => (
              <li 
                key={idx} 
                className={`text-sm flex items-center ${
                  idx <= Math.floor((stepProgress / 100) * step.details.length) 
                    ? 'text-green-400' : 'text-slate-500'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 mr-2" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Steps Overview */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="font-semibold mb-3">Pipeline Steps</h4>
        <div className="space-y-2">
          {allSteps.map((pipelineStep, index) => (
            <div 
              key={pipelineStep.id}
              className={`flex items-center p-2 rounded ${
                index === stepIndex 
                  ? 'bg-blue-600' 
                  : pipelineStep.status === 'completed' 
                    ? 'bg-green-600' 
                    : 'bg-slate-700'
              }`}
            >
              <div className="w-6 h-6 mr-3 flex-shrink-0">
                {pipelineStep.icon}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium">{pipelineStep.name}</span>
                <div className="w-full bg-slate-600 rounded-full h-1 mt-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${pipelineStep.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepDetails;
