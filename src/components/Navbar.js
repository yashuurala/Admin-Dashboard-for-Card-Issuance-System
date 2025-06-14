import { NavLink } from 'react-router-dom';
import './Sidebar.css'; // we'll define the styles here

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
      <NavLink to="/branches" className={({ isActive }) => isActive ? 'active' : ''}>Branch Master</NavLink>
      <NavLink to="/accounts" className={({ isActive }) => isActive ? 'active' : ''}>Account Master</NavLink>
      <NavLink to="/devices" className={({ isActive }) => isActive ? 'active' : ''}>Device Master</NavLink>
      <NavLink to="/transactions" className={({ isActive }) => isActive ? 'active' : ''}>Transactions</NavLink>
      <NavLink to="/cardtypes" className={({ isActive }) => isActive ? 'active' : ''}>Card Type Master</NavLink>
      <NavLink to="/accountcards" className={({ isActive }) => isActive ? 'active' : ''}>Account Cards</NavLink>
    </div>
  );
}

export default Sidebar;
