import React from 'react';
import { Cpu, MemoryStick, Activity, HardDrive } from 'lucide-react';
import type { SystemMetrics as SystemMetricsType } from '../../types/pipeline';

interface SystemMetricsProps {
  metrics: SystemMetricsType;
}

const SystemMetrics: React.FC<SystemMetricsProps> = ({ metrics }) => {
  return (
    <div className="fixed bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 min-w-64 z-10 border border-slate-700">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">System Resources</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <Cpu className="w-3 h-3 mr-2" /> CPU
          </span>
          <span className="text-xs font-mono text-slate-200">{metrics.cpu.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-slate-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(metrics.cpu, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <MemoryStick className="w-3 h-3 mr-2" /> Memory
          </span>
          <span className="text-xs font-mono text-slate-200">{metrics.memory.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-slate-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(metrics.memory, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <HardDrive className="w-3 h-3 mr-2" /> Disk I/O
          </span>
          <span className="text-xs font-mono text-slate-200">{metrics.disk.toFixed(1)} MB/s</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-slate-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(metrics.disk / 100 * 100, 100)}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center">
            <Activity className="w-3 h-3 mr-2" /> Network
          </span>
          <span className="text-xs font-mono text-slate-200">{metrics.network.toFixed(1)} MB/s</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-1.5">
          <div 
            className="bg-slate-400 h-1.5 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(metrics.network / 100 * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default SystemMetrics;
