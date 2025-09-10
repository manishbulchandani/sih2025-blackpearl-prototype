import React from 'react';
import { GitMerge, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { PipelineStep } from '../../../types/pipeline';

interface ReadMergingStepProps {
  step: PipelineStep;
  progress: number;
}

const ReadMergingStep: React.FC<ReadMergingStepProps> = ({ step, progress }) => {
  const files = step.files;
  
  // Generate read length distribution data
  const lengthData = Array.from({ length: 50 }, (_, i) => ({
    length: 200 + i * 5,
    count: Math.max(0, 1000 * Math.exp(-Math.pow(i - 25, 2) / 200) + Math.random() * 100)
  }));

  const mergeStats = [
    { label: 'Total Read Pairs', value: '1,189,432', status: progress > 10 },
    { label: 'Successfully Merged', value: progress > 60 ? '987,654 (83.0%)' : '--', status: progress > 60 },
    { label: 'Mean Merged Length', value: progress > 80 ? '253 bp' : '--', status: progress > 80 },
    { label: 'Overlap Quality', value: progress > 90 ? '98.7%' : '--', status: progress > 90 }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <GitMerge className="w-6 h-6 text-purple-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">{step.name}</h3>
          <p className="text-sm text-slate-400">{files?.processing}</p>
        </div>
      </div>

      {/* Merge Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Merge Statistics</h4>
          <div className="space-y-3">
            {mergeStats.map((stat, index) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-xs text-slate-400">{stat.label}:</span>
                <span className={`text-sm font-mono ${stat.status ? 'text-green-400' : 'text-slate-500'}`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Merged Read Length Distribution</h4>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={lengthData.slice(0, Math.floor(progress * 0.5))}>
              <XAxis dataKey="length" hide />
              <YAxis hide />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#a855f7" 
                fill="#a855f7" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Read Pair Processing Visualization */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          Read Pair Processing
        </h4>
        
        <div className="space-y-4">
          {/* Visual representation of read merging */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-xs font-mono">R1</span>
              </div>
              <div className="w-16 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-xs font-mono">R2</span>
              </div>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div 
                  className="bg-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            
            <div className={`w-20 h-6 rounded flex items-center justify-center transition-all duration-300 ${
              progress > 70 ? 'bg-green-500' : 'bg-slate-600'
            }`}>
              <span className="text-xs font-mono">Merged</span>
            </div>
          </div>

          {/* Merge Quality Indicator */}
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400">Overlap Region:</span>
            <span className={`font-mono ${progress > 50 ? 'text-green-400' : 'text-slate-500'}`}>
              {progress > 50 ? '15-45 bp' : 'Detecting...'}
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
                  ? 'text-purple-400' 
                  : 'text-slate-500'
            }`}
          >
            {progress > (index + 1) * 25 ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : progress > index * 25 ? (
              <div className="w-4 h-4 mr-2 border-2 border-purple-400 rounded-full border-t-transparent animate-spin" />
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

export default ReadMergingStep;
