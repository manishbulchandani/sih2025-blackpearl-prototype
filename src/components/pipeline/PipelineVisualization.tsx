import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, AreaChart, Area } from 'recharts';
import type { PipelineStep } from '../../types/pipeline';

interface PipelineVisualizationProps {
  step: PipelineStep | undefined;
}

const PipelineVisualization: React.FC<PipelineVisualizationProps> = ({ step }) => {
  // Generate mock visualization data based on step type
  const generateVisualizationData = (step: PipelineStep) => {
    switch (step.visualization) {
      case 'line':
        return Array.from({ length: 20 }, (_, i) => ({
          x: i,
          value: Math.random() * 100 + 20 + Math.sin(i * 0.5) * 30,
          quality: Math.random() * 40 + 10
        }));
      case 'bar':
        return Array.from({ length: 8 }, (_, i) => ({
          name: `Sample ${i + 1}`,
          before: Math.random() * 1000 + 500,
          after: Math.random() * 800 + 200
        }));
      case 'scatter':
        return Array.from({ length: 50 }, () => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
          z: Math.random() * 100
        }));
      case 'area':
        return Array.from({ length: 15 }, (_, i) => ({
          position: i * 10,
          reads: Math.random() * 1000 + 100,
          quality: Math.random() * 40 + 10
        }));
      default:
        return [];
    }
  };

  const renderVisualization = (step: PipelineStep) => {
    const data = generateVisualizationData(step);
    
    switch (step.visualization) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="x" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }}
                name="Quality Score"
              />
              <Line 
                type="monotone" 
                dataKey="quality" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                name="Base Quality"
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="before" fill="#EF4444" name="Before Filtering" />
              <Bar dataKey="after" fill="#10B981" name="After Filtering" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="x" stroke="#9CA3AF" name="PC1" />
              <YAxis dataKey="y" stroke="#9CA3AF" name="PC2" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                formatter={(value, name) => [`${Number(value).toFixed(2)}`, name]}
              />
              <Scatter dataKey="z" fill="#8B5CF6" name="Embedding Space" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="position" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Area 
                type="monotone" 
                dataKey="reads" 
                stroke="#06B6D4" 
                fill="#06B6D4" 
                fillOpacity={0.6}
                name="Read Count"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'terminal':
        return (
          <div className="bg-black rounded p-4 font-mono text-sm h-48 overflow-y-auto">
            <div className="text-green-400 mb-2">$ blast -query sequences.fasta -db ncbi_nt</div>
            <div className="text-gray-300 space-y-1">
              <div>Connecting to NCBI database...</div>
              <div>Processing 1,247 sequences...</div>
              <div className="text-yellow-400">Progress: {Math.round((step.progress || 0))}%</div>
              <div>Found {Math.floor(Math.random() * 50 + 10)} high-confidence matches</div>
              {step.status === 'running' && (
                <div className="text-yellow-400 animate-pulse">Processing...</div>
              )}
            </div>
          </div>
        );
      default:
        return <div className="text-slate-400">No visualization available</div>;
    }
  };

  if (!step) {
    return (
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Analysis Visualization</h3>
        <div className="h-48 flex items-center justify-center text-slate-400">
          Select a step to view visualization
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Real-time Analysis: {step.name}</h3>
      {renderVisualization(step)}
    </div>
  );
};

export default PipelineVisualization;
