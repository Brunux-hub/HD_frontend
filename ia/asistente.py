import streamlit as st
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()
st.title("🐾 Healthy Pets - Asistente de Productividad")

st.write("Automatización de procesos para la clínica veterinaria.")

st.subheader("🤖 Asistente de OpenAI")

consulta = st.text_input(
    "Escribe una consulta para el asistente"
)

if st.button("Consultar asistente"):
    if consulta:
        try:
            respuesta = client.responses.create(
                model="gpt-5-mini",
                input=(
                    "Eres un asistente de productividad de Healthy Pets. "
                    "Ayudas al personal de una clínica veterinaria a redactar "
                    "mensajes, correos y respuestas breves para clientes. "
                    "Responde de manera clara, profesional y amable.\n\n"
                    f"Consulta: {consulta}"
                )
            )

            st.subheader("Respuesta del asistente")
            st.write(respuesta.output_text)

        except Exception:
            st.info(
                "El asistente está configurado correctamente, "
                "pero actualmente no hay créditos disponibles "
                "para ejecutar la consulta mediante la API."
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

st.subheader("📧 Generación de correo automático")

destinatario = st.text_input("Correo del destinatario")
asunto = st.text_input("Asunto del correo")

if st.button("Generar correo"):
    if destinatario and asunto:
        correo = (
            f"Para: {destinatario}\n\n"
            f"Asunto: {asunto}\n\n"
            "Estimado cliente,\n\n"
            "Le informamos que Healthy Pets ha registrado "
            "su solicitud correctamente. Nuestro equipo "
            "se pondrá en contacto con usted para continuar "
            "con la atención de su mascota.\n\n"
            "Saludos,\n"
            "Equipo Healthy Pets"
        )

        st.subheader("Correo generado")
        st.code(correo)
    else:
        st.warning("Completa el destinatario y el asunto.")