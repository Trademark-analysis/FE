import "./DetailedComparisonPage.css";
import { useLocation, useNavigate } from "react-router-dom";

type SimilarCandidate = {
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
  imageUrl?: string;
  selectedCodes?: string[];
  serviceDescription?: string;
};

type MetricBarProps = {
  label: string;
  value: number;
};

type CodeChipProps = {
  children: React.ReactNode;
  matched?: boolean;
};

function normalizeScore(percent?: number, raw?: number) {
  if (percent != null) return Math.round(percent);
  if (raw == null) return 0;
  if (raw <= 1) return Math.round(raw * 100);
  return Math.round(raw);
}

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
  const location = useLocation();

  const candidate = location.state?.candidate as SimilarCandidate | undefined;

  const rawAnalysisResult = location.state?.analysisResult;
  const analysisResult = (rawAnalysisResult?.result ?? rawAnalysisResult) as
    | AnalysisResult
    | undefined;

  if (!candidate) {
    return (
      <div className="page-shell">
        <main className="report">
          <section className="report__header">
            <button
              className="back-button"
              onClick={() =>
                navigate("/similarity", {
                  state: {
                    analysisResult,
                  },
                })
              }
            >
              ← 목록으로 돌아가기
            </button>
            <h1>상세 비교 분석 리포트</h1>
            <p>선택된 후보 데이터가 없습니다.</p>
          </section>
        </main>
      </div>
    );
  }

  const inputName = analysisResult?.trademarkName ?? "내 상표";

  const candidateName =
    candidate.name ||
    candidate.candidateName ||
    candidate.ocr_text ||
    candidate.fileName?.split(".")[0] ||
    "유사 후보";

  const inputImageUrl = analysisResult?.imageUrl;

  const candidateImageUrl =
    candidate.imageUrl ||
    (candidate.fileName
      ? `http://localhost:8000/static/${candidate.fileName}`
      : "");

  const totalScore = normalizeScore(
    candidate.final_score_percent,
    candidate.final_score
  );

  const imageScore = normalizeScore(
    candidate.image_similarity_percent,
    candidate.image_similarity
  );

  const textScore = normalizeScore(
    candidate.text_similarity_percent,
    candidate.text_similarity
  );

  const riskText =
    candidate.risk_label === "높음" || totalScore >= 75
      ? "고위험 유사성"
      : candidate.risk_label === "주의" || totalScore >= 50
      ? "주의 유사성"
      : "보통 유사성";

  const matchedNiceCodes = candidate.matched_nice_codes ?? [];
  const niceCodes = candidate.nice_codes ?? [];
  const viennaCodes = candidate.vienna_codes ?? [];
  const matchedViennaCodes = candidate.matched_vienna_codes ?? [];

  return (
    <div className="page-shell">
      <main className="report">
        <section className="report__header">
          <button
            className="back-button"
            onClick={() =>
              navigate("/similarity", {
                state: {
                  analysisResult,
                },
              })
            }
          >
            ← 목록으로 돌아가기
          </button>
          <h1>상세 비교 분석 리포트</h1>
          <p>
            Case #{candidate.rank ?? "-"}: {candidateName}
          </p>
        </section>

        <section className="top-grid">
          <article className="card trademark-card">
            <div className="trademark-card__item">
              <span className="trademark-card__label">내 상표</span>

              <div className="trademark-card__image">
                {inputImageUrl && (
                  <img
                    src={inputImageUrl}
                    alt={inputName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              <strong>{inputName}</strong>
            </div>

            <div className="trademark-card__divider" />

            <div className="trademark-card__item">
              <span className="trademark-card__label">유사 후보</span>

              <div className="trademark-card__image">
                {candidateImageUrl && (
                  <img
                    src={candidateImageUrl}
                    alt={candidateName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                )}
              </div>

              <strong>{candidateName}</strong>
            </div>
          </article>

          <article className="card similarity-card">
            <div className="card-header">
              <h2>
                <span className="purple-icon">⊙</span>
                이미지 및 형태 유사도
              </h2>
              <span className="danger-text">{riskText}</span>
            </div>

            <div className="similarity-card__body">
              <div className="score-area">
                <div className="score-ring">{totalScore}%</div>
                <p>종합 유사도</p>
              </div>

              <div className="metric-area">
                <MetricBar label="이미지 유사도" value={imageScore} />
                <MetricBar label="문자 유사도" value={textScore} />
              </div>
            </div>

            <p className="description">
              이 후보는 종합 유사도 {totalScore}%로 계산되었습니다.
              <br />
              이미지 유사도는 {imageScore}%, 문자 유사도는 {textScore}%입니다.
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
                <strong>{niceCodes.join(", ") || "-"}</strong>
                <span>
                  매칭 코드:{" "}
                  {matchedNiceCodes.length > 0
                    ? matchedNiceCodes.join(", ")
                    : "없음"}
                </span>
              </div>
              <span className="check-icon">✓</span>
            </div>

            <p>
              입력 상표와 후보 상표의 NICE 분류 매칭 여부를 기준으로
              <br />
              상품/서비스 범위 유사성을 확인합니다.
            </p>
          </article>

          <article className="card info-card">
            <h2>
              <span className="purple-icon">♙</span>
              Vienna Code
            </h2>

            <div className="chip-group">
              <div>
                {viennaCodes.length > 0 ? (
                  viennaCodes.map((code) => (
                    <CodeChip
                      key={code}
                      matched={matchedViennaCodes.includes(code)}
                    >
                      {code}
                      {matchedViennaCodes.includes(code) ? " (Match)" : ""}
                    </CodeChip>
                  ))
                ) : (
                  <CodeChip>비엔나 코드 없음</CodeChip>
                )}
              </div>
            </div>

            <p>
              비엔나 코드 기준으로 도형 요소의 중복 여부를 확인합니다.
              <br />
              매칭 코드:{" "}
              {matchedViennaCodes.length > 0
                ? matchedViennaCodes.join(", ")
                : "없음"}
            </p>
          </article>

          <article className="card info-card status-card">
            <h2>출원 현황 비교</h2>

            <div className="timeline">
              <div className="timeline__line" />

              <div className="timeline__item">
                <span className="timeline__dot" />
                <div>
                  <p>{candidateName}</p>
                  <strong>유사 후보</strong>
                </div>
              </div>

              <div className="timeline__item">
                <span className="timeline__dot" />
                <div>
                  <p>My Trademark ({inputName})</p>
                  <strong>출원 준비 중</strong>
                </div>
              </div>
            </div>

            <p className="legal-note">
              ※ 본 결과는 자동화된 사전 검토용 참고 정보입니다.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}