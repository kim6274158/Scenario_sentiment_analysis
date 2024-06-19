import json
import warnings
import torch
from transformers import logging as transformers_logging
from torch import nn
from transformers import AutoTokenizer, RobertaModel
from torch.nn.functional import softmax
# GPU 설정 (GPU가 가능하면 CUDA를, 그렇지 않으면 CPU를 사용)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 경고 메시지를 억제하여 불필요한 로그 출출을 줄임
warnings.filterwarnings('ignore', category=FutureWarning)
transformers_logging.set_verbosity_error()

# Pretrained 모델과 토크나이저 로드
model_name = "klue/roberta-large"
model_path = "C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\관계분석모델"
tokenizer = AutoTokenizer.from_pretrained('C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\관계분석모델\tokenizer')

num_labels = 3

# 토크나이저에 특수 토큰 추가
special_tokens = {'additional_special_tokens': ['[SUBJ]', '[/SUBJ]', '[OBJ]', '[/OBJ]']}
num_added_toks = tokenizer.add_special_tokens(special_tokens)

# PyTorch 모델 정의
class EnhancedRobertaClassifier(nn.Module):
    def __init__(self, model_name, num_labels, dropout_rate=0.3):
        super(EnhancedRobertaClassifier, self).__init__()
        self.roberta = RobertaModel.from_pretrained(model_name)
        hidden_size = self.roberta.config.hidden_size
        self.fc1 = nn.Linear(hidden_size * 2, hidden_size)
        self.batch_norm1 = nn.BatchNorm1d(hidden_size)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(dropout_rate)
        self.fc2 = nn.Linear(hidden_size, num_labels)
        self.batch_norm2 = nn.BatchNorm1d(num_labels)

    def forward(self, input_ids, attention_mask, subj_positions, obj_positions):
        outputs = self.roberta(input_ids=input_ids, attention_mask=attention_mask)
        sequence_output = outputs.last_hidden_state
        cls_output = sequence_output[:, 0, :]
        subj_positions = torch.clamp(subj_positions, 0, sequence_output.shape[1] - 1)
        obj_positions = torch.clamp(obj_positions, 0, sequence_output.shape[1] - 1)
        subj_vector = sequence_output[torch.arange(sequence_output.size(0)), subj_positions[:, 0]]
        obj_vector = sequence_output[torch.arange(sequence_output.size(0)), obj_positions[:, 0]]
        combined_vector = torch.cat([cls_output, subj_vector + obj_vector], dim=1)
        x = self.dropout(self.relu(self.batch_norm1(self.fc1(combined_vector))))
        logits = self.batch_norm2(self.fc2(x))
        return logits

# 모델을 GPU 또는 CPU로 로드
model = EnhancedRobertaClassifier(model_name, num_labels).to(device)
model.roberta.resize_token_embeddings(len(tokenizer))
model.load_state_dict(torch.load(model_path, map_location=device))
model.to(device)
model.eval()

