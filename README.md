# Scenario_sentiment_analysis
EmotionVoice: 프론트 

Scenarios_Sentiment_Analysis : 시나리오 감정분석


## 프로젝트 개요
- **프로젝트 기간:** 2024.03.04 ~ 2024.08.12  
- **개발 언어:** JavaScript, Python, PHP, MySQL  
- **개발 환경:** Node.js, Flask, phpMyAdmin, React, Visual Studio Code  
- **협업 툴:** Discord, Notion  

## 프로젝트 목적
이 프로젝트는 이야기의 흐름과 대화의 전개 속에서  
발화자의 감정을 보다 정밀하게 분석하기 위한 **4단계 다중 감정 분석 모델**을 구축하는 것을 목표로 하였습니다.  
대화 맥락, 발화 내용, 이전 대화 기록, 인물 관계를 통합하여  
상황별로 가중치를 부여함으로써 실제 인간의 대화에 가까운 감정 인식 정확도를 향상시켰습니다.  

## 나의 역할
- **팀장**으로서 프로젝트 총괄 및 기술 구조 설계  
- 발화 감정 분류 모델(KcBERT) 학습 및 성능 개선  
- 맥락·상황 기반 감정 분석 알고리즘 설계 및 구현  
- 관계 기반 감정 분류 모듈(KLUE RoBERTa) 개발  
- Flask 기반 **백엔드 API 서버 구현** 및 TTS 연동  
- 감정 분석 결과를 웹 인터페이스에서 시각화  

## 주요 분석 단계
1. **발화 감정 분류 (Utterance Emotion Classification)**  
   - 감정 범주: 기쁨·분노·놀람·슬픔·중립  
   - 5만 문장 데이터 구축 및 KcBERT 기반 다중 라벨 분류 모델 학습  
   - 문장 단위 감정 점수 산출  

2. **상황 감정 분석 (Contextual Emotion Analysis)**  
   - 시나리오 문장을 N-gram 기반 그래프로 변환  
   - 인물 노드의 중요도(Ix) 산출  
   - 감정 어휘 사전을 통해 인물별 상황 감정 수치화  

3. **관계 기반 감정 분석 (Relation-based Emotion Analysis)**  
   - KLUE RoBERTa 모델로 발화자-수신자 간 관계(친화·적대·중립) 추출  
   - 응답 적절성과 관계 감정 통합 분석  

4. **최종 감정 통합 (Final Emotion Integration)**  
   - 발화 감정, 어휘 감정, 상황 감정, 관계 감정, 전발화 감정에  
     가중치 (30/10/30/20/10)을 부여하여 최종 감정 점수 산출  

## 활용 기술
- **환경:** Python, PyTorch, TensorFlow, CUDA, MySQL  
- **모델:**  
  - KcBERT (감정 분석)  
  - KLUE RoBERTa-large (관계 추출)  
  - KLUE RoBERTa-base (응답 적절성)  
- **서버 및 프레임워크:** Flask, React (Node.js)  

## 주요 결과
- 감정 인식 정확도 13% 향상 (기존 BERT 대비)  
- 다단계 감정 가중치 통합을 통해 맥락·관계·감정 일관성 향상  
- 웹 기반 시각화 TTS 인터페이스 구축으로 사용자 피드백 실현  


