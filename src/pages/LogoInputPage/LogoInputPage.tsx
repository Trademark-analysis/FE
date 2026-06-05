import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LogoInputPage.css";
import axios from "axios";

interface FormData {
  serviceDescription: string;
  trademarkName: string;
  selectedCodes: string[];
  logoImage: File | null;
}

interface ClassificationCode {
  code: string;
  description: string;
}

const STEPS = [
  { label: "서비스 정보 입력", hint: "회사/서비스를 설명해주세요" },
  { label: "유사군 코드 확인", hint: "AI 분석 결과를 확인하세요" },
  { label: "상표 이미지 업로드", hint: "로고 이미지를 등록하세요" },
];

const SERVICE_EXAMPLES = [
  "중고거래 플랫폼 운영",
  "의류 온라인 판매",
  "식품 제조 및 판매",
  "IT 소프트웨어 개발",
  "뷰티 제품 판매",
  "온라인 교육 서비스",
  "물류/배송 서비스",
  "구독형 콘텐츠 서비스",
];

const SIMILAR_CODES = [
  { code: "제9류", description: "컴퓨터, 소프트웨어, 전자기기" },
  { code: "제25류", description: "의류, 신발, 모자" },
  { code: "제30류", description: "커피, 차, 음식료품" },
  { code: "제35류", description: "광고, 온라인 판매, 사업 관리" },
  { code: "제42류", description: "소프트웨어 개발, IT 서비스" },
];

