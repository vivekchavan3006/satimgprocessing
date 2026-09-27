import json
import os
import time
from deep_translator import GoogleTranslator

# The list of target languages and their codes for Google Translate
languages = {
    'hi': 'hi',
    'mr': 'mr',
    'bn': 'bn',
    'ta': 'ta',
    'te': 'te',
    'kn': 'kn',
    'ml': 'ml',
    'gu': 'gu',
    'pa': 'pa',
    'ur': 'ur',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'pt': 'pt',
    'it': 'it',
    'nl': 'nl',
    'ru': 'ru',
    'uk': 'uk',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    'ja': 'ja',
    'ko': 'ko',
    'ar': 'ar',
    'tr': 'tr',
    'id': 'id',
    'vi': 'vi',
    'th': 'th'
}

def translate_dict(d, translator):
    translated = {}
    for k, v in d.items():
        if isinstance(v, dict):
            translated[k] = translate_dict(v, translator)
        elif isinstance(v, str):
            try:
                translated[k] = translator.translate(v)
            except Exception as e:
                print(f"Error translating '{v}': {e}")
                translated[k] = v # fallback to original
        else:
            translated[k] = v
    return translated

def main():
    base_path = os.path.join('public', 'locales')
    en_file = os.path.join(base_path, 'en.json')
    
    with open(en_file, 'r', encoding='utf-8') as f:
        en_data = json.load(f)
        
    for lang_code, google_code in languages.items():
        out_file = os.path.join(base_path, f'{lang_code}.json')
        if os.path.exists(out_file):
            print(f"Skipping {lang_code}, file already exists.")
            continue
            
        print(f"Translating to {lang_code}...")
        translator = GoogleTranslator(source='en', target=google_code)
        translated_data = translate_dict(en_data, translator)
        
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(translated_data, f, ensure_ascii=False, indent=2)
            
        time.sleep(1) # Be nice to the API

if __name__ == "__main__":
    main()
