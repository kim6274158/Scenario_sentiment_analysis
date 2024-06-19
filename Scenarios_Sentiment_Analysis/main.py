import sentiment_analysis.Character_Features as cf
from sentiment_analysis.Vocabulary_explore import register_morphemes_to_kiwi, analyze_sentence_emotions
from sentiment_analysis.Situation_analysis import create_bigram_network, draw_network_graph,get_emotions
from sentiment_analysis.Scenario_Analysis import extract_characters,parse_text
from sentiment_analysis.Recipient_Definition import parse_dialogue, process_dialogue, find_recipient
from sentiment_analysis.Situation_analysis import create_bigram_network, draw_network_graph,get_emotions
import json

title = "라푼젤"

text = '''라푼첼

1. 프롤로그.

-1. 한 부부의 집.

오랫동안 아무런 결실 없이 아이를 원하기만 한 부부가 있었습니다. 그 부부의 집 뒤채에는 제일 예쁜 꽃과 식물들로 가득 찬 정원을 볼 수 있는 작은 창문이 있었습니다. 하지만 그 정원은 높은 벽으로 둘러 쌓여있었고 아무도 감히 들어갈 수 없었습니다. 왜냐하면, 그 정원은 전 세계 모두가 무서워하고 엄청난 힘을 가진 마녀의 것이기 때문이었습니다. 어느 날 부인은 창문 가에 서서 정원에 있는 화단을 보았습니다. 그 화단에 라푼첼(초롱꽃속의 식물)이 심겨 있었는데 선명한 초록색을 띠고 신선해 보여 그녀는 라푼첼을 매우 먹고 싶었습니다. 그 욕구는 날마다 커졌지만, 라푼첼을 먹을 수 없다는 사실 때문에 부인은 날마다 야위어 갔습니다. 그런 모습을 본 남편은 깜짝 놀라 물었습니다.

남편 : 깜짝이야! 무슨 일이야? 여보!
부인 : 만약 내가 우리 집 뒤에 정원에서 먹을 라푼첼을 얻지 못하면 난 죽을 거 에요.
남편 : 어떤 위험이 있더라도 내 아내를 죽게 내버려 두기보다는 라푼첼을 가져오겠어.

-2. 마녀의 정원.

그래서 남편은 황혼에 마녀의 정원에 벽을 넘어들어갔습니다. 그리고는 황급히 한 줌의 라푼첼을 가져와 부인에게 주었습니다. 그녀는 라푼첼로 샐러드를 만들었습니다. 하지만 그 샐러드가 매우 맛있어서 날이 갈수록 라푼첼을 먹고 싶은 욕구가 커졌습니다. 부인이 안정을 찾기 위해서는 남편이 한 번 더 정원에 올라가야 했습니다. 그는 황혼에 다시 정원의 벽을 올라갔고 그 순간, 그는 놀랐습니다. 그 앞에 서 있는 마녀를 보았기 때문입니다.

마녀 : 어떻게 네가 감히 내 정원에 도둑처럼 들어와 라푼첼을 훔칠 수 있느냐! 괘씸한 것.
남편 : 죄송합니다. 자비를 베풀어 용서해 주세요.
부인 : 제발 용서해 주세요. 남편은 나를 위해 라푼첼을 가져왔어요.
마녀 : 흠, 네가 말한 그런 상황이라면 너희가 필요한 만큼의 라푼첼을 먹을 수 있게 해주겠어. 하지만 조건이 있지. 너희 부부는 나에게 한 아이를 나에게 줘야 해. 다만 그 아이는 네 아내가 낳은 아이여야 해. 그 아이는 잘 자랄 거고 내가 엄마처럼 잘 보살펴주지.

2. 라푼첼이 사는 탑.

-1. 탑. 몇 년 후.

머리카락이 내려왔고 왕자는 위로 올라갔습니다. 처음에 왕자가 그녀 앞으로 왔을 때, 그녀는 깜짝 놀랐습니다. 그러자 그는 라푼첼의 노래가 그의 심장을 뛰게 했고 그를 너무 혼란스럽게 만들어 그녀를 보지 않고는 안 될 것 같아 이곳에 왔다고 말했습니다. 그래서 라푼첼은 두려움을 잊었습니다.왕자가 그녀에게 자신을 남편으로 받아주겠느냐고 물어봤을 때, 그녀는 '그가 고텔 엄마(마녀)보다 날 더 사랑해 줄 거야.'라고 생각했고 그의 손을 잡았습니다. 그녀는 말했습니다.

라푼첼 : 당신과 함께 가겠어요. 하지만 여기서 어떻게 나가야 할지 모르겠어요. 당신이 여기 올 때 비단을 갖고 오시면 제가 그걸로 사다리를 만들게요. 사다리가 완성되면 내가 내려갈 테니 당신이 나를 말 위로 태워주세요.
라푼첼 : 어떻게 나에게 한눈에 반한 왕자보다 당신이 더 무거울 수가 있죠?
마녀 : 이런 간사한것!
마녀 : 지금 무슨 소릴 하는 거야! 나는 너를 세상과 완전히 단절시켰다고 생각했는데. 넌 날 배신한 거였어!''';


