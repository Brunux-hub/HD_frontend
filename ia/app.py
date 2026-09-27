import streamlit as st
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq()

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
            respuesta = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Eres el asistente virtual de Healthy Pets, "
                            "una clínica veterinaria. Responde de forma clara, "
                            "amable y breve. Ayuda con consultas sobre citas, "
                            "servicios veterinarios y atención para mascotas.\n\n"
                            "Datos de la clínica:\n"
                            "- Teléfono: 963400566\n"
                            "- Dirección: Av. Huaylas, Los Olivos 15306\n"
                            "- Horarios: Lunes a Sábado de 10 am a 7 pm\n"
                            "- Servicios: Traumatología, Cirugía abdominal, "
                            "Ecografías, Exodoncias, Baños\n\n"
                            "Usa estos datos para responder consultas. "
                            "Si te preguntan algo que no está en esta "
                            "información, indícalo amablemente."
                        )
                    },
                    {
                        "role": "user",
                        "content": pregunta
                    }
                ]
            )

            st.subheader("Respuesta del asistente")
            st.write(respuesta.choices[0].message.content)

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
