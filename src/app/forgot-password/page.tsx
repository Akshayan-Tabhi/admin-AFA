"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { z } from "zod";
import { forgotPasswordSchema } from "@/lib/validations";
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
  const [emailError, setEmailError] = useState<string | undefined>();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      forgotPasswordSchema.parse({ email: resetEmail });
      setEmailError(undefined);
      setStep("otp");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0]?.message);
      }
    }
  };

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
      className="self-start bg-transparent border-none text-[#888] text-[13px] cursor-pointer flex items-center gap-1 mb-2 font-[inherit] hover:text-[#555] transition-colors"
    >
      {label}
    </button>
  );

  const logo = (
    <div className="mb-7">
      <Image src="/logo_main.png" alt="Miraee Logo" width={150} height={48} className="object-contain" priority />
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "email":
        return (
          <>
            {backButton(() => router.push("/login"), "← Back to login")}
            {logo}

            <h1 className="text-[28px] max-sm:text-[22px] font-bold text-[#1a1a2e] text-center leading-tight tracking-[-0.02em] mb-2">
              Forgot Password?
            </h1>
            <p className="text-sm max-sm:text-xs text-[#999] text-center mb-8 leading-relaxed">
              No worries! Enter your email and we&apos;ll send you a verification code
            </p>

            <form onSubmit={handleSendResetLink} className="flex flex-col gap-2 w-full max-w-[380px] max-md:max-w-full">
              <label htmlFor="reset-email" className="text-[13px] font-medium text-[#555] mb-0.5">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                placeholder="Enter your email address"
                value={resetEmail}
                onChange={(e) => { setResetEmail(e.target.value); if (emailError) setEmailError(undefined); }}
                style={{ ...inputStyle, marginBottom: emailError ? "4px" : "20px", borderColor: emailError ? "#ef4444" : "#e5e5ed" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              {emailError && <span className="text-[#ef4444] text-[11px] mb-4 block">{emailError}</span>}
              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Send OTP
              </button>
            </form>
          </>
        );

      case "otp":
        return (
          <>
            {backButton(() => setStep("email"))}
            {logo}

            <h1 className="text-[28px] max-sm:text-[22px] font-bold text-[#1a1a2e] text-center leading-tight tracking-[-0.02em] mb-2">
              Verify OTP
            </h1>
            <p className="text-sm max-sm:text-xs text-[#999] text-center mb-3 leading-relaxed">
              We&apos;ve sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold text-[#1a1a2e] text-center mb-7">
              {resetEmail || "your@email.com"}
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep("newpass"); }} className="flex flex-col gap-2 w-full max-w-[380px] max-md:max-w-full">
              {/* OTP Boxes */}
              <div className="flex gap-2.5 max-sm:gap-1.5 justify-center mb-6">
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
                    className="w-12 h-[52px] max-sm:w-10 max-sm:h-11 text-center text-xl font-semibold rounded-[10px] outline-none text-[#1a1a2e] bg-white transition-all duration-200 font-[inherit]"
                    style={{
                      border: digit ? "1.5px solid #e85d45" : "1.5px solid #e2e2e6",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "#e85d45"; e.target.style.boxShadow = "0 0 0 3px rgba(232, 93, 69, 0.10)"; }}
                    onBlur={(e) => { e.target.style.borderColor = digit ? "#e85d45" : "#e2e2e6"; e.target.style.boxShadow = "none"; }}
                  />
                ))}
              </div>

              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Verify OTP
              </button>

              <p className="text-center text-[13px] text-[#999] mt-4">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={() => { /* resend logic */ }}
                  className="bg-transparent border-none text-[#e85d45] font-semibold cursor-pointer text-[13px] font-[inherit] underline underline-offset-2"
                >
                  Resend OTP
                </button>
              </p>
            </form>
          </>
        );

      case "newpass":
        return (
          <>
            {backButton(() => setStep("otp"))}
            {logo}

            <h1 className="text-[28px] max-sm:text-[22px] font-bold text-[#1a1a2e] text-center leading-tight tracking-[-0.02em] mb-2">
              Set New Password
            </h1>
            <p className="text-sm max-sm:text-xs text-[#999] text-center mb-8 leading-relaxed">
              Create a strong password for your account
            </p>

            <form onSubmit={(e) => { e.preventDefault(); setStep("success"); }} className="flex flex-col gap-2 w-full max-w-[380px] max-md:max-w-full">
              <label htmlFor="new-pass" className="text-[13px] font-medium text-[#555] mb-0.5">
                New Password
              </label>
              <div className="relative mb-3">
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
                <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[15px] text-[#aaa] p-1">
                  {showNewPass ? "🙈" : "👁"}
                </button>
              </div>

              <label htmlFor="confirm-pass" className="text-[13px] font-medium text-[#555] mb-0.5">
                Confirm Password
              </label>
              <div className="relative mb-2">
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
                <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[15px] text-[#aaa] p-1">
                  {showConfirmPass ? "🙈" : "👁"}
                </button>
              </div>

              {/* Password requirements */}
              <div className="text-xs text-[#aaa] mb-3 leading-[1.7]">
                <div className="flex items-center gap-1.5">
                  <span className={newPassword.length >= 8 ? "text-[#22c55e]" : "text-[#ccc]"}>●</span>
                  At least 8 characters
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={/[A-Z]/.test(newPassword) ? "text-[#22c55e]" : "text-[#ccc]"}>●</span>
                  One uppercase letter
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={/\d/.test(newPassword) ? "text-[#22c55e]" : "text-[#ccc]"}>●</span>
                  One number
                </div>
              </div>

              <button type="submit" style={btnPrimary} onMouseEnter={btnHoverEnter} onMouseLeave={btnHoverLeave}>
                Reset Password
              </button>
            </form>
          </>
        );

      case "success":
        return (
          <>
            {logo}

            {/* Success icon */}
            <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-[rgba(232,93,69,0.12)] to-[rgba(232,93,69,0.06)] flex items-center justify-center mb-6">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#e85d45" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>

            <h1 className="text-[28px] max-sm:text-[22px] font-bold text-[#1a1a2e] text-center leading-tight tracking-[-0.02em] mb-2">
              Password Reset!
            </h1>
            <p className="text-sm max-sm:text-xs text-[#999] text-center mb-8 leading-relaxed">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="flex flex-col gap-2 w-full max-w-[380px] max-md:max-w-full">
              <button
                onClick={() => router.push("/login")}
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
