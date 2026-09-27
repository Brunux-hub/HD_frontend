import streamlit as st
from openai import OpenAI
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage

# Cargar variables del archivo .env
load_dotenv()

# Cliente de OpenAI
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Cliente de Groq
groq_client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)


# --------------------------------------------------
# CONFIGURACIÓN DE LA PÁGINA
# --------------------------------------------------

st.set_page_config(
    page_title="Healthy Pets - Centro de IA",
    page_icon="🐾"
)

st.title("🐾 Healthy Pets")
st.subheader("Centro de Inteligencia Artificial")

st.write(
    "Selecciona una de las funcionalidades disponibles "
    "para trabajar con las herramientas de IA del sistema."
)

st.divider()


# --------------------------------------------------
# MENÚ PRINCIPAL
# --------------------------------------------------

opcion = st.radio(
    "Selecciona una opción:",
    [
        "🤖 Chatbot",
        "🎙️ Transcripción de audio",
        "⚙️ Productividad"
    ]
)

st.divider()


# ==================================================
# CHATBOT CON GROQ
# ==================================================

if opcion == "🤖 Chatbot":

    st.header("🤖 Chatbot de Healthy Pets")

    st.write(
        "Asistente virtual para consultas sobre "
        "citas, servicios y atención veterinaria."
    )

    pregunta = st.text_input(
        "Escribe tu consulta:",
        placeholder="Ejemplo: ¿Cómo puedo reservar una cita?"
    )

    if st.button("Enviar consulta"):

        if pregunta:

            try:

                respuesta = groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Eres el asistente virtual de Healthy Pets, "
                                "una clínica veterinaria. "
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

                st.subheader("Respuesta del asistente")

                st.write(
                    respuesta.choices[0].message.content
                )

            except Exception as error:

                st.error(
                    "No se pudo obtener una respuesta de Groq."
                )

                st.write(
                    f"Detalle del error: {error}"
                )

        else:

            st.warning(
                "Por favor, escribe una consulta."
            )


# ==================================================
# TRANSCRIPCIÓN DE AUDIO CON OPENAI
# ==================================================

elif opcion == "🎙️ Transcripción de audio":

    st.header("🎙️ Transcripción de audio")

    st.write(
        "Selecciona un archivo de audio para realizar "
        "una transcripción."
    )

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
                    "La API de OpenAI no está configurada."
                )

            else:

                try:

                    client = OpenAI(
                        api_key=api_key
                    )

                    with open(
                        "audio_temp",
                        "wb"
                    ) as archivo:

                        archivo.write(
                            audio.getbuffer()
                        )

                    with open(
                        "audio_temp",
                        "rb"
                    ) as archivo:

                        transcripcion = (
                            client.audio.transcriptions.create(
                                model="gpt-transcribe",
                                file=archivo
                            )
                        )

                    st.subheader(
                        "Transcripción"
                    )

                    st.success(
                        "Audio transcrito correctamente."
                    )

                    st.write(
                        transcripcion.text
                    )

                except Exception as error:

                    st.subheader(
                        "Resultado de la prueba"
                    )

                    st.warning(
                        "La aplicación se conectó con la "
                        "API de OpenAI, pero la transcripción "
                        "no pudo completarse."
                    )

                    st.caption(
                        f"Detalle técnico: {error}"
                    )


# ==================================================
# PRODUCTIVIDAD CON GROQ
# ==================================================

