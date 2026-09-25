import streamlit as st

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
        respuesta = (
            "Hola, soy el asistente virtual de Healthy Pets. "
            "Puedo ayudarte con información sobre citas, "
            "servicios veterinarios y atención para mascotas."
        )

        st.subheader("Respuesta del asistente")
        st.write(respuesta)

    else:
        st.warning("Por favor, escribe una consulta.")