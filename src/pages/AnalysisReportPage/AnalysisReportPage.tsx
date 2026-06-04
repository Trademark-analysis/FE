import { useNavigate } from "react-router-dom";
import "./AnalysisReportPage.css";

type Candidate = {
  name: string;
  score: number;
  priority: "높음" | "중간";
  reason: string;
};

const candidates: Candidate[] = [
  {
    name: "STARBUCKS",
    score: 81,
    priority: "높음",
    reason: "문자 및 도형 유사도 높음",
  },
  {
    name: "STARBOX",
    score: 77,
    priority: "높음",
    reason: "문자 유사",
  },
  {
    name: "STAR CAFE",
    score: 62,
    priority: "중간",
    reason: "일부 문자 유사",
  },
];

const summaryItems = [
  "최종 결론: 유사성이 높음",
  "문자 유사도 높음",
  "동일 니스분류 존재",
  "유사한 도형 구도 발견",
];

function AnalysisReportPage() {
  const navigate = useNavigate();

  return (
    <main className="report-page">
      <nav className="report-nav">
        <div className="nav-dot" />
        <span className="nav-brand">TrademarkAI</span>
        <div className="nav-divider" />
        <span className="nav-page">AI 분석 리포트</span>
      </nav>

      <section className="report-content">
        <header className="report-header">
          <div className="header-left">
            <button
              className="back-button"
              type="button"
              aria-label="비교 화면으로 이동"
              onClick={() => navigate("/similarity")}
            >
              ←
            </button>

            <div className="header-title">
              <p>Analysis Report</p>
              <h1>상표 유사도 분석 결과</h1>
            </div>
          </div>

        </header>

        <section className="report-overview">
          <article className="overview-card">
            <span className="status-badge">분석 완료</span>
            <h2>
              입력 상표명: <strong>STARBOX COFFEE</strong>
            </h2>
            <p className="overview-desc">
              입력 상표와 기존 상표의 문자, 도형, 상품류 정보를 기준으로
              유사 가능성이 높은 후보를 정리했습니다.
            </p>

            <ul className="summary-list">
              {summaryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <aside className="logo-card" aria-label="분석 대상 상표 이미지">
            <p className="logo-card-label">분석 대상 상표</p>
            <div className="logo-preview">
              <div className="logo-inner" />
            </div>
            <p className="logo-name">STARBOX COFFEE</p>
          </aside>
        </section>

        <section className="candidate-section">
          <div className="section-heading">
            <div>
              
              <h2>유사 후보 Top 3 요약</h2>
            </div>
            <span className="candidate-count">총 {candidates.length}건</span>
          </div>

          <div className="candidate-list">
            {candidates.map((candidate, index) => (
              <article className="candidate-card" key={candidate.name}>
                <div className="candidate-rank">{index + 1}</div>

                <div className="candidate-thumb">
                  <div />
                </div>

                <div className="candidate-info">
                  <h3>{candidate.name}</h3>
                  <p>
                    우선순위
                    <span className={`priority-chip priority-${candidate.priority}`}>
                      {candidate.priority}
                    </span>
                  </p>
                </div>

                <div className="candidate-score">
                  <span>종합 유사도</span>
                  <strong>{candidate.score}%</strong>
                </div>

                <div className="candidate-reason">
                  <span>주요 근거</span>
                  <p>{candidate.reason}</p>
                </div>

                {/* 이 버튼을 클릭하면 /detail 페이지로 이동하며 선택한 상표 데이터를 보냅니다 */}
                <button
                  className="candidate-more-button"
                  type="button"
                  aria-label={`${candidate.name} 상세 비교 화면으로 이동`}
                  onClick={() =>
                    navigate("/detail", { state: { candidate } })
                  }
                >
                  →
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="summary-report">
          <h2>분석 요약</h2>

          <div className="summary-box">
            <p>
              본 분석 결과, 입력 상표는 일부 기존 상표와 문자 및 도형 요소에서
              유사성이 확인되었습니다.
            </p>
            <p>
              특히 동일하거나 유사한 니스류에 속한 등록 상표가 존재하므로
              변리사의 추가 검토가 필요합니다.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

export default AnalysisReportPage;