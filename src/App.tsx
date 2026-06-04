import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import LogoInputPage from "./pages/LogoInputPage/LogoInputPage";
import AnalysisReportPage from "./pages/AnalysisReportPage/AnalysisReportPage";
import SimilaritySearchPage from "./pages/SimilaritySearchPage/SimilaritySearchPage";
import DetailedComparisonPage from "./pages/DetailedComparisonPage/DetailedComparisonPage";
import ProcessPage from "./pages/ProcessPage/ProcessPage";

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
          to="/process"
          style={{
            color: "#7c2cf4",
            textDecoration: "none",
          }}
        >
          진행
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

        <Link
          to="/report"
          style={{
            color: "#7c2cf4",
            textDecoration: "none",
          }}
        >
          AI 리포트
        </Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<LogoInputPage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/similarity" element={<SimilaritySearchPage />} />
        <Route path="/detail" element={<DetailedComparisonPage />} />
        <Route path="/report" element={<AnalysisReportPage />} />
        {/* 2. 추가: /detail/상표명 형태로 들어와도 상세 페이지가 뜨도록 매핑 */}
        <Route path="/detail/:candidateName" element={<DetailedComparisonPage />} />
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