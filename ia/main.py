import streamlit as st
import os
import smtplib
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from groq import Groq
from twilio.rest import Client as TwilioClient

load_dotenv()

groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
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
                                "para mascotas.\n\n"
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
# TRANSCRIPCIÓN DE AUDIO CON GROQ
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

            api_key = os.getenv("GROQ_API_KEY")

            if not api_key:

                st.warning(
                    "La API de Groq no está configurada. "
                    "Configura GROQ_API_KEY en el archivo .env"
                )

            else:

                try:

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
                            groq_client.audio.transcriptions.create(
                                model="whisper-large-v3",
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
                        "La transcripción no pudo completarse. "
                        "Verifica que tu GROQ_API_KEY sea válida."
                    )

                    st.caption(
                        f"Detalle técnico: {error}"
                    )


# ==================================================
# PRODUCTIVIDAD CON GROQ
# ==================================================

elif opcion == "⚙️ Productividad":

    st.header("⚙️ Gestión de Citas")

    if "citas_pendientes" not in st.session_state:
        st.session_state["citas_pendientes"] = []

    # --------------------------------------------------
    # FUNCIONES AUXILIARES
    # --------------------------------------------------

    def enviar_correo(destinatario, asunto, cuerpo):
        gmail_user = os.getenv("GMAIL_USER")
        gmail_password = os.getenv("GMAIL_APP_PASSWORD")

        if not gmail_user or not gmail_password:
            st.error(
                "Configura GMAIL_USER y GMAIL_APP_PASSWORD "
                "en el archivo .env"
            )
            return False

        msg = MIMEMultipart()
        msg["From"] = gmail_user
        msg["To"] = destinatario
        msg["Subject"] = asunto
        msg.attach(MIMEText(cuerpo, "plain"))

        with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
            servidor.starttls()
            servidor.login(gmail_user, gmail_password)
            servidor.send_message(msg)

        return True

    def enviar_whatsapp(numero, mensaje):
        account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")

        if not account_sid or not auth_token or not whatsapp_from:
            st.warning(
                "Twilio no está configurado. "
                "Configura TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN "
                "y TWILIO_WHATSAPP_FROM en el archivo .env"
            )
            return False

        twilio_client = TwilioClient(account_sid, auth_token)
        twilio_client.messages.create(
            from_=whatsapp_from,
            body=mensaje,
            to=f"whatsapp:+51{numero}"
        )

        return True

    # --------------------------------------------------
    # SECCIÓN 1: GENERACIÓN DE CITA
    # --------------------------------------------------

    st.subheader("📋 Generación de cita")

    st.write(
        "Completa los datos para enviar una solicitud "
        "de cita a la clínica."
    )

    nombre_cliente = st.text_input("Nombre del cliente")
    nombre_mascota = st.text_input("Nombre de la mascota")

    servicio = st.selectbox(
        "Servicio solicitado",
        [
            "Traumatología",
            "Cirugía abdominal",
            "Ecografías",
            "Exodoncias",
            "Baños"
        ]
    )

    fecha_cita = st.date_input("Fecha de la cita")
    correo_cliente = st.text_input("Correo del cliente")

    numero_cliente = st.text_input(
        "Número de WhatsApp (sin +51)",
        placeholder="Ejemplo: 963400566"
    )

    if st.button("Enviar solicitud de cita"):

        if (
            nombre_cliente
            and nombre_mascota
            and correo_cliente
            and numero_cliente
        ):

            try:
                respuesta = groq_client.chat.completions.create(
                    model="openai/gpt-oss-20b",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "Eres un asistente de Healthy Pets. "
                                "Redacta correos profesionales y amables "
                                "para solicitudes de citas veterinarias."
                            )
                        },
                        {
                            "role": "user",
                            "content": (
                                f"Redacta un correo de solicitud de cita "
                                f"con estos datos:\n"
                                f"- Cliente: {nombre_cliente}\n"
                                f"- Mascota: {nombre_mascota}\n"
                                f"- Servicio: {servicio}\n"
                                f"- Fecha: {fecha_cita}\n"
                                f"- Correo: {correo_cliente}\n"
                                f"- WhatsApp: {numero_cliente}\n"
                                f"El correo es para la clínica veterinaria."
                            )
                        }
                    ]
                )

                cuerpo_correo = respuesta.choices[0].message.content

                enviar_correo(
                    "healthypet2017@outlook.com",
                    f"Solicitud de cita - {nombre_cliente} - {servicio}",
                    cuerpo_correo
                )

                cita = {
                    "nombre": nombre_cliente,
                    "mascota": nombre_mascota,
                    "servicio": servicio,
                    "fecha": str(fecha_cita),
                    "correo": correo_cliente,
                    "numero": numero_cliente
                }
                st.session_state["citas_pendientes"].append(cita)

                st.success(
                    "Solicitud de cita enviada correctamente "
                    "a healthypet2017@outlook.com"
                )

            except Exception as error:
                st.error(f"Error al enviar la solicitud: {error}")

        else:
            st.warning("Completa todos los campos.")

    st.divider()

    # --------------------------------------------------
    # SECCIÓN 2: CITAS PENDIENTES (CONFIRMAR / RECHAZAR)
    # --------------------------------------------------

    st.subheader("📝 Citas pendientes")

    citas = st.session_state["citas_pendientes"]

    if not citas:
        st.info("No hay citas pendientes.")
    else:
        for i, cita in enumerate(citas):

            with st.container(border=True):
                st.markdown(
                    f"**{cita['nombre']}** — {cita['mascota']} — "
                    f"{cita['servicio']} — {cita['fecha']}"
                )
                st.caption(
                    f"Correo: {cita['correo']} | "
                    f"WhatsApp: +51{cita['numero']}"
                )

                col1, col2 = st.columns(2)

                with col1:
                    if st.button(
                        "✅ Confirmar",
                        key=f"confirmar_{i}"
                    ):
                        try:
                            respuesta = groq_client.chat.completions.create(
                                model="openai/gpt-oss-20b",
                                messages=[
                                    {
                                        "role": "system",
                                        "content": (
                                            "Eres un asistente de Healthy Pets. "
                                            "Redacta mensajes de confirmación de cita "
                                            "profesionales, amables y breves."
                                        )
                                    },
                                    {
                                        "role": "user",
                                        "content": (
                                            f"Genera un mensaje de confirmación "
                                            f"de cita para:\n"
                                            f"- Cliente: {cita['nombre']}\n"
                                            f"- Mascota: {cita['mascota']}\n"
                                            f"- Servicio: {cita['servicio']}\n"
                                            f"- Fecha: {cita['fecha']}\n"
                                            f"- Dirección: Av. Huaylas, Los Olivos 15306\n"
                                            f"Incluye un saludo y la dirección."
                                        )
                                    }
                                ]
                            )

                            mensaje = respuesta.choices[0].message.content

                            enviado_correo = enviar_correo(
                                cita["correo"],
                                f"Cita confirmada - Healthy Pets - {cita['servicio']}",
                                mensaje
                            )

                            enviado_wsp = False
                            try:
                                enviado_wsp = enviar_whatsapp(
                                    cita["numero"], mensaje
                                )
                            except Exception as e:
                                st.warning(f"No se pudo enviar WhatsApp: {e}")

                            if enviado_correo:
                                st.success(
                                    f"Correo de confirmación enviado a {cita['correo']}"
                                )

                            if enviado_wsp:
                                st.success(
                                    f"WhatsApp enviado a +51{cita['numero']}"
                                )

                            if not enviado_wsp:
                                texto = urllib.parse.quote(mensaje)
                                enlace = (
                                    f"https://wa.me/51{cita['numero']}"
                                    f"?text={texto}"
                                )
                                st.markdown(
                                    f"[Enviar por WhatsApp manualmente]({enlace})"
                                )

                            st.session_state["citas_pendientes"].pop(i)
                            st.rerun()

                        except Exception as error:
                            st.error(f"Error al confirmar: {error}")

                with col2:
                    if st.button(
                        "❌ Rechazar",
                        key=f"rechazar_{i}"
                    ):
                        try:
                            respuesta = groq_client.chat.completions.create(
                                model="openai/gpt-oss-20b",
                                messages=[
                                    {
                                        "role": "system",
                                        "content": (
                                            "Eres un asistente de Healthy Pets. "
                                            "Redacta mensajes amables y empáticos "
                                            "para informar que no hay disponibilidad "
                                            "en una fecha solicitada. Siempre sugiere "
                                            "3 horarios alternativos dentro del horario "
                                            "de atención: Lunes a Sábado de 10am a 7pm."
                                        )
                                    },
                                    {
                                        "role": "user",
                                        "content": (
                                            f"El cliente {cita['nombre']} solicitó "
                                            f"una cita de {cita['servicio']} para su "
                                            f"mascota {cita['mascota']} el día "
                                            f"{cita['fecha']}. No hay disponibilidad. "
                                            f"Genera un mensaje amable informando esto "
                                            f"y sugiere 3 horarios alternativos "
                                            f"cercanos a esa fecha."
                                        )
                                    }
                                ]
                            )

                            mensaje = respuesta.choices[0].message.content

                            st.write(mensaje)

                            enviado_correo = enviar_correo(
                                cita["correo"],
                                "Reprogramación de cita - Healthy Pets",
                                mensaje
                            )

                            enviado_wsp = False
                            try:
                                enviado_wsp = enviar_whatsapp(
                                    cita["numero"], mensaje
                                )
                            except Exception as e:
                                st.warning(f"No se pudo enviar WhatsApp: {e}")

                            if enviado_correo:
                                st.success(
                                    f"Correo enviado a {cita['correo']}"
                                )

                            if enviado_wsp:
                                st.success(
                                    f"WhatsApp enviado a +51{cita['numero']}"
                                )

                            if not enviado_wsp:
                                texto = urllib.parse.quote(mensaje)
                                enlace = (
                                    f"https://wa.me/51{cita['numero']}"
                                    f"?text={texto}"
                                )
                                st.markdown(
                                    f"[Enviar por WhatsApp manualmente]({enlace})"
                                )

                            st.session_state["citas_pendientes"].pop(i)
                            st.rerun()

                        except Exception as error:
                            st.error(f"Error al rechazar: {error}")
