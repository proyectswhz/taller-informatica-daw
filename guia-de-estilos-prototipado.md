# 🎨 Guía de Estilos y Prototipado — Taller Informático DAW

## 1. Filosofía e identidad visual

La interfaz está diseñada para el uso cotidiano en un taller informático: clara, legible, ágil y libre de distracciones. Combina una base cálida en **tonos crema** (que reduce la fatiga visual en entornos de trabajo continuo) con un **azul corporativo** que transmite solidez técnica, precisión y confianza.

* **Tono general:** Limpio, funcional y orientado a la gestión rápida de datos (altas, búsquedas, ediciones y cambios de estado).
* **Jerarquía visual:** Cabecera fija superior, barra de búsqueda centralizada para filtrado en tiempo real y tarjetas diferenciadas para formularios y tablas.
* **Retroalimentación de estado:** Indicador persistente del estado del servidor en Render e insignias de color para el seguimiento de las órdenes de reparación.

---

## 2. Paleta cromática

| Rol visual | Color / Token | Código HEX | Uso principal en la interfaz |
| :--- | :--- | :--- | :--- |
| **Fondo principal** | Crema suave | `#f7f5f0` | Fondo general del `body` y superficies neutras |
| **Fondo del dashboard** | Blanco roto frío | `#f7f9fc` / `#fcfbf9` | Panel de inicio y contenedor principal del dashboard |
| **Superficie de tarjetas** | Blanco puro | `#ffffff` | Cabecera, formularios colapsables, tablas y modales |
| **Fondo de inputs** | Crema muy claro | `#faf8f5` | Campos `input`, `textarea` y `select` en reposo |
| **Color corporativo primario** | Azul marino intenso | `#1e3a8a` | Títulos, cabeceras de tabla, botón principal y enlace activo |
| **Acento interactivo** | Azul brillante | `#2563eb` / `#1d4ed8` | Estado `:focus` en campos, `:hover` en botones primarios |
| **Bordes suaves** | Arena / Gris claro | `#e7dfd3` / `#d1d5db` | Divisores de tarjetas, cabecera y bordes de campos |
| **Texto principal** | Gris carbón | `#1f2937` / `#4b5563` | Textos de lectura y contenido de celdas |

### Estados de las órdenes de reparación (`status-badge`)

| Estado | Fondo | Texto | Significado visual |
| :--- | :--- | :--- | :--- |
| **Pendiente** | `#fef3c7` | `#d97706` | Pendiente de revisión o diagnóstico inicial |
| **En reparación** | `#eff6ff` | `#1e3a8a` | Activo en taller, en proceso técnico |
| **Finalizado** | `#ecfdf5` | `#065f46` | Reparación completada, listo para entrega |
| **Entregado** | `#f3f4f6` | `#374151` | Equipo entregado al cliente (orden cerrada) |

---

## 3. Tipografía

* **Familia tipográfica:** Pila del sistema (`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif`), garantizando carga instantánea y coherencia nativa en Windows, Linux, Android y iOS.
* **Títulos de sección / tarjetas (`h2`):** `1.3rem`, peso `600`–`700`, color `#1e3a8a`.
* **Título del dashboard (`h1`):** `2.6rem` en escritorio (`1.8rem` en móvil), peso `700`.
* **Etiquetas de formulario (`label`):** `0.85rem`, peso `600`, color `#1e3a8a`, con ligera separación superior.
* **Texto de tablas y formularios:** `0.95rem` para una lectura cómoda sin saturar las filas.

---

## 4. Arquitectura de componentes y patrones de UI

### 4.1. Cabecera superior (`site-header`)
* Fija en la parte superior (`position: sticky; top: 0; z-index: 1000`) con ancho máximo centrado (`max-width: 1200px`).
* Contiene el logotipo/enlace a `index.html` a la izquierda y la navegación (`Clientes`, `Dispositivos`, `Reparaciones`) junto con la acción destacada para abrir el formulario de alta (`➕ Nuevo...`).

### 4.2. Formulario colapsable + Tabla (`content-grid`)
* Por defecto ocupa una sola columna (`1fr`) para que la tabla disponga del máximo espacio horizontal.
* Al activar el formulario (clase `.show-form` y retirando `.hidden` de `.form-card`), pasa a una distribución de dos columnas en escritorio (`380px 1fr`), permitiendo crear o editar sin perder de vista el listado.
* Dispone de botón de cierre (`✖`) que limpia el estado de edición y reinicia el formulario.

### 4.3. Tablas de acción (`table-responsive`)
* Cabecera en `#f7f5f0` con texto `#1e3a8a` y borde inferior marcado.
* Fila de acciones en la última columna con botones compactos (`.btn-action`) para editar (`✏️`), eliminar (`🗑️`) o acceder a dispositivos/reparaciones relacionados.

### 4.4. Modales flotantes (`modal-overlay` / `modal-card`)
* Fondo oscuro semitransparente con `backdrop-filter: blur(4px)` y animación suave de entrada (`modalScaleUp`), reservado para acciones rápidas contextuales (como registrar un dispositivo directamente desde la ficha del cliente).

### 4.5. Indicador de servidor (`server-status-badge`)
* Badge flotante inferior derecho que muestra el estado de conexión con la API de Render (`checking` en amarillo, `online` en verde, `offline` en rojo), informando visualmente si el contenedor gratuito está despertando tras inactividad.

---

## 5. Prototipado y diseño responsive

El prototipado se ha planteado garantizando una adaptación fluida entre **escritorio**, **tablet** y **móvil**:

1. **Escritorio (`> 968px`):**
   * Dashboard con cuadrícula de 3 tarjetas horizontales (`.button-group-horizontal`).
   * Vistas de gestión con contenedor de hasta `1300px` y formulario lateral colapsable (`380px`).
2. **Tablet y móvil (`<= 768px`):**
   * La cabecera apila logotipo y navegación en columna permitiendo envolver enlaces (`flex-wrap: wrap`).
   * `.content-grid.show-form` pasa a `1fr` para que el formulario ocupe todo el ancho por encima del listado.
   * El dashboard se organiza en una sola columna vertical para facilitar la pulsación táctil.
   * Las tablas mantienen un ancho mínimo (`min-width: 600px`) dentro de un contenedor con `overflow-x: auto` y `-webkit-overflow-scrolling: touch`, evitando que las columnas se amontonen o rompan el diseño en pantallas estrechas.
3. **Móvil muy estrecho (`<= 480px`):**
   * Ajuste de tamaños de títulos (`1.1rem`) y rellenos de tarjetas y modales para optimizar la superficie útil.

---

## 6. Flujo de prototipado recomendado para la presentación/defensa

Para hacer una demostración fluida del prototipo:

1. **Inicio (`index.html`):** Mostrar la comprobación de estado del servidor y el acceso directo a los tres módulos.
2. **Clientes (`clientes.html`):** Filtrar por cliente, abrir el formulario colapsable para alta/edición y mostrar el modal contextual de alta rápida de dispositivo.
3. **Dispositivos (`dispositivos.html`):** Comprobar el desplegable de clientes propietarios y la tabla dinámica de equipos.
4. **Reparaciones (`reparaciones.html`):** Seleccionar cliente y dispositivo, gestionar la descripción de avería, estados y costes, y verificar el cambio visual de las etiquetas de estado.
5. **Prueba responsive:** Cambiar la ventana a vista de móvil para verificar el menú adaptado y el despliegue de tablas con scroll horizontal.