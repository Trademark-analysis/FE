# 🔍 TrademarkAI — AI 기반 상표 유사도 분석 서비스

> 변리사의 선행조사 시간을 줄이는 Mircrosoft Azure 기반 상표 검색 서비스

상표 출원 전, 기존 상표와의 유사 가능성을 AI가 빠르게 선별해드립니다.  


니스 분류 · 비엔나 코드 · 이미지 유사도 · 텍스트 유사도를 종합적으로 고려한 3단계 검사 시스템입니다.

---

## 📌 프로젝트 개요

변리사 사무실에서는 상표 선행조사 시 KIPRIS에서 직접 검색하고 도형 코드를 일일이 대조해야 합니다.  
심사 기간이 12~14개월에 달하고 누락 시 시간·비용 전액이 손실되는 만큼, 반복 수작업과 높은 리스크를 줄이는 AI 검색 도구가 필요했습니다.

본 서비스는 **법적 심사를 대체하는 것이 아니라**, 변리사가 우선 검토해야 할 유사 후보군을 빠르게 선별하는 **1차 검색 도구**입니다.

---

## 🏗️ 시스템 아키텍처

```
Browser
  ↕
Frontend (TypeScript + React + Vite)
  ↕ REST API
Backend Server (Spring Boot)  ←→  ML Server (Python)
  ↕
Azure SQL (분석 결과 저장)
  ↕
Azure AI Services
  ├── Custom Vision     — 비엔나코드 도형 분류 (1차)
  ├── GPT-4o            — 니스/유사군 분류, 식별력 분석 (1·3차)
  ├── Azure AI Vision   — 이미지 임베딩 유사도 (2차)
  └── AI Vision OCR     — 상표 텍스트 추출 (2차)
```

---

## 🔄 서비스 핵심 플로우

| 단계 | 내용 | 사용 기술 |
|------|------|-----------|
| **1차 검사** | 니스 분류·유사군 코드 추출 / 비엔나코드(도형) 분류로 후보군 축소 | GPT-4o, Azure Custom Vision |
| **2차 검사** | 이미지 벡터 임베딩 + OCR 텍스트 추출 → 코사인 유사도 계산 (0.5:0.5) | Azure AI Vision |
| **3차 및 리포트** | 식별력 점수 산출(few-shot) + 종합 분석 리포트 생성(zero-shot) | GPT-4o / GPT-4o mini |

---

## 🛠️ 기술 스택 (FE)

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS (UI 통일 디자인 시스템 적용)
- **통신**: REST API (Spring Boot 서버 연동)

---

## 📂 주요 화면

- **서비스 소개 입력** — 상표명 · 유사군 코드 · 상표 이미지 3단계 입력
- **유사 후보 목록** — 유사도 점수 · NICE 분류 · 비엔나코드 매칭 정보 표시
- **AI 분석 리포트** — 식별력 점수, 유사 위험도, 변리사 검토 필요 여부 안내

---

## 💻 로컬 실행 방법

```bash
# 패키지 설치
npm install

# 개발 서버 실행
npm run dev
```

> Backend 서버가 함께 실행 중이어야 정상 동작합니다.

---

## 📎 관련 레포지토리

- [BE](https://github.com/Trademark-analysis/BE) — Spring Boot 백엔드 서버
- [ML](https://github.com/Trademark-analysis/ML) — Python ML 분석 서버

