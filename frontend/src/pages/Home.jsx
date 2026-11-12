import React from "react";
import { Link } from "react-router-dom";
import { Activity, ArrowRight, FileText, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  return <div className="landing">
    <nav className="landing-nav wrap">
      <Link to="/" className="brand"><span className="brand-mark"><Activity size={20}/></span>report<span className="brand-light">alyze</span></Link>
      <div className="nav-actions"><a href="#how-it-works">How it works</a><Link className="btn btn-dark btn-small" to={user ? "/dashboard" : "/login"}>{user ? "Open workspace" : "Sign in"} <ArrowRight size={15}/></Link></div>
    </nav>
    <section className="hero wrap">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={14}/> A clearer way to read your reports</div>
        <h1>Make sense of your medical reports, <em>with clarity.</em></h1>
        <p className="hero-sub">Upload a lab report and get a plain-language explanation of the information it contains. Understand the terms, prepare better questions, and keep your reports organized.</p>
        <div className="hero-actions"><Link to={user ? "/dashboard" : "/login"} className="btn btn-primary">Get started <ArrowRight size={17}/></Link><a href="#how-it-works" className="text-link">See how it works</a></div>
        <div className="trust-row"><ShieldCheck size={16}/> Private account-based report history <span>·</span> Educational, not diagnostic</div>
      </div>
      <div className="hero-visual">
        <div className="visual-glow"></div>
        <div className="report-card">
          <div className="mock-top"><div className="mock-icon"><Activity size={18}/></div><div><b>Report overview</b><small>Sample laboratory report</small></div><span className="mock-pill">EXAMPLE</span></div>
          <div className="mock-rule"></div>
          <div className="mock-stat"><span>Hemoglobin</span><b>13.8 <small>g/dL</small></b><i>Example value</i></div>
          <div className="mock-stat"><span>White blood cells</span><b>6.2 <small>×10⁹/L</small></b><i>Example value</i></div>
          <div className="mock-stat"><span>Platelets</span><b>248 <small>×10⁹/L</small></b><i>Example value</i></div>
          <div className="ai-note"><Sparkles size={16}/><div><b>Plain-language explanation</b><p>Learn what each measurement generally represents and what to discuss with your clinician.</p></div></div>
          <div className="mock-footer"><ShieldCheck size={14}/> Your information stays in your account</div>
        </div>
        <div className="float-chip"><FileText size={17}/> PDF & image reports</div>
      </div>
    </section>
    <section id="how-it-works" className="steps-section">
      <div className="wrap"><div className="section-kicker">SIMPLE BY DESIGN</div><h2>From report to understanding</h2><div className="steps-grid">
        <article><span>01</span><FileText/><h3>Upload your report</h3><p>Add a PDF, JPG, or PNG report from your device.</p></article>
        <article><span>02</span><Sparkles/><h3>Get an explanation</h3><p>Review extracted information and an educational AI summary.</p></article>
        <article><span>03</span><ShieldCheck/><h3>Keep it organized</h3><p>Return to your report history whenever you need it.</p></article>
      </div></div>
    </section>
    <footer className="landing-footer"><div className="wrap"><b>reportalyze</b><span>For education only. Not a substitute for professional medical advice.</span></div></footer>
  </div>;
}
