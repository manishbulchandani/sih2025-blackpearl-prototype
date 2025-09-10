import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  MapPin, 
  Thermometer, 
  Layers, 
  Calendar, 
  HardDrive,
  CheckCircle2,
  Circle,
  Play,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { mockSamples } from '../data/mockData';
import type { Sample, DatabaseConnection } from '../types';

const DatabaseSelection = () => {
  const navigate = useNavigate();
  const [connection, setConnection] = useState<DatabaseConnection>({
    status: 'disconnected',
    availableSamples: []
  });
  const [selectedSamples, setSelectedSamples] = useState<Sample[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [depthFilter, setDepthFilter] = useState('all');
  const [environmentFilter, setEnvironmentFilter] = useState('all');

  // Simulate database connection
  useEffect(() => {
    const connectToDatabase = async () => {
      setConnection(prev => ({ ...prev, status: 'connecting' }));
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setConnection({
        status: 'connected',
        availableSamples: mockSamples,
        lastUpdated: new Date()
      });
    };

    connectToDatabase();
  }, []);

  const filteredSamples = connection.availableSamples.filter(sample => {
    const matchesSearch = sample.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sample.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepth = depthFilter === 'all' || 
      (depthFilter === 'hadal' && sample.environment_type === 'Hadal Zone') ||
      (depthFilter === 'abyssal' && sample.environment_type === 'Abyssal Plain') ||
      (depthFilter === 'bathyal' && sample.environment_type === 'Bathyal Zone');
    
    const matchesEnvironment = environmentFilter === 'all' || 
                              sample.environment_type === environmentFilter;
    
    return matchesSearch && matchesDepth && matchesEnvironment;
  });

  const toggleSampleSelection = (sample: Sample) => {
    setSelectedSamples(prev => {
      const exists = prev.find(s => s.id === sample.id);
      if (exists) {
        return prev.filter(s => s.id !== sample.id);
      } else {
        return [...prev, sample];
      }
    });
  };

  const selectAllVisible = () => {
    const newSelections = filteredSamples.filter(
      sample => !selectedSamples.find(s => s.id === sample.id)
    );
    setSelectedSamples(prev => [...prev, ...newSelections]);
  };

  const clearSelection = () => {
    setSelectedSamples([]);
  };

  const startAnalysis = () => {
    if (selectedSamples.length > 0) {
      // Store selected samples in localStorage for the pipeline
      localStorage.setItem('selectedSamples', JSON.stringify(selectedSamples));
      navigate('/pipeline');
    }
  };

  const ConnectionStatus = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${
            connection.status === 'connected' ? 'bg-green-100' : 
            connection.status === 'connecting' ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            {connection.status === 'connected' ? (
              <Wifi className="w-6 h-6 text-green-600" />
            ) : connection.status === 'connecting' ? (
              <Loader2 className="w-6 h-6 text-yellow-600 animate-spin" />
            ) : (
              <WifiOff className="w-6 h-6 text-red-600" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>SRA/ENA Database Connection</span>
            </h2>
            <p className="text-gray-600">
              {connection.status === 'connected' && `${connection.availableSamples.length} samples available`}
              {connection.status === 'connecting' && 'Establishing connection...'}
              {connection.status === 'disconnected' && 'Connection failed'}
            </p>
          </div>
        </div>
        
        {connection.status === 'connected' && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Last Updated</div>
            <div className="text-sm font-medium text-gray-900">
              {connection.lastUpdated?.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (connection.status !== 'connected') {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <ConnectionStatus />
          
          {connection.status === 'connecting' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Connecting to Database</h3>
              <p className="text-gray-600">Accessing global eDNA sequencing repositories...</p>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <ConnectionStatus />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Select Deep-Sea Samples</h1>
          <p className="text-gray-600 text-lg">
            Choose from {filteredSamples.length} available deep-sea eDNA samples for analysis
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by location or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depth Zone</label>
              <select
                value={depthFilter}
                onChange={(e) => setDepthFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Depths</option>
                <option value="bathyal">Bathyal (200-4000m)</option>
                <option value="abyssal">Abyssal (4000-6000m)</option>
                <option value="hadal">Hadal (6000m+)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
              <select
                value={environmentFilter}
                onChange={(e) => setEnvironmentFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Environments</option>
                <option value="Hadal Zone">Hadal Zone</option>
                <option value="Abyssal Plain">Abyssal Plain</option>
                <option value="Bathyal Zone">Bathyal Zone</option>
              </select>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={selectAllVisible}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearSelection}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </motion.div>

        {/* Selection Summary */}
        <AnimatePresence>
          {selectedSamples.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    {selectedSamples.length} Sample{selectedSamples.length !== 1 ? 's' : ''} Selected
                  </h3>
                  <p className="opacity-90">
                    Total Data: {selectedSamples.reduce((acc, sample) => 
                      acc + parseFloat(sample.file_size.split(' ')[0]), 0
                    ).toFixed(1)} GB
                  </p>
                </div>
                <button
                  onClick={startAnalysis}
                  className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Analysis</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Samples Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredSamples.map((sample, index) => {
            const isSelected = selectedSamples.find(s => s.id === sample.id);
            
            return (
              <motion.div
                key={sample.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 hover:shadow-xl border-2 ${
                  isSelected ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-gray-200'
                }`}
                onClick={() => toggleSampleSelection(sample)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {sample.id}
                      </span>
                      {isSelected ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{sample.location}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{sample.coordinates[0].toFixed(3)}, {sample.coordinates[1].toFixed(3)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Layers className="w-4 h-4" />
                    <span>{sample.depth} • {sample.environment_type}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Thermometer className="w-4 h-4" />
                    <span>{sample.temperature}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{sample.collection_date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <HardDrive className="w-4 h-4" />
                    <span>{sample.reads.toLocaleString()} reads • {sample.file_size}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">{sample.platform}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredSamples.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Samples Found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSelection;
