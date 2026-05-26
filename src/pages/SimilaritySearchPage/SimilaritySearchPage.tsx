import "./SimilaritySearchPage.css";

type SimilarCandidate = {
  name: string;
  probability: number;
};

const similarCandidates: SimilarCandidate[] = [
  {
    name: "STARBUKS COFFEE",
    probability: 99,
  },
  {
    name: "STARBOOKS",
    probability: 90,
  },
  {
    name: "STAR",
    probability: 81,
  },
  {
    name: "BOOKS COFFEE",
    probability: 72,
  },
];

function SimilaritySearchPage() {
  return (
    <main className="similarity-page">
      <section className="similarity-content">
        <div className="similarity-left-area">
          <header className="similarity-title-block">
            <div className="title-line">
              <span className="sparkle-icon">✧</span>
              <h1>Similarity Search</h1>
            </div>
            <p>문자 및 이미지 유사도를 분석합니다</p>
          </header>

          <section className="my-trademark-section">
            <h2>내 상표</h2>

            <article className="my-trademark-card">
                <div className="floating-title">STARBOX COFFEE</div>
                
                <div className="my-image-box">
                  <div className="image-placeholder">
                    <span className="diagonal diagonal-one" />
                    <span className="diagonal diagonal-two" />
                  </div>
                </div>
            </article>

            <button className="detail-button" type="button">
              상세 비교화면
              <span>→</span>
            </button>
          </section>
        </div>

        <section className="similar-candidate-section">
          <h2>유사 후보</h2>

          <div className="similar-candidate-list">
            {similarCandidates.map((candidate) => (
              <article className="similar-candidate-row" key={candidate.name}>
                <div className="similar-candidate-image" />

                <div className="similar-candidate-text">
                  <h3>{candidate.name}</h3>
                  <p>유사 확률:</p>
                  <strong>{candidate.probability}%</strong>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

export default SimilaritySearchPage;