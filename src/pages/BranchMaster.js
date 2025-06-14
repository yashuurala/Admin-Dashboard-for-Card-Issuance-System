import React, { useEffect, useState } from 'react';
import axios from 'axios';

function BranchMaster() {
  const [branches, setBranches] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState(''); // Search input state
  const [newBranch, setNewBranch] = useState({
    branchCode: '',
    branchName: ''
  });

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/branches');
      setBranches(res.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleChange = (e) => {
    setNewBranch({ ...newBranch, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/branches', newBranch);
      setBranches([...branches, res.data]);
      setNewBranch({ branchCode: '', branchName: '' });
    } catch (err) {
      console.error('Error adding branch:', err);
    }
  };

  // Filter branches based on search query
  const filteredBranches = branches.filter((b) =>
    b.branchName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Branch Master</h2>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Branch Code"
              name="branchCode"
              value={newBranch.branchCode}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Branch Name"
              name="branchName"
              value={newBranch.branchName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="btn btn-primary">Add Branch</button>
      </form>

      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Branch Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Toggle Switch */}
      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleTable"
          checked={showTable}
          onChange={() => setShowTable(!showTable)}
        />
        <label className="form-check-label" htmlFor="toggleTable">
          Show Table
        </label>
      </div>

      {/* Conditionally render table */}
      {showTable && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Branch Code</th>
              <th>Branch Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredBranches.map((branch) => (
              <tr key={branch._id}>
                <td>{branch.branchCode}</td>
                <td>{branch.branchName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BranchMaster;
