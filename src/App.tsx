import React from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import Premium from './pages/Premium';

function App() {
  // Simple client-side routing
  const [currentPage, setCurrentPage] = React.useState(
    window.location.pathname === '/tickets' ? 'tickets' :
    window.location.pathname === '/premium' ? 'premium' : 'home'
  );

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(
        window.location.pathname === '/tickets' ? 'tickets' :
        window.location.pathname === '/premium' ? 'premium' : 'home'
      );
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPage(
      path === '/tickets' ? 'tickets' :
      path === '/premium' ? 'premium' : 'home'
    );
  };

  return (
    <Layout>
      {currentPage === 'home' && <Home />}
      {currentPage === 'tickets' && <Tickets />}
      {currentPage === 'premium' && <Premium />}
    </Layout>
  );
}

export default App;