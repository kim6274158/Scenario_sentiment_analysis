from flask import Flask, request, jsonify
import json
import sentiment_analysis.Character_Features as cf
from sentiment_analysis.Vocabulary_explore import register_morphemes_to_kiwi, analyze_sentence_emotions
from sentiment_analysis.Scenario_Analysis import extract_characters, parse_text

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    # JSON 데이터에서 title과 text 추출
    data = request.get_json()
    title = data.get('title', '')
    text = data.get('text', '')
    json_file_path = r'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정어휘형태소사전.json'
    register_morphemes_to_kiwi(json_file_path)

    print(f"분석할 시나리오: {title}")

    # 시나리오 감정 분석
    print("\n시나리오 감정 분석(발화,감정어휘, 상황):")
    parsed_data = parse_text(text)
    scenes = []
    for scene in parsed_data:
        scenes.append(json.dumps(scene, indent=4, ensure_ascii=False))

    return jsonify(scenes)

if __name__ == '__main__':
    app.run(port=6000, debug=True)
