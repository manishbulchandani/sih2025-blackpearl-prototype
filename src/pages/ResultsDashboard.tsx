import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { 
  BarChart3,
  Dna,
  Brain,
  TrendingUp,
  Download,
  Eye,
  MapPin,
  Calendar,
  Users,
  Award,
  FileText,
  Maximize,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

// 3D Embedding Space Component
function EmbeddingSpace3D({ data }: { data: any[] }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      
      {data.map((point, index) => (
        <Sphere
          key={index}
          position={[point.x, point.y, point.z]}
          args={[0.1]}
        >
          <meshStandardMaterial 
            color={point.cluster === 'novel' ? '#ef4444' : point.cluster === 'known' ? '#3b82f6' : '#10b981'} 
          />
        </Sphere>
      ))}
      
      {/* Cluster boundaries */}
      {data.filter(p => p.cluster === 'novel').map((point, index) => (
        <group key={`cluster-${index}`} position={[point.x, point.y, point.z]}>
          <Box args={[0.5, 0.5, 0.5]}>
            <meshBasicMaterial color="#ef4444" transparent opacity={0.1} />
          </Box>
        </group>
      ))}
      
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        DNABERT Embedding Space
      </Text>
      
      <Text
        position={[-4, -3, 0]}
        fontSize={0.3}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        Novel Clusters
      </Text>
      
      <Text
        position={[4, -3, 0]}
        fontSize={0.3}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        Known Species
      </Text>
    </>
  );
}

// 3D Diversity Landscape
function DiversityLandscape3D({ data }: { data: any[] }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      
      {data.map((sample, index) => (
        <Box
          key={index}
          position={[sample.x, sample.diversity * 2, sample.z]}
          args={[0.5, sample.diversity * 2, 0.5]}
        >
          <meshStandardMaterial 
            color={new THREE.Color().setHSL(sample.diversity / 5, 0.8, 0.6)} 
          />
        </Box>
      ))}
      
      <Text
        position={[0, 6, 0]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Biodiversity Landscape
      </Text>
    </>
  );
}

