import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CardType() {
  const [cardTypes, setCardTypes] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCard, setNewCard] = useState({
    cardTypeId: '',
    cardTypeName: '',
    serviceProvider: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/cardtypes')
      .then(res => setCardTypes(res.data))
      .catch(err => console.error('Error fetching card types:', err));
  }, []);

  const handleChange = (e) => {
    setNewCard({ ...newCard, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/cardtypes', newCard);
      setCardTypes([...cardTypes, res.data]);
      setNewCard({ cardTypeId: '', cardTypeName: '', serviceProvider: '' });
    } catch (err) {
      console.error('Error adding card type:', err);
    }
  };

  // Filter card types based on search query
  const filteredCardTypes = cardTypes.filter((c) =>
    (c.cardTypeName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.serviceProvider || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Card Type Master</h2>

      {/* Add Card Type Form */}
      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row">
          {['cardTypeId', 'cardTypeName', 'serviceProvider'].map((field, idx) => (
            <div className="col-md-4" key={idx}>
              <input
                type="text"
                className="form-control mb-2"
                placeholder={field}
                name={field}
                value={newCard[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>
        <button className="btn btn-primary">Add Card Type</button>
      </form>

      {/* Search bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Card Name or Service Provider..."
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
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Card Type ID</th>
              <th>Name</th>
              <th>Service Provider</th>
            </tr>
          </thead>
          <tbody>
            {filteredCardTypes.map((c, i) => (
              <tr key={i}>
                <td>{c.cardTypeId}</td>
                <td>{c.cardTypeName}</td>
                <td>{c.serviceProvider}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CardType;
