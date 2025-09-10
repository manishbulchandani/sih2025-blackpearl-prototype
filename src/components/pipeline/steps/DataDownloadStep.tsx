import React from 'react';
import { Download, CheckCircle, Clock, Database } from 'lucide-react';
import type { PipelineStep } from '../../../types/pipeline';

interface DataDownloadStepProps {
  step: PipelineStep;
  progress: number;
}

const DataDownloadStep: React.FC<DataDownloadStepProps> = ({ step, progress }) => {
  const files = step.files;
  
  return (
    <div className="bg-slate-800 rounded-lg p-6 h-full">
      <div className="flex items-center mb-6">
        <Download className="w-6 h-6 text-blue-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">{step.name}</h3>
          <p className="text-sm text-slate-400">{files?.processing}</p>
        </div>
      </div>

      {/* File Status */}
      <div className="space-y-4 mb-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center">
            <Database className="w-4 h-4 mr-2" />
            Download Status
          </h4>
          
          {files?.output.map((file, index) => (
            <div key={file} className="flex items-center justify-between py-2 border-b border-slate-600 last:border-b-0">
              <span className="text-sm font-mono text-slate-300">{file}</span>
              <div className="flex items-center">
                {progress > (index + 1) * 40 ? (
                  <CheckCircle className="w-4 h-4 text-green-400" />
                ) : progress > index * 40 ? (
                  <div className="flex items-center">
                    <div className="w-16 bg-slate-600 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(((progress - index * 40) / 40) * 100, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {Math.min(Math.round(((progress - index * 40) / 40) * 100), 100)}%
                    </span>
                  </div>
                ) : (
                  <Clock className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Download Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-400">Download Speed</div>
            <div className="text-sm font-mono">
              {progress > 0 ? `${(45 + Math.random() * 20).toFixed(1)} MB/s` : '0 MB/s'}
            </div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="text-xs text-slate-400">Total Size</div>
            <div className="text-sm font-mono">4.2 GB</div>
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

export default DataDownloadStep;
