import os
import re
import requests

# =========================
# CONFIGURATION
# =========================
# JAPANESE VOICES
# M1-"3JDquces8E8bkmvbh6Bc" --> A regéner si liste des techniques actuellement ok
# M2-"LIisRj2veIKEBdr6KZ5y" --> A regéner si liste des techniques actuellement ok
# M3-"6wdSVG3CMjPfAthsnMv9" --> A regéner si liste des techniques actuellement ok
# F1-"wcs09USXSN5Bl7FXohVZ" --> A regéner si liste des techniques actuellement ok
# F2-"GxhGYQesaQaYKePCZDEC" --> A regéner si liste des techniques actuellement ok
# F3-"8kgj5469z1URcH4MB2G4" --> A regéner si liste des techniques actuellement ok
# FRENCH VOICES
# M1-"MIuhjMla9d1GsjEn0qCp"
# M2-"zNijNwkR2nhHrbrmJITT"
# M3-"w4FDa0ya9UrortMOEDXi"
# F1-"Da9VfudgKUvFOKayCiue"
# F2-"YxrwjAKoUKULGd0g8K9Y"
# F3-"12CHcREbuPdJY02VY7zT"

API_KEY = ""
VOICE_ID = "12CHcREbuPdJY02VY7zT"
OUTPUT_DIR = "../src/assets/audio/French/Female3"
MODEL_ID = "eleven_multilingual_v2"

# TEXT_LIST = [
# "Omote",
# "Ura",
# "Ikkyo",
# "Nikyo",
# "Sankyo",
# "Yonkyo",
# "Gokyo",
# "Irimi nage",
# "Shiho nage",
# "Kote gaeshi",
# "Tenchi nage",
# "Uchi kaiten nage",
# "Soto kaiten nage",
# "Koshi nage",
# "Kokyu Nage",
# "Sokumen irimi nage",
# "Sumi otoshi",
# "Aiki otoshi",
# "Kubi nage",
# "Hiji kime osae",
# "Ude garami",
# "Ai hanmi katate dori",
# "Katate dori",
# "Katate ryote dori",
# "Ryote dori",
# "Katate ryote dori",
# "Muna dori",
# "Kata dori",
# "Kata dori men uchi",
# "Mae ryo kata dori",
# "Ushiro ryote dori",
# "Ushiro katate dori kubishime",
# "Ushiro eri dori",
# "Ushiro ryo kata dori",
# "Shomen uchi",
# "Yokomen uchi",
# "Chudan tsuki",
# "Jodan tsuki",
# "Tanto dori",
# "Ken taï ken",
# "Jo taï jo",
# "Jo dori",
# "Jo nage",
# "Tachi waza",
# "Suwari waza",
# "Hanmi handachi waza",
# "Kumijo",
# "Gyaku hanmi katate dori",
# "Naname kokyu nage",
# "Morote dori",
# "Tachi dori",
# "Jiyu waza",
# "Randori",
# "Gyaku Yokomen"
# ]

TEXT_MAP = {
    "Omote": "Omotè",
    "Ura": "Oura",
    "Ikkyo": "Ikkyo",
    "Nikyo": "Nikkyo",
    "Sankyo": "Sankyo",
    "Yonkyo": "Yonkyo",
    "Gokyo": "Gokyo",
    "Irimi nage": "Irimi nagué",
    "Shiho nage": "Shiho nagué",
    "Kote gaeshi": "Koté gaéshi",
    "Tenchi nage": "Tentchi nagué",
    "Uchi kaiten nage": "Utchi kaïtèn nagué",
    "Soto kaiten nage": "Soto kaïtèn nagué",
    "Koshi nage": "Koshi nagué",
    "Kokyu nage": "Kokyou nagué",
    "Sokumen irimi nage": "Sokoumen irimi nagué",
    "Sumi otoshi": "Soumi otoshi",
    "Aiki otoshi": "Aïki otoshi",
    "Kubi nage": "Koubi nagué",
    "Hiji kime osae": "Hiji kimé ossaé",
    "Ude garami": "Oudé garami",
    "Ai hanmi katate dori": "Aï hanmi kataté dori",
    "Katate dori": "Kataté dori",
    "Katate ryote dori": "Kataté ryoté dori",
    "Ryote dori": "Ryoté dori",
    "Muna dori": "Mouna dori",
    "Kata dori": "Kata dori",
    "Kata dori men uchi": "Kata dori men utchi",
    "Mae ryo kata dori": "Maé ryo kata dori",
    "Ushiro ryote dori": "Oushiro ryoté dori",
    "Ushiro katate dori kubishime": "Oushiro kataté dori koubishimé",
    "Ushiro eri dori": "Oushiro éri dori",
    "Ushiro ryo kata dori": "Oushiro ryo kata dori",
    "Shomen uchi": "Shomèn utchi",
    "Yokomen uchi": "Yokomèn utchi",
    "Chudan tsuki": "Tchoudan tsuki",
    "Jodan tsuki": "Yodan tsuki",
    "Tanto dori": "Tanto dori",
    "Ken tai ken": "Ken taï ken",
    "Jo tai jo": "Djo taï Djo",
    "Jo dori": "Djo dori",
    "Jo nage": "Djo nagué",
    "Tachi waza": "Tatchi waza",
    "Suwari waza": "Souwari waza",
    "Hanmi handachi waza": "Hanmi handatchi waza",
    "Kumijo": "KoumiDjo",
    "Gyaku hanmi katate dori": "Gyakou hanmi kataté dori",
    "Naname kokyu nage": "Nanamé kokyou nagué",
    "Morote dori": "Moroté dori",
    "Tachi dori": "Tatchi dori",
    "Jiyu waza": "Djiyou waza",
    "Randori": "Randori",
    "Gyaku Yokomen": "Gyakou yokomèn"
}

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
        raise Exception(
            f"Erreur API ElevenLabs ({response.status_code}) : {response.text}"
        )

    return response.content

# =========================
# MAIN
# =========================

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for filename_label, tts_text in TEXT_MAP.items():
        filename = sanitize_filename(filename_label) + ".mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)

        print(f"Génération audio : {filename_label} -> « {tts_text} »")
        audio_data = generate_audio(tts_text)

        with open(filepath, "wb") as f:
            f.write(audio_data)

        print(f"✔ Sauvegardé : {filepath}")

if __name__ == "__main__":
    main()