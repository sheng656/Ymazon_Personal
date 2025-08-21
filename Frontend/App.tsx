import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Prediction } from './components/Prediction';
import { Maintenance } from './components/Maintenance';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'prediction':
        return <Prediction />;
      case 'maintenance':
        return <Maintenance />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="min-h-[calc(100vh-4rem)]">
        {renderCurrentPage()}
      </main>
      <Toaster />
    </div>
  );
}