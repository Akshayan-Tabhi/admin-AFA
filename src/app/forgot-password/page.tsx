"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import AuthLayout, {
  inputStyle,
  btnPrimary,
  handleFocus,
  handleBlur,
  btnHoverEnter,
  btnHoverLeave,
} from "@/components/AuthLayout";

type Step = "email" | "otp" | "newpass" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  const [resetEmail, setResetEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    const nextIndex = Math.min(pasted.length, 5);
    otpRefs.current[nextIndex]?.focus();
  };

  const backButton = (onClick: () => void, label = "← Back") => (
    <button
      onClick={onClick}
      style={{
        alignSelf: "flex-start",
        background: "none",
        border: "none",
        color: "#888",
        fontSize: "13px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        marginBottom: "8px",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );

  const logo = (
    <div style={{ marginBottom: "28px" }}>
      <Image src="/logo_main.png" alt="Miraee Logo" width={150} height={48} style={{ objectFit: "contain" }} priority />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      // -------- Step 1: Enter Email --------
      case "email":
        return (
          <>
            {backButton(() => router.push("/"), "← Back to login")}
            {logo}

            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Forgot Password?
            </h1>
            <p className="subtitle" style={{ fontSize: "14px", color: "#999", textAlign: "center", marginBottom: "32px", lineHeight: 1.5 }}>
              No worries! Enter your email and we&apos;ll send you a verification code
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep("otp"); }} className="form-inner">
              <label htmlFor="reset-email" style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}>
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                style={{ ...inputStyle, marginBottom: "20px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
                required
              />
              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Send OTP
              </button>
            </form>
          </>
        );

      // -------- Step 2: OTP Verification --------
      case "otp":
        return (
          <>
            {backButton(() => setStep("email"))}
            {logo}

            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Verify OTP
            </h1>
            <p className="subtitle" style={{ fontSize: "14px", color: "#999", textAlign: "center", marginBottom: "12px", lineHeight: 1.5 }}>
              We&apos;ve sent a 6-digit code to
            </p>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", textAlign: "center", marginBottom: "28px" }}>
              {resetEmail || "your@email.com"}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep("newpass"); }} className="form-inner">
              {/* OTP Boxes */}
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    onPaste={i === 0 ? handleOtpPaste : undefined}
                    style={{
                      width: "48px",
                      height: "52px",
                      textAlign: "center",
                      fontSize: "20px",
                      fontWeight: 600,
                      border: digit ? "1.5px solid #e85d45" : "1.5px solid #e2e2e6",
                      borderRadius: "10px",
                      outline: "none",
                      color: "#1a1a2e",
                      background: "#fff",
                      transition: "all 0.2s ease",
                      fontFamily: "inherit",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#e85d45"; e.target.style.boxShadow = "0 0 0 3px rgba(232, 93, 69, 0.10)"; }}
                    onBlur={(e) => { e.target.style.borderColor = digit ? "#e85d45" : "#e2e2e6"; e.target.style.boxShadow = "none"; }}
                  />
                ))}
              </div>

              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Verify OTP
              </button>

              <p style={{ textAlign: "center", fontSize: "13px", color: "#999", marginTop: "16px" }}>
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => { /* resend logic */ }}
                  style={{ background: "none", border: "none", color: "#e85d45", fontWeight: 600, cursor: "pointer", fontSize: "13px", fontFamily: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}
                >
                  Resend OTP
                </button>
              </p>
            </form>
          </>
        );

      // -------- Step 3: New Password --------
      case "newpass":
        return (
          <>
            {backButton(() => setStep("otp"))}
            {logo}

            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Set New Password
            </h1>
            <p className="subtitle" style={{ fontSize: "14px", color: "#999", textAlign: "center", marginBottom: "32px", lineHeight: 1.5 }}>
              Create a strong password for your account
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep("success"); }} className="form-inner">
              <label htmlFor="new-pass" style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}>
                New Password
              </label>
              <div style={{ position: "relative", marginBottom: "12px" }}>
                <input
                  id="new-pass"
                  type={showNewPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "48px" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#aaa", padding: "4px" }}>
                  {showNewPass ? "🙈" : "👁"}
                </button>
              </div>

              <label htmlFor="confirm-pass" style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}>
                Confirm Password
              </label>
              <div style={{ position: "relative", marginBottom: "8px" }}>
                <input
                  id="confirm-pass"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "48px" }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "15px", color: "#aaa", padding: "4px" }}>
                  {showConfirmPass ? "🙈" : "👁"}
                </button>
              </div>

              {/* Password requirements */}
              <div style={{ fontSize: "12px", color: "#aaa", marginBottom: "12px", lineHeight: 1.7 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: newPassword.length >= 8 ? "#22c55e" : "#ccc" }}>●</span>
                  At least 8 characters
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: /[A-Z]/.test(newPassword) ? "#22c55e" : "#ccc" }}>●</span>
                  One uppercase letter
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: /\d/.test(newPassword) ? "#22c55e" : "#ccc" }}>●</span>
                  One number
                </div>
              </div>

              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Reset Password
              </button>
            </form>
          </>
        );

      // -------- Step 4: Success --------
      case "success":
        return (
          <>
            {logo}

            {/* Success icon */}
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(232, 93, 69, 0.12) 0%, rgba(232, 93, 69, 0.06) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e85d45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#1a1a2e", textAlign: "center", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Password Reset!
            </h1>
            <p className="subtitle" style={{ fontSize: "14px", color: "#999", textAlign: "center", marginBottom: "32px", lineHeight: 1.5 }}>
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="form-inner">
              <button
                onClick={() => router.push("/")}
                style={btnPrimary}
                onMouseEnter={btnHoverEnter}
                onMouseLeave={btnHoverLeave}
              >
                Back to Login
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <AuthLayout>
      {renderStep()}
    </AuthLayout>
  );
}
