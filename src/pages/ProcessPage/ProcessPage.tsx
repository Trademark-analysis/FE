import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
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
  const navigate = useNavigate(); // 2. navigate 함수 선언
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
    const timers = DELAYS.map((delay, i) =>
      window.setTimeout(() => {
        setStepStates((prev) => {
          const next = [...prev];

          if (i > 0) next[i - 1] = "done";
          next[i] = "active";

          return next;
        });

        setProgress(STEPS[i].prog);
        setProgressLabel(STEPS[i].progLabel);
        setHint(STEPS[i].hint);
      }, delay),
    );

    const doneTimer = window.setTimeout(() => {
      setStepStates(["done", "done", "done", "done"]);
      setProgress(100);
      setProgressLabel("분석 완료");
      setCompleted(true);

      // 3. 분석이 완료된 후 사용자가 완료 메시지를 잠깐 볼 수 있도록 
      // 1초(1000ms) 정도 딜레이를 준 후 유사 후보 페이지로 이동
      setTimeout(() => {
        navigate("/similarity");
      }, 1000);

    }, DONE_AT);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(doneTimer);
    };
  }, [navigate]); // 4. 의존성 배열에 navigate 추가

  return (
    <main className="process-page">
      <nav className="process-nav">
        <div className="nav-dot" />
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>TrademarkAI</Link>
        <div className="nav-divider" />
        <span className="nav-page">상표 유사도 분석</span>
      </nav>

      <section className="process-content">
        <div className="process-card">
          <div className="process-image-box">
            <svg
              width="38"
              height="38"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

          <div className="process-title-area">
            <p className="process-eyebrow">AI Analysis</p>
            <h1>
              {completed ? "분석이 완료되었습니다" : "상표 유사도 분석 중"}
              {!completed && (
                <span className="dotsAnim" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              )}
            </h1>
            <p>{completed ? "유사 상표 3건이 발견되었습니다" : hint}</p>
          </div>

          <div className="progressWrap">
            <div className="progressTrack">
              <div className="progressFill" style={{ width: `${progress}%` }} />
            </div>

            <div className="progressLabels">
              <span>{progressLabel}</span>
              <span>{progress}%</span>
            </div>
          </div>

          <div className="process-steps">
            {STEPS.map((step, idx) => (
              <div key={step.label} className={`process-step ${stepStates[idx]}`}>
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
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.progLabel}</p>
                </div>
              </div>
            ))}
          </div>

          {completed && (
            <div className="resultCard">
              <div className="resultBadge">✓ 분석 완료</div>
              <div className="resultSub">곧 유사 후보 화면으로 이동합니다...</div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}