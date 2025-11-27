import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Simulados = lazy(() => import('@/pages/Simulados'));
const SkillsProgress = lazy(() => import('@/pages/SkillsProgress'));
const Configuracoes = lazy(() => import('@/pages/Configuracoes'));

function App() {
  return (
    <Router>
      <Layout>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Carregando VDP...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/simulados" element={<Simulados />} />
            <Route path="/skills" element={<SkillsProgress />} />
            <Route path="/config" element={<Configuracoes />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;
