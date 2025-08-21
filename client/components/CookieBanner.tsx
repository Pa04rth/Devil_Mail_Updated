"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check localStorage to see if consent has already been given
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // If no consent is found, show the banner
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    // When the user accepts, save their consent to localStorage
    localStorage.setItem("cookie_consent", "true");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%",
        backgroundColor: "#333",
        color: "white",
        padding: "15px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <p style={{ margin: 0, paddingBottom: "10px" }}>
        We use cookies to enhance your experience. By clicking "Accept", you
        agree to our use of cookies.
        {/* You should link to a real privacy policy page */}
        <Link
          href="/privacy-policy"
          style={{ color: "#aaffaa", marginLeft: "10px" }}
        >
          Learn More
        </Link>
      </p>
      <button
        onClick={handleAccept}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        Accept All Cookies
      </button>
    </div>
  );
}
