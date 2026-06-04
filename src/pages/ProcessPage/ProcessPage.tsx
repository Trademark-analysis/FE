import { useEffect, useState } from "react";
import "./ProcessPage.css";

const STEPS = [
  {
    prog: 20,
    progLabel: "이미지 처리 중",
    hint: "이미지를 업로드하고 있습니다...",
    label: "이미지 업로드",
  },
  {
    prog: 50,
    progLabel: "특징 벡터 추출 중",
    hint: "상표의 시각적 특징을 추출하고 있습니다...",
    label: "특징 추출",
  },
  {
    prog: 80,
    progLabel: "등록 상표 DB 검색 중",
    hint: "등록 상표 DB를 검색하고 있습니다...",
    label: "DB 검색",
  },
  {
    prog: 100,
    progLabel: "유사도 점수 계산 중",
    hint: "결과를 분석하고 있습니다...",
    label: "결과 분석",
  },
];

const DELAYS = [400, 1600, 3000, 4600];
const DONE_AT = 6000;

type StepState = "waiting" | "active" | "done";

export default function TrademarkAnalysis() {
  const [stepStates, setStepStates] = useState<StepState[]>([
    "waiting",
    "waiting",
    "waiting",
    "waiting",
  ]);

  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("분석 준비 중");
  const [hint, setHint] = useState("분석을 시작합니다...");
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    DELAYS.forEach((delay, i) => {
      setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];

          if (i > 0) next[i - 1] = "done";
          next[i] = "active";

          return next;
        });

        setProgress(STEPS[i].prog);
        setProgressLabel(STEPS[i].progLabel);
        setHint(STEPS[i].hint);
      }, delay);
    });

    setTimeout(() => {
      setStepStates(["done", "done", "done", "done"]);
      setProgress(100);
      setProgressLabel("분석 완료");
      setCompleted(true);
    }, DONE_AT);
  }, []);

  return (
    <div className="container">
      <main className="content">
        {/* 이미지 박스 */}
        <div className="imageBox">
          <svg
            width="36"
            height="36"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#B4B2A9"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 15l-5-5L5 21"
            />
          </svg>

          <span>업로드한 상표</span>
        </div>

        {/* 타이틀 */}
        <div className="title">
          <span>
            {completed ? "분석이 완료되었습니다" : "상표 유사도 분석 중"}
          </span>

          {!completed && (
            <span className="dotsAnim">
              <span></span>
              <span></span>
              <span></span>
            </span>
          )}
        </div>

        {/* 프로그레스 바 */}
        <div className="progressWrap">
          <div className="progressTrack">
            <div
              className="progressFill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="progressLabels">
            <span>{progressLabel}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* 단계 */}
        <div className="steps">
          {STEPS.map((step, idx) => (
            <div key={idx} className="stepWrapper">
              <div className={`step ${stepStates[idx]}`}>
                <div className="stepCircle">
                  {stepStates[idx] === "done" ? (
                    <svg
                      className="stepIcon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="stepIcon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                  )}
                </div>

                <span className="stepLabel">{step.label}</span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`stepLine ${
                    stepStates[idx] === "done"
                      ? "lineDone"
                      : stepStates[idx] === "active"
                      ? "lineActive"
                      : "lineWaiting"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 결과 카드 */}
        {completed && (
          <div className="resultCard">
            <div className="resultBadge">
              ✓ 분석 완료
            </div>

            <div className="resultSub">
              유사 상표 3건이 발견되었습니다
            </div>
          </div>
        )}

        {!completed && (
          <p className="hint">{hint}</p>
        )}
      </main>
    </div>
  );
}