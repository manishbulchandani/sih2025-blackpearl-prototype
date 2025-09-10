import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DatabaseBrowser from './pages/DatabaseBrowser';
import PipelineExecution from './pages/PipelineExecution';
import ResultsDashboard from './pages/ResultsDashboard';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 ml-64"
        >
          <Routes>
            <Route path="/" element={<Navigate to="/database" replace />} />
            <Route path="/database" element={<DatabaseBrowser />} />
            <Route path="/pipeline/:datasetId" element={<PipelineExecution />} />
            <Route path="/results/:resultId" element={<ResultsDashboard />} />
          </Routes>
        </motion.main>
      </div>
    </Router>
  );
}

export default App;
