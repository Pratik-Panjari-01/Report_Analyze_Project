import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, FolderOpen } from "lucide-react";
import api from "../services/api";

export default function History() {
  const [reports, setReports] = useState([]);
  useEffect(() => { api.get("/api/reports").then(r => setReports(r.data.reports)).catch(() => {}); }, []);
  return <div><div className="section-kicker">YOUR LIBRARY</div><h1>My reports</h1><p className="page-lead">All the reports you have uploaded to your account.</p>
    {reports.length ? <div className="report-list">{reports.map(r => <Link to={`/analysis/${r._id}`} className="report-row" key={r._id}><span className="file-icon"><FileText/></span><span className="report-info"><b>{r.originalName}</b><small>{new Date(r.createdAt).toLocaleString()} · {(r.size/1024/1024).toFixed(2)} MB</small></span><span className="status">{r.status}</span><ArrowRight size={17}/></Link>)}</div> :
      <div className="empty-state"><div className="empty-icon"><FolderOpen size={27}/></div><h3>No reports yet</h3><p>Your uploaded reports will appear here.</p><Link to="/upload" className="btn btn-primary">Upload first report</Link></div>}
  </div>;
}
