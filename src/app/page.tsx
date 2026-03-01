"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { loginSchema } from "@/lib/validations";
import AuthLayout, {
  inputStyle,
  btnPrimary,
  handleFocus,
  handleBlur,
  btnHoverEnter,
  btnHoverLeave,
} from "@/components/AuthLayout";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberLogin, setRememberLogin] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      // Proceed with actual login logic here
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") newErrors.email = err.message;
          if (err.path[0] === "password") newErrors.password = err.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <AuthLayout>
      {/* Logo */}
      <div style={{ marginBottom: "28px" }}>
        <Image
          src="/logo_main.png"
          alt="Miraee Logo"
          width={150}
          height={48}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#1a1a2e",
          textAlign: "center",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}
      >
        Login to your account
      </h1>
      <p
        className="subtitle"
        style={{
          fontSize: "14px",
          color: "#999",
          textAlign: "center",
          fontWeight: 400,
          marginBottom: "32px",
          lineHeight: 1.5,
        }}
      >
        Welcome back! Enter your details to log in to your account
      </p>

      {/* Form */}
      <form
        onSubmit={handleLogin}
        className="form-inner"
      >
        {/* Email */}
        <label
          htmlFor="email"
          style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
          style={{ ...inputStyle, marginBottom: errors.email ? "4px" : "12px", borderColor: errors.email ? "#ef4444" : "#e5e5ed" }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {errors.email && <span style={{ color: "#ef4444", fontSize: "11px", marginBottom: "8px", display: "block" }}>{errors.email}</span>}

        {/* Password */}
        <label
          htmlFor="password"
          style={{ fontSize: "13px", fontWeight: 500, color: "#555", marginBottom: "2px" }}
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
          style={{ ...inputStyle, borderColor: errors.password ? "#ef4444" : "#e5e5ed", marginBottom: errors.password ? "4px" : "0" }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {errors.password && <span style={{ color: "#ef4444", fontSize: "11px", display: "block", marginTop: "4px" }}>{errors.password}</span>}

        {/* Remember + Forgot */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "6px",
            marginBottom: "8px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "13px",
              color: "#666",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberLogin}
              onChange={(e) => setRememberLogin(e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: "#e85d45", cursor: "pointer" }}
            />
            Remember login
          </label>
          <button
            type="button"
            onClick={() => router.push("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              fontSize: "13px",
              fontWeight: 500,
              color: "#e85d45",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Forget Password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          id="login-button"
          style={btnPrimary}
          onMouseEnter={btnHoverEnter}
          onMouseLeave={btnHoverLeave}
        >
          Login
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)" }} />
          <span style={{ fontSize: "12px", color: "#bbb" }}>Or continue with</span>
          <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #e0e0e0, transparent)" }} />
        </div>

        {/* Microsoft */}
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1a1a2e",
            background: "#f4f4f5",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#eaeaec"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
        >
          <svg width="18" height="18" viewBox="0 0 23 23">
            <rect x="1" y="1" width="10" height="10" fill="#f25022"/>
            <rect x="12" y="1" width="10" height="10" fill="#7fba00"/>
            <rect x="1" y="12" width="10" height="10" fill="#00a4ef"/>
            <rect x="12" y="12" width="10" height="10" fill="#ffb900"/>
          </svg>
          Sign in with Microsoft
        </button>

        {/* Google */}
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            fontWeight: 500,
            color: "#1a1a2e",
            background: "#f4f4f5",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            fontFamily: "inherit",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#eaeaec"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#f4f4f5"; }}
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          Sign in with Google
        </button>
      </form>
    </AuthLayout>
  );
}
