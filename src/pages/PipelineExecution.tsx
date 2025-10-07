import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, BarChart3, Activity, Database, Brain, Download, GitMerge, Zap } from 'lucide-react';
import { usePipelineExecution } from '../hooks/usePipelineExecution';
import { pipelineStepsData } from '../data/pipelineData';
import type { Dataset } from '../data/mockData';
import type { PipelineStep, SystemMetrics as SystemMetricsType } from '../types/pipeline';

// Components
import SystemMetrics from '../components/pipeline/SystemMetrics';
import StepVisualization from '../components/pipeline/StepVisualization';
import TerminalView from '../components/pipeline/TerminalView';

const PipelineExecution = () => {
  const { datasetId } = useParams();
  const navigate = useNavigate();
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  const [executionStarted, setExecutionStarted] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricsType>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0
  });

  const {
    currentStepIndex,
    currentStep,
    steps,
    isRunning,
    stepProgress,
    currentLogIndex,
    isCompleted,
    startPipeline
  } = usePipelineExecution();

  // Icon mapping for pipeline steps
  const getStepIcon = (stepId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'data-download': <Download className="w-6 h-6" />,
      'quality-control': <Activity className="w-6 h-6" />,
      'read-merging': <GitMerge className="w-6 h-6" />,
      'asv-inference': <Zap className="w-6 h-6" />,
      'taxonomic-classification': <Database className="w-6 h-6" />,
      'novelty-detection': <Brain className="w-6 h-6" />,
      'diversity-analysis': <BarChart3 className="w-6 h-6" />
    };
    return iconMap[stepId] || <Activity className="w-6 h-6" />;
  };

  // Load dataset from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('currentDataset');
    if (stored) {
      setCurrentDataset(JSON.parse(stored));
    } else {
      navigate('/database');
    }
  }, [datasetId, navigate]);

  // More realistic system metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isRunning && currentStep) {
        // Different steps have different resource patterns
        const baseMetrics = getStepResourcePattern(currentStep.id, stepProgress);
        
        setSystemMetrics({
          cpu: Math.max(5, Math.min(95, baseMetrics.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(10, Math.min(90, baseMetrics.memory + (Math.random() - 0.5) * 5)),
          disk: Math.max(0, Math.min(100, baseMetrics.disk + (Math.random() - 0.5) * 20)),
          network: Math.max(0, Math.min(100, baseMetrics.network + (Math.random() - 0.5) * 15))
        });
      } else {
        // Idle metrics
        setSystemMetrics({
          cpu: 5 + Math.random() * 10,
          memory: 15 + Math.random() * 10,
          disk: Math.random() * 5,
          network: Math.random() * 5
        });
      }
    }, 3000); // Update every 3 seconds for more realistic feel
    
    return () => clearInterval(interval);
  }, [isRunning, currentStep, stepProgress]);

  // Resource patterns for different steps
  const getStepResourcePattern = (stepId: string, progress: number) => {
    const patterns: Record<string, { cpu: number; memory: number; disk: number; network: number }> = {
      'data-download': {
        cpu: 15 + progress * 0.1,
        memory: 20 + progress * 0.15,
        disk: 60 + progress * 0.3,
        network: 70 + progress * 0.2
      },
      'quality-control': {
        cpu: 40 + progress * 0.4,
        memory: 35 + progress * 0.25,
        disk: 30 + progress * 0.2,
        network: 5
      },
      'read-merging': {
        cpu: 25 + progress * 0.3,
        memory: 45 + progress * 0.2,
        disk: 20 + progress * 0.15,
        network: 2
      },
      'asv-inference': {
        cpu: 80 + progress * 0.1,
        memory: 70 + progress * 0.15,
        disk: 15 + progress * 0.1,
        network: 1
      },
      'taxonomic-classification': {
        cpu: 60 + progress * 0.2,
        memory: 50 + progress * 0.2,
        disk: 25 + progress * 0.15,
        network: 30 + progress * 0.1
      },
      'novelty-detection': {
        cpu: 85 + progress * 0.1,
        memory: 75 + progress * 0.1,
        disk: 10 + progress * 0.05,
        network: 5
      },
      'diversity-analysis': {
        cpu: 30 + progress * 0.2,
        memory: 40 + progress * 0.15,
        disk: 15 + progress * 0.1,
        network: 3
      }
    };
    
    return patterns[stepId] || { cpu: 20, memory: 30, disk: 10, network: 5 };
  };

  const handleStartPipeline = () => {
    // Convert data to full pipeline steps with icons
    const stepsWithIcons: PipelineStep[] = pipelineStepsData.map(step => ({
      ...step,
      icon: getStepIcon(step.id)
    }));
    
    setExecutionStarted(true);
    startPipeline(stepsWithIcons);
  };

  // Full-screen pipeline view
  if (executionStarted) {
    return (
      <div className="fixed inset-0 bg-slate-900 text-white z-50  flex flex-col overflow-y-auto">
        {/* Main Pipeline Interface */}
        <div className="flex-1 flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">eDNA Biodiversity Analysis Pipeline</h1>
              <p className="text-slate-400">
                Processing: {currentDataset?.name || 'Unknown Dataset'}
              </p>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-2xl font-bold">Step {currentStepIndex + 1}/{steps.length}</div>
                <div className="text-slate-400">
                  {isCompleted ? 'Analysis Complete ✓' : isRunning ? 'Processing...' : 'Ready'}
                </div>
                {/* Debug info */}
                <div className="text-xs text-slate-500">
                  Completed: {isCompleted ? 'TRUE' : 'FALSE'} | Running: {isRunning ? 'TRUE' : 'FALSE'}
                </div>
              </div>
              
              {/* Show button when all steps are completed OR when not running and on last step */}
              {(isCompleted || (!isRunning && currentStepIndex === steps.length - 1 && steps.length > 0)) && (
                <button
                  onClick={() => {
                    window.open('https://sih2025-blackpearl-report-dashboard.vercel.app/', '_blank'); 
                  }}
                  className="bg-gradient-to-r from-green-500 to-blue-500 px-6 py-3 rounded-lg font-semibold hover:from-green-400 hover:to-blue-400 transition-all duration-300 flex items-center space-x-2 animate-pulse"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Results</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-slate-400">
                {Math.round(((currentStepIndex + (stepProgress / 100)) / steps.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-teal-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentStepIndex + (stepProgress / 100)) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Pipeline Steps Overview */}
          <div className="flex space-x-2 mb-6">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex-1 p-3 rounded-lg border transition-all duration-300 ${
                  index === currentStepIndex
                    ? 'bg-blue-600 border-blue-400'
                    : step.status === 'completed'
                      ? 'bg-green-600 border-green-400'
                      : 'bg-slate-700 border-slate-600'
                }`}
              >
                <div className="flex items-center">
                  <div className="mr-2">{step.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{step.name}</div>
                    <div className="text-xs opacity-75">{step.duration}s</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-h-0">
            <StepVisualization step={currentStep} progress={stepProgress} />
          </div>
        </div>

        {/* Bottom Terminal */}
        <TerminalView 
          step={currentStep}
          isRunning={isRunning}
          currentLogIndex={currentLogIndex}
        />

        {/* System Metrics - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-10">
          <SystemMetrics metrics={systemMetrics} />
        </div>
      </div>
    );
  }

  // Initial setup view
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">eDNA Pipeline Execution</h1>
        <p className="text-slate-600">
          Ready to process: {currentDataset?.name || 'Unknown Dataset'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-6">Bioinformatics Pipeline Overview</h2>
        
        <div className="grid grid-cols-2 gap-6 mb-8">
          {pipelineStepsData.map((step) => (
            <div key={step.id} className="flex items-center p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="mr-4">{getStepIcon(step.id)}</div>
              <div>
                <h3 className="font-semibold">{step.name}</h3>
                <p className="text-sm text-slate-600">{step.description}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Duration: ~{step.duration}s
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-3">Pipeline Features:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• Real-time bioinformatics tool execution (DADA2, MMseqs2, DNABERT)</li>
            <li>• Novel species detection using machine learning embeddings</li>
            <li>• Comprehensive quality control and data validation</li>
            <li>• Resource monitoring and progress tracking</li>
            <li>• Professional terminal interface with realistic output</li>
          </ul>
        </div>

        <div className="text-center">
          <button
            onClick={handleStartPipeline}
            className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-400 hover:to-teal-400 transition-all duration-300 flex items-center mx-auto space-x-2"
          >
            <Play className="w-5 h-5" />
            <span>Start Pipeline Execution</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PipelineExecution;
