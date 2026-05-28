import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import LogoInputPage from "./pages/LogoInputPage/LogoInputPage";
import AnalysisReportPage from "./pages/AnalysisReportPage/AnalysisReportPage";
import SimilaritySearchPage from "./pages/SimilaritySearchPage/SimilaritySearchPage";
import DetailedComparisonPage from "./pages/DetailedComparisonPage/DetailedComparisonPage";

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== "/";

  return (
    <>
      {showNav && (
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

        <Link
            to="/detail"
            style={{
              color: "#7c2cf4",
              textDecoration: "none",
            }}
          >
            상세 비교
          </Link>

        </nav>
      )}

      <Routes>
        <Route path="/" element={<LogoInputPage />} />
        <Route path="/report" element={<AnalysisReportPage />} />
        <Route path="/similarity" element={<SimilaritySearchPage />} />
        <Route path="/detail" element={<DetailedComparisonPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;