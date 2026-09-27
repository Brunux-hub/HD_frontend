import streamlit as st
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq()
st.title("🐾 Healthy Pets - Asistente de Productividad")

st.write("Automatización de procesos para la clínica veterinaria.")

st.subheader("🤖 Asistente IA")

consulta = st.text_input(
    "Escribe una consulta para el asistente"
)

if st.button("Consultar asistente"):
    if consulta:
        try:
            respuesta = client.chat.completions.create(
                model="openai/gpt-oss-20b",
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "Eres un asistente de productividad de Healthy Pets. "
                            "Ayudas al personal de una clínica veterinaria a redactar "
                            "mensajes, correos y respuestas breves para clientes. "
                            "Responde de manera clara, profesional y amable."
                        )
                    },
                    {
                        "role": "user",
                        "content": consulta
                    }
                ]
            )

            st.subheader("Respuesta del asistente")
            st.write(respuesta.choices[0].message.content)

        except Exception:
            st.info(
                "El asistente está configurado correctamente, "
                "pero actualmente no se pudo conectar con la API de Groq. "
                "Verifica tu GROQ_API_KEY."
            )
    else:
        st.warning("Escribe una consulta.")

st.subheader("Generación de mensaje automático")

nombre_cliente = st.text_input("Nombre del cliente")
nombre_mascota = st.text_input("Nombre de la mascota")
servicio = st.text_input("Servicio solicitado")

if st.button("Generar mensaje"):
    if nombre_cliente and nombre_mascota and servicio:
        mensaje = (
            f"Hola {nombre_cliente}, te contactamos de Healthy Pets. "
            f"Tu mascota {nombre_mascota} tiene registrada una atención "
            f"relacionada con el servicio de {servicio}. "
            f"Gracias por confiar en nuestra clínica veterinaria."
        )

        st.subheader("Mensaje generado")
        st.success(mensaje)
    else:
        st.warning("Completa todos los campos.")
        st.divider()

st.subheader("📧 Envío de correo electrónico")

destinatario = st.text_input("Correo del destinatario")
asunto = st.text_input("Asunto del correo")
cuerpo = st.text_area(
    "Cuerpo del correo",
    placeholder="Escribe el contenido del correo o usa el asistente IA para generarlo..."
)

if st.button("Vista previa del correo"):
    if destinatario and asunto and cuerpo:
        st.session_state["correo_listo"] = True
        st.session_state["correo_datos"] = {
            "destinatario": destinatario,
            "asunto": asunto,
            "cuerpo": cuerpo
        }

        st.subheader("Vista previa")
        st.code(
            f"Para: {destinatario}\n"
            f"Asunto: {asunto}\n\n"
            f"{cuerpo}\n\n"
            "Saludos,\n"
            "Equipo Healthy Pets"
        )
    else:
        st.warning("Completa el destinatario, asunto y cuerpo del correo.")

if st.session_state.get("correo_listo") and st.button("Enviar correo"):
    gmail_user = os.getenv("GMAIL_USER")
    gmail_password = os.getenv("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        st.error(
            "Configura GMAIL_USER y GMAIL_APP_PASSWORD en el archivo .env "
            "para poder enviar correos."
        )
    else:
        datos = st.session_state["correo_datos"]
        msg = MIMEMultipart()
        msg["From"] = gmail_user
        msg["To"] = datos["destinatario"]
        msg["Subject"] = datos["asunto"]

        cuerpo_completo = (
            f"{datos['cuerpo']}\n\n"
            "Saludos,\n"
            "Equipo Healthy Pets"
        )
        msg.attach(MIMEText(cuerpo_completo, "plain"))

        try:
            with smtplib.SMTP("smtp.gmail.com", 587) as servidor:
                servidor.starttls()
                servidor.login(gmail_user, gmail_password)
                servidor.send_message(msg)

            st.success(f"Correo enviado correctamente a {datos['destinatario']}")
            st.session_state["correo_listo"] = False

        except Exception as e:
            st.error(f"Error al enviar el correo: {e}")
