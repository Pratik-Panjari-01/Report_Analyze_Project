import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Image, UploadCloud, X, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/api";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  function choose(f) {
    if (!f) return;
    if (!["application/pdf","image/jpeg","image/png"].includes(f.type)) return toast.error("Please select a PDF, JPG or PNG file");
    if (f.size > 10 * 1024 * 1024) return toast.error("File must be smaller than 10 MB");
    setFile(f);
  }
  async function submit(e) {
    e.preventDefault();
    if (!file) return toast.error("Choose a report first");
    const body = new FormData(); body.append("report", file);
    setBusy(true);
    try {
      const { data } = await api.post("/api/reports", body);
      toast.success("Report uploaded");
      navigate(`/analysis/${data.report.id}`);
    } catch (err) { toast.error(err.response?.data?.message || "Upload failed"); }
    finally { setBusy(false); }
  }
  return <div className="narrow-page">
    <div className="section-kicker">NEW ANALYSIS</div><h1>Upload a medical report</h1><p className="page-lead">Add a report to extract its text and generate an educational explanation.</p>
    <form onSubmit={submit} className="upload-panel">
      <div className={`dropzone ${file ? "has-file" : ""}`} onClick={() => inputRef.current?.click()} onDragOver={e => e.preventDefault()} onDrop={e => {e.preventDefault(); choose(e.dataTransfer.files[0]);}}>
        <input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" hidden onChange={e => choose(e.target.files[0])}/>
        {file ? <><div className="upload-icon"><FileText size={28}/></div><b>{file.name}</b><small>{(file.size/1024/1024).toFixed(2)} MB · Ready to upload</small></> :
          <><div className="upload-icon"><UploadCloud size={29}/></div><b>Drag and drop your report here</b><small>or click to browse your device</small><span className="btn btn-outline btn-small">Choose file</span></>}
      </div>
      {file && <button type="button" className="remove-file" onClick={() => setFile(null)}><X size={15}/> Remove file</button>}
      <div className="format-row"><span><FileText size={16}/> PDF</span><span><Image size={16}/> JPG / PNG</span><span>Maximum 10 MB</span></div>
      <div className="upload-disclaimer"><ShieldCheck size={18}/><p>Reports contain sensitive information. Upload only documents you are authorized to share. This prototype stores files on the backend server.</p></div>
      <button className="btn btn-primary btn-full" disabled={!file || busy}>{busy ? "Uploading…" : "Upload and continue"}</button>
    </form>
    <p className="medical-note">This service provides educational explanations only and cannot diagnose conditions or replace a clinician.</p>
  </div>;
}
