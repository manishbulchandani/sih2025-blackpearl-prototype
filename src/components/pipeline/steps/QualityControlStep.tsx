import React from 'react';
import { BarChart3, CheckCircle, Clock, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import type { PipelineStep } from '../../../types/pipeline';

interface QualityControlStepProps {
  step: PipelineStep;
  progress: number;
}

const QualityControlStep: React.FC<QualityControlStepProps> = ({ step, progress }) => {
  const files = step.files;
  
  // Generate realistic quality score data
  const qualityData = Array.from({ length: 150 }, (_, i) => ({
    position: i + 1,
    quality: Math.max(10, 40 - Math.pow(i / 30, 2) + Math.random() * 8)
  }));

  const readCountData = [
    { category: 'Raw Reads', count: 1234567, color: '#64748b' },
    { category: 'After Trimming', count: progress > 50 ? 1189432 : 0, color: '#3b82f6' },
    { category: 'High Quality', count: progress > 80 ? 1156789 : 0, color: '#10b981' }
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <BarChart3 className="w-6 h-6 text-green-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">{step.name}</h3>
          <p className="text-sm text-slate-400">{files?.processing}</p>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Per-Base Quality Scores</h4>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={qualityData.slice(0, Math.floor(progress * 1.5))}>
              <XAxis dataKey="position" hide />
              <YAxis domain={[0, 45]} hide />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="text-xs text-slate-400 mt-2">
            Mean Quality: {progress > 20 ? '32.4' : '--'}
          </div>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3">Read Counts</h4>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={readCountData}>
              <XAxis dataKey="category" hide />
              <YAxis hide />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
          <div className="text-xs text-slate-400 mt-2">
            Retention: {progress > 70 ? '96.3%' : '--'}
          </div>
        </div>
      </div>

      {/* File Transformation */}
      <div className="bg-slate-700 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium mb-3 flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          File Processing
        </h4>
        
        <div className="space-y-3">
          {/* Input Files */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Input:</span>
            <div className="flex space-x-2">
              {files?.input.map(file => (
                <span key={file} className="text-xs font-mono bg-slate-600 px-2 py-1 rounded">
                  {file}
                </span>
              ))}
            </div>
          </div>
          
          {/* Processing Arrow */}
          <div className="flex justify-center">
            <div className="w-8 h-0.5 bg-slate-500">
              <div 
                className="h-0.5 bg-blue-400 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Output Files */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Output:</span>
            <div className="flex space-x-2">
              {files?.output.map((file, index) => (
                <span 
                  key={file} 
                  className={`text-xs font-mono px-2 py-1 rounded transition-all duration-300 ${
                    progress > 60 + index * 20 
                      ? 'bg-green-600 text-white' 
                      : 'bg-slate-600 text-slate-400'
                  }`}
                >
                  {file}
                </span>
              ))}
            </div>
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
                  ? 'text-blue-400' 
                  : 'text-slate-500'
            }`}
          >
            {progress > (index + 1) * 25 ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : progress > index * 25 ? (
              <div className="w-4 h-4 mr-2 border-2 border-blue-400 rounded-full border-t-transparent animate-spin" />
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

export default QualityControlStep;
