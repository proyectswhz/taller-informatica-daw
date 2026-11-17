const URL_RENDER = "https://taller-informatica-daw.onrender.com/api/customers";
const tablaClientes = document.getElementById("tabla-clientes-body");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const clientForm = document.getElementById("client-form");
const responseMessage = document.getElementById("response-message");

// Referencias del Modal de Dispositivos
const deviceModal = document.getElementById("deviceModal");
const btnCloseDeviceModal = document.getElementById("btnCloseDeviceModal");
const deviceForm = document.getElementById("device-form");
const modalCustomerId = document.getElementById("modalCustomerId");
const deviceResponseMessage = document.getElementById(
  "device-response-message",
);

const serverStatus = document.getElementById("server-status");

// Referencia al input de búsqueda de la vista
const searchInput = document.getElementById("searchInput");

let editandoId = null;
// 1. Mostrar/Ocultar el formulario al hacer clic en "Nuevo Cliente"
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editandoId = null; // Limpiamos el ID por si veníamos de editar
  clientForm.reset(); // Limpiamos los campos
  formContainer.classList.remove("hidden");
  mainGrid.classList.add("show-form");
});

btnCloseForm.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  mainGrid.classList.remove("show-form");
  editandoId = null;
  clientForm.reset();
});
// 2. Cargar clientes desde la API de render y mostrarlos en la tabla
async function cargarClientes() {
  try {
    const response = await fetch(URL_RENDER);

    if (!response.ok) {
      throw new Error("Error al cargar los clientes");
    }

    const clientes = await response.json();
    tablaClientes.innerHTML = "";

    clientes.forEach((cliente) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
            <td><strong>${cliente.name} ${cliente.surname}</strong></td>
            <td>${cliente.dni}</td>
            <td>${cliente.phone}</td>
            <td>${cliente.email}</td>
            <td>
                <div class="action-buttons">
                    <button onclick="abrirDispositivo('${cliente._id}')" class="btn-action btn-device" title="Añadir Dispositivo">💻</button>
                    <button onclick="verReparacionesCliente('${cliente._id}')" class="btn-action btn-reparaciones" title="Ver Reparaciones">📋</button>
                    <button onclick="editarCliente('${cliente._id}')" class="btn-action btn-edit" title="Editar Cliente">✏️</button>
                     <button onclick="eliminarCliente('${cliente._id}')" class="btn-action btn-delete" title="Borrar Cliente">🗑️</button>
                </div>
            </td>
        `;
      tablaClientes.appendChild(fila);
    });
  } catch (error) {
    console.error("Error de red: ", error);
  }
}

// 3. Crear o editar cliente al enviar el formulario
clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    dni: document.getElementById("dni").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  };

  try {
    let response;
    if (editandoId) {
      response = await fetch(`${URL_RENDER}/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
    } else {
      response = await fetch(URL_RENDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
    }

    if (response.ok) {
      responseMessage.textContent = editandoId
        ? "Cliente actualizado correctamente"
        : "Cliente creado correctamente";
      responseMessage.className = "message-box success";
      clientForm.reset();
      editandoId = null;
      formContainer.classList.add("hidden");
      mainGrid.classList.remove("show-form");
      cargarClientes();
    } else {
      const errorData = await response.json();
      responseMessage.textContent = `Error: ${errorData.message}`;
      responseMessage.className = "message-box error";
    }
  } catch (error) {
    responseMessage.textContent = "Error de red al procesar la solicitud";
    responseMessage.className = "message-box error";
  }
});

