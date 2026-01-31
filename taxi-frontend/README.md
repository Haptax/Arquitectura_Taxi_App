# Taxi Frontend (React + Vite)

Panel local para probar los casos de uso del backend (usuarios, perfiles, conductores y viajes).

## Requisitos

- Node.js 18+
- Backend en local (por defecto `http://localhost:3000`)

## Configuración

1. Copia el archivo de entorno:

```
cp .env.example .env
```

2. Ajusta el backend si es necesario:

```
VITE_API_URL=http://localhost:3000
```

## Desarrollo local

```
npm install
npm run dev
```

Abrir `http://localhost:5173`.

## Build

```
npm run build
npm run preview
```

## Deploy (Render)

- Build Command: `npm run build`
- Publish Directory: `dist`
- Variable de entorno: `VITE_API_URL=https://TU_BACKEND.onrender.com`
