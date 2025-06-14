import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Devices() {
  const [devices, setDevices] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newDevice, setNewDevice] = useState({
    deviceId: '',
    branchCode: '',
    location: '',
    type: '',
    uniqueId: '',
    hopperCount: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchDevices();
    fetchBranches();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/devices');
      setDevices(res.data);
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/branches');
      setBranches(res.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
    }
  };

  const handleChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/devices', newDevice);
      fetchDevices();
      setNewDevice({
        deviceId: '',
        branchCode: '',
        location: '',
        type: '',
        uniqueId: '',
        hopperCount: '',
        status: 'Active'
      });
    } catch (err) {
      console.error('Error adding device:', err);
    }
  };

  const filteredDevices = devices.filter((device) =>
    (device.branchName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Device Master</h2>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Device ID"
              name="deviceId"
              value={newDevice.deviceId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <select
              name="branchCode"
              className="form-control"
              value={newDevice.branchCode}
              onChange={handleChange}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch.branchCode} value={branch.branchCode}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Location"
              name="location"
              value={newDevice.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Type"
              name="type"
              value={newDevice.type}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Unique ID"
              name="uniqueId"
              value={newDevice.uniqueId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Hopper Count"
              name="hopperCount"
              value={newDevice.hopperCount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={newDevice.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button className="btn btn-primary">Add Device</button>
      </form>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Branch Name or Location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

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

      {showTable && (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Branch Name</th>
              <th>Location</th>
              <th>Type</th>
              <th>Unique ID</th>
              <th>Hopper Count</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDevices.map((device, index) => (
              <tr key={index}>
                <td>{device.deviceId}</td>
                <td>{device.branchName || '-'}</td>
                <td>{device.location}</td>
                <td>{device.type}</td>
                <td>{device.uniqueId}</td>
                <td>{device.hopperCount}</td>
                <td>{device.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Devices;