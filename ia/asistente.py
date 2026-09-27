import streamlit as st
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq()


st.set_page_config(
    page_title="Healthy Pets - Asistente",
    page_icon="🐾"
)


st.title("🐾 Healthy Pets - Asistente")
st.write(
    "Asistente virtual para una clínica veterinaria"
)

st.divider()


pregunta = st.text_input(
    "Escribe tu consulta:",
    placeholder="Ejemplo: ¿Cómo puedo reservar una cita?"
)


if st.button("Enviar consulta"):

    if pregunta:

        try:

            respuesta = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Eres el asistente virtual de "
                            "Healthy Pets, una clínica veterinaria. "
                            "Responde de forma clara, natural, "
                            "amable y breve. "
                            "Ayuda con consultas sobre citas, "
                            "servicios veterinarios y atención "
                            "para mascotas. "
                            "No inventes información específica "
                            "sobre horarios, precios o disponibilidad."
                        )
                    },
                    {
                        "role": "user",
                        "content": pregunta
                    }
                ]
            )

            st.subheader(
                "Respuesta del asistente"
            )

            st.write(
                respuesta.choices[0].message.content
            )

        except Exception as error:

            st.error(
                "No se pudo obtener una respuesta de Groq."
            )

            st.caption(
                f"Detalle técnico: {error}"
            )

    else:

        st.warning(
            "Por favor, escribe una consulta."
        )