# Usa una imagen base de Python
FROM python:3.9-slim

# Establece el directorio de trabajo en el contenedor
WORKDIR /app
COPY ./backend_n5 /app

RUN apt-get update && \
    apt-get install -y pkg-config libmariadb-dev-compat build-essential && \
    rm -rf /var/lib/apt/lists/*

# Instala virtualenv
#RUN pip install virtualenv

# Crea un entorno virtual en el directorio /app/venv
#RUN virtualenv venv

# Activa el entorno virtual
ENV VIRTUAL_ENV=/app/venv
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

# Copia el archivo de requisitos y lo instala
COPY ./backend_n5/requirements.txt /app/requirements.txt
RUN ls /app
RUN pip install --no-cache-dir -r /app/requirements.txt
RUN ls /app
RUN ls /

# Copia el resto del código fuente del proyecto al contenedor
# Comentado para permitir el uso de volúmenes en su lugar
# COPY . .

# Expone el puerto en el que tu aplicación estará escuchando
ENV FLASK_APP=/app/src/app.py
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["python3", "/app/src/app.py"]