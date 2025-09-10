import { motion } from 'framer-motion';

const TechnicalShowcase = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 p-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI/ML Technical Showcase</h1>
        <p className="text-gray-600">Technical showcase and innovation highlights coming soon...</p>
      </div>
    </motion.div>
  );
};

export default TechnicalShowcase;
