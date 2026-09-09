# 🚀 Guía Completa de Despliegue 100% Gratuito para Portafolio

Esta guía te explica cómo desplegar la plataforma completa (**Base de Datos**, **Backend NestJS** y **Frontend React 19**) sin costo alguno.

---

## 🏗️ Arquitectura de Despliegue

```
+---------------------------+        +---------------------------+        +---------------------------+
|    Frontend (React 19)    |  HTTP  |     Backend (NestJS)      |  SQL   |    Database (PostgreSQL)  |
|    Alojado en: Vercel     | -----> |     Alojado en: Render    | -----> |    Alojado en: Neon.tech  |
|   (o Netlify / Render)    |        |     (Web Service Free)    |  (SSL) |       (Free Serverless)   |
+---------------------------+        +---------------------------+        +---------------------------+
```

---

## 1️⃣ Paso 1: Base de Datos PostgreSQL Gratuita en Neon.tech
1. Regístrate en [Neon.tech](https://neon.tech) con GitHub.
2. Crea un proyecto `taxi-app-db`.
3. Copia el **Connection String**: `postgresql://usuario:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`.

---

## 2️⃣ Paso 2: Desplegar Backend en Render.com
1. En [Render.com](https://render.com), crea un **New Web Service** con tu repositorio.
2. Configuración:
   - **Root Directory**: `taxi-backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
3. Variables de entorno:
   - `DATABASE_URL`: *(Tu URL de Neon)*
   - `DB_SSL`: `true`
   - `JWT_SECRET`: `clave_secreta_jwt`
   - `NODE_ENV`: `production`

---

## 3️⃣ Paso 3: Desplegar Frontend en Vercel
1. En [Vercel.com](https://vercel.com), importa el repositorio.
2. Configuración:
   - **Root Directory**: `taxi-frontend`
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Variable de entorno:
   - `VITE_API_URL`: `https://arquitectura-taxi-app.onrender.com`
