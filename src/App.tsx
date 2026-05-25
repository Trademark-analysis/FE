import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import AnalysisReportPage from "./pages/AnalysisReportPage/AnalysisReportPage";
import SimilaritySearchPage from "./pages/SimilaritySearchPage/SimilaritySearchPage";

function App() {
  return (
    <BrowserRouter>
      <nav
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1000,
          display: "flex",
          gap: 12,
          padding: "10px 14px",
          borderRadius: 12,
          background: "rgba(255, 255, 255, 0.9)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        <Link
          to="/report"
          style={{
            color: "#7c2cf4",
            textDecoration: "none",
          }}
        >
          AI 리포트
        </Link>

        <Link
          to="/similarity"
          style={{
            color: "#7c2cf4",
            textDecoration: "none",
          }}
        >
          유사 후보
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/report" replace />} />
        <Route path="/report" element={<AnalysisReportPage />} />
        <Route path="/similarity" element={<SimilaritySearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;