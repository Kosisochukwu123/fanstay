// src/pages/fifa/TicketTransfer.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FIFABanner from '../../components/layout/FIFABanner';
import FIFASectionFooter from '../../components/layout/FIFASectionFooter';
import './fifa.css';

const TicketTransfer = () => {
  const navigate = useNavigate();
  const [transferData, setTransferData] = useState({
    ticketId: '',
    recipientEmail: '',
    recipientName: ''
  });

  const myTickets = [
    { id: "FIFA-2026-001", match: "Opening Match", date: "June 11, 2026", seats: "Section 124, Seats 5-6" },
    { id: "FIFA-2026-002", match: "USA vs England", date: "June 15, 2026", seats: "Section 205, Seats 12-14" },
  ];

  const handleTransfer = (e) => {
    e.preventDefault();
    console.log('Transfer initiated:', transferData);
    alert(`Ticket transfer initiated to ${transferData.recipientEmail}. The recipient will receive an email to accept.`);
    setTransferData({ ticketId: '', recipientEmail: '', recipientName: '' });
  };

  return (
    <div className="fifa-page-container">
      <FIFABanner />
      
      <div className="page-content">
        <div className="page-header">
          <h1>Ticket Transfer</h1>
          <p>Securely transfer your tickets to friends, family, or clients</p>
        </div>

        <div className="transfer-container">
          <div className="my-tickets">
            <h3>My Tickets</h3>
            {myTickets.map((ticket) => (
              <div key={ticket.id} className="ticket-item">
                <div>
                  <strong>{ticket.match}</strong>
                  <p>{ticket.date}</p>
                  <p>{ticket.seats}</p>
                  <small>ID: {ticket.id}</small>
                </div>
                <button 
                  className="select-btn"
                  onClick={() => setTransferData({...transferData, ticketId: ticket.id})}
                >
                  Select
                </button>
              </div>
            ))}
          </div>

          <div className="transfer-form">
            <h3>Transfer Ticket</h3>
            <form onSubmit={handleTransfer}>
              <div className="form-group">
                <label>Ticket ID / Order Number *</label>
                <input 
                  type="text" 
                  value={transferData.ticketId} 
                  onChange={(e) => setTransferData({...transferData, ticketId: e.target.value})}
                  placeholder="e.g., FIFA-2026-XXXX"
                  required 
                />
              </div>
              <div className="form-group">
                <label>Recipient's Full Name *</label>
                <input 
                  type="text" 
                  value={transferData.recipientName}
                  onChange={(e) => setTransferData({...transferData, recipientName: e.target.value})}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Recipient's Email Address *</label>
                <input 
                  type="email" 
                  value={transferData.recipientEmail}
                  onChange={(e) => setTransferData({...transferData, recipientEmail: e.target.value})}
                  required 
                />
              </div>
              <button type="submit" className="transfer-btn">Transfer Ticket →</button>
            </form>
          </div>
        </div>

        <div className="info-section">
          <h3><i className="fas fa-info-circle"></i> How Ticket Transfer Works</h3>
          <ol>
            <li>Select the ticket you want to transfer</li>
            <li>Enter recipient's details (they need a FIFA ID)</li>
            <li>Recipient receives an email to accept the transfer</li>
            <li>Once accepted, ticket is permanently moved to their account</li>
            <li>Original ticket is invalidated</li>
          </ol>
        </div>

        <button className="back-btn" onClick={() => navigate('/fifa')}>
          ← Back to FIFA World Cup
        </button>
      </div>

      <FIFASectionFooter />
    </div>
  );
};

export default TicketTransfer;