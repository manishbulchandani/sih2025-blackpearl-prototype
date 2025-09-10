import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Dna, Microscope, Globe, Brain, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  const stats = [
    { value: '2,847', label: 'Novel Species Detected', icon: Dna },
    { value: '98.7%', label: 'AI Classification Accuracy', icon: Brain },
    { value: '156TB', label: 'Sequencing Data Processed', icon: Globe },
    { value: '45ms', label: 'Average Processing Time', icon: Microscope },
  ];

  const innovations = [
    {
      title: 'DNABERT-S Embeddings',
      description: 'Species-aware sequence embeddings for novelty detection',
      highlight: 'AI-Powered'
    },
    {
      title: 'Hybrid Taxonomy',
      description: 'Reference-based + ML-based classification pipeline',
      highlight: 'Innovation'
    },
    {
      title: 'Real-time Processing',
      description: 'Scalable cloud-native bioinformatics pipeline',
      highlight: 'Performance'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-teal-900 relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* DNA Animation */}
      <div className="absolute inset-0 ">
        <div className="absolute top-20 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent animate-dna-flow"></div>
        <div className="absolute top-40 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/30 to-transparent animate-dna-flow" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-60 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent animate-dna-flow" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-3 bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 rounded-full px-6 py-3 mb-6">
              <Dna className="w-6 h-6 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              <span className="text-blue-300 font-medium">Advanced eDNA Analysis Platform</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Discover Hidden
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
              Ocean Life
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionary AI-powered eDNA analysis pipeline for discovering novel deep-sea species.
            Combining reference-based taxonomy with cutting-edge machine learning for unprecedented biodiversity insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/database')}
              className="group bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl flex items-center space-x-3"
            >
              <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span>Start Analysis</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate('/showcase')}
              className="border-2 border-white/20 hover:border-white/40 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm hover:bg-white/5"
            >
              View AI Technology
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-colors duration-300"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Innovation Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          {innovations.map((innovation, index) => (
            <motion.div
              key={innovation.title}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.6 + index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-semibold rounded-full">
                  {innovation.highlight}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{innovation.title}</h3>
              <p className="text-gray-300 leading-relaxed">{innovation.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pipeline Overview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Complete Analysis Pipeline</h2>
          <p className="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
            From raw sequencing data to novel species discovery in minutes, not months.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              'Raw Data Processing',
              'Quality Control',
              'ASV Inference',
              'AI Classification',
              'Novelty Detection',
              'Biodiversity Analysis'
            ].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 2.0 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white"
              >
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
