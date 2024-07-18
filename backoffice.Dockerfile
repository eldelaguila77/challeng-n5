# Establece la imagen base
FROM node:20

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app
COPY ./backoffice /app

# Copia el package.json y el package-lock.json para instalar las dependencias
COPY backoffice/package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Expone el puerto 3000 para acceder a la aplicación
EXPOSE 3000

# Inicia la aplicación en modo de desarrollo para permitir la actualización en caliente
CMD ["npm", "start"]