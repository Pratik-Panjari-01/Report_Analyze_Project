import React from "react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Sparkles, AlertCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Analysis() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const { data } = await api.get(`/api/reports/${id}`);
      setReport(data.report); setAnalysis(data.report.analysis || "");
    } catch { toast.error("Could not load report"); }
  }
  useEffect(() => { load(); }, [id]);
  async function analyze() {
    setBusy(true);
    try { const { data } = await api.post(`/api/ai/${id}`); setAnalysis(data.analysis); toast.success("Explanation generated"); }
    catch (e) { toast.error(e.response?.data?.message || "Analysis failed"); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!confirm("Delete this report permanently?")) return;
    try { await api.delete(`/api/reports/${id}`); toast.success("Report deleted"); window.location.href = "/history"; }
    catch { toast.error("Could not delete report"); }
  }
  if (!report) return <div className="loading-screen">Loading report…</div>;
  return <div className="narrow-page">
    <Link to="/history" className="back-link"><ArrowLeft size={16}/> Back to reports</Link>
    <div className="analysis-title"><div><div className="section-kicker">REPORT DETAILS</div><h1>{report.originalName}</h1><p className="page-lead">Uploaded {new Date(report.createdAt).toLocaleString()}</p></div><button className="icon-button danger" onClick={remove} title="Delete report"><Trash2/></button></div>
    <div className="detail-card"><div className="detail-file"><span className="file-icon"><FileText/></span><div><b>{report.originalName}</b><small>{report.mimeType} · {(report.size/1024/1024).toFixed(2)} MB</small></div><span className="status">{report.status}</span></div></div>
    {!report.extractedText ? <div className="notice"><AlertCircle/><div><b>Text extraction is not available yet</b><p>This file may be a scanned PDF or image. OCR support is not included in this first version. Upload a text-based PDF for extraction.</p></div></div> :
      <div className="analysis-panel"><div className="panel-heading"><div className="panel-icon"><Sparkles/></div><div><h2>AI explanation</h2><p>Educational summary of the extracted report text</p></div></div>
        {analysis ? <div className="analysis-text">{analysis}</div> : <div className="analysis-empty"><p>Your report text has been extracted. Generate an explanation to understand the terms and values.</p><button onClick={analyze} disabled={busy} className="btn btn-primary">{busy ? "Analyzing…" : "Generate explanation"}</button></div>}
        {analysis && <button onClick={analyze} disabled={busy} className="btn btn-outline">{busy ? "Analyzing…" : "Regenerate explanation"}</button>}
      </div>}
    <div className="medical-note"><AlertCircle size={17}/> AI-generated explanations may be inaccurate. They are not a diagnosis or treatment recommendation. Discuss results with a qualified healthcare professional.</div>
  </div>;
}
