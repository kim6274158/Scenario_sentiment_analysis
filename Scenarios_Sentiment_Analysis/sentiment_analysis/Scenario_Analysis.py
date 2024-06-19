import sentiment_analysis.Character_Features as cf
from sentiment_analysis.Sentiment_Analysis import sentiment_analysis
from sentiment_analysis.Vocabulary_explore import register_morphemes_to_kiwi, analyze_sentence_emotions
from sentiment_analysis.Situation_analysis import create_bigram_network, draw_network_graph,get_emotions
from sentiment_analysis.Recipient_Definition import parse_dialogue, process_dialogue, find_recipient
from sentiment_analysis.Pre_Speech import get_previous_speech

import re
from collections import Counter
import pandas as pd

def part_of_scene(text):
    scene_pattern = re.compile(r'^-\d+\..+?\n|^\d+\..+?\n', re.MULTILINE)
    scenes = scene_pattern.findall(text)
    scene_texts = re.split(scene_pattern, text)[1:]
    scene_text_pairs = [(scene.strip(), scene_text.strip()) for scene, scene_text in zip(scenes, scene_texts)]
    return scene_texts, scene_text_pairs

def find_recipients(data, number):
    for item in data:
        if item['number'] == number:
            return item['Recipients']
    return []

def dialogue(scene_text, current_situation, character_list, character_num, processed_dialogues):
    
    json_file_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정어휘형태소사전.json'

    dialogue_pattern = re.compile(r'([^:\n]+):\s*(.*?)(?=\n|$)', re.MULTILINE)
    dialogues = []
    dialogue_num = 1
    
    for match in dialogue_pattern.findall(scene_text):
        character, dialogue = match
        dialogue_options = dialogue_option(dialogue)
        dialogues.append({
            'prev_situation': current_situation,
            'character_list': character_list,
            'character_num': character_num,
            'dialogue_num': dialogue_num,
            'character': character.strip(),
            'dialogue': dialogue.strip(),
            'dialogue_option': dialogue_options,
            'sentiment_analysis': sentiment_analysis(dialogue.strip()),
            'Emotion_vocab': analyze_sentence_emotions(dialogue.strip(), json_file_path)[0],
            'Emotion_usage': {key: f"{value:.3f}" for key, value in analyze_sentence_emotions(dialogue.strip(), json_file_path)[1].items()},
            #'situation_analysis': get_emotions(situation_emotions, character.strip()),
            'Recipients' : processed_dialogues
        })
        dialogue_num += 1
    return dialogues

def dialogue_option(dialogue):
    dialogue_option_pattern = re.compile(r'\((.*?)\)')
    dialogue_options = dialogue_option_pattern.findall(dialogue)
    return dialogue_options

def scene_situation(scene_text, character_list, character_num):
    json_file_path = 'C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\감정어휘형태소사전.json'
    openApiURL = "open_key"
    accessKey = "access_key"
    
    #print("scene_text: ", scene_text)
    #print("end")
    #print("chracter_num: ", character_num)
    #print("end")
    model_path = "C:\Scenarios_Sentiment_Analysis\Model_and_Dictionary\응답발화모델\응답발화모델-2e-05"
    parsed_dialogue = parse_dialogue(scene_text)
    processed_dialogues = process_dialogue(parsed_dialogue, character_num, model_path)
    #print("processed_dialogues: ", processed_dialogues)
    
    
    sentences = re.split(r'\n+', scene_text.strip())
    situations = []
    situation_list = []
    situation = ""
    prev_situations = []
    situation_num = 1
    dialogue_num = 1
    
    
    for sentence in sentences:
        if ":" not in sentence:
            situation += sentence.strip() + " "
        else:
            if situation:
                # 1. 상황 분석
                character_list = [character.strip() for character in character_list]
                #network_graph, characters_emotions = create_bigram_network(situation.strip(), character_list, openApiURL, accessKey, json_file_path)
                #이미지 저장: draw_network_graph(network_graph, directory_path, title)
                
                situations.append({'Situation': situation.strip(), 'SituationNum': situation_num, 'dialogues': []})
                situation = ""
                situation_num += 1
                dialogue_num = 1
        if ":" in sentence:
            dialogue_list = dialogue(sentence, situation.strip(), character_list, character_num, processed_dialogues)
            if situations:
                for dialogue_item in dialogue_list:
                    dialogue_item['dialogue_num'] = dialogue_num
                    dialogue_num += 1
                situations[-1]['dialogues'].extend(dialogue_list)
            else:
                prev_situations.append({'prev_situation': "", 'dialogue': dialogue_list})
    if situation:
        situations.append({'Situation': situation.strip(), 'SituationNum': situation_num, 'dialogues': []})
        situation_num += 1
        dialogue_num = 1
    for idx, situation in enumerate(situations):
        if isinstance(situation, str) and ':' in situation:
            dialogue_list = dialogue(situation, situation.strip(), character_list, character_num, processed_dialogues)
            if situation_list:
                situation_list[-1]['dialogues'] = dialogue_list
            else:
                prev_situations.append({'prev_situation': "", 'dialogue': dialogue_list})
        else:
            situation_list.append(situation)
    return situation_list, prev_situations

def extract_characters(scene_text):
    dialogue_pattern = re.compile(r'([^:\n]+):\s*(.*?)(?=\n|$)', re.MULTILINE)
    characters = [character for character, _ in dialogue_pattern.findall(scene_text)]
    character_counts = Counter(characters)
    sorted_characters = sorted(character_counts.items(), key=lambda x: x[1], reverse=True)
    return [character for character, count in sorted_characters], len(sorted_characters)

def parse_text(text):
    scene_texts, scene_text_pairs = part_of_scene(text)
    scenes_data = []
    
    recent_positive_integer = None
    
    for i, (scene, scene_text) in enumerate(scene_text_pairs):
        scene_num_part = scene.split('.', 1)
        if len(scene_num_part) == 2:
            scene_num = int(scene_num_part[0])
            scenes_nm = scene_num_part[1].strip()
        else:
            scene_num = int(scene)
            scenes_nm = ""
        
        if scene_num < 0:
            if recent_positive_integer is not None:
                sub_scene_num = abs(scene_num) / 10
                scene_num = recent_positive_integer + sub_scene_num
            else:
                scene_num = str(scene_num)
        
        else:
            recent_positive_integer = scene_num
        
        character_list, character_num = extract_characters(scene_text)
        
        scene_dict = {
            'sceneNum': str(scene_num),
            'scenes_nm': scenes_nm,
            'character_list': character_list,
            'character_num': character_num,
            'Situations': []
        }
        
        situation_list, prev_situations = scene_situation(scene_text, character_list, character_num)
        for situation in situation_list:
            for dialogue in situation['dialogues']:
                dialogue['prev_situation'] = situation['Situation']
            scene_dict['Situations'].append({
                'SituationNum': situation['SituationNum'],
                'Situation': situation['Situation'],
                'dialogues': situation['dialogues']
            })
        
        scenes_data.append(scene_dict)
    
    return scenes_data