age_json_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\나이.json'
gender_json_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\성별.json'
json_file_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정어휘형태소사전.json'

#인물 특징 추출
# print("\n등장인물 info:")
# cf.extract_dialogue_info(text, age_json_path, gender_json_path)
# # #인물 목록 추출
# print("\n등장인물 전체 목록:")
# character_list = extract_characters(text)
# print(character_list)

# 사전 형태소 등록 (한 번 실행)
register_morphemes_to_kiwi(json_file_path)

json_file_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정어휘형태소사전.json'
openApiURL = "http://aiopen.etri.re.kr:8000/Coreference"
accessKey = "04cdaa8d-4639-445a-bcee-fb1ba559b7a4"

def get_previous_speech(dialogues, number):
    if number == 1:
        return []
    return dialogues[number - 2]['Speech']

# 시나리오 감정 분석
print("\n시나리오 감정 분석(발화,감정어휘, 상황):")
parsed_data = parse_text(text)
# for scene in parsed_data:
#   print(json.dumps(scene, indent=4, ensure_ascii=False))
  
for scene in parsed_data:
    scene_num = scene['sceneNum']
    scenes_nm = scene['scenes_nm']
    character_list = scene['character_list']
    character_num = scene['character_num']

    print(f"Scene Number: {scene_num}")
    print(f"Scene Name: {scenes_nm}")
    print(f"Character List: {', '.join(character_list)}")
    print(f"Number of Characters: {character_num}")

    # Looping through situations within the scene
    for situation in scene['Situations']:
        situation_num = situation['SituationNum']
        situation_desc = situation['Situation']
        dialogues = situation['dialogues']

        print(f"\nSituation Number: {situation_num}")
        print(f"Situation Description: {situation_desc}")
        print("-" * 30)  # Separator for each dialogue
        
        character_list = [character.strip() for character in character_list]
        network_graph, characters_emotions = create_bigram_network(situation_desc, character_list, openApiURL, accessKey, json_file_path)
        print("situaion_emotion: ", characters_emotions)

        # Looping through dialogues within the situation
        for dialogue in dialogues:
            dialogue_num = dialogue['dialogue_num']
            character = dialogue['character']
            speech = dialogue['dialogue']
            speech_option = dialogue['dialogue_option']

            print(f"\nDialogue Number: {dialogue_num}")
            print(f"Character Speaking: {character}")
            print(f"Speech: {speech}")
            print(f"Speech Option: {speech_option}")
            
            sentiment_analysis_기쁨 = 0.0
            sentiment_analysis_분노 = 0.0
            sentiment_analysis_놀람 = 0.0
            sentiment_analysis_슬픔 = 0.0
            sentiment_analysis_중립 = 0.0
            
            situation_emotion_기쁨 = 0.0
            situation_emotion_분노 = 0.0
            situation_emotion_놀람 = 0.0
            situation_emotion_슬픔 = 0.0
            
            emotion_vocab_기쁨 = []
            emotion_vocab_분노 = []
            emotion_vocab_놀람 = []
            emotion_vocab_슬픔 = []
            
            emotion_usage_기쁨 = []
            emotion_usage_분노 = []
            emotion_usage_놀람 = []
            emotion_usage_슬픔 = []
                        
            sentiment_analysis = dialogue["sentiment_analysis"]
            for sentiment in sentiment_analysis:
                label = sentiment["label"]
                score = sentiment["score"]
                if label == "기쁨":
                    sentiment_analysis_기쁨 = score
                elif label == "분노":
                    sentiment_analysis_분노 = score
                elif label == "놀람":
                    sentiment_analysis_놀람 = score
                elif label == "슬픔":
                    sentiment_analysis_슬픔 = score
                elif label == "중립":
                    sentiment_analysis_중립 = score
                    
            print(f"기쁨: {sentiment_analysis_기쁨}")
            print(f"분노: {sentiment_analysis_분노}")
            print(f"놀람: {sentiment_analysis_놀람}")
            print(f"슬픔: {sentiment_analysis_슬픔}")
            print(f"중립: {sentiment_analysis_중립}")
            
            emotion_vocab = dialogue["Emotion_vocab"]
            for emotion, vocab_list in emotion_vocab.items():
                if emotion == "기쁨":
                    emotion_vocab_기쁨 = vocab_list
                elif emotion == "분노":
                    emotion_vocab_분노 = vocab_list
                elif emotion == "놀람":
                    emotion_vocab_놀람 = vocab_list
                elif emotion == "슬픔":
                    emotion_vocab_슬픔 = vocab_list
            
            print(f"Emotion Vocabulary 기쁨: {emotion_vocab_기쁨}")
            print(f"Emotion Vocabulary 분노: {emotion_vocab_분노}")
            print(f"Emotion Vocabulary 놀람: {emotion_vocab_놀람}")
            print(f"Emotion Vocabulary 슬픔: {emotion_vocab_슬픔}")
            
            emotion_usage = dialogue["Emotion_usage"]
            for emotion, value in emotion_usage.items():
                if emotion == "기쁨":
                    emotion_usage_기쁨 = float(value)
                elif emotion == "분노":
                    emotion_usage_분노 = float(value)
                elif emotion == "놀람":
                    emotion_usage_놀람 = float(value)
                elif emotion == "슬픔":
                    emotion_usage_슬픔 = float(value)
                    
            print(f"Emotion Usage 기쁨: {emotion_usage_기쁨}")
            print(f"Emotion Usage 분노: {emotion_usage_분노}")
            print(f"Emotion Usage 놀람: {emotion_usage_놀람}")
            print(f"Emotion Usage 슬픔: {emotion_usage_슬픔}")
            
            #get_emotions(situation_emotions, character.strip()),
            situaion_emotion = get_emotions(characters_emotions , character)
            print(f"Situation Emotion: {situaion_emotion}")
            for emotion, score in situaion_emotion.items():
              if emotion == "기쁨":
                  situation_emotion_기쁨 = float(score)
              elif emotion == "분노":
                  situation_emotion_분노 = float(score)
              elif emotion == "놀람":
                  situation_emotion_놀람 = float(score)
              elif emotion == "슬픔":
                  situation_emotion_슬픔 = float(score)
                  
            print(f"Situation Emotion 기쁨: {situation_emotion_기쁨}")
            print(f"Situation Emotion 분노: {situation_emotion_분노}")
            print(f"Situation Emotion 놀람: {situation_emotion_놀람}")
            print(f"Situation Emotion 슬픔: {situation_emotion_슬픔}")
            
            recipient_list = dialogue['Recipients']
            print(f"Recipient List: {recipient_list}")
            
            recipient = find_recipient(recipient_list, dialogue_num)
            print(f"Recipient: {recipient}")
            
            pre_speech = get_previous_speech(recipient_list, dialogue_num)
            print(f"Previous Speech: {pre_speech}")
            
            #수신자관계
            #전발화감정
            #최종감정

            print("-" * 30)  
        print("=" * 40)  
    print("#" * 50)
