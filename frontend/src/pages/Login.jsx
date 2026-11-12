import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Activity, ArrowLeft, ShieldCheck } from "lucide-react";
import GoogleLogin from "../components/GoogleLogin";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace/>;
  return <div className="login-page">
    <Link to="/" className="back-link"><ArrowLeft size={16}/> Back to home</Link>
    <div className="login-card">
      <div className="login-logo"><span className="brand-mark"><Activity size={21}/></span></div>
      <div className="section-kicker">WELCOME TO REPORTALYZE</div>
      <h1>Your reports, made clearer.</h1>
      <p>Sign in securely to upload and understand your medical reports.</p>
      <GoogleLogin/>
      <div className="login-divider"><span>SECURE ACCESS</span></div>
      <div className="login-assurance"><ShieldCheck size={17}/> Your account keeps your reports private.</div>
      <small className="terms">By continuing, you agree to use this service for educational information only, not diagnosis or treatment.</small>
    </div>
  </div>;
}
