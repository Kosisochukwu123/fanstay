// src/pages/GeneralFAQ.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const GeneralFAQ = () => {
  const faqs = [
    { q: "When do tickets go on sale?", a: "Ticket sales phases begin January 2025. Check our Sales Phases page for exact dates." },
    { q: "How many tickets can I purchase?", a: "Up to 6 tickets per match per FIFA ID, with a maximum of 20 tickets across all matches." },
    { q: "Are tickets refundable?", a: "Tickets are non-refundable but can be resold on our official marketplace." },
    { q: "Do I need a visa to attend?", a: "International fans should check entry requirements for host countries (USA, Canada, Mexico)." }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>General Public Frequently Asked Questions</h1>
          <p>Everything you need to know about FIFA World Cup 2026™ tickets</p>
        </div>
        
        <div className="faq-section">
          {faqs.map((faq, idx) => (
            <div key={idx} className="faq-item">
              <h3>Q: {faq.q}</h3>
              <p>A: {faq.a}</p>
            </div>
          ))}
        </div>
        
        <div className="faq-contact">
          <i className="fas fa-headset"></i>
          <p>Still have questions? <a href="/contact">Contact our ticket support team</a></p>
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default GeneralFAQ;