import React from 'react';
import { Brain, CheckCircle, Clock, Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { PipelineStep } from '../../../types/pipeline';

interface ASVProcessingStepProps {
  step: PipelineStep;
  progress: number;
}

const ASVProcessingStep: React.FC<ASVProcessingStepProps> = ({ step, progress }) => {
  const files = step.files;
  
  // Generate error model data
  const errorData = Array.from({ length: 20 }, (_, i) => ({
    iteration: i + 1,
    error_rate: Math.max(0.001, 0.01 * Math.exp(-i / 5) + Math.random() * 0.002)
  }));


  const processingStats = [
    { label: 'Input Sequences', value: '987,654', status: progress > 5 },
    { label: 'Error Model Iterations', value: progress > 30 ? '7' : `${Math.floor(progress / 30 * 7)}`, status: progress > 30 },
    { label: 'Unique ASVs Inferred', value: progress > 70 ? '12,847' : `${Math.floor(progress / 70 * 12847)}`, status: progress > 70 },
    { label: 'Chimeras Removed', value: progress > 90 ? '1,203 (9.4%)' : '--', status: progress > 90 }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <Brain className="w-6 h-6 text-yellow-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">{step.name}</h3>
          <p className="text-sm text-slate-400">{files?.processing}</p>
        </div>
      </div>

      {/* DADA2 Processing */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Error Model Learning</h4>
          {progress > 20 ? (
            <ResponsiveContainer width="100%" height={120}>
              <ScatterChart data={errorData.slice(0, Math.floor(progress / 30 * 7))}>
                <XAxis dataKey="iteration" hide />
                <YAxis hide />
                <Scatter dataKey="error_rate" fill="#fbbf24" />
              </ScatterChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-120 flex items-center justify-center">
              <div className="text-center">
                <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2 animate-pulse" />
                <div className="text-xs text-slate-400">Initializing...</div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">ASV Statistics</h4>
          <div className="space-y-3">
            {processingStats.map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{stat.label}:</span>
                <span className={`text-sm font-mono ${stat.status ? 'text-yellow-400' : 'text-slate-500'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ASV Inference Progress */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium mb-3">Denoising Progress</h4>
        
        <div className="space-y-4">
          {/* Processing phases */}
          <div className="grid grid-cols-4 gap-2">
            {['Error Learning', 'Denoising', 'ASV Inference', 'Chimera Removal'].map((phase, index) => (
              <div 
                key={phase}
                className={`text-xs p-2 rounded text-center transition-all duration-300 ${
                  progress > (index + 1) * 25 
                    ? 'bg-yellow-500 text-black' 
                    : progress > index * 25 
                      ? 'bg-yellow-600 text-white animate-pulse' 
                      : 'bg-slate-600 text-slate-400'
                }`}
              >
                {phase}
              </div>
            ))}
          </div>

          {/* Memory usage indicator */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Memory Usage:</span>
            <span className={`font-mono ${progress > 40 ? 'text-yellow-400' : 'text-slate-500'}`}>
              {progress > 40 ? `${(2.1 + progress * 0.02).toFixed(1)} GB` : '0.5 GB'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Details */}
      <div className="space-y-2">
        {step.details.map((detail, index) => (
          <div 
            key={index} 
            className={`flex items-center text-sm ${
              progress > (index + 1) * 25 
                ? 'text-green-400' 
                : progress > index * 25 
                  ? 'text-yellow-400' 
                  : 'text-slate-500'
            }`}
          >
            {progress > (index + 1) * 25 ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : progress > index * 25 ? (
              <div className="w-4 h-4 mr-2 border-2 border-yellow-400 rounded-full border-t-transparent animate-spin" />
            ) : (
              <Clock className="w-4 h-4 mr-2" />
            )}
            {detail}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ASVProcessingStep;