elif opcion == "⚙️ Productividad":

    st.header(
        "⚙️ Asistente de Productividad"
    )


    # --------------------------------------------------
    # ASISTENTE CON GROQ
    # --------------------------------------------------

    st.subheader(
        "🤖 Asistente de Productividad con Groq"
    )

    consulta = st.text_input(
        "Escribe una consulta para el asistente"
    )

    if st.button(
        "Consultar asistente"
    ):

        if consulta:

            try:

                respuesta = groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente de productividad "
                                "de Healthy Pets. Ayudas al personal "
                                "de una clínica veterinaria a redactar "
                                "mensajes, correos y respuestas para "
                                "clientes. "
                                "Responde de manera clara, profesional, "
                                "natural y amable."
                            )
                        },
                        {
                            "role": "user",
                            "content": consulta
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
                "Escribe una consulta."
            )


    st.divider()


    # --------------------------------------------------
    # GENERACIÓN DE MENSAJE
    # --------------------------------------------------

    st.subheader(
        "💬 Generación de mensaje automático"
    )

    nombre_cliente = st.text_input(
        "Nombre del cliente"
    )

    nombre_mascota = st.text_input(
        "Nombre de la mascota"
    )

    servicio = st.text_input(
        "Servicio solicitado"
    )

    if st.button(
        "Generar mensaje"
    ):

        if (
            nombre_cliente
            and nombre_mascota
            and servicio
        ):

            try:

                respuesta_mensaje = groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente de comunicación "
                                "de una clínica veterinaria. "
                                "Redacta mensajes cortos, naturales, "
                                "amables y profesionales para clientes."
                            )
                        },
                        {
                            "role": "user",
                            "content": (
                                f"Redacta un mensaje para el cliente "
                                f"{nombre_cliente}. "
                                f"Su mascota se llama {nombre_mascota} "
                                f"y el servicio solicitado es "
                                f"{servicio}. "
                                f"El mensaje debe ser amable y profesional."
                            )
                        }
                    ]
                )

                mensaje = (
                    respuesta_mensaje
                    .choices[0]
                    .message
                    .content
                )

                st.subheader(
                    "Mensaje generado por IA"
                )

                st.success(
                    mensaje
                )

            except Exception as error:

                st.error(
                    "No se pudo generar el mensaje con Groq."
                )

                st.caption(
                    f"Detalle técnico: {error}"
                )

        else:

            st.warning(
                "Completa todos los campos."
            )


    st.divider()


    # --------------------------------------------------
    # GENERACIÓN DE CORREO CON GROQ
    # --------------------------------------------------

    st.subheader(
        "📧 Generación y envío de correo automático"
    )

    destinatario = st.text_input(
        "Correo del destinatario"
    )

    asunto = st.text_input(
        "Asunto del correo"
    )

    if st.button(
        "Generar correo"
    ):

        if destinatario and asunto:

            try:

                respuesta_correo = groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente profesional "
                                "de comunicación de Healthy Pets. "
                                "Redacta correos claros, naturales, "
                                "amables y profesionales."
                            )
                        },
                        {
                            "role": "user",
                            "content": (
                                f"Redacta un correo para "
                                f"{destinatario}. "
                                f"El asunto es: {asunto}. "
                                f"El correo debe informar que "
                                f"Healthy Pets ha registrado "
                                f"correctamente la solicitud del "
                                f"cliente y que el equipo se "
                                f"pondrá en contacto para continuar "
                                f"con la atención de su mascota."
                            )
                        }
                    ]
                )

                correo = (
                    respuesta_correo
                    .choices[0]
                    .message
                    .content
                )

                st.session_state["correo_generado"] = correo
                st.session_state["destinatario"] = destinatario
                st.session_state["asunto"] = asunto

                st.subheader(
                    "Correo generado por IA"
                )

                st.code(
                    correo
                )

            except Exception as error:

                st.error(
                    "No se pudo generar el correo con Groq."
                )

                st.caption(
                    f"Detalle del error: {error}"
                )

        else:

            st.warning(
                "Completa el destinatario y el asunto."
            )

    # --------------------------------------------------
    # ENVÍO REAL DEL CORREO
    # --------------------------------------------------

    if "correo_generado" in st.session_state:

        st.divider()

        st.subheader(
            "📨 Envío real del correo"
        )

        st.write(
            "El correo ya fue generado. "
            "Pulsa el botón para enviarlo al destinatario."
        )

        if st.button(
            "📨 Enviar correo real"
        ):

            correo_emisor = os.getenv("GMAIL_USER")
            clave_aplicacion = os.getenv("GMAIL_APP_PASSWORD")

            if not correo_emisor or not clave_aplicacion:

                st.error(
                    "Faltan las credenciales de correo. "
                    "Configura GMAIL_USER y GMAIL_APP_PASSWORD "
                    "en el archivo .env."
                )

            else:

                try:

                    mensaje = EmailMessage()

                    mensaje["From"] = correo_emisor
                    mensaje["To"] = st.session_state["destinatario"]
                    mensaje["Subject"] = st.session_state["asunto"]

                    mensaje.set_content(
                        st.session_state["correo_generado"]
                    )

                    with smtplib.SMTP(
                        "smtp.gmail.com",
                        587
                    ) as servidor:

                        servidor.starttls()

                        servidor.login(
                            correo_emisor,
                            clave_aplicacion
                        )

                        servidor.send_message(
                            mensaje
                        )

                    st.success(
                        "✅ Correo enviado correctamente."
                    )

                except Exception as error:

                    st.error(
                        "No se pudo enviar el correo."
                    )

                    st.caption(
                        f"Detalle técnico: {error}"
                    )