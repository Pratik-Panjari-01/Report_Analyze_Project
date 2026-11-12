import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, Plus, Sparkles, UploadCloud } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  useEffect(() => { api.get("/api/reports").then(r => setReports(r.data.reports)).catch(() => {}); }, []);
  return <div>
    <div className="welcome-row"><div><div className="section-kicker">YOUR WORKSPACE</div><h1>Good to see you, {user?.name?.split(" ")[0]}.</h1><p>Keep your health documents organized and easier to understand.</p></div><Link to="/upload" className="btn btn-primary"><Plus size={17}/> New analysis</Link></div>
    <div className="dashboard-banner"><div className="banner-icon"><Sparkles size={22}/></div><div><b>Understand your report, one step at a time.</b><p>Upload a lab report to extract its text and receive an educational explanation.</p></div><Link to="/upload" className="banner-link">Upload report <ArrowRight size={16}/></Link></div>
    <div className="stats-grid"><div className="stat-card"><span>Total reports</span><b>{reports.length}</b><small>Saved in your workspace</small></div><div className="stat-card"><span>Supported formats</span><b>03</b><small>PDF, JPG and PNG</small></div><div className="stat-card"><span>Privacy</span><b className="stat-private">Private</b><small>Only your account can access them</small></div></div>
    <div className="section-heading"><div><h2>Recent reports</h2><p>Your latest uploaded documents</p></div><Link to="/history" className="text-link">View all <ArrowRight size={15}/></Link></div>
    {reports.length ? <div className="report-list">{reports.slice(0,4).map(r => <Link to={`/analysis/${r._id}`} className="report-row" key={r._id}><span className="file-icon"><FileText/></span><span className="report-info"><b>{r.originalName}</b><small>{new Date(r.createdAt).toLocaleDateString()}</small></span><span className="status">{r.status}</span><ArrowRight size={17}/></Link>)}</div> :
      <div className="empty-state"><div className="empty-icon"><UploadCloud size={27}/></div><h3>Your report library is ready</h3><p>Upload your first medical report to get started.</p><Link to="/upload" className="btn btn-primary">Upload a report <ArrowRight size={16}/></Link></div>}
  </div>;
}
