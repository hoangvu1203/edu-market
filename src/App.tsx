import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import ViewHistoryPage from './pages/ViewHistoryPage';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/view-history" element={<ViewHistoryPage />} />
          </Routes>
          <ScrollToTopButton />
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
