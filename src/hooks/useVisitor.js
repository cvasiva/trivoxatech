import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../utils/api";

// Generate or reuse a session ID stored in sessionStorage
function getSessionId() {
  let id = sessionStorage.getItem("trivoxa_session");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("trivoxa_session", id);
  }
  return id;
}

export default function useVisitor() {
  const { pathname } = useLocation();

  useEffect(() => {
    const sessionId = getSessionId();
    api.trackVisit(pathname, sessionId).catch(() => {});
  }, [pathname]);
}
