import "./SimilaritySearchPage.css";
import { Link, useNavigate, useLocation } from "react-router-dom";

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

function toPercent(score: number | null | undefined) {
  if (score == null) return 0;
  return score <= 1 ? Math.round(score * 100) : Math.round(score);
}

function getRiskLabel(score: number) {
  if (score >= 75) return "높음";
  if (score >= 50) return "주의";
  return "보통";
}

function SimilaritySearchPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 백엔드 응답 전체가 넘어온 경우와 result만 넘어온 경우 둘 다 대응
  const rawState = location.state?.analysisResult;
  const analysisResult = rawState?.result ?? rawState;

  const candidateList: SimilarCandidate[] =
    analysisResult?.similar_trademark ?? [];

  const trademarkName = analysisResult?.trademarkName || "분석 대상 상표";
  const myImageUrl = analysisResult?.imageUrl;

  return (
    <main className="similarity-page">
      <nav className="similarity-nav">
        <div className="nav-dot" />
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>
          TrademarkAI
        </Link>
        <div className="nav-divider" />
        <span className="nav-page">유사 상표 검색 결과</span>
      </nav>

      <section className="similarity-content">
        <header className="similarity-hero">
          <div>
            <p className="hero-eyebrow">AI Similarity Search</p>
            <h1>유사 상표 후보를 찾았습니다</h1>
            <p className="hero-desc">
              입력한 상표와 기존 상표의 문자, 이미지, 상품류 정보를 비교해
              유사 가능성이 높은 후보를 정리했습니다.
            </p>
          </div>
        </header>

        <div className="similarity-layout">
          <section className="my-trademark-card" aria-label="내 상표 정보">
            <div className="section-heading">
              <p>My Trademark</p>
              <h2>내 상표</h2>
            </div>

            <div className="my-image-box">
              {myImageUrl ? (
                <img
                  src={myImageUrl}
                  alt="My Trademark"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <div className="image-placeholder" aria-hidden="true">
                  <span className="diagonal diagonal-one" />
                  <span className="diagonal diagonal-two" />
                </div>
              )}
            </div>

            <div className="trademark-info">
              <h3>{trademarkName}</h3>
              <p>분석 대상 상표명</p>
            </div>

            <button
              className="detail-button"
              type="button"
              onClick={() =>
                navigate("/report", {
                  state: {
                    analysisResult,
                  },
                })
              }
            >
              분석 리포트 보기
              <span>→</span>
            </button>
          </section>

          <section
            className="similar-candidate-section"
            aria-label="유사 후보 목록"
          >
            <div className="section-heading candidate-heading">
              <div>
                <p>Similar Candidates</p>
                <h2>유사 후보</h2>
              </div>
              <span className="candidate-count">{candidateList.length}건</span>
            </div>

            <div className="similar-candidate-list">
              {candidateList.map((candidate, index) => {
                const finalScore =
                  candidate.final_score_percent ??
                  toPercent(candidate.final_score);

                const riskLabel =
                  candidate.risk_label ?? getRiskLabel(finalScore);

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
                  final_score_percent: finalScore,
                  risk_label: riskLabel,
                };

                return (
                  <article
                    className="similar-candidate-row"
                    key={candidate.id || candidate.fileName || index}
                    onClick={() =>
                      navigate("/detail", {
                        state: {
                          candidate: enhancedCandidate,
                          analysisResult,
                        },
                      })
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="rank-badge">
                      {candidate.rank ?? index + 1}
                    </div>

                    <div className="similar-candidate-image">
                      {candidateImageUrl ? (
                        <img
                          src={candidateImageUrl}
                          alt={candidateName}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="mini-placeholder" aria-hidden="true" />
                      )}
                    </div>

                    <div className="similar-candidate-text">
                      <div className="candidate-title-row">
                        <h3>{candidateName}</h3>
                        <span className={`risk-chip risk-${riskLabel}`}>
                          {riskLabel}
                        </span>
                      </div>

                      <p className="candidate-meta">
                        NICE 분류:{" "}
                        {candidate.nice_codes?.join(", ") || "분류 정보 없음"}
                      </p>

                      <p className="candidate-reason">
                        {candidate.matched_vienna_codes &&
                        candidate.matched_vienna_codes.length > 0
                          ? `도형 유사(비엔나코드 매칭: ${candidate.matched_vienna_codes.join(
                              ", "
                            )}) `
                          : ""}
                        {candidate.matched_nice_codes &&
                        candidate.matched_nice_codes.length > 0
                          ? "| 동일 상품군 분류 매칭"
                          : ""}
                        {(!candidate.matched_vienna_codes ||
                          candidate.matched_vienna_codes.length === 0) &&
                        (!candidate.matched_nice_codes ||
                          candidate.matched_nice_codes.length === 0)
                          ? "유사도 기반 후보"
                          : ""}
                      </p>
                    </div>

                    <div className="candidate-score">
                      <span>유사도</span>
                      <strong>{finalScore}%</strong>
                    </div>
                  </article>
                );
              })}

              {candidateList.length === 0 && (
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
        </div>
      </section>
    </main>
  );
}

export default SimilaritySearchPage;