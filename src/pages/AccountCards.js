import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AccountCards() {
  const [cards, setCards] = useState([]);
  const [accounts, setAccounts] = useState([]); // For dropdown
  const [cardTypes, setCardTypes] = useState([]); // For dropdown
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [newCard, setNewCard] = useState({
    accountId: '',
    cardTypeId: '',
    maskedCardNumber: '',
    issuedDate: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchCards();
    fetchAccounts();
    fetchCardTypes();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/accountcards');
      setCards(res.data);
    } catch (err) {
      console.error('Error fetching account cards:', err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/accounts');
      setAccounts(res.data);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchCardTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cardtypes');
      setCardTypes(res.data);
    } catch (err) {
      console.error('Error fetching card types:', err);
    }
  };

  const handleChange = (e) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/accountcards', newCard);
      setCards([...cards, res.data]);
      setNewCard({
        accountId: '',
        cardTypeId: '',
        maskedCardNumber: '',
        issuedDate: '',
        expiryDate: ''
      });
    } catch (err) {
      console.error('Error adding account card:', err);
    }
  };

  const filteredCards = cards.filter((c) =>
    (c.customerName || c.accountId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Account Cards</h2>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4 mb-2">
            <select
              className="form-control"
              name="accountId"
              value={newCard.accountId}
              onChange={handleChange}
              required
            >
              <option value="">Select Customer</option>
              {accounts.map((acc) => (
                <option key={acc._id} value={acc.accountId}>
                  {acc.customerName} ({acc.accountId})
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <select
              className="form-control"
              name="cardTypeId"
              value={newCard.cardTypeId}
              onChange={handleChange}
              required
            >
              <option value="">Select Card Type</option>
              {cardTypes.map((type) => (
                <option key={type._id} value={type.cardTypeId}>
                  {type.cardTypeName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Masked Card Number"
              name="maskedCardNumber"
              value={newCard.maskedCardNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <label htmlFor="issuedDate" className="form-label">Issued Date</label>
            <input
              type="date"
              className="form-control"
              name="issuedDate"
              value={newCard.issuedDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4 mb-2">
            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-control"
              name="expiryDate"
              value={newCard.expiryDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="btn btn-primary mt-2">Add Account Card</button>
      </form>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Customer Name..."
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
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Card Type</th>
              <th>Masked Card No</th>
              <th>Issued Date</th>
              <th>Expiry Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.map((c, i) => (
              <tr key={i}>
                <td>{c.customerName || c.accountId}</td>
                <td>{c.cardTypeName || c.cardTypeId}</td>
                <td>{c.maskedCardNumber}</td>
                <td>{c.issuedDate}</td>
                <td>{c.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AccountCards;
