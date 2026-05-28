import "./DetailedComparisonPage.css";
import { useNavigate } from "react-router-dom";

type MetricBarProps = {
  label: string;
  value: number;
};

type CodeChipProps = {
  children: React.ReactNode;
  matched?: boolean;
};

function MetricBar({ label, value }: MetricBarProps) {
  return (
    <div className="metric">
      <div className="metric__top">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="metric__track">
        <div className="metric__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function CodeChip({ children, matched = false }: CodeChipProps) {
  return (
    <span className={matched ? "code-chip code-chip--matched" : "code-chip"}>
      {children}
    </span>
  );
}

export default function DetailedComparisonPage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell">
      <main className="report">
        <section className="report__header">
          <button
            className="back-button"
            onClick={() => navigate("/similarity")}
          >
            ← 목록으로 돌아가기
          </button>
          <h1>상세 비교 분석 리포트</h1>
          <p>Case #1: STARBUKS COFFEE</p>
        </section>

        <section className="top-grid">
          <article className="card trademark-card">
            <div className="trademark-card__item">
              <span className="trademark-card__label">내 상표</span>
              <div className="trademark-card__image" />
              <strong>STARBOX COFFEE</strong>
            </div>

            <div className="trademark-card__divider" />

            <div className="trademark-card__item">
              <span className="trademark-card__label">유사 후보</span>
              <div className="trademark-card__image" />
              <strong>STARBUKS COFFEE</strong>
            </div>
          </article>

          <article className="card similarity-card">
            <div className="card-header">
              <h2>
                <span className="purple-icon">⊙</span>
                이미지 및 형태 유사도
              </h2>
              <span className="danger-text">고위험 유사성</span>
            </div>

            <div className="similarity-card__body">
              <div className="score-area">
                <div className="score-ring">99%</div>
                <p>종합 유사도</p>
              </div>

              <div className="metric-area">
                <MetricBar label="이미지 유사도" value={98.4} />
                <MetricBar label="문자 유사도" value={92.1} />
              </div>
            </div>

            <p className="description">
              이미지 분석에서는 별 모양 로고 구조와 배치 방식이 유사하게 나타났으며,
              <br />
              문자 분석에서는 단어 구조와 브랜드명이 높은 유사도를 보였습니다.
            </p>
          </article>
        </section>

        <section className="bottom-grid">
          <article className="card info-card">
            <h2>
              <span className="purple-icon">♙</span>
              NICE Code
            </h2>

            <div className="nice-box">
              <div>
                <strong>Class 30</strong>
                <span>Coffee, Tea, Pastries</span>
              </div>
              <span className="check-icon">✓</span>
            </div>

            <p>
              두 상표 모두 제30류(커피, 차 등)로 분류되어,
              <br />
              상품 범위가 완벽하게 일치합니다.
            </p>
          </article>

          <article className="card info-card">
            <h2>
              <span className="purple-icon">♙</span>
              Vienna Code
            </h2>

            <div className="chip-group">
              <div>
                <CodeChip matched>01.01 (Match)</CodeChip>
                <CodeChip matched>27.05 (Match)</CodeChip>
              </div>
              <CodeChip>26.04</CodeChip>
            </div>

            <p>
              주요 비엔나 코드인 01.01(별), 27.05(특수 문자·장식화된 문자)에서
              중복이 발생하였습니다.
            </p>
          </article>

          <article className="card info-card status-card">
            <h2>출원 현황 비교</h2>

            <div className="timeline">
              <div className="timeline__line" />

              <div className="timeline__item">
                <span className="timeline__dot" />
                <div>
                  <p>STARBUKS</p>
                  <strong>1971.03.30 등록 완료</strong>
                </div>
              </div>

              <div className="timeline__item">
                <span className="timeline__dot" />
                <div>
                  <p>My Trademark (STARBOX)</p>
                  <strong>출원 준비 중</strong>
                </div>
              </div>
            </div>

            <p className="legal-note">
              ※ 선출원주의에 따라 법적 우선권을 가집니다.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}