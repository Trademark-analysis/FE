import "./SimilaritySearchPage.css";
import { Link, useNavigate } from "react-router-dom"; 

type SimilarCandidate = {
  name: string;
  probability: number;
  niceClass: string;
  reason: string;
};

const similarCandidates: SimilarCandidate[] = [
  {
    name: "STARBUKS COFFEE",
    probability: 99,
    niceClass: "제30류 · 커피/음료",
    reason: "",
  },
  {
    name: "STARBOOKS",
    probability: 90,
    niceClass: "제35류 · 온라인 판매",
    reason: "",
  },
  {
    name: "STAR",
    probability: 81,
    niceClass: "제42류 · IT 서비스",
    reason: "",
  },
  {
    name: "BOOKS COFFEE",
    probability: 72,
    niceClass: "제30류 · 식음료",
    reason: "",
  },
];

function getRiskLabel(probability: number) {
  if (probability >= 90) return "높음";
  if (probability >= 80) return "주의";
  return "보통";
}

function SimilaritySearchPage() {
  const navigate = useNavigate(); 

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
          <section className="my-trademark-card" aria-label="내 상표 정보">
            <div className="section-heading">
              <p>My Trademark</p>
              <h2>내 상표</h2>
            </div>

            <div className="my-image-box">
              <div className="image-placeholder" aria-hidden="true">
                <span className="diagonal diagonal-one" />
                <span className="diagonal diagonal-two" />
              </div>
            </div>

            <div className="trademark-info">
              <h3>STARBOX COFFEE</h3>
              <p>분석 대상 상표명</p>
            </div>

            {/* 3. 분석 리포트 보기 버튼의 경로를 /report 로 수정 */}
            <button 
              className="detail-button" 
              type="button" 
              onClick={() => navigate("/report")}
            >
              분석 리포트 보기
              <span>→</span>
            </button>
          </section>

          <section className="similar-candidate-section" aria-label="유사 후보 목록">
            <div className="section-heading candidate-heading">
              <div>
                <p>Similar Candidates</p>
                <h2>유사 후보</h2>
              </div>
              <span className="candidate-count">{similarCandidates.length}건</span>
            </div>

            <div className="similar-candidate-list">
              {similarCandidates.map((candidate, index) => (
                /* 4. 유사 후보 행을 클릭하면 상세 페이지(/detail)로 이동하며 선택된 데이터를 넘겨줍니다. */
                <article 
                  className="similar-candidate-row" 
                  key={candidate.name}
                  onClick={() => navigate("/detail", { state: { candidate } })}
                  style={{ cursor: "pointer" }} // 클릭 가능한 요소임을 보여주는 스타일 추가
                >
                  <div className="rank-badge">{index + 1}</div>

                  <div className="similar-candidate-image">
                    <div className="mini-placeholder" aria-hidden="true" />
                  </div>

                  <div className="similar-candidate-text">
                    <div className="candidate-title-row">
                      <h3>{candidate.name}</h3>
                      <span className={`risk-chip risk-${getRiskLabel(candidate.probability)}`}>
                        {getRiskLabel(candidate.probability)}
                      </span>
                    </div>
                    <p className="candidate-meta">{candidate.niceClass}</p>
                    <p className="candidate-reason">{candidate.reason}</p>
                  </div>

                  <div className="candidate-score">
                    <span>유사도</span>
                    <strong>{candidate.probability}%</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default SimilaritySearchPage;