from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

def parse_dialogue(scene_text):
    lines = scene_text.strip().split('\n')
    dialogue_lines = [line for line in lines if ':' in line]
    dialogue = []
    for i, line in enumerate(dialogue_lines):
        character, speech = line.split(' : ')
        dialogue.append({'number': i+1, 'character': character, 'Speech': speech.strip()})

    return dialogue


def add_recipients(parsed_dialogue):
    enhanced_dialogue = []
    for i, dialogue in enumerate(parsed_dialogue):
        new_dialogue = dialogue.copy()
        if i < len(parsed_dialogue) - 1:
            new_dialogue['Recipients'] = parsed_dialogue[i + 1]['character']
        else:
            new_dialogue['Recipients'] = parsed_dialogue[i - 1]['character']

        enhanced_dialogue.append(new_dialogue)

    return enhanced_dialogue

from transformers import pipeline, AutoModelForSequenceClassification, AutoTokenizer

def assign_recipients(dialogue, model_path):
    model = AutoModelForSequenceClassification.from_pretrained(model_path)
    tokenizer = AutoTokenizer.from_pretrained(model_path)

    classifier = pipeline(
        "text-classification",
        model=model,
        tokenizer=tokenizer,
        return_all_scores=True
    )

    def test_question_answer(question, answer):
        input_text = f"{question} {tokenizer.sep_token} {answer}"
        results = classifier(input_text)
        return results

    for entry in dialogue:
        entry['Recipients'] = None

    for i in range(len(dialogue)):
        for j in range(i + 1, len(dialogue)):
            if dialogue[i]['character'] != dialogue[j]['character']:
                score = test_question_answer(dialogue[i]['Speech'], dialogue[j]['Speech'])
                if score[0][1]['score'] >= 0.8:
                    if dialogue[i]['Recipients'] is None:
                        dialogue[i]['Recipients'] = dialogue[j]['character']
                    if dialogue[j]['Recipients'] is None:
                        dialogue[j]['Recipients'] = dialogue[i]['character']

    return dialogue

def process_dialogue(parsed_dialogue, character_num, model_path):
    if character_num == 0:
        return []
    if character_num == 1:
        return []
    if character_num == 2:
        return add_recipients(parsed_dialogue)
    else:
        return assign_recipients(parsed_dialogue, model_path)
    
def find_recipient(dialogues, number):
    for dialogue in dialogues:
        if dialogue["number"] == number:
            return dialogue["Recipients"]
    return "Number not found in the dialogues"