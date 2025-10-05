import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Play,
  Activity,
  Download,
  Layers,
  BookOpen,
  Database
} from 'lucide-react';
import { mockDatasets, type Dataset } from '../data/mockData';

const formatNumber = (value: number | undefined) => {
  if (value === undefined) return '—';
  return new Intl.NumberFormat('en-US').format(value);
};

const DatabaseBrowser = () => {
  const navigate = useNavigate();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(mockDatasets[0] ?? null);

  if (!mockDatasets.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        No dataset available.
      </div>
    );
  }

  const runAnalysis = (selected: Dataset) => {
    localStorage.setItem('currentDataset', JSON.stringify(selected));
    navigate(`/pipeline/${selected.id}`);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-2/5 border-r border-gray-200 flex flex-col bg-white">
        <div className="p-8 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dataset Browser</h1>
          <p className="text-gray-600">Browse and select eDNA sequencing datasets for analysis</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {mockDatasets.map(dataset => {
            const isSelected = selectedDataset?.id === dataset.id;
            return (
              <motion.button
                key={dataset.id}
                type="button"
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => setSelectedDataset(dataset)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center space-x-3 ${
                  isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <FileText className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{dataset.name}</div>
                  {dataset.stats && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {dataset.stats.downloadSize}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b border-gray-200 bg-white">
          <div className="flex items-start justify-between">
            <div className="max-w-2xl">
              {selectedDataset && (
                <>
                  <div className="text-sm font-mono text-blue-600 bg-blue-50 inline-flex px-3 py-1 rounded-full mb-3">
                    {selectedDataset.id}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 leading-tight">{selectedDataset.name}</h2>
                  {selectedDataset.summary && (
                    <p className="text-base text-gray-600 mt-4 leading-relaxed">{selectedDataset.summary}</p>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => selectedDataset && runAnalysis(selectedDataset)}
              className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-500 hover:to-teal-400 transition-all duration-300 flex items-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedDataset}
            >
              <Play className="w-5 h-5" />
              <span>Run Analysis</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          {selectedDataset?.stats && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Sequencing Snapshot</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-slate-500">Runs & Instrument</div>
                      <div className="text-lg font-semibold text-slate-900">
                        {selectedDataset.stats.runCount} run • {selectedDataset.stats.instrument}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-teal-50 rounded-lg">
                      <Layers className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-slate-500">Spots</div>
                      <div className="text-lg font-semibold text-slate-900">{formatNumber(selectedDataset.stats.spots)}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Database className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-slate-500">Total Bases</div>
                      <div className="text-lg font-semibold text-slate-900">{selectedDataset.stats.bases}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Download className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs uppercase text-slate-500">Download Size</div>
                      <div className="text-lg font-semibold text-slate-900">{selectedDataset.stats.downloadSize}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-5">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Read Details</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
              <div>
                <div className="text-xs uppercase text-slate-500 mb-1">Type</div>
                <div className="font-medium text-slate-900">{selectedDataset?.type ?? '—'}</div>
              </div>
              {selectedDataset?.stats?.instrument && (
                <div>
                  <div className="text-xs uppercase text-slate-500 mb-1">Instrument</div>
                  <div>{selectedDataset.stats.instrument}</div>
                </div>
              )}
              {selectedDataset?.metadata?.location && (
                <div>
                  <div className="text-xs uppercase text-slate-500 mb-1">Location</div>
                  <div>{selectedDataset.metadata.location}</div>
                </div>
              )}
              {selectedDataset?.design && (
                <div>
                  <div className="text-xs uppercase text-slate-500 mb-1">Design</div>
                  <div>{selectedDataset.design}</div>
                </div>
              )}
            </div>
            {selectedDataset?.study && (
              <div className="mt-6 text-sm text-slate-700">
                <div className="text-xs uppercase text-slate-500 mb-1">Study</div>
                <p className="leading-relaxed">{selectedDataset.study}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseBrowser;
