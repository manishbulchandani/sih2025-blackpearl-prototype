import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, AlertCircle } from 'lucide-react';
import type { PipelineStep } from '../types';

interface StepIndicatorProps {
  steps: PipelineStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

const StepIndicator = ({ steps, currentStep, onStepClick }: StepIndicatorProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline Progress</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.status === 'completed';
          const isRunning = step.status === 'running';
          const hasError = step.status === 'error';
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
                isActive ? 'bg-blue-50 border border-blue-200' :
                isCompleted ? 'bg-green-50 border border-green-200' :
                hasError ? 'bg-red-50 border border-red-200' :
                'bg-gray-50 border border-gray-200'
              }`}
              onClick={() => onStepClick?.(index)}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : isRunning ? (
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                ) : hasError ? (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-900' :
                    isCompleted ? 'text-green-900' :
                    hasError ? 'text-red-900' :
                    'text-gray-900'
                  }`}>
                    {step.name}
                  </p>
                  <span className="text-xs text-gray-500">
                    Step {step.id + 1}
                  </span>
                </div>
                
                <p className="text-xs text-gray-600 mt-1">
                  {step.description}
                </p>
                
                {(isRunning || isCompleted) && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(step.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full ${
                          isCompleted ? 'bg-green-600' : 'bg-blue-600'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${step.progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
