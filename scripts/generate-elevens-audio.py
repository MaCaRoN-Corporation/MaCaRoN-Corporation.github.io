import os
import re
import requests

# =========================
# CONFIGURATION
# =========================
# M1-"3JDquces8E8bkmvbh6Bc"
# F1-"wcs09USXSN5Bl7FXohVZ"
# M2-"LIisRj2veIKEBdr6KZ5y"
# F2-"GxhGYQesaQaYKePCZDEC"
# F3-"8kgj5469z1URcH4MB2G4"
# M3-"6wdSVG3CMjPfAthsnMv9"

API_KEY = ""
VOICE_ID = "6wdSVG3CMjPfAthsnMv9"
OUTPUT_DIR = "../src/assets/audio/Male3"
MODEL_ID = "eleven_multilingual_v2"

TEXT_LIST = [
"Omote",
"Ura",
"Ikkyo",
"Nikyo",
"Sankyo",
"Yonkyo",
"Gokyo",
"Irimi nage",
"Shiho nage",
"Kote gaeshi",
"Tenchi nage",
"Uchi kaiten nage",
"Soto kaiten nage",
"Koshi nage",
"Kokyu Nage",
"Sokumen irimi nage",
"Sumi otoshi",
"Aiki otoshi",
"Kubi nage",
"Hiji kime osae",
"Ude garami",
"Ai hanmi katate dori",
"Katate dori",
"Katate ryote dori",
"Ryote dori",
"Katate ryote dori",
"Muna dori",
"Kata dori",
"Kata dori men uchi",
"Mae ryo kata dori",
"Ushiro ryote dori",
"Ushiro katate dori kubishime",
"Ushiro eri dori",
"Ushiro ryo kata dori",
"Shomen uchi",
"Yokomen uchi",
"Chudan tsuki",
"Jodan tsuki",
"Tanto dori",
"Ken taï ken",
"Jo taï jo",
"Jo dori",
"Jo nage",
"Tachi waza",
"Suwari waza",
"Hanmi handachi waza",
"Kumijo",
"Gyaku hanmi katate dori",
"Naname kokyu nage",
"Morote dori",
"Tachi dori",
"Jiyu waza",
"Randori"
]

# =========================
# UTILITAIRES
# =========================

def sanitize_filename(text, max_length=80):
    """
    Nettoie une string pour être utilisée comme nom de fichier
    """
    text = text.lower()
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[^a-z0-9_ -]", "", text)
    text = text.strip().replace(" ", "_")
    return text[:max_length]

# =========================
# GÉNÉRATION AUDIO
# =========================

def generate_audio(text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.6,
            "similarity_boost": 0.8
        }
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code != 200:
        raise Exception(f"Erreur API ElevenLabs ({response.status_code}) : {response.text}")

    return response.content

# =========================
# MAIN
# =========================

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for text in TEXT_LIST:
        filename = sanitize_filename(text) + ".mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)

        print(f"Génération audio : {text}")
        audio_data = generate_audio(text)

        with open(filepath, "wb") as f:
            f.write(audio_data)

        print(f"✔ Sauvegardé : {filepath}")

if __name__ == "__main__":
    main()
