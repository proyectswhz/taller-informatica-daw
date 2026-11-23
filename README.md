# Gestor de Órdenes de Trabajo y Reparaciones - Taller de Informática

Aplicación web full-stack para la gestión integral de un taller informático: administración de **Clientes**, registro de **Dispositivos** asociados y control operativo de **Órdenes de Reparación** (`WorkOrders`), con diseño _responsive_ y conexión a API REST.

---

## 📋 Características principales

- **Panel principal (`index.html`):** Acceso directo a los módulos del taller y comprobación visual del estado del servidor.
- **Gestión de clientes (`clientes.html` / `clientes.js`):** CRUD completo, búsqueda en tiempo real (`?cliente=...`) por nombre, DNI o teléfono, modal para añadir dispositivos y acceso rápido a las reparaciones del cliente.
- **Gestión de dispositivos (`dispositivos.html` / `dispositivos.js`):** Registro y edición de equipos (`type`, `brand`, `model`, `serialNumber`, `observations`) vinculados a un cliente, con formulario colapsable y tabla _responsive_.
- **Órdenes de reparación (`reparaciones.html` / `reparaciones.js`):** Creación y actualización de órdenes (`customer`, `device`, `issueDescription`, `status`, `estimatedCost`, `finalCost`, `technicianNotes`) con estados (`Pendiente`, `En reparación`, `Finalizado`, `Entregado`).
- **Interfaz adaptable:** Diseño en tonos crema (`#f7f5f0`) y azul corporativo (`#1e3a8a`) con soporte _responsive_ para escritorio, tablet y móvil.

---

## 🛠️ Stack tecnológico

### Frontend

- **HTML5**, **CSS3** (diseño _responsive_ con _media queries_ y tablas con _scroll_ horizontal) y **JavaScript vanilla (ES6+)** (`fetch`, `async/await`, `FormData`).

### Backend y Base de Datos

- **Node.js** y **Express** (API REST).
- **MongoDB** con **Mongoose** (esquemas `Customer`, `Device` y `WorkOrder` relacionados mediante `ObjectId`).

### Despliegue y herramientas

- **Backend:** Render (`https://taller-informatica-daw.onrender.com`)
- **Base de datos:** MongoDB Atlas
- **Frontend:** Vercel / servidor estático
- **Control de versiones:** Git y GitHub

---

## 📁 Estructura del proyecto

```text
taller-informatica-daw/
├── client/                  # Frontend estático
│   ├── css/
│   │   └── style.css        # Estilos globales y responsive
│   ├── js/
│   │   ├── clientes.js      # Lógica CRUD, buscador y estado del servidor
│   │   ├── dispositivos.js  # Lógica CRUD de dispositivos y select de clientes
│   │   └── reparaciones.js  # Lógica de órdenes de reparación y estados
│   ├── index.html           # Panel principal
│   ├── clientes.html        # Vista de clientes
│   ├── dispositivos.html    # Vista de dispositivos
│   └── reparaciones.html    # Vista de reparaciones
├── server/                  # Backend Node.js + Express + Mongoose
│   ├── controllers/         # Lógica de negocio (clientes, dispositivos, órdenes)
│   ├── models/              # Esquemas Mongoose (Customer, Device, WorkOrder)
│   ├── routes/              # Rutas de la API REST
│   ├── .env.example         # Plantilla de variables de entorno
│   ├── package.json
│   └── server.js            # Punto de entrada del servidor
└── README.md
```

---

## ⚙️ Instalación y puesta en marcha en local

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPOSITORIO>
cd taller-informatica-daw
```

### 2. Configurar y arrancar el Backend (`/server`)

```bash
cd server
npm install
```

Crea un archivo `.env` dentro de `server/` (te puedes basar en `.env.example`) con las variables necesarias:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<nombre_bd>?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5500
```

Inicia el servidor en desarrollo o producción:

```bash
npm run dev   # o npm start, según el script configurado en package.json
```

El backend quedará disponible en `http://localhost:3000` (o el puerto definido en `PORT`).

### 3. Ejecutar el Frontend (`/client`)

Al tratarse de archivos HTML, CSS y JavaScript estáticos, los puedes abrir con **Live Server** en VS Code o servir la carpeta `client/` con cualquier servidor estático:

```bash
npx serve client
```

> **Nota sobre la URL de la API:** En los archivos `clientes.js`, `dispositivos.js` y `reparaciones.js` está configurada la URL desplegada en Render (`https://taller-informatica-daw.onrender.com/api/...`). Si vas a probar contra tu backend local, cambia esa constante a `http://localhost:3000/api/...` y asegúrate de tener habilitado **CORS** en Express para el origen de tu frontend.

---

## 🔌 Endpoints principales de la API

| Recurso      | Método   | Endpoint              | Descripción                                                                 |
| :----------- | :------- | :-------------------- | :-------------------------------------------------------------------------- |
| Clientes     | `GET`    | `/api/customers`      | Lista clientes (admite `?cliente=` para filtrar por nombre, DNI o teléfono) |
| Clientes     | `POST`   | `/api/customers`      | Crea un nuevo cliente                                                       |
| Clientes     | `PUT`    | `/api/customers/:id`  | Actualiza un cliente existente                                              |
| Clientes     | `DELETE` | `/api/customers/:id`  | Elimina un cliente                                                          |
| Dispositivos | `GET`    | `/api/devices`        | Lista todos los dispositivos                                                |
| Dispositivos | `GET`    | `/api/devices/:id`    | Obtiene un dispositivo por ID                                               |
| Dispositivos | `POST`   | `/api/devices`        | Registra un dispositivo asociado a un cliente                               |
| Dispositivos | `PUT`    | `/api/devices/:id`    | Actualiza un dispositivo                                                    |
| Dispositivos | `DELETE` | `/api/devices/:id`    | Elimina un dispositivo                                                      |
| Reparaciones | `GET`    | `/api/workOrders`     | Lista todas las órdenes de reparación                                       |
| Reparaciones | `GET`    | `/api/workOrders/:id` | Obtiene una orden por ID                                                    |
| Reparaciones | `POST`   | `/api/workOrders`     | Crea una nueva orden de reparación                                          |
| Reparaciones | `PUT`    | `/api/workOrders/:id` | Actualiza estado, costes, diagnóstico o notas                               |
| Reparaciones | `DELETE` | `/api/workOrders/:id` | Elimina una orden de reparación                                             |

---

## ☁️ Despliegue en producción

1. **Base de datos:** Clúster creado en **MongoDB Atlas** con usuario de base de datos y acceso de red configurado.
2. **Backend (Render):** Servicio web conectado al repositorio apuntando al directorio `server`, con `MONGODB_URI` y `CORS_ORIGIN` configurados en las variables de entorno de Render. Ten en cuenta que en planes gratuitos de Render el servidor puede tardar unos segundos en despertar tras un periodo de inactividad (reflejado en el indicador de estado del frontend).
3. **Frontend (Vercel):** Despliegue del directorio `client` sirviendo los archivos estáticos conectados a los endpoints de Render.
