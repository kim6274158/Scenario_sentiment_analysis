from transformers import BertForSequenceClassification, AutoTokenizer, TextClassificationPipeline

def sentiment_analysis(sentence):
    # 저장된 디렉토리에서 모델과 토큰라이저를 로드
    model_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정분석모델'
    model = BertForSequenceClassification.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)

    # 텍스트 분류를 위한 파이프라인 생성
    pipeline = TextClassificationPipeline(model=model, tokenizer=tokenizer, device=-1, return_all_scores=True)

    # 입력 문장에 대한 감정 분석 수행
    predictions = pipeline(sentence)

    # 예측 결과 반환
    return predictions[0]