import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, Files, LayoutDashboard, LogOut, Plus, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  async function logout() { await signOut(); navigate("/"); }
  return <div className="app-shell">
    <aside className="sidebar">
      <NavLink to="/dashboard" className="brand"><span className="brand-mark"><Activity size={20}/></span><span>report<span className="brand-light">alyze</span></span></NavLink>
      <div className="side-label">WORKSPACE</div>
      <nav>
        <NavLink to="/dashboard"><LayoutDashboard size={18}/> Overview</NavLink>
        <NavLink to="/upload"><Plus size={18}/> New analysis</NavLink>
        <NavLink to="/history"><Files size={18}/> My reports</NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="privacy-note"><ShieldCheck size={17}/><span>Your reports are private and only visible to your account.</span></div>
        <div className="user-mini">
          <img src={user?.picture || "https://ui-avatars.com/api/?name=User"} alt="" />
          <div className="user-details"><b>{user?.name}</b><small>{user?.email}</small></div>
          <button className="icon-button" onClick={logout} title="Sign out"><LogOut size={17}/></button>
        </div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar"><span>Personal health workspace</span><span className="secure-label"><ShieldCheck size={15}/> Private workspace</span></header>
      <div className="page-content"><Outlet/></div>
    </main>
  </div>;
}
