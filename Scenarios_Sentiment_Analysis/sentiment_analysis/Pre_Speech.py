def get_previous_speech(dialogues, number):
    if number == 1:
        return []
    return dialogues[number - 2]['Speech']