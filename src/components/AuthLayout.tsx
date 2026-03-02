"use client";

import Image from "next/image";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 sm:p-4 max-sm:p-2 bg-gradient-to-br from-[#f2f0ed] via-[#eae8e5] to-[#e8e6e3] font-[Inter,system-ui,-apple-system,sans-serif]">
      <div className="flex w-full max-w-[960px] min-h-[600px] bg-white rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.08),0_12px_32px_rgba(0,0,0,0.05),0_0_0_1px_rgba(0,0,0,0.02)] max-md:flex-col max-md:max-w-[500px] max-md:min-h-0 max-md:rounded-[20px] max-sm:rounded-2xl">
        {/* LEFT - Artwork */}
        <div className="relative w-[42%] shrink-0 m-3 rounded-[18px] overflow-hidden bg-[#e8e6e3] max-md:w-auto max-md:h-[220px] max-md:m-[10px_10px_0_10px] max-md:rounded-[14px] max-sm:h-[170px] max-sm:m-[8px_8px_0_8px] max-sm:rounded-xl">
          <Image
            src="/login-artwork.png"
            alt="Decorative artwork"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT - Form Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-[48px_52px] max-md:p-[32px_28px_36px] max-sm:p-[24px_20px_28px]">
          {children}
        </div>
      </div>
    </div>
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
