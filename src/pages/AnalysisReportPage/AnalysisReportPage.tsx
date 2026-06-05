import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AnalysisReportPage.css";

type SimilarCandidate = {
  id?: string;
  rank?: number;
  name?: string;
  candidateName?: string;

  fileName?: string;
  imageUrl?: string;

  ocr_text?: string;
  type?: string;

  final_score?: number;
  final_score_percent?: number;
  image_similarity?: number;
  image_similarity_percent?: number;
  text_similarity?: number;
  text_similarity_percent?: number;

  risk_label?: string;

  nice_codes?: string[];
  matched_nice_codes?: string[];
  vienna_codes?: string[];
  matched_vienna_codes?: string[];
};

type AnalysisResult = {
  trademarkName?: string;
  serviceDescription?: string;
  imageUrl?: string;
  similarityScore?: string;
  isAvailable?: boolean;
  resultMessage?: string;
  selectedCodes?: string[];
  similar_trademark?: SimilarCandidate[];

  final_report?: Record<string, unknown>;
  report?: Record<string, unknown>;
  similarity_assessment?: Record<string, unknown>;
  distinctiveness?: Record<string, unknown>;
};

function toPercent(score: number | null | undefined) {
  if (score == null) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
}

function getRiskLabel(score: number) {
  if (score >= 75) return "높음";
  if (score >= 50) return "중간";
  return "낮음";
}

function buildReason(candidate: SimilarCandidate) {
  const reasons = [];

  if (candidate.matched_nice_codes && candidate.matched_nice_codes.length > 0) {
    reasons.push("동일/유사 NICE 분류 존재");
  }

  if (
    candidate.matched_vienna_codes &&
    candidate.matched_vienna_codes.length > 0
  ) {
    reasons.push("유사한 비엔나 코드 발견");
  }

  const textScore =
    candidate.text_similarity_percent ?? toPercent(candidate.text_similarity);
  const imageScore =
    candidate.image_similarity_percent ?? toPercent(candidate.image_similarity);

  if (textScore >= 70) {
    reasons.push("문자 유사도 높음");
  }

  if (imageScore >= 70) {
    reasons.push("이미지 유사도 높음");
  }

  return reasons.length > 0 ? reasons.join(", ") : "유사도 기반 후보";
}

function AnalysisReportPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const rawState = location.state?.analysisResult;
  const analysisResult: AnalysisResult | undefined = rawState?.result ?? rawState;

  const candidates: SimilarCandidate[] = analysisResult?.similar_trademark ?? [];
  const topCandidates = candidates.slice(0, 3);

  const report = analysisResult?.final_report ?? analysisResult?.report ?? {};
  const similarityAssessment = analysisResult?.similarity_assessment ?? {};

  const trademarkName = analysisResult?.trademarkName ?? "분석 대상 상표";
  const imageUrl = analysisResult?.imageUrl;

  const resultMessage =
    analysisResult?.resultMessage ||
    report["분석 요약 리포트"] ||
    "입력 상표와 기존 상표의 문자, 도형, 상품류 정보를 기준으로 유사 가능성이 높은 후보를 정리했습니다.";

  const conclusion =
    report["최종 결론"] ||
    (analysisResult?.isAvailable === false
      ? "유사성 검토 필요"
      : "분석 완료");

  const overallScore =
    analysisResult?.similarityScore ||
    (similarityAssessment["overall_similarity_score"] != null
      ? `${similarityAssessment["overall_similarity_score"]}%`
      : "-");

  const riskFactors: string[] =
    report["주요 위험 요소"] ||
    similarityAssessment["risk_factors"] ||
    [];

  const summaryItems = [
    `최종 결론: ${conclusion}`,
    `종합 유사도: ${overallScore}`,
    ...(riskFactors.length > 0 ? riskFactors : ["유사 후보 기반 분석 완료"]),
  ];

  return (
    <main className="report-page">
      <nav className="report-nav">
        <div className="nav-dot" />
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
          TrademarkAI
        </Link>
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
              onClick={() =>
                navigate("/similarity", {
                  state: {
                    analysisResult,
                  },
                })
              }
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
              입력 상표명: <strong>{trademarkName}</strong>
            </h2>

            <p className="overview-desc">{resultMessage}</p>

            <ul className="summary-list">
              {summaryItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>

          <aside className="logo-card" aria-label="분석 대상 상표 이미지">
            <p className="logo-card-label">분석 대상 상표</p>

            <div className="logo-preview">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={trademarkName}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="logo-inner" />
              )}
            </div>

            <p className="logo-name">{trademarkName}</p>
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
            {topCandidates.length > 0 ? (
              topCandidates.map((candidate, index) => {
                const score =
                  candidate.final_score_percent ??
                  toPercent(candidate.final_score);

                const priority = candidate.risk_label ?? getRiskLabel(score);

                const candidateImageUrl =
                  candidate.imageUrl ||
                  (candidate.fileName
                    ? `http://localhost:8000/static/${candidate.fileName}`
                    : "");

                const candidateName =
                  candidate.name ||
                  candidate.candidateName ||
                  candidate.ocr_text ||
                  candidate.fileName?.split(".")[0] ||
                  "이름 없음";

                const enhancedCandidate = {
                  ...candidate,
                  imageUrl: candidateImageUrl,
                  name: candidateName,
                  candidateName,
                  final_score_percent: score,
                  risk_label: priority,
                };

                return (
                  <article
                    className="candidate-card"
                    key={candidate.id || candidate.fileName || index}
                  >
                    <div className="candidate-rank">
                      {candidate.rank ?? index + 1}
                    </div>

                    <div className="candidate-thumb">
                      {candidateImageUrl ? (
                        <img
                          src={candidateImageUrl}
                          alt={candidateName}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div />
                      )}
                    </div>

                    <div className="candidate-info">
                      <h3>{candidateName}</h3>
                      <p>
                        우선순위
                        <span
                          className={`priority-chip priority-${priority}`}
                        >
                          {priority}
                        </span>
                      </p>
                    </div>

                    <div className="candidate-score">
                      <span>종합 유사도</span>
                      <strong>{score}%</strong>
                    </div>

                    <div className="candidate-reason">
                      <span>주요 근거</span>
                      <p>{buildReason(candidate)}</p>
                    </div>

                    <button
                      className="candidate-more-button"
                      type="button"
                      aria-label={`${candidateName} 상세 비교 화면으로 이동`}
                      onClick={() =>
                        navigate("/detail", {
                          state: {
                            candidate: enhancedCandidate,
                            analysisResult,
                          },
                        })
                      }
                    >
                      →
                    </button>
                  </article>
                );
              })
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "#888",
                }}
              >
                조회된 유사 상표 후보가 없습니다.
              </div>
            )}
          </div>
        </section>

        <section className="summary-report">
          <h2>분석 요약</h2>

          <div className="summary-box">
            <p>{resultMessage}</p>

            {report["주의 문구"] && <p>{report["주의 문구"]}</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default AnalysisReportPage;