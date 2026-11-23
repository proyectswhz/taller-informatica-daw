# 📌 Memoria del Proyecto: Gestor de Taller Informático (DAW)

## 1. Idea y Objetivo del Proyecto

El proyecto nace para cubrir la necesidad operativa de un taller de reparación de equipos informáticos. Consiste en una aplicación web **full-stack** que centraliza la administración diaria del negocio en tres pilares principales:

- **Gestión de Clientes:** Alta, consulta y filtrado de datos de contacto.
- **Gestión de Dispositivos:** Registro de ordenadores, móviles u otros equipos asociados a cada cliente.
- **Órdenes de Reparación (`WorkOrders`):** Control del ciclo de vida de la reparación (diagnóstico, estado, costes y observaciones técnicas).

Su diseño es **responsive**, ligero y cuenta con una arquitectura desacoplada que conecta un frontend en HTML/CSS/JS con un backend en Node.js/Express y base de datos MongoDB.

---

## 2. Información de Acceso y Despliegue

A continuación se facilitan todos los enlaces y datos técnicos para probar y evaluar la aplicación:

- **🚀 Aplicación Web (Frontend):**  
  [https://taller-informatica-daw.vercel.app](https://taller-informatica-daw.vercel.app) _(o enlace a tu servidor de producción/Vercel)_

- **⚙️ API REST (Backend en Render):**  
  [https://taller-informatica-daw.onrender.com/api/workOrders](https://taller-informatica-daw.onrender.com/api/workOrders)  
  _Endpoints activos:_ `/api/customers`, `/api/devices`, `/api/workOrders`

- **📁 Repositorio de Código (GitHub):**  
  [https://github.com/projectswhz/taller-informatica-daw](https://github.com/projectswhz/taller-informatica-daw)

---

## 3. Resumen Técnico

- **Frontend:** HTML5, CSS3 (variables, grid, flexbox, responsive design) y JavaScript Vanilla (ES6+ fetch/async/await).
- **Backend:** Node.js, Express, Mongoose.
- **Base de datos:** MongoDB Atlas (nube).