// Boton editar: cargar datos del cliente en el formulario y lo despliegamos
async function editarCliente(id) {
  try {
    const response = await fetch(`${URL_RENDER}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del cliente");
    }
    const cliente = await response.json();
    document.getElementById("name").value = cliente.name;
    document.getElementById("surname").value = cliente.surname;
    document.getElementById("dni").value = cliente.dni;
    document.getElementById("phone").value = cliente.phone;
    document.getElementById("email").value = cliente.email;
    document.getElementById("address").value = cliente.address;

    editandoId = id;
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error("Error al cargar los datos del cliente: ", error);
    alert("No se pudieron cargar los datos del cliente. Inténtalo de nuevo.");
  }
}

// BOTÓN VER REPARACIONES DEL CLIENTE: Redirige al listado de órdenes del cliente
function abrirDispositivo(clienteId) {
  modalCustomerId.value = clienteId; // Guardamos el ID en el input oculto
  deviceForm.reset();
  deviceResponseMessage.className = "message-box";
  deviceResponseMessage.textContent = "";
  deviceModal.classList.remove("hidden");
}

// Cerrar el modal
btnCloseDeviceModal.addEventListener("click", () => {
  deviceModal.classList.add("hidden");
});

// Cerrar modal haciendo clic fuera de la tarjeta
deviceModal.addEventListener("click", (e) => {
  if (e.target === deviceModal) {
    deviceModal.classList.add("hidden");
  }
});

// Enviar el nuevo dispositivo a la API
deviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = modalCustomerId.value;
  const deviceData = {
    customer: clienteId, // Clave exacta del modelo de Mongoose
    type: document.getElementById("deviceType").value,
    brand: document.getElementById("deviceBrand").value,
    model: document.getElementById("deviceModel").value,
    serialNumber: document.getElementById("serialNumber").value,
    observations: document.getElementById("deviceObservations").value,
  };

  try {
    const response = await fetch(
      "https://taller-informatica-daw.onrender.com/api/devices",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deviceData),
      },
    );

    if (response.ok) {
      deviceResponseMessage.textContent = "¡Dispositivo añadido con éxito!";
      deviceResponseMessage.className = "message-box success";
      setTimeout(() => {
        deviceModal.classList.add("hidden");
      }, 1500);
    } else {
      const err = await response.json();
      deviceResponseMessage.textContent = `Error: ${err.message || "No se pudo registrar el dispositivo."}`;
      deviceResponseMessage.className = "message-box error";
    }
  } catch (error) {
    console.error("Error de red:", error);
    deviceResponseMessage.textContent = "Error de conexión con el servidor.";
    deviceResponseMessage.className = "message-box error";
  }
});

async function eliminarCliente(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
    try {
      const response = await fetch(`${URL_RENDER}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        cargarClientes();
      } else {
        alert("Error al eliminar el cliente. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("Error al eliminar el cliente: ", error);
      alert(
        "Error de red al intentar eliminar el cliente. Inténtalo de nuevo.",
      );
    }
  }
}

// Evento para buscar en tiempo real mientras el usuario escribe
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim();

  try {
    // Llamada al endpoint enviando el parámetro que lee tu req.query.cliente
    const response = await fetch(
      `${URL_RENDER}?cliente=${encodeURIComponent(searchTerm)}`,
    );
    if (!response.ok) throw new Error("Error en la búsqueda");

    const clientes = await response.json();

    // Volvemos a pintar la tabla con los resultados filtrados
    tablaClientes.innerHTML = "";

    if (clientes.length === 0) {
      tablaClientes.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #9ca3af;">No se encontraron clientes</td></tr>`;
      return;
    }

    clientes.forEach((cliente) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td><strong>${cliente.name} ${cliente.surname}</strong></td>
        <td>${cliente.dni}</td>
        <td>${cliente.phone}</td>
        <td>${cliente.email}</td>
        <td>
          <div class="action-buttons">
            <button onclick="abrirDispositivo('${cliente._id}')" class="btn-action btn-device" title="Añadir Dispositivo">💻</button>
            <button onclick="verReparacionesCliente('${cliente._id}')" class="btn-action btn-reparaciones" title="Ver Reparaciones">📋</button>
            <button onclick="editarCliente('${cliente._id}')" class="btn-action btn-edit" title="Editar Cliente">✏️</button>
            <button onclick="eliminarCliente('${cliente._id}')" class="btn-action btn-delete" title="Borrar Cliente">🗑️</button>
          </div>
        </td>
      `;
      tablaClientes.appendChild(fila);
    });
  } catch (error) {
    console.error("Error al buscar clientes:", error);
  }
});

async function checkServerStatus() {
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");

  if (!statusDot || !statusText) return;

  // URL base de tu API (quitando /api/customers para probar la raíz o haciendo HEAD/GET)
  const urlRoot = "https://taller-informatica-daw.onrender.com/api/health"; // Endpoint de salud que puedes crear en tu backend

  try {
    statusDot.className = "status-dot checking";
    statusText.textContent = "Conectando con servidor...";

    // Hacemos una petición rápida al servidor
    const response = await fetch(urlRoot, { method: "GET" });

    if (response.ok || response.status < 500) {
      statusDot.className = "status-dot online";
      statusText.textContent = "Servidor Online";
    } else {
      statusDot.className = "status-dot offline";
      statusText.textContent = "Servidor con problemas";
    }
  } catch (error) {
    statusDot.className = "status-dot offline";
    statusText.textContent = "Servidor Offline";
    console.error("Error al comprobar el estado del servidor:", error);
  }
}

// Ejecutar la comprobación al iniciar la vista de clientes

cargarClientes();
checkServerStatus();