def relation(text, characterlist):
    relationships = []
    relationship_counts = {}
    relationship_details = {}
    relationship_probabilities = {}

    def safe_index_finder(inputs, pos, length):
        if pos < 0:
            return 0
        idx = inputs.char_to_token(0, pos)
        if idx is None:
            return inputs.char_to_token(0, pos + length - 1) if inputs.char_to_token(0, pos + length - 1) is not None else 0
        return idx

    for scene in text:
        included_characters = scene.get('character_list', [])
        situations = scene.get('Situations', [])
        # print(f'[scene]: {scene}')
        for situation in situations:
            sentence = situation.get('Situation', '')
            dialogues = situation.get('dialogues', [])
            
            for dialogue in dialogues:
                sentence = dialogue.get('prev_situation', '')
                char_list = dialogue.get('character_list', [])
                
                for i in range(len(char_list)):
                    for j in range(i + 1, len(char_list)):
                        char1, char2 = char_list[i], char_list[j]

                        marked_sentence = sentence.replace(char1, "[SUBJ]").replace(char2, "[OBJ]")
                        inputs = tokenizer.encode_plus(marked_sentence, add_special_tokens=True, max_length=128,
                                                       padding='max_length', truncation=True, return_tensors='pt')
                        input_ids = inputs['input_ids'].to(device)
                        attention_mask = inputs['attention_mask'].to(device)

                        subj_start_idx = marked_sentence.find("[SUBJ]")
                        subj_end_idx = subj_start_idx + len("[SUBJ]")
                        obj_start_idx = marked_sentence.find("[OBJ]")
                        obj_end_idx = obj_start_idx + len("[OBJ]")

                        subj_positions = torch.tensor([
                            safe_index_finder(inputs, subj_start_idx, len(char1)),
                            safe_index_finder(inputs, subj_end_idx, len(char1))
                        ]).unsqueeze(0).to(device)
                        obj_positions = torch.tensor([
                            safe_index_finder(inputs, obj_start_idx, len(char2)),
                            safe_index_finder(inputs, obj_end_idx, len(char2))
                        ]).unsqueeze(0).to(device)

                        logits = model(input_ids, attention_mask=attention_mask, subj_positions=subj_positions, obj_positions=obj_positions)
                        probabilities = softmax(logits, dim=1)
                        predicted_label = logits.argmax(dim=1).item()

                        label_map = {0: "isFriendlyOf", 1: "isOpponentOf", 2: "no-Relation"}
                        relationship = label_map[predicted_label]
                        relationships.append(((char1, char2), relationship, sentence))

                        if (char1, char2) not in relationship_counts:
                            relationship_counts[(char1, char2)] = 0
                            relationship_details[(char1, char2)] = []
                            relationship_probabilities[(char1, char2)] = []

                        relationship_counts[(char1, char2)] += 1
                        relationship_details[(char1, char2)].append(sentence)
                        relationship_probabilities[(char1, char2)].append(probabilities[0].tolist())

    final_relationships = {}
    relationship_probs = {}

    characters = characterlist if isinstance(characterlist, list) and all(isinstance(c, str) for c in characterlist) else characterlist[0]
    characters = characters if isinstance(characters, list) else [characters]

    for character1 in characters:
        for character2 in characters:
            character1 = character1.strip()
            character2 = character2.strip()
            if character1 != character2:
                key1 = (character1, character2)
                key2 = (character2, character1)

                counts = {'isFriendlyOf': 0, 'isOpponentOf': 0, 'no-Relation': 0}

                for (key, relationship, description) in relationships:
                    if key == key1 or key == key2:
                        counts[relationship] += 1

                if sum(counts.values()) == 0:
                    continue

                weights = {'isFriendlyOf': 1, 'isOpponentOf': -1, 'no-Relation': 0}
                score = 0
                for rel, count in counts.items():
                    score += count * weights[rel]

                latest_relationship = None

                for (key, relationship, description) in relationships:
                    if key == key1 or key == key2:
                        latest_relationship = (relationship, description)

                relationship_over_time = latest_relationship

                if score > 0:
                    final_relationship = 'isFriendlyOf'
                elif score < 0:
                    final_relationship = 'isOpponentOf'
                else:
                    final_relationship = 'no-Relation'

                final_relationships[(character1, character2)] = final_relationship
                relationship_details[(character1, character2)] = f"{relationship_over_time[1]}"

                probs_list = relationship_probabilities.get((character1, character2), []) + relationship_probabilities.get((character2, character1), [])
                if probs_list:
                    avg_probabilities = torch.mean(torch.tensor(probs_list), dim=0).tolist()
                else:
                    avg_probabilities = [0.0, 0.0, 0.0]
                relationship_probs[(character1, character2)] = avg_probabilities

    scene_relationships = []

    label_map = {0: "isFriendlyOf", 1: "isOpponentOf", 2: "no-Relation"}

    for k, v in final_relationships.items():
        if v == "isFriendlyOf":
            emotions = {"기쁨": 1.0, "분노": 0.0, "중립": 0.0, "놀람": 0.0, "슬픔": 0.0}
        elif v == "isOpponentOf":
            emotions = {"기쁨": 0.0, "분노": 1.0, "중립": 0.0, "놀람": 0.0, "슬픔": 0.0}
        else:
            emotions = {"기쁨": 0.0, "분노": 0.0, "중립": 1.0, "놀람": 0.0, "슬픔": 0.0}

        for emotion, value in emotions.items():
            emotions[emotion] = f"{value * 100:.0f}%"
        details = relationship_details.get(k, "")
        probabilities = relationship_probs.get(k, [0.0, 0.0, 0.0])
        character1, character2 = k
        weighted_probabilities = {label_map[i]: f"{prob * 100:.0f}%" for i, prob in enumerate(probabilities)}

        relationship_info = {
            "character_list": [character1, character2],
            "relationship": weighted_probabilities,
            "details": details,
            "emotions": emotions
        }

        scene_relationships.append(relationship_info)

    return scene_relationships