export default function LogoInputPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    serviceDescription: "",
    trademarkName: "",
    selectedCodes: [],
    logoImage: null,
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recommendedCodes, setRecommendedCodes] = useState<ClassificationCode[]>([]);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleServiceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, serviceDescription: value }));
    setErrors((prev) => ({ ...prev, serviceDescription: "" }));
  };

  const handleTrademarkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, trademarkName: value }));
    setErrors((prev) => ({ ...prev, trademarkName: "" }));
  };

  const handleExampleClick = (example: string) => {
    setFormData((prev) => ({
      ...prev,
      serviceDescription: example,
    }));
  };

  const handleCodeToggle = (code: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCodes: prev.selectedCodes.includes(code)
        ? prev.selectedCodes.filter((c) => c !== code)
        : [...prev.selectedCodes, code],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logoImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, logoImage: "" }));
    }
  };

  const handleNext = async () => {
  if (step === 1) {
    if (!formData.serviceDescription.trim()) {
      setErrors((prev) => ({ ...prev, serviceDescription: "서비스 설명을 입력해주세요." }));
      return;
    }

    if (!formData.trademarkName.trim()) {
      setErrors((prev) => ({ ...prev, trademarkName: "상표명을 입력해주세요." }));
      return;
    }

    try {
      setIsClassifying(true);

      const response = await axios.post(
        "http://localhost:8080/api/trademark/classification",
        {
          trademarkName: formData.trademarkName,
          serviceDescription: formData.serviceDescription
        }
      );

      const codes = Array.isArray(response.data) ? response.data : [];

      setRecommendedCodes(codes);
      setFormData((prev) => ({
        ...prev,
        selectedCodes: [],
      }));

      setStep(2);
    } catch (error) {
      console.error("니스/유사군 코드 추천 실패:", error);
      alert("코드 추천에 실패했습니다. 백엔드/ML 서버 상태를 확인해주세요.");
    } finally {
      setIsClassifying(false);
    }

    return;
  }

  if (step === 2) {
    if (formData.selectedCodes.length === 0) {
      setErrors((prev) => ({ ...prev, selectedCodes: "최소 1개 이상의 코드를 선택해주세요." }));
      return;
    }

    setStep(3);
  }
};

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  //  즉시 로딩 화면으로 진입하도록 수정한 비동기 제어 영역
  const handleSubmit = () => {
    if (!formData.logoImage) {
      setErrors((prev) => ({ ...prev, logoImage: "상표 이미지를 업로드해주세요." }));
      return;
    }

    console.log("=== ⏳ [1단계 입력창] 분석 시작 -> 로딩 화면(/process)으로 즉시 이동 ===");

    //  원재료 formData를 rawFormData 주머니에 담아 로딩 페이지로 지연 없이 토스
    navigate("/process", { state: { rawFormData: formData } });
  };

  const getStepClass = (i: number) => {
    if (i < step) return "done";
    if (i === step) return "active";
    return "";
  };

  return (
    <div className="logo-input-root">
      <nav className="logo-input-nav">
        <div className="nav-dot" />
        <Link to="/" className="nav-brand" style={{ textDecoration: "none" }}>TrademarkAI</Link>
        <div className="nav-divider" />
        <span className="nav-page">상표 등록 가능성 진단</span>
      </nav>

      <div className="logo-input-body">
        <aside className="left-panel">
          <div className="left-tag">
            <div className="left-tag-dot" />
            AI 상표 분석
          </div>
          <h1 className="left-title">
            빠르고 정확한<br />
            상표 등록 가능성<br />
            사전 진단
          </h1>
          <p className="left-desc">
            KIPRIS 데이터 기반으로 유사 상표를 분석하고
            등록 가능성을 평가합니다. 3단계 입력으로
            AI 분석 리포트를 확인하세요.
          </p>

          <div className="steps">
            {STEPS.map((s, idx) => {
              const num = idx + 1;
              const state = getStepClass(num);
              return (
                <div className="step-row" key={num}>
                  <div className="step-left-col">
                    <div className={`step-num ${state}`}>
                      {state === "done" ? (
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="3"
                          strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : num}
                    </div>
                    {num < 3 && (
                      <div className={`step-vline ${state === "done" ? "done" : ""}`} />
                    )}
                  </div>
                  <div className="step-text">
                    <div className={`step-name ${state}`}>{s.label}</div>
                    <div className={`step-hint ${state}`}>{s.hint}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="left-footer">
            <p className="left-footer-text">
              <strong>🔒 데이터 보안</strong><br />
              입력하신 정보는 분석 목적으로만 사용되며 안전하게 보호됩니다.
            </p>
          </div>
        </aside>

        <div className="right-card">
          <div className={`form-panel ${step === 1 ? "visible" : ""}`}>
            <p className="panel-eyebrow">Step 01 / 03</p>
            <h2 className="panel-title">서비스/회사를 설명해주세요</h2>
            <p className="panel-desc">
              등록하려는 상표를 사용할 서비스나 회사에 대해 간단히 설명해주세요.
            </p>

            <div className="form-field">
              <label className="form-label" htmlFor="trademarkName">상표명</label>
              <input
                className="form-textarea"
                id="trademarkName"
                type="text"
                value={formData.trademarkName}
                onChange={handleTrademarkNameChange}
                placeholder="예) toss"
              />
              {errors.trademarkName && (
                <span className="error-message" style={{ marginTop: 6 }}>{errors.trademarkName}</span>
              )}
            </div>

            <div className="examples-section">
              <p className="examples-label">예시 선택 (클릭하면 자동 입력됩니다)</p>
              <div className="examples-grid">
                {SERVICE_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    className={`example-btn ${formData.serviceDescription === example ? "selected" : ""}`}
                    onClick={() => handleExampleClick(example)}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-field">
              <label className="form-label" htmlFor="serviceDescription">또는 직접 입력</label>
              <textarea
                className="form-textarea"
                id="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleServiceChange}
                placeholder="예) 온라인 쇼핑몰을 운영하며 의류와 액세서리를 판매합니다..."
                maxLength={200}
                rows={4}
              />
              <div className="field-footer">
                {errors.serviceDescription && (
                  <span className="error-message">{errors.serviceDescription}</span>
                )}
                <span className="char-count">{formData.serviceDescription.length} / 200</span>
              </div>
            </div>

            <div className="form-actions">
              <button className="btn-next" onClick={handleNext}>
                다음 단계
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`form-panel ${step === 2 ? "visible" : ""}`}>
            <p className="panel-eyebrow">Step 02 / 03</p>
            <h2 className="panel-title">입력한 정보를 바탕으로 유사군 코드를 찾았습니다</h2>
            <p className="panel-desc">
              해당하는 유사군 코드를 선택해주세요. 다중 선택이 가능합니다.
            </p>

            <div className="codes-section">
              {recommendedCodes.map((item) => (
                <div
                  key={item.code}
                  className={`code-item ${formData.selectedCodes.includes(item.code) ? "selected" : ""}`}
                  onClick={() => handleCodeToggle(item.code)}
                >
                  <div className="code-checkbox">
                    {formData.selectedCodes.includes(item.code) && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <div className="code-content">
                    <div className="code-name">{item.code}</div>
                    <div className="code-desc">{item.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="field-footer">
              {errors.selectedCodes && (
                <span className="error-message">{errors.selectedCodes}</span>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-back" onClick={handleBack}>이전</button>
              <button className="btn-next" onClick={handleNext} disabled={isClassifying}>
                {isClassifying ? "유사군 추천 중..." : "다음 단계"}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>

          <div className={`form-panel ${step === 3 ? "visible" : ""}`}>
            <p className="panel-eyebrow">Step 03 / 03</p>
            <h2 className="panel-title">상표 이미지를 업로드해주세요</h2>
            <p className="panel-desc">
              등록할 상표(로고, 텍스트, 이미지 등)를 업로드해주세요.
            </p>

            <div className="upload-section">
              {!imagePreview ? (
                <label className="upload-area">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="upload-input"
                  />
                  <div className="upload-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p className="upload-text">
                      <strong>이미지를 선택하거나 드래그해주세요</strong>
                    </p>
                    <p className="upload-hint">PNG, JPG, GIF (최대 10MB)</p>
                  </div>
                </label>
              ) : (
                <div className="image-preview-section">
                  <div className="image-preview">
                    <img src={imagePreview} alt="preview" />
                  </div>
                  <button
                    className="btn-change-image"
                    onClick={() => {
                      setImagePreview("");
                      setFormData((prev) => ({ ...prev, logoImage: null }));
                    }}
                  >
                    다른 이미지 선택
                  </button>
                </div>
              )}
            </div>

            <div className="field-footer">
              {errors.logoImage && (
                <span className="error-message">{errors.logoImage}</span>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-back" onClick={handleBack}>이전</button>
              <button className="btn-next" onClick={handleSubmit}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                분석 시작하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}