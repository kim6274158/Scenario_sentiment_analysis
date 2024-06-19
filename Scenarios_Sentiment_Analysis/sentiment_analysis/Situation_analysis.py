import pandas as pd
import re
import urllib3
from kiwipiepy import Kiwi
from konlpy.tag import Okt
from nltk import ngrams
import networkx as nx
import json
import matplotlib.pyplot as plt
from matplotlib import font_manager
import os

kiwi = Kiwi()

# 감정 사전 불러오기 함수
def load_emotion_dict(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# 조사를 제거하는 함수
def remove_josa(text):
    tokens = kiwi.analyze(text)[0][0]
    result = []
    for token in tokens:
        if token.tag not in ['JKS', 'JKB', 'JKC', 'JKG', 'JKO', 'JKV', 'JKQ', 'JX']:
            result.append(token.form)
    return ''.join(result)

# 상호 참조 API를 이용한 동의어 처리 함수
def coreference(text, openApiURL, accessKey):
    requestJson = {
        "argument": {
            "text": text
        }
    }
    http = urllib3.PoolManager()
    response = http.request(
        "POST",
        openApiURL,
        headers={"Content-Type": "application/json; charset=UTF-8", "Authorization": accessKey},
        body=json.dumps(requestJson)
    )
    result = json.loads(response.data.decode('utf-8'))
    entities = result.get("return_object", {}).get("entity", [])

    id_groups = {}
    for entity in entities:
        entity_id = entity.get("id", "")
        mentions = entity.get("mention", [])
        if entity_id not in id_groups:
            id_groups[entity_id] = []
        for mention in mentions:
            text_short = mention.get("text_short", "")
            cleaned_text = remove_josa(text_short)
            id_groups[entity_id].append(cleaned_text)

    synonyms = {}
    for texts in id_groups.values():
        if texts:
            main_text = texts[0]
            for text in texts:
                synonyms[text] = main_text

    return synonyms

def create_bigram_network(text, persons, openApiURL, accessKey, json_file_path):
    # print("\n상황 감정 분석을 시작합니다. 잠시만 기다려주세요...")
    # print("\n분석 중인 상황: ", text)
    # print("\n분석 중인 인물: ", persons)
    
    # 전처리
    text = re.sub("[^가-힣\s]", " ", text)
    text = re.sub("\s+", " ", text).strip()

    # 동의어 처리
    synonyms = coreference(text, openApiURL, accessKey)

    # 감정 사전 로드
    emotion_dict = load_emotion_dict(json_file_path)
    emotion_map = {f"{entry['morpheme']}({entry['tag']})": entry['emotion'] for entry in emotion_dict}

    # 감정 레이블 맵핑
    emotion_labels = {1: "기쁨", 2: "분노", 3: "놀람", 4: "슬픔"}

    # 토큰화 및 관련 품사 추출, 동의어 처리
    okt = Okt()
    tokens = []
    for word, pos in okt.pos(text, norm=True, stem=True):
        if pos in ['Noun', 'Verb', 'Adjective']:
            if pos in ['Verb', 'Adjective']:
                word = re.sub(r'다$', '', word) + '다'
            if len(word) > 1:
                word = synonyms.get(word, word)  # 동의어 처리
                tokens.append(word)

    # 바이그램 생성
    bigrams = list(ngrams(tokens, 2))

    # 단어 쌍의 빈도 계산
    pair_bigram = pd.DataFrame(bigrams, columns=['word1', 'word2'])
    pair_bigram = pair_bigram.groupby(['word1', 'word2']).size().reset_index(name='count').sort_values(by='count', ascending=False)

    # 네트워크 그래프 데이터 생성
    G = nx.from_pandas_edgelist(pair_bigram, 'word1', 'word2', ['count'])

    # 중심 노드 분석 함수
    kiwi = Kiwi()
    substantive_tags = {'NNG', 'NNP', 'NNB', 'NR', 'NP', 'VV', 'VA', 'VX', 'MM', 'MAG', 'MAJ', 'IC', 'XR'}
    
    def analyze_central_node(G, central_node):
        distances = nx.single_source_shortest_path_length(G, central_node)
        degrees = dict(G.degree())
        importance = {node: degrees[node] / distance if distance != 0 else 0 for node, distance in distances.items()}

        node_details = {}
        emotion_scores = {emotion: 0.0 for emotion in emotion_labels.values()}
        
        for node in distances:
            tokens = kiwi.tokenize(node)
            substantive_morphemes = [(token.form, token.tag if token.tag != 'VA-I' else 'VA') for token in tokens if token.tag in substantive_tags or token.tag == 'VA-I']
            morphemes = ', '.join([f"{form}({tag})" for form, tag in substantive_morphemes])
            emotions = [emotion_map[m] for m in morphemes.split(', ') if m in emotion_map]
            node_details[node] = morphemes if morphemes else '실질 형태소 없음', ', '.join([emotion_labels[e] for e in emotions]) if emotions else 'none'
            
            # Emotion scoring
            for e in emotions:
                emotion_scores[emotion_labels[e]] = round(emotion_scores[emotion_labels[e]] + importance[node], 2)

        total_emotion_score = sum(emotion_scores.values())
        if total_emotion_score > 0:
            emotion_scores = {emotion: round((score / total_emotion_score) * 100, 2) for emotion, score in emotion_scores.items()}

        return distances, degrees, importance, node_details, emotion_scores

    # 결과 저장
    results = []

    # 인물별 분석 및 테이블 출력
    for person in persons:
        if person in G:
            distances, degrees, importance, node_details, emotion_scores = analyze_central_node(G, person)
            results.append({'Character': person, 'Situation_emotion': emotion_scores})
            print("정상적으로 분석되었습니다")
        else:
            print(f"\n'{person}'은(는) 그래프에 존재하지 않습니다.")

    return G, results

def get_emotions(characters_emotions, character_name):
    for character in characters_emotions:
        if character['Character'] == character_name:
            return character['Situation_emotion']
    return None 

def draw_network_graph(G, directory_path, title):
    # 한글 폰트 설정
    font_path = r'C:\Scenarios_Sentiment_Analysis\Fonts\NanumGothic.ttf'
    
    # Load the font to matplotlib
    font_manager.fontManager.addfont(font_path)
    plt.rcParams['font.family'] = 'NanumGothic'
    plt.rcParams['axes.unicode_minus'] = False

    # matplotlib으로 그리기
    plt.figure(figsize=(12, 12))
    pos = nx.spring_layout(G, seed=42)
    nx.draw(G, pos, with_labels=True, node_size=[v * 100 for v in dict(G.degree()).values()],
            node_color='skyblue', font_size=12, font_family='NanumGothic', edge_color='gray', alpha=0.6)
    
    # 그래프 이미지 저장
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)
    image_path = os.path.join(directory_path, f'{title}.png')
    plt.savefig(image_path)
    plt.close()