import "./SimilaritySearchPage.css";
import { Link, useNavigate, useLocation } from "react-router-dom"; 

type SimilarCandidate = {
  fileName: string;
  ocr_text: string;
  type: string;
  final_score: number;
  image_similarity: number;
  text_similarity: number;
  nice_codes: string[];
  matched_nice_codes: string[];
  vienna_codes: string[];
  matched_vienna_codes: string[];
};

function getRiskLabel(score: number) {
  if (score >= 75) return "높음";
  if (score >= 50) return "주의";
  return "보통";
}

function SimilaritySearchPage() {
  const navigate = useNavigate(); 
  const location = useLocation();

  const analysisResult = location.state?.analysisResult;
  const candidateList: SimilarCandidate[] = analysisResult?.similar_trademark || [];

  return (
    <main className="similarity-page">
      <nav className="similarity-nav">
        <div className="nav-dot" />
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>TrademarkAI</Link>
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
          {/* ── 내 상표 카드 영역 ── */}
          <section className="my-trademark-card" aria-label="내 상표 정보">
            <div className="section-heading">
              <p>My Trademark</p>
              <h2>내 상표</h2>
            </div>

            <div className="my-image-box">
              {analysisResult?.imageUrl ? (
                <img 
                  src={analysisResult.imageUrl} 
                  alt="My Trademark" 
                  style={{ width: "100%", height: "100%", objectFit: "contain" }} 
                />
              ) : (
                <div className="image-placeholder" aria-hidden="true">
                  <span className="diagonal diagonal-one" />
                  <span className="diagonal diagonal-two" />
                </div>
              )}
            </div>

            <div className="trademark-info">
              <h3>{analysisResult?.trademarkName || "STARBOX COFFEE"}</h3>
              <p>분석 대상 상표명</p>
            </div>

            <button 
              className="detail-button" 
              type="button" 
              onClick={() => navigate("/report", { state: { analysisResult } })}
            >
              분석 리포트 보기
              <span>→</span>
            </button>
          </section>

          {/* ── 유사 후보 리스트 영역 ── */}
          <section className="similar-candidate-section" aria-label="유사 후보 목록">
            <div className="section-heading candidate-heading">
              <div>
                <p>Similar Candidates</p>
                <h2>유사 후보</h2>
              </div>
              <span className="candidate-count">{candidateList.length}건</span>
            </div>

            <div className="similar-candidate-list">
              {candidateList.map((candidate, index) => {
                const finalScore = Math.round(candidate.final_score);
                
                return (
                  <article 
                    className="similar-candidate-row" 
                    key={candidate.fileName || index}
                    onClick={() => navigate("/detail", { state: { candidate, analysisResult } })}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="rank-badge">{index + 1}</div>

                    <div className="similar-candidate-image">
                      {candidate.fileName ? (
                        <img 
                          src={`http://localhost:8000/static/${candidate.fileName}`} 
                          alt={candidate.fileName}
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <div className="mini-placeholder" aria-hidden="true" />
                      )}
                    </div>

                    <div className="similar-candidate-text">
                      <div className="candidate-title-row">
                        <h3>{candidate.ocr_text || candidate.fileName.split('.')[0]}</h3>
                        <span className={`risk-chip risk-${getRiskLabel(finalScore)}`}>
                          {getRiskLabel(finalScore)}
                        </span>
                      </div>
                      
                      <p className="candidate-meta">
                        NICE 분류: {candidate.nice_codes?.join(", ") || "분류 정보 없음"}
                      </p>
                      
                      <p className="candidate-reason">
                        {candidate.matched_vienna_codes?.length > 0 
                          ? `도형 유사(비엔나코드 매칭: ${candidate.matched_vienna_codes.join(", ")}) ` 
                          : ""}
                        {candidate.matched_nice_codes?.length > 0 
                          ? `| 동일 상품군 분류 매칭` 
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
                <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
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