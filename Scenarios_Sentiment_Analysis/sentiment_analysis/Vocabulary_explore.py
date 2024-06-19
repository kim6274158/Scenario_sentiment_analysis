import json
from kiwipiepy import Kiwi

# Kiwi 형태소 분석기 초기화
kiwi = Kiwi()

def load_emotion_dictionary(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def register_morphemes_to_kiwi(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file:
        morpheme_data = json.load(file)

    for entry in morpheme_data:
        morpheme = entry['morpheme']
        tag = entry['tag']
        result = kiwi.add_user_word(morpheme, tag)
        print(f"Registered: {morpheme} as {tag}, Result: {result}")

def analyze_sentence_emotions(sentence, json_file_path):
    emotion_dict = load_emotion_dictionary(json_file_path)
    tokens = kiwi.tokenize(sentence)
    emotion_counts = {1: 0, 2: 0, 3: 0, 4: 0}
    substantive_morphemes = []
    found_emotion_morphemes = []
    substantive_tags = {'NNG', 'NNP', 'NNB', 'NR', 'NP', 'VV', 'VA', 'VX', 'MM', 'MAG', 'MAJ', 'IC', 'XR'}

    for token in tokens:
        if token.tag in substantive_tags:
            substantive_morphemes.append((token.form, token.tag))
            for item in emotion_dict:
                if token.form == item['morpheme'] and token.tag == item['tag']:
                    emotion_counts[item['emotion']] += 1
                    word = token.form
                    if token.tag == 'XR':
                        word += '하다'
                    elif token.tag.startswith('V'):
                        word += '다'
                    found_emotion_morphemes.append((item['emotion'], word, token.tag))

    return found_emotional_vocabulary(found_emotion_morphemes), emotional_vocabulary_usage(emotion_counts, substantive_morphemes)

def found_emotional_vocabulary(found_emotion_morphemes):
    emotion_labels = {1: "기쁨", 2: "분노", 3: "놀람", 4: "슬픔"}
    vocab_by_emotion = {emotion_labels[emotion]: [] for emotion in emotion_labels.keys()}  # 이 부분을 수정
    
    for emotion, word, tag in found_emotion_morphemes:
        vocab_by_emotion[emotion_labels[emotion]].append(word)

    return vocab_by_emotion

def emotional_vocabulary_usage(emotion_counts, substantive_morphemes):
    emotion_labels = {1: "기쁨", 2: "분노", 3: "놀람", 4: "슬픔"}
    total_substantive = len(substantive_morphemes)
    usage_percentages = {}

    for emotion, count in emotion_counts.items():
        if total_substantive > 0:
            usage_percentages[emotion_labels[emotion]] = 100 * count / total_substantive
        else:
            usage_percentages[emotion_labels[emotion]] = 0

    return usage_percentages
