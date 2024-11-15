import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import App from './App';
import RaidTeam from './RaidTeam';
import BattleTeam from './BattleTeam';
import './index.css';

// Main component with routing
function Main() {
  return (
    <BrowserRouter> {/* Only use BrowserRouter once here */}
      <div className="main">
        <h1>Welcome to the Pokemon Type Filter</h1>
        <nav>
          <Link to="/raid-team" className="button">Filter By Raid Boss</Link>
          <Link to="/battle-team" className="button">Filter by Pokemon type</Link>
        </nav>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/raid-team" element={<RaidTeam />} />
          <Route path="/battle-team" element={<BattleTeam />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
