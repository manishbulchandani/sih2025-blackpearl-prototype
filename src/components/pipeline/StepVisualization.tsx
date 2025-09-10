import React from 'react';
import type { PipelineStep } from '../../types/pipeline';

// Import step components
import DataDownloadStep from './steps/DataDownloadStep';
import QualityControlStep from './steps/QualityControlStep';
import ReadMergingStep from './steps/ReadMergingStep';
import ASVProcessingStep from './steps/ASVProcessingStep';

// Default fallback component for unimplemented steps
const DefaultStepView: React.FC<{ step: PipelineStep; progress: number }> = ({ step, progress }) => (
  <div className="bg-slate-800 rounded-lg p-6 h-full">
    <div className="flex items-center mb-6">
      {step.icon}
      <div className="ml-3">
        <h3 className="text-lg font-semibold">{step.name}</h3>
        <p className="text-sm text-slate-400">{step.description}</p>
      </div>
    </div>
    
    <div className="mb-6">
      <div className="w-full bg-slate-700 rounded-full h-3 mb-2">
        <div 
          className="bg-blue-400 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-sm text-slate-400">{progress.toFixed(1)}% complete</div>
    </div>

    <div className="space-y-2">
      {step.details.map((detail, index) => (
        <div 
          key={index} 
          className={`flex items-center text-sm ${
            progress > (index + 1) * (100 / step.details.length)
              ? 'text-green-400' 
              : progress > index * (100 / step.details.length)
                ? 'text-blue-400' 
                : 'text-slate-500'
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current mr-3" />
          {detail}
        </div>
      ))}
    </div>
  </div>
);

interface StepVisualizationProps {
  step: PipelineStep | null;
  progress: number;
}

const StepVisualization: React.FC<StepVisualizationProps> = ({ step, progress }) => {
  if (!step) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-slate-400">
          <div className="text-lg mb-2">Ready to Process</div>
          <div className="text-sm">Pipeline will start when initiated</div>
        </div>
      </div>
    );
  }

  // Route to appropriate step component based on step ID
  switch (step.id) {
    case 'data-download':
      return <DataDownloadStep step={step} progress={progress} />;
    case 'quality-control':
      return <QualityControlStep step={step} progress={progress} />;
    case 'read-merging':
      return <ReadMergingStep step={step} progress={progress} />;
    case 'asv-inference':
      return <ASVProcessingStep step={step} progress={progress} />;
    case 'taxonomic-classification':
    case 'novelty-detection':
    case 'diversity-analysis':
    default:
      return <DefaultStepView step={step} progress={progress} />;
  }
};

export default StepVisualization;
