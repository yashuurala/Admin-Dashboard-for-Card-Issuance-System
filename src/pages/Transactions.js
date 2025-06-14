import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showTable, setShowTable] = useState(true);

  const [customers, setCustomers] = useState([]);
  const [cardTypes, setCardTypes] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [selectedCardType, setSelectedCardType] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(res.data);

      const uniqueCustomers = [...new Set(res.data.map(t => t.customerName))];
      setCustomers(uniqueCustomers);

      const uniqueCardTypes = [...new Set(res.data.map(t => t.cardTypeName))];
      setCardTypes(uniqueCardTypes);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const matchesFilter = (txn) => {
    const matchCustomer = selectedCustomer ? txn.customerName === selectedCustomer : true;
    const matchCardType = selectedCardType ? txn.cardTypeName === selectedCardType : true;
    const matchType = selectedType ? txn.type === selectedType : true;
    const matchStatus = selectedStatus ? txn.printStatus === selectedStatus : true;
    const matchTime = (!fromDateTime || new Date(txn.generationTime) >= new Date(fromDateTime)) &&
                      (!toDateTime || new Date(txn.generationTime) <= new Date(toDateTime));
    return matchCustomer && matchCardType && matchType && matchStatus && matchTime;
  };

  const filteredTransactions = transactions.filter(matchesFilter);

  return (
    <div>
      <h2>Transaction Log</h2>

      <div className="row mb-3">
        <div className="col-md-2">
          <select className="form-control" value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)}>
            <option value="">Select Customer</option>
            {customers.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <select className="form-control" value={selectedCardType} onChange={(e) => setSelectedCardType(e.target.value)}>
            <option value="">Select Card Type</option>
            {cardTypes.map((c, i) => (
              <option key={i} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <select className="form-control" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">Select Type</option>
            <option value="New">New</option>
            <option value="Reprint">Reprint</option>
          </select>
        </div>

        <div className="col-md-2">
          <select className="form-control" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="Printed">Printed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">From (Date & Time)</label>
          <input
            type="datetime-local"
            className="form-control"
            value={fromDateTime}
            onChange={(e) => setFromDateTime(e.target.value)}
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">To (Date & Time)</label>
          <input
            type="datetime-local"
            className="form-control"
            value={toDateTime}
            onChange={(e) => setToDateTime(e.target.value)}
          />
        </div>
      </div>

      <div className="form-check form-switch mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleTable"
          checked={showTable}
          onChange={() => setShowTable(!showTable)}
        />
        <label className="form-check-label" htmlFor="toggleTable">Show Table</label>
      </div>

      {showTable && (
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Ref No</th>
              <th>Customer Name</th>
              <th>Type</th>
              <th>Card Type</th>
              <th>Ref Card Type</th>
              <th>Gen Branch</th>
              <th>Gen Location</th>
              <th>Gen Time</th>
              <th>Print Branch</th>
              <th>Print Location</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn, idx) => (
              <tr key={idx}>
                <td>{txn.refNumber}</td>
                <td>{txn.customerName || '-'}</td>
                <td>{txn.type}</td>
                <td>{txn.cardTypeName || '-'}</td>
                <td>{txn.refCardTypeName || '-'}</td>
                <td>{txn.genBranch || '-'}</td>
                <td>{txn.genLocation || '-'}</td>
                <td>{txn.generationTime?.replace('T', ' ').slice(0, 16)}</td>
                <td>{txn.printBranch || '-'}</td>
                <td>{txn.printLocation || '-'}</td>
                <td>{txn.printStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Transactions;
