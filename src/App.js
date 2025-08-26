import React, { useState } from 'react';
import CoinToss from './CoinToss';
import ContestResults from './ContestResults';

function App() {
  const [currentPage, setCurrentPage] = useState('coinToss'); // デフォルトはコイントス

  const navigateToResults = () => {
    setCurrentPage('results');
  };

  const navigateToCoinToss = () => {
    setCurrentPage('coinToss');
  };

  return (
    <div className="App">
      {currentPage === 'coinToss' ? (
        <CoinToss onNavigateToResults={navigateToResults} />
      ) : (
        <ContestResults onNavigateToCoinToss={navigateToCoinToss} />
      )}
    </div>
  );
}

export default App;