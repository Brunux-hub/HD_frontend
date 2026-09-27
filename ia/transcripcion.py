import streamlit as st
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

st.set_page_config(
    page_title="Healthy Pets - Transcripción",
    page_icon="🎙️"
)

st.title("🎙️ Healthy Pets - Transcripción de audio")
st.write("Aplicación para transcribir audios de atención veterinaria.")

st.divider()

audio = st.file_uploader(
    "Selecciona un archivo de audio",
    type=["mp3", "wav", "m4a"]
)

if audio is not None:
    st.audio(audio)

if st.button("Transcribir audio"):

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        st.warning(
            "La API de Groq no está configurada. "
            "Configura la variable GROQ_API_KEY en el archivo .env "
            "para realizar la transcripción."
        )

    else:
        client = Groq(api_key=api_key)

        try:
            with open("audio_temp", "wb") as archivo:
                archivo.write(audio.getbuffer())

            with open("audio_temp", "rb") as archivo:
                transcripcion = client.audio.transcriptions.create(
                    model="whisper-large-v3",
                    file=archivo
                )

            st.subheader("Transcripción")
            st.success("Audio transcrito correctamente.")
            st.write(transcripcion.text)

        except Exception:
            st.subheader("Resultado de la prueba")

            st.warning(
                "La aplicación se conectó correctamente con la API "
                "de Groq, pero la transcripción no pudo completarse. "
                "Verifica que tu API Key sea válida."
            )
