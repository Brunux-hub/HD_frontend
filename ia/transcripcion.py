import streamlit as st
import os
from dotenv import load_dotenv
from openai import OpenAI

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

        api_key = os.getenv("OPENAI_API_KEY")

        if not api_key:
            st.warning(
                "La API de OpenAI no está configurada. "
                "La interfaz está lista para realizar la transcripción "
                "cuando se disponga de una API Key."
            )
        else:
            client = OpenAI(api_key=api_key)

            with open("audio_temp", "wb") as archivo:
                archivo.write(audio.getbuffer())

            with open("audio_temp", "rb") as archivo:
                transcripcion = client.audio.transcriptions.create(
                    model="gpt-4o-transcribe",
                    file=archivo
                )

            st.subheader("Transcripción")
            st.write(transcripcion.text)