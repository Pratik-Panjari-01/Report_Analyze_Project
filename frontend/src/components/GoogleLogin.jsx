import React from "react";
import { GoogleLogin as GoogleButton } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function GoogleLogin() {
  const { refreshUser } = useAuth();
  async function onSuccess(response) {
    try {
      await api.post("/api/auth/google", { credential: response.credential });
      await refreshUser();
      toast.success("Signed in successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Google sign-in failed");
    }
  }
  return <div className="google-wrap">
    <GoogleButton onSuccess={onSuccess} onError={() => toast.error("Google sign-in was cancelled")}
      theme="outline" size="large" shape="pill" text="continue_with" width="280" />
  </div>;
}
