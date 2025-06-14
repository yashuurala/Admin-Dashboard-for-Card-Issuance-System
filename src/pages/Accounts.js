import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newAcc, setNewAcc] = useState({
    accountId: '',
    accountType: '',
    accountNo: '',
    customerName: '',
    mobileNumber: '',
    emailAddress: ''
  });

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleChange = (e) => {
    setNewAcc({ ...newAcc, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/accounts', newAcc);
      setAccounts([...accounts, res.data]);
      setNewAcc({
        accountId: '',
        accountType: '',
        accountNo: '',
        customerName: '',
        mobileNumber: '',
        emailAddress: ''
      });
    } catch (err) {
      console.error('Error adding account:', err);
    }
  };

  // Filtered accounts based on searchQuery
  const filteredAccounts = accounts.filter((acc) =>
    acc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    acc.accountType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Account Master</h2>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          {['accountId', 'accountType', 'accountNo', 'customerName', 'mobileNumber', 'emailAddress'].map((field, idx) => (
            <div className="col-md-4" key={idx}>
              <input
                type={field.includes('email') ? 'email' : 'text'}
                className="form-control mb-2"
                placeholder={field}
                name={field}
                value={newAcc[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary">Add Account</button>
      </form>

      {/* Search input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer Name or Account Type..."
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

      {/* Conditionally render the table */}
      {showTable && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Account Type</th>
              <th>Account No</th>
              <th>Customer Name</th>
              <th>Mobile</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc._id}>
                <td>{acc.accountId}</td>
                <td>{acc.accountType}</td>
                <td>{acc.accountNo}</td>
                <td>{acc.customerName}</td>
                <td>{acc.mobileNumber}</td>
                <td>{acc.emailAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Accounts;
