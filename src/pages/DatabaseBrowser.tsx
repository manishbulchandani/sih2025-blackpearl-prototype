import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File, 
  Play,
  Calendar,
  MapPin,
  Layers,
  HardDrive,
  Info,
  Cpu
} from 'lucide-react';
import { mockDatasets, type Dataset } from '../data/mockData';

const DatabaseBrowser = () => {
  const navigate = useNavigate();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['mariana-expedition-2024']));
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const selectDataset = (dataset: Dataset) => {
    setSelectedDataset(dataset);
  };

  const runAnalysis = (dataset: Dataset) => {
    // Store selected dataset for pipeline
    localStorage.setItem('currentDataset', JSON.stringify(dataset));
    navigate(`/pipeline/${dataset.id}`);
  };

  const renderTree = (datasets: Dataset[], level: number = 0) => {
    return datasets.map((dataset) => {
      const isExpanded = expandedNodes.has(dataset.id);
      const hasChildren = dataset.children && dataset.children.length > 0;
      const isSelected = selectedDataset?.id === dataset.id;

      return (
        <motion.div
          key={dataset.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
        >
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
              isSelected ? 'bg-blue-50 border border-blue-200' : ''
            }`}
            style={{ paddingLeft: `${12 + level * 20}px` }}
            onClick={() => selectDataset(dataset)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(dataset.id);
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}
            
            {!hasChildren && <div className="w-6" />}
            
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {dataset.type === 'project' && <Folder className="w-5 h-5 text-blue-600 flex-shrink-0" />}
              {dataset.type === 'expedition' && (
                isExpanded ? 
                <FolderOpen className="w-5 h-5 text-orange-600 flex-shrink-0" /> :
                <Folder className="w-5 h-5 text-orange-600 flex-shrink-0" />
              )}
              {dataset.type === 'sample' && <File className="w-5 h-5 text-green-600 flex-shrink-0" />}
              
              <span className="font-medium text-gray-900 truncate">{dataset.name}</span>
              
              {dataset.size && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {dataset.size}
                </span>
              )}
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="mt-1">
              {renderTree(dataset.children!, level + 1)}
            </div>
          )}
        </motion.div>
      );
    });
  };

  return (
    <div className="h-screen bg-white flex">
      {/* File Tree Panel */}
      <div className="w-1/2 border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dataset Browser</h1>
          <p className="text-gray-600">Browse and select eDNA sequencing datasets for analysis</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {renderTree(mockDatasets)}
          </div>
        </div>
      </div>

      {/* Details Panel */}
      <div className="w-1/2 flex flex-col">
        {selectedDataset ? (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    {selectedDataset.type === 'project' && <Folder className="w-6 h-6 text-blue-600" />}
                    {selectedDataset.type === 'expedition' && <Folder className="w-6 h-6 text-orange-600" />}
                    {selectedDataset.type === 'sample' && <File className="w-6 h-6 text-green-600" />}
                    <h2 className="text-xl font-bold text-gray-900">{selectedDataset.name}</h2>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">{selectedDataset.path}</code>
                  </div>
                </div>
                
                {(selectedDataset.type === 'expedition' || selectedDataset.type === 'sample') && (
                  <button
                    onClick={() => runAnalysis(selectedDataset)}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-500 hover:to-blue-500 transition-all duration-300 flex items-center space-x-2 shadow-lg"
                  >
                    <Play className="w-5 h-5" />
                    <span>Run Analysis</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedDataset.size && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <HardDrive className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Size</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedDataset.size}</div>
                  </div>
                )}
                
                {selectedDataset.fileCount && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <File className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Files</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{selectedDataset.fileCount}</div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              {selectedDataset.metadata && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Info className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Metadata</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Location</div>
                        <div className="text-gray-900">{selectedDataset.metadata.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Layers className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Depth Range</div>
                        <div className="text-gray-900">{selectedDataset.metadata.depth}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Collection Date</div>
                        <div className="text-gray-900">{selectedDataset.metadata.date}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Cpu className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Sequencing Platform</div>
                        <div className="text-gray-900">{selectedDataset.metadata.platform}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700">Description</div>
                        <div className="text-gray-900">{selectedDataset.metadata.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {selectedDataset.type === 'sample' && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Cpu className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Technical Specifications</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-blue-700">Read Type</div>
                      <div className="text-blue-900">Paired-end (2×150bp)</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">Target Region</div>
                      <div className="text-blue-900">16S rRNA V4</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">Library Prep</div>
                      <div className="text-blue-900">Nextera XT</div>
                    </div>
                    <div>
                      <div className="font-medium text-blue-700">Quality Score</div>
                      <div className="text-blue-900">Q30+ (&gt;90%)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Select a Dataset</h3>
              <p>Choose a dataset from the file tree to view details and run analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseBrowser;