const ResultsDashboard = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<any>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'embedding' | 'novel' | 'diversity' | 'phylogeny'>('overview');
  const [view3D, setView3D] = useState(false);

  useEffect(() => {
    // Load results from localStorage
    const stored = localStorage.getItem('pipelineResults');
    if (stored) {
      const pipelineData = JSON.parse(stored);
      setResults(generateEnhancedResults(pipelineData));
    } else {
      navigate('/database');
    }
  }, [resultId, navigate]);

  const generateEnhancedResults = (pipelineData: any) => ({
    dataset: pipelineData.dataset || {
      name: 'Mariana Trench Deep Survey 2024',
      samples: 18,
      totalReads: 24500000,
      processedAt: new Date().toISOString()
    },
    summary: pipelineData.results || {
      totalASVs: 11644,
      assignedTaxa: 8932,
      novelClusters: 47,
      shannonDiversity: 4.23,
      observedSpecies: 8932,
      completionTime: 108
    },
    pipelineSteps: pipelineData.steps || [],
    embeddingData: generateEmbeddingData(),
    taxonomyData: generateTaxonomyData(),
    novelSpecies: generateNovelSpeciesData(),
    diversityMetrics: generateDiversityData(),
    phylogeneticData: generatePhylogeneticData()
  });

  const generateEmbeddingData = () => {
    const data = [];
    
    // Known species clusters (blue)
    for (let i = 0; i < 200; i++) {
      data.push({
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8,
        cluster: 'known',
        similarity: Math.random() * 0.3 + 0.7,
        species: `Known_Species_${i}`
      });
    }
    
    // Novel species clusters (red)
    for (let i = 0; i < 47; i++) {
      const centerX = (Math.random() - 0.5) * 6;
      const centerY = (Math.random() - 0.5) * 6;
      const centerZ = (Math.random() - 0.5) * 6;
      
      data.push({
        x: centerX + (Math.random() - 0.5) * 2,
        y: centerY + (Math.random() - 0.5) * 2,
        z: centerZ + (Math.random() - 0.5) * 2,
        cluster: 'novel',
        similarity: Math.random() * 0.4 + 0.3,
        species: `Novel_Cluster_${i + 1}`
      });
    }
    
    return data;
  };

  const generateTaxonomyData = () => ({
    distribution: [
      { name: 'Bacteria', value: 8124, color: '#3b82f6', percentage: 69.8 },
      { name: 'Archaea', value: 2156, color: '#10b981', percentage: 18.5 },
      { name: 'Eukaryota', value: 892, color: '#f59e0b', percentage: 7.7 },
      { name: 'Unassigned', value: 472, color: '#6b7280', percentage: 4.0 }
    ],
    topPhyla: [
      { phylum: 'Proteobacteria', count: 2847, percentage: 24.5, novelty: 12 },
      { phylum: 'Thermoplasmatota', count: 1956, percentage: 16.8, novelty: 18 },
      { phylum: 'Bacteroidetes', count: 1634, percentage: 14.0, novelty: 8 },
      { phylum: 'Planctomycetes', count: 1289, percentage: 11.1, novelty: 15 },
      { phylum: 'Actinobacteria', count: 987, percentage: 8.5, novelty: 6 },
      { phylum: 'Firmicutes', count: 756, percentage: 6.5, novelty: 4 }
    ]
  });

  const generateNovelSpeciesData = () => [
    {
      id: 'CLUSTER_001',
      confidence: 95.2,
      asvCount: 89,
      samples: 12,
      closestMatch: 'Pyrococcus yayanosii (72.3% identity)',
      habitat: 'Hydrothermal vents (>400°C)',
      description: 'Hyperthermophile with novel sulfur metabolism',
      embeddings: { x: 2.3, y: -1.8, z: 3.1 },
      significance: 'High'
    },
    {
      id: 'CLUSTER_002',
      confidence: 92.7,
      asvCount: 156,
      samples: 8,
      closestMatch: 'Colwellia hadaliensis (68.9% identity)',
      habitat: 'Hadal zone sediments (>10km depth)',
      description: 'Pressure-adapted bacterium with unique cell wall',
      embeddings: { x: -1.7, y: 2.4, z: -0.9 },
      significance: 'High'
    },
    {
      id: 'CLUSTER_003',
      confidence: 89.4,
      asvCount: 67,
      samples: 15,
      closestMatch: 'Methanobrevibacter sp. (74.1% identity)',
      habitat: 'Deep anaerobic sediments',
      description: 'Methanogen with novel coenzyme pathways',
      embeddings: { x: 0.8, y: -2.1, z: 1.6 },
      significance: 'Medium'
    }
  ];

  const generateDiversityData = () => ({
    shannon: 4.23,
    simpson: 0.87,
    chao1: 12847,
    evenness: 0.73,
    rarefactionCurve: Array.from({ length: 50 }, (_, i) => ({
      sampleSize: i * 200,
      speciesCount: Math.floor(Math.log(i + 1) * 1500 + Math.random() * 200)
    })),
    sampleComparison: Array.from({ length: 18 }, (_, i) => ({
      sample: `MD24-${String(i + 1).padStart(3, '0')}`,
      depth: 9800 + i * 120 + Math.random() * 200,
      shannon: 3.2 + Math.random() * 1.8,
      simpson: 0.75 + Math.random() * 0.2,
      species: Math.floor(800 + Math.random() * 400),
      x: (i % 6) * 2 - 5,
      z: Math.floor(i / 6) * 2 - 3,
      diversity: 3.2 + Math.random() * 1.8
    }))
  });

  const generatePhylogeneticData = () => ({
    novelPlacements: [
      { cluster: 'CLUSTER_001', clade: 'Thermococcales', support: 0.89, distance: 0.34 },
      { cluster: 'CLUSTER_002', clade: 'Oceanospirillales', support: 0.92, distance: 0.28 },
      { cluster: 'CLUSTER_003', clade: 'Methanobacteriales', support: 0.87, distance: 0.41 }
    ]
  });

  if (!results) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl font-semibold">Loading Analysis Results...</div>
        </div>
      </div>
    );
  }

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'embedding', label: '3D Embeddings', icon: Brain },
    { id: 'novel', label: 'Novel Species', icon: Zap },
    { id: 'diversity', label: 'Biodiversity', icon: TrendingUp },
    { id: 'phylogeny', label: 'Phylogeny', icon: Dna }
  ];

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Dna className="w-8 h-8" />
            <span className="text-lg font-semibold">Total ASVs</span>
          </div>
          <div className="text-3xl font-bold">{results.summary.totalASVs.toLocaleString()}</div>
          <div className="text-blue-100 text-sm">Unique sequence variants detected</div>
          <div className="mt-2 text-xs bg-blue-500 bg-opacity-50 rounded px-2 py-1 inline-block">
            {((results.summary.assignedTaxa / results.summary.totalASVs) * 100).toFixed(1)}% assigned
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8" />
            <span className="text-lg font-semibold">Known Taxa</span>
          </div>
          <div className="text-3xl font-bold">{results.summary.assignedTaxa.toLocaleString()}</div>
          <div className="text-green-100 text-sm">Species with database matches</div>
          <div className="mt-2 text-xs bg-green-500 bg-opacity-50 rounded px-2 py-1 inline-block">
            SILVA + NCBI databases
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-8 h-8" />
            <span className="text-lg font-semibold">Novel Clusters</span>
          </div>
          <div className="text-3xl font-bold">{results.summary.novelClusters}</div>
          <div className="text-red-100 text-sm">DNABERT-detected candidates</div>
          <div className="mt-2 text-xs bg-red-500 bg-opacity-50 rounded px-2 py-1 inline-block">
            {results.novelSpecies.filter((s: any) => s.significance === 'High').length} high confidence
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Award className="w-8 h-8" />
            <span className="text-lg font-semibold">Shannon Index</span>
          </div>
          <div className="text-3xl font-bold">{results.summary.shannonDiversity}</div>
          <div className="text-purple-100 text-sm">Community diversity</div>
          <div className="mt-2 text-xs bg-purple-500 bg-opacity-50 rounded px-2 py-1 inline-block">
            Extremely high diversity
          </div>
        </motion.div>
      </div>

      {/* Pipeline Performance Summary */}
      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-6">Pipeline Performance Summary</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{results.summary.completionTime}s</div>
            <div className="text-slate-400">Total Runtime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{results.pipelineSteps?.length || 7}</div>
            <div className="text-slate-400">Processing Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">GPU</div>
            <div className="text-slate-400">Accelerated Analysis</div>
          </div>
        </div>
      </div>

      {/* Taxonomy Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Domain Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results.taxonomyData.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Phyla with Novel Species</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={results.taxonomyData.topPhyla}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="count" stroke="#9ca3af" />
              <YAxis dataKey="novelty" stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                labelStyle={{ color: '#f9fafb' }}
              />
              <Scatter dataKey="novelty" fill="#ef4444" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const EmbeddingTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">DNABERT Embedding Space</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setView3D(!view3D)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Maximize className="w-4 h-4" />
              <span>{view3D ? '2D View' : '3D View'}</span>
            </button>
          </div>
        </div>
        
        <div className="h-96 bg-slate-900 rounded-lg">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-white">Loading 3D visualization...</div>}>
            <Canvas camera={{ position: [0, 0, 10] }}>
              <EmbeddingSpace3D data={results.embeddingData} />
            </Canvas>
          </Suspense>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Novel Species Clusters ({results.summary.novelClusters})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Known Species ({results.summary.assignedTaxa})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">High Confidence Regions</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Embedding Statistics</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">768</div>
            <div className="text-slate-400">Dimensions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">0.23</div>
            <div className="text-slate-400">Avg Distance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">47</div>
            <div className="text-slate-400">Novel Clusters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">94.2%</div>
            <div className="text-slate-400">Separation</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-900 text-white flex flex-col">
      {/* Enhanced Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">eDNA Analysis Results</h1>
            <div className="flex items-center space-x-6 text-slate-400">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{results.dataset.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(results.dataset.processedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>{results.dataset.samples} samples analyzed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>AI-Enhanced Discovery</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Export Report</span>
            </button>
            <button 
              onClick={() => navigate('/database')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              New Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 px-6">
        <div className="flex space-x-1">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex items-center space-x-2 ${
                selectedView === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedView === 'overview' && <OverviewTab />}
        {selectedView === 'embedding' && <EmbeddingTab />}
        {selectedView === 'novel' && <div className="text-center text-slate-400">Novel Species analysis coming soon...</div>}
        {selectedView === 'diversity' && <div className="text-center text-slate-400">Diversity analysis coming soon...</div>}
        {selectedView === 'phylogeny' && <div className="text-center text-slate-400">Phylogenetic analysis coming soon...</div>}
      </div>
    </div>
  );
};

export default ResultsDashboard;
