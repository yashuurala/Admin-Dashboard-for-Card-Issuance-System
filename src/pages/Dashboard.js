import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [summary, setSummary] = useState({
    total: 0,
    failed: 0,
    recent: [],
    activeDevices: 0
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const txnRes = await axios.get('http://localhost:5000/api/transactions/summary');
        const deviceRes = await axios.get('http://localhost:5000/api/devices/active-count');

        setSummary({
          total: txnRes.data.total,
          failed: txnRes.data.failed,
          recent: txnRes.data.recent,
          activeDevices: deviceRes.data.active
        });
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="p-3 border rounded bg-light">Total Cards Issued: {summary.total}</div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded bg-light">Active Devices: {summary.activeDevices}</div>
        </div>
        <div className="col-md-4">
          <div className="p-3 border rounded bg-light">Failed Transactions: {summary.failed}</div>
        </div>
      </div>

      <div className="bg-light p-3 border rounded">
        <h5>Recent Transactions</h5>
        {summary.recent.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead className="table-light">
              <tr>
                <th>Ref No</th>
                <th>Type</th>
                <th>Generation Time</th>
              </tr>
            </thead>
            <tbody>
              {summary.recent.map((txn) => (
                <tr key={txn._id}>
                  <td>{txn.refNumber}</td>
                  <td>{txn.type}</td>
                  <td>{txn.generationTime?.replace('T', ' ').slice(0, 16)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted">No recent transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
