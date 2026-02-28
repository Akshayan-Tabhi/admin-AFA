"use client";

import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style jsx global>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; width: 100%; }
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(145deg, #f2f0ed 0%, #eae8e5 50%, #e8e6e3 100%);
        }
        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .login-card {
          display: flex;
          width: 100%;
          max-width: 960px;
          min-height: 600px;
          background: #ffffff;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 30px 80px rgba(0,0,0,0.08),
            0 12px 32px rgba(0,0,0,0.05),
            0 0 0 1px rgba(0,0,0,0.02);
        }
        .art-panel {
          position: relative;
          width: 42%;
          flex-shrink: 0;
          margin: 12px;
          border-radius: 18px;
          overflow: hidden;
          background: #e8e6e3;
        }
        .form-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 52px;
        }
        .form-inner {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-width: 380px;
        }
        @media (max-width: 768px) {
          .login-wrapper { padding: 16px; }
          .login-card {
            flex-direction: column;
            max-width: 500px;
            min-height: auto;
            border-radius: 20px;
          }
          .art-panel {
            width: auto;
            height: 220px;
            margin: 10px 10px 0 10px;
            border-radius: 14px;
          }
          .form-panel { padding: 32px 28px 36px; }
          .form-inner { max-width: 100%; }
        }
        @media (max-width: 480px) {
          .login-wrapper { padding: 8px; }
          .login-card { border-radius: 16px; }
          .art-panel {
            height: 170px;
            margin: 8px 8px 0 8px;
            border-radius: 12px;
          }
          .form-panel { padding: 24px 20px 28px; }
          .form-panel h1 { font-size: 22px !important; }
          .form-panel .subtitle { font-size: 12px !important; }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-card">
          {/* LEFT - Artwork */}
          <div className="art-panel">
            <Image
              src="/login-artwork.png"
              alt="Decorative artwork"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          {/* RIGHT - Form Content */}
          <div className="form-panel">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

/* ===== Shared Styles ===== */
export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 16px",
  fontSize: "14px",
  border: "1.5px solid #e2e2e6",
  borderRadius: "10px",
  outline: "none",
  color: "#1a1a2e",
  background: "#fff",
  transition: "all 0.2s ease",
  fontFamily: "inherit",
};

export const btnPrimary: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  fontSize: "15px",
  fontWeight: 600,
  color: "#ffffff",
  background: "linear-gradient(135deg, #e85d45 0%, #e04a32 100%)",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  transition: "all 0.25s ease",
  fontFamily: "inherit",
  letterSpacing: "0.02em",
  boxShadow: "0 4px 14px rgba(232, 93, 69, 0.3)",
  marginTop: "4px",
};

export const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#e0a080";
  e.target.style.boxShadow = "0 0 0 3px rgba(232, 93, 69, 0.10)";
};

export const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = "#e2e2e6";
  e.target.style.boxShadow = "none";
};

export const btnHoverEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.boxShadow = "0 6px 22px rgba(232, 93, 69, 0.45)";
  e.currentTarget.style.transform = "translateY(-1px)";
};

export const btnHoverLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.boxShadow = "0 4px 14px rgba(232, 93, 69, 0.3)";
  e.currentTarget.style.transform = "translateY(0)";
};
