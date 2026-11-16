# 🛠️ Gestor de Órdenes de Trabajo y Reparaciones - Taller de Informática

Sistema de gestión interna B2B para talleres de reparación de equipos informáticos. Permite registrar clientes, asociar equipos en revisión y llevar el seguimiento del flujo de trabajo de las órdenes de reparación desde la entrada hasta la entrega.

---

## 🚀 Tecnologías Utilizadas

### Backend

- **Node.js** con **Express** (API RESTful)
- **MongoDB** con **Mongoose** (Base de datos NoSQL con relaciones via `ObjectId`)
- **CORS** & **dotenv** (Seguridad y configuración de entorno)

### Frontend

- **HTML5** & **CSS3 puro** (Sin frameworks como Tailwind/Bootstrap)
- **JavaScript Vainilla** (Arquitectura de páginas separadas usando `fetch` API)

### Infraestructura y Despliegue

- **Backend**: Render (Web Service)
- **Frontend**: Vercel (Static Hosting)
- **Base de Datos**: MongoDB local (Desarrollo) / MongoDB Atlas (Producción)

---

## 📁 Estructura del Proyecto

```text
taller-pc/
├── client/                  # Frontend estático
│   ├── index.html           # Dashboard principal y estado de reparaciones
│   ├── nueva-orden.html     # Formulario de alta de clientes y equipos
│   ├── css/
│   │   └── styles.css       # Estilos CSS puros del taller
│   └── js/
│       ├── api.js           # Configuración de URLs dinámicas (Local / Render)
│       └── app.js           # Lógica de manipulación del DOM y llamadas fetch
├── server/                  # Backend Node.js / Express
│   ├── config/
│   │   └── db.js            # Conexión a MongoDB (Local / Atlas)
│   ├── controllers/         # Lógica de controladores CRUD
│   ├── models/              # Esquemas Mongoose (Customer, Device, WorkOrder)
│   ├── routes/              # Endpoints de la API REST
│   └── index.js             # Punto de entrada del servidor Express
├── TODO.md                  # Seguimiento del estado del proyecto
├── .env.example             # Plantilla de variables de entorno
└── README.md                # Documentación del proyecto
```

---

## 🗄️ Modelo de Datos

1. **`Customer` (Clientes):** Nombre, teléfono, email, DNI/CIF.
2. **`Device` (Equipos):** Tipo (_Portátil, Sobremesa, Consola_), marca, modelo, número de serie.
3. **`WorkOrder` (Órdenes de Trabajo):** Relación con Cliente y Equipo, descripción de la avería, estado (_Recibido_, _En Diagnóstico_, _Esperando Repuesto_, _Reparado_, _Entregado_), desglose de piezas y horas de mano de obra.

---

## 🗺️ Fases del Proyecto (Hoja de Ruta DAW)

- [x] **Fase 1: Entorno e Infraestructura Local**
  - [x] Estructura de carpetas `/server` y `/client`.
  - [x] Configuración del repositorio Git e inicialización del proyecto.
  - [x] Conexión a MongoDB local (`mongodb://localhost:27017/taller-pc-db`).

- [ ] **Fase 2: Backend Core y Modelos de Taller**
  - [x] Esquemas Mongoose: `Customer.js`, `Device.js` y `WorkOrder.js`.
  - Controlador y endpoints CRUD de órdenes de trabajo.
  - Configuración del middleware `cors`.

- [ ] **Fase 3: Desarrollo del Frontend Local**
  - Maquetación con HTML5 y CSS puro (`index.html`, `nueva-orden.html`).
  - Consumo de la API local con JS Vainilla (`fetch`).

- [ ] **Fase 4: Preparación para Producción**
  - Parametrización con variables de entorno (`dotenv`).
  - Alternancia dinámica entre API local (`http://localhost:5000/api`) y API remota.

- [ ] **Fase 5: Despliegue en la Nube**
  - Migración de base de datos a **MongoDB Atlas**.
  - Despliegue de la API REST en **Render**.
  - Despliegue del cliente estático en **Vercel**.

- [ ] **Fase 6: Seguridad y Hardening**
  - Manejo de excepciones, restricciones CORS finales y códigos HTTP adecuados.

- [ ] **Fase 7: Pruebas E2E y Ensayos**
  - Validación del flujo completo de creación y actualización de órdenes en producción.

- [ ] **Fase 8: Documentación y Memoria DAW**
  - Redacción de la memoria del proyecto, diagramas ER y preparación de la defensa ante el tribunal.

---

## ⚙️ Configuración del Entorno Local

1. **Clonar el repositorio y ubicar la carpeta del proyecto:**

   ```bash
   cd taller-pc
   ```

2. **Configurar el Backend:**

   ```bash
   cd server
   npm install
   ```

3. **Crear el archivo `.env` en `/server` con los siguientes parámetros:**

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taller-pc-db
   ```

4. **Iniciar el servidor en modo desarrollo:**

   ```bash
   npm start
   ```

5. **Abrir el Frontend:**
   Abrir `client/index.html` en el navegador o mediante una extensión de servidor local tipo _Live Server_.
