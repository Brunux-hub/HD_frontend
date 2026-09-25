import streamlit as st

st.title("🐾 Healthy Pets - Asistente de Productividad")

st.write("Automatización de procesos para la clínica veterinaria.")

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