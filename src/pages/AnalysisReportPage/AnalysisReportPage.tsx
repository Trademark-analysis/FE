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
  "최종 결론 유사성이 높음",
  "주요 위험 요소",
  "문자 유사도 높음",
  "동일 니스분류 존재",
  "유사한 도형 구도 발견",
];

function AnalysisReportPage() {
  const navigate = useNavigate();
  return (
    <main className="report-page">
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
          <span>AI 분석 리포트</span>
        </div>

        <button className="download-button" type="button">
          <span>⇩</span>
          Download
        </button>
      </header>

      <section className="hero-section">
        <div className="hero-text">
          <span className="status-badge">분석 완료</span>

          <h1>
            입력 상표명: <strong>STARBOX COFFEE</strong>
          </h1>

          <ul className="summary-list">
            {summaryItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="logo-preview">
          <div className="logo-inner" />
        </div>
      </section>

      <section className="candidate-section">
        <h2>
          <span>↗</span>
          유사 후보 Top 3 요약
        </h2>

        <div className="candidate-list">
          {candidates.map((candidate) => (
            <article className="candidate-card" key={candidate.name}>
              <div className="candidate-left">
                <div className="candidate-thumb">
                  <div />
                </div>

                <div className="candidate-info">
                  <h3>{candidate.name}</h3>
                  <p>
                    종합유사도:{" "}
                    <strong className="score">{candidate.score}%</strong>
                    <span>
                      우선순위: <b>{candidate.priority}</b>
                    </span>
                  </p>
                </div>
              </div>

              <div className="candidate-right">
                <p>
                  주요 근거:
                  <br />
                  {candidate.reason}
                </p>
                <button
                  type="button"
                  aria-label={`${candidate.name} 상세 비교 화면으로 이동`}
                  onClick={() =>
                    navigate(`/similarity/${encodeURIComponent(candidate.name)}`)
                  }
                >
                  →
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-report">
        <h2>분석 요약 리포트</h2>

        <div className="summary-box">
          <p>
            &gt;&gt; 본 분석 결과, 입력 상표는 일부 기존 상표와 문자 및 도형
            요소에서 유사성이 확인되었다.
          </p>
          <p>
            특히 동일하거나 유사한 니스류에 속한 등록 상표가 존재하므로
            변리사의 추가 검토가 필요하다.
          </p>
        </div>
      </section>
    </main>
  );
}

export default AnalysisReportPage;