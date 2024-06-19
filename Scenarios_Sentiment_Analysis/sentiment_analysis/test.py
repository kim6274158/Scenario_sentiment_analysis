import requests
import json

# Typecast API URL 설정
url = "https://typecast.ai/api/speak"

# API 요청에 필요한 데이터 구성
payload = json.dumps({
    "actor_id": "622964d6255364be41659078",  # 사용할 음성 액터의 ID
    "text": "시험에 떨어져서 너무 속상해",  # 음성으로 변환할 텍스트
    "lang": "auto",  # 언어 설정 (auto로 설정하면 자동 인식)
    "tempo": 1,  # 재생 속도
    "volume": 100,  # 볼륨
    "pitch": 0,  # 피치(음높이)
    "xapi_hd": True,  # 고화질 음성 사용 여부
    "max_seconds": 60,  # 최대 음성 길이(초)
    "model_version": "latest",  # 사용할 모델 버전
    "xapi_audio_format": "mp3",  # 오디오 포맷
    "emotion_tone_preset": "sad-1"  # 감정 톤 설정
})
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer __plt5oCpVm9widgVgJUX3RXvk6MZ3RyAXbrmZYjxkybH'  # API 토큰
}

# POST 요청을 보내고 응답을 받음
response = requests.post(url, headers=headers, data=payload)

# 응답 텍스트 출력
print(response.text)
