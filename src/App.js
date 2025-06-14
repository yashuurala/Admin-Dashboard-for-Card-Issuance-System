import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import Devices from './pages/Devices';
import Transactions from './pages/Transactions';
import BranchMaster from './pages/BranchMaster'; 
import CardType from './pages/CardTypes';
import AccountCards from './pages/AccountCards';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Navbar />
        <div className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/branches" element={<BranchMaster />} /> 
            <Route path="/cardtypes" element={<CardType />} />
            <Route path="/accountcards" element={<AccountCards />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
