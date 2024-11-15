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
        <h1>Welcome to the Pokémon Type Filter</h1>
        <nav className="sticky-nav">
  <Link to="/raid-team" className="button">
    ⚔️ Raid Boss Counter Builder
  </Link>
  <Link to="/battle-team" className="button">
    🔍 Pokémon Type Explorer
  </Link>
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
