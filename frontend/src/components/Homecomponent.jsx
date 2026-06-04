import React, { useState } from 'react';
import '../features/style/homebar.scss';

const Homecomponent = () => {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All', type: 'all' },
    { id: 'popular', label: 'Popular', type: 'category' },
    { id: 'trending', label: 'Trending', type: 'category' },
    { id: 'Action', label: 'Action', type: 'genre' },
    { id: 'Comedy', label: 'Comedy', type: 'genre' },
    { id: 'Horror', label: 'Horror', type: 'genre' },
    { id: 'Sci-Fi', label: 'Sci-Fi', type: 'genre' },
    { id: 'Drama', label: 'Drama', type: 'genre' },
    { id: 'Thriller', label: 'Thriller', type: 'genre' }
  ];

  return (
    <div className="premium-filter-bar-container">
      <div className="scrollable-tabs-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`filter-tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Homecomponent;