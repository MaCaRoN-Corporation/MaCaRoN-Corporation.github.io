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

TEXT_LIST = [
'<phoneme alphabet="ipa" ph="omote">Omote</phoneme>',
'<phoneme alphabet="ipa" ph="ɯɾa">Ura</phoneme>',
'<phoneme alphabet="ipa" ph="ikːjo">Ikkyo</phoneme>',
'<phoneme alphabet="ipa" ph="nikʲo">Nikyo</phoneme>',
'<phoneme alphabet="ipa" ph="saŋkʲo">Sankyo</phoneme>',
'<phoneme alphabet="ipa" ph="joŋkʲo">Yonkyo</phoneme>',
'<phoneme alphabet="ipa" ph="ɡokʲo">Gokyo</phoneme>',
'<phoneme alphabet="ipa" ph="iɾimi naɡe">Irimi nage</phoneme>',
'<phoneme alphabet="ipa" ph="ɕiho naɡe">Shiho nage</phoneme>',
'<phoneme alphabet="ipa" ph="kote ɡaeɕi">Kote gaeshi</phoneme>',
'<phoneme alphabet="ipa" ph="teɴtɕi naɡe">Tenchi nage</phoneme>',
'<phoneme alphabet="ipa" ph="ɯtɕi kaiten naɡe">Uchi kaiten nage</phoneme>',
'<phoneme alphabet="ipa" ph="soto kaiten naɡe">Soto kaiten nage</phoneme>',
'<phoneme alphabet="ipa" ph="koɕi naɡe">Koshi nage</phoneme>',
'<phoneme alphabet="ipa" ph="kokʲɯː naɡe">Kokyu nage</phoneme>',
'<phoneme alphabet="ipa" ph="sokɯmeɴ iɾimi naɡe">Sokumen irimi nage</phoneme>',
'<phoneme alphabet="ipa" ph="sɯmi otoɕi">Sumi otoshi</phoneme>',
'<phoneme alphabet="ipa" ph="aiki otoɕi">Aiki otoshi</phoneme>',
'<phoneme alphabet="ipa" ph="kɯbi naɡe">Kubi nage</phoneme>',
'<phoneme alphabet="ipa" ph="hiji kime osae">Hiji kime osae</phoneme>',
'<phoneme alphabet="ipa" ph="ɯde ɡaɾami">Ude garami</phoneme>',
'<phoneme alphabet="ipa" ph="ai hanmi katate doɾi">Ai hanmi katate dori</phoneme>',
'<phoneme alphabet="ipa" ph="katate doɾi">Katate dori</phoneme>',
'<phoneme alphabet="ipa" ph="katate ɾʲote doɾi">Katate ryote dori</phoneme>',
'<phoneme alphabet="ipa" ph="ɾʲote doɾi">Ryote dori</phoneme>',
'<phoneme alphabet="ipa" ph="katate ɾʲote doɾi">Katate ryote dori</phoneme>',
'<phoneme alphabet="ipa" ph="mɯna doɾi">Muna dori</phoneme>',
'<phoneme alphabet="ipa" ph="kata doɾi">Kata dori</phoneme>',
'<phoneme alphabet="ipa" ph="kata doɾi meɴ ɯtɕi">Kata dori men uchi</phoneme>',
'<phoneme alphabet="ipa" ph="mae ɾʲo kata doɾi">Mae ryo kata dori</phoneme>',
'<phoneme alphabet="ipa" ph="ɯɕiɾo ɾʲote doɾi">Ushiro ryote dori</phoneme>',
'<phoneme alphabet="ipa" ph="ɯɕiɾo katate doɾi kɯbiɕime">Ushiro katate dori kubishime</phoneme>',
'<phoneme alphabet="ipa" ph="ɯɕiɾo eɾi doɾi">Ushiro eri dori</phoneme>',
'<phoneme alphabet="ipa" ph="ɯɕiɾo ɾʲo kata doɾi">Ushiro ryo kata dori</phoneme>',
'<phoneme alphabet="ipa" ph="ɕomen ɯtɕi">Shomen uchi</phoneme>',
'<phoneme alphabet="ipa" ph="jokomen ɯtɕi">Yokomen uchi</phoneme>',
'<phoneme alphabet="ipa" ph="tɕɯːdaɴ tsɯki">Chudan tsuki</phoneme>',
'<phoneme alphabet="ipa" ph="dʑoːdaɴ tsɯki">Jodan tsuki</phoneme>',
'<phoneme alphabet="ipa" ph="taɴto doɾi">Tanto dori</phoneme>',
'<phoneme alphabet="ipa" ph="keɴ tai keɴ">Ken tai ken</phoneme>',
'<phoneme alphabet="ipa" ph="dʑo tai dʑo">Jo tai jo</phoneme>',
'<phoneme alphabet="ipa" ph="dʑo doɾi">Jo dori</phoneme>',
'<phoneme alphabet="ipa" ph="dʑo naɡe">Jo nage</phoneme>',
'<phoneme alphabet="ipa" ph="tatɕi waza">Tachi waza</phoneme>',
'<phoneme alphabet="ipa" ph="sɯwaɾi waza">Suwari waza</phoneme>',
'<phoneme alphabet="ipa" ph="haɴmi handatɕi waza">Hanmi handachi waza</phoneme>',
'<phoneme alphabet="ipa" ph="kɯmidʑo">Kumijo</phoneme>',
'<phoneme alphabet="ipa" ph="ɡʲakɯ hanmi katate doɾi">Gyaku hanmi katate dori</phoneme>',
'<phoneme alphabet="ipa" ph="naname kokʲɯː naɡe">Naname kokyu nage</phoneme>',
'<phoneme alphabet="ipa" ph="moɾote doɾi">Morote dori</phoneme>',
'<phoneme alphabet="ipa" ph="tatɕi doɾi">Tachi dori</phoneme>',
'<phoneme alphabet="ipa" ph="dʑijɯː waza">Jiyu waza</phoneme>',
'<phoneme alphabet="ipa" ph="ɾaɴdoɾi">Randori</phoneme>',
'<phoneme alphabet="ipa" ph="ɡʲakɯ jokomen">Gyaku Yokomen</phoneme>'
]

# =========================
# UTILITAIRES
# =========================

def extract_display_text(ssml_text):
    """
    Extrait le texte lisible depuis une balise phoneme
    Exemple :
    <phoneme ...>Omote</phoneme> -> Omote
    """
    match = re.search(r">(.*?)<", ssml_text)
    if not match:
        raise ValueError(f"Impossible d'extraire le texte depuis : {ssml_text}")
    return match.group(1)


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

def generate_audio(ssml_text):
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"

    headers = {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    }

    payload = {
        "text": ssml_text,
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

    for ssml_text in TEXT_LIST:
        display_text = extract_display_text(ssml_text)
        filename = sanitize_filename(display_text) + ".mp3"
        filepath = os.path.join(OUTPUT_DIR, filename)

        print(f"Génération audio : {display_text}")
        audio_data = generate_audio(ssml_text)

        with open(filepath, "wb") as f:
            f.write(audio_data)

        print(f"✔ Sauvegardé : {filepath}")


if __name__ == "__main__":
    main()
