import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()

st.set_page_config(
    page_title="Healthy Pets - Chatbot",
    page_icon="🐾"
)

st.title("🐾 Healthy Pets - Chatbot")
st.write("Asistente virtual para una clínica veterinaria")

st.divider()

pregunta = st.text_input(
    "Escribe tu consulta:",
    placeholder="Ejemplo: ¿Cómo puedo reservar una cita?"
)

if st.button("Enviar consulta"):
    if pregunta:
        try:
            respuesta = client.responses.create(
                model="gpt-5-mini",
                input=(
                    "Eres el asistente virtual de Healthy Pets, "
                    "una clínica veterinaria. Responde de forma clara, "
                    "amable y breve. Ayuda con consultas sobre citas, "
                    "servicios veterinarios y atención para mascotas.\n\n"
                    f"Consulta del cliente: {pregunta}"
                )
            )

            st.subheader("Respuesta del asistente")
            st.write(respuesta.output_text)

        except Exception:
            st.subheader("Respuesta del asistente")
            st.info(
                "Hola, soy el asistente virtual de Healthy Pets. "
                "Puedo ayudarte con información sobre citas, "
                "servicios veterinarios y atención para mascotas. "
                "Para reservar una cita, indícame el nombre de tu mascota "
                "y el servicio que necesitas."
            )

    else:
        st.warning("Por favor, escribe una consulta.")