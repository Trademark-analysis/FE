import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; 
import "./ProcessPage.css";
import axios from "axios";

const STEPS = [
  { maxProg: 25, progLabel: "이미지 처리 중", hint: "이미지를 업로드하고 있습니다...", label: "이미지 업로드" },
  { maxProg: 50, progLabel: "특징 벡터 추출 중", hint: "상표의 시각적 특징을 추출하고 있습니다...", label: "특징 추출" },
  { maxProg: 75, progLabel: "등록 상표 DB 검색 중", hint: "등록 상표 DB를 검색하고 있습니다...", label: "DB 검색" },
  { maxProg: 100, progLabel: "유사도 점수 계산 중", hint: "결과를 분석하고 있습니다...", label: "결과 분석" },
];

type StepState = "waiting" | "active" | "done";

export default function TrademarkAnalysis() {
  const navigate = useNavigate(); 
  const location = useLocation();
  
  const rawFormData = location.state?.rawFormData;
  const apiResultRef = useRef<any>(null); // 비동기 API 결과를 담아놓을 보관함
  const [apiFailed, setApiFailed] = useState(false);

  const [stepStates, setStepStates] = useState<StepState[]>(["active", "waiting", "waiting", "waiting"]);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("이미지 처리 중");
  const [hint, setHint] = useState("이미지를 업로드하고 있습니다...");
  const [completed, setCompleted] = useState(false);

  const uploadImageSrc = rawFormData?.logoImage ? URL.createObjectURL(rawFormData.logoImage) : "";

  // 1. [실전 백그라운드 API 통신 효과] - 주머니 보관 기능 유지
  useEffect(() => {
    if (!rawFormData) return;

    const callBackendApi = async () => {
      const multipartBody = new FormData();
      multipartBody.append("trademarkName", rawFormData.trademarkName);
      multipartBody.append("serviceDescription", rawFormData.serviceDescription);
      rawFormData.selectedCodes.forEach((code: string) => {
        multipartBody.append("selectedCodes", code);
      });
      multipartBody.append("image", rawFormData.logoImage);

      try {
        console.log("=== [로딩 내부] 백그라운드 Spring Boot API 구동 개시 ===");
        const response = await axios.post(
          "http://localhost:8080/api/trademark/analyze", 
          multipartBody,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (response.data) {
          console.log("=== [로딩 내부] 백엔드 데이터 수신 완료! (보관함 보관 후 UI 타이머와 싱크 대기) ===");
          const finalResult = response.data.result ? response.data.result : response.data;
          apiResultRef.current = finalResult;
        } else {
          setApiFailed(true);
        }
      } catch (error) {
        console.error("로딩 중 백엔드 통신 에러 발생:", error);
        setApiFailed(true);
      }
    };

    callBackendApi();
  }, [rawFormData]);

  // 2. [통합 애니메이션 및 데이터 체킹 프레임 인터벌]
  useEffect(() => {
    if (apiFailed) {
      alert("서ver 연동에 실패했습니다. 시스템 가동 상태를 점검하세요.");
      navigate(-1);
      return;
    }

    // 0.05초(50ms)마다 게이지를 부드럽게 1%씩 누적시키는 통합 인터벌 작동 (총 약 5초 소요 연출)
    const intervalTimer = window.setInterval(() => {
      setProgress((prevProg) => {
        if (prevProg >= 100) {
          window.clearInterval(intervalTimer); // 100% 도달 시 타이머 소멸
          return 100;
        }

        const nextProg = prevProg + 1;

        // 실시간 게이지 위치에 따라 1~4단계 UI 스텝 상태값(State)을 안전하게 업데이트
        setStepStates(() => {
          if (nextProg < 25) return ["active", "waiting", "waiting", "waiting"];
          if (nextProg >= 25 && nextProg < 50) return ["done", "active", "waiting", "waiting"];
          if (nextProg >= 50 && nextProg < 75) return ["done", "done", "active", "waiting"];
          if (nextProg >= 75 && nextProg < 100) return ["done", "done", "done", "active"];
          return ["done", "done", "done", "done"];
        });

        // 진행률 마일스톤에 맞게 가이드 라벨 텍스트 동기화
        if (nextProg <= 25) {
          setProgressLabel(STEPS[0].progLabel);
          setHint(STEPS[0].hint);
        } else if (nextProg <= 50) {
          setProgressLabel(STEPS[1].progLabel);
          setHint(STEPS[1].hint);
        } else if (nextProg <= 75) {
          setProgressLabel(STEPS[2].progLabel);
          setHint(STEPS[2].hint);
        } else if (nextProg < 100) {
          setProgressLabel(STEPS[3].progLabel);
          setHint(STEPS[3].hint);
        }

        return nextProg;
      });
    }, 50);

    return () => window.clearInterval(intervalTimer);
  }, [navigate, apiFailed]);

  // 3. [100% 완결 시점 최종 결과창 라우팅 트리거]
  useEffect(() => {
    if (progress === 100) {
      setStepStates(["done", "done", "done", "done"]);
      setProgressLabel("분석 완료");
      setCompleted(true);

      // 게이지 100% 완료 문구를 감상할 1.2초 최종 딜레이 폴링 가동
      const routeTimer = window.setTimeout(() => {
        const checkAndNavigate = () => {
          if (apiResultRef.current) {
            console.log("=== ➡️ [연출 대성공] 1~4단계 전 구간 완수 완료! 결과창으로 무빙 ===");
            navigate("/similarity", { state: { analysisResult: apiResultRef.current } });
          } else {
            console.log("⏳ 애니메이션은 끝났으나 백그라운드 연산이 조금 무겁습니다. 0.3초 후 재조회");
            setTimeout(checkAndNavigate, 300);
          }
        };
        checkAndNavigate();
      }, 1200);

      return () => window.clearTimeout(routeTimer);
    }
  }, [progress, navigate]);

  // 메모리 누수 관리 클린업
  useEffect(() => {
    return () => {
      if (uploadImageSrc) URL.revokeObjectURL(uploadImageSrc);
    };
  }, [uploadImageSrc]);

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
            {uploadImageSrc ? (
              <img 
                src={uploadImageSrc} 
                alt="Uploaded Logo" 
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "8px" }}
              />
            ) : (
              <>
                <svg width="38" height="38" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 15l-5-5L5 21" />
                </svg>
                <span>업로드한 상표</span>
              </>
            )}
          </div>

          <div className="process-title-area">
            <p className="process-eyebrow">AI Analysis</p>
            <h1>
              {completed ? "분석이 완료되었습니다" : "상표 유사도 분석 중"}
              {!completed && (
                <span className="dotsAnim" aria-hidden="true">
                  <span /><span /><span />
                </span>
              )}
            </h1>
            <p>{completed ? "유사 상표 분석이 매칭되었습니다" : hint}</p>
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
                    <svg className="stepIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <div>
                  <strong>{step.label}</strong>
                  <p>{step.maxProg <= progress ? step.progLabel : "대기 중"}</p>
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