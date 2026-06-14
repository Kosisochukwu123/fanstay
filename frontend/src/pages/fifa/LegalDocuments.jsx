// src/pages/LegalDocuments.jsx
import React from 'react';
import FIFABanner from '../../components/layout/FIFABanner';
// import Footer from '../components/layout/Footer';
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";


const LegalDocuments = () => {
  const documents = [
    { title: "Terms & Conditions", desc: "General terms for using FIFA services", link: "/legal/terms" },
    { title: "Ticket Purchase Policy", desc: "Rules and regulations for ticket buyers", link: "/legal/ticket-policy" },
    { title: "Privacy Policy", desc: "How we handle your personal data", link: "/legal/privacy" },
    { title: "FIFA Code of Conduct", desc: "Expected behavior at FIFA events", link: "/legal/code-of-conduct" }
  ];

  return (
    <div className="page-container">
      <FIFABanner />
      <div className="page-content">
        <div className="page-header">
          <h1>Legal Documents</h1>
          <p>Official legal information and policies</p>
        </div>
        
        <div className="documents-list">
          {documents.map((doc, idx) => (
            <div key={idx} className="document-card">
              <i className="fas fa-file-alt"></i>
              <div className="doc-info">
                <h3>{doc.title}</h3>
                <p>{doc.desc}</p>
              </div>
              <button className="fifa-btn small">View Document</button>
            </div>
          ))}
        </div>
      </div>
      <FIFASectionFooter />
    </div>
  );
};

export default LegalDocuments;