const URL_RENDER = "https://taller-informatica-daw.onrender.com/api/customers";
const URL_DEVICES = "https://taller-informatica-daw.onrender.com/api/devices";

const tablaClientes = document.getElementById("tabla-clientes-body");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const clientForm = document.getElementById("client-form");
const clientFormTitle = document.getElementById("clientFormTitle");
const responseMessage = document.getElementById("response-message");

// Referencias del Modal de Perfil
const profileModal = document.getElementById("profileModal");
const btnCloseProfileModal = document.getElementById("btnCloseProfileModal");
const profileDetails = document.getElementById("profileDetails");

// Referencias del Modal de Dispositivos
const deviceModal = document.getElementById("deviceModal");
const btnCloseDeviceModal = document.getElementById("btnCloseDeviceModal");
const deviceForm = document.getElementById("device-form");
const modalCustomerId = document.getElementById("modalCustomerId");
const deviceResponseMessage = document.getElementById(
  "device-response-message",
);

// Referencia al input de búsqueda de la vista
const searchInput = document.getElementById("searchInput");

let editandoId = null;
let clientesCache = [];

// 1. Mostrar/Ocultar el formulario al hacer clic en "Nuevo Cliente"
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editandoId = null;
  clientFormTitle.textContent = "Registrar Nuevo Cliente";
  responseMessage.className = "message-box";
  responseMessage.textContent = "";
  clientForm.reset();
  formContainer.classList.remove("hidden");
  mainGrid.classList.add("show-form");
});

btnCloseForm.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  mainGrid.classList.remove("show-form");
  editandoId = null;
  clientForm.reset();
});

// Pintar la tabla solo con Nombre y Apellidos + Acciones
function pintarTablaClientes(clientes) {
  tablaClientes.innerHTML = "";

  if (!clientes || clientes.length === 0) {
    tablaClientes.innerHTML = `<tr><td colspan="2" style="text-align: center; color: #9ca3af;">No se encontraron clientes</td></tr>`;
    return;
  }

  clientes.forEach((cliente) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>
        <button
          type="button"
          onclick="verDispositivosCliente('${cliente._id}')"
          style="background: none; border: none; color: #1e3a8a; font-weight: 700; font-size: 0.95rem; cursor: pointer; text-align: left; padding: 0;"
          title="Ver dispositivos de este cliente"
        >
          ${cliente.name} ${cliente.surname}
        </button>
      </td>
      <td>
        <div class="action-buttons">
          <button onclick="verPerfilCliente('${cliente._id}')" class="btn-action btn-device" title="Ver Perfil">👤</button>
          <button onclick="abrirDispositivo('${cliente._id}')" class="btn-action btn-device" title="Añadir Dispositivo">💻</button>
          <button onclick="verReparacionesCliente('${cliente._id}')" class="btn-action btn-reparaciones" title="Ver Reparaciones">📋</button>
          <button onclick="editarCliente('${cliente._id}')" class="btn-action btn-edit" title="Editar Cliente">✏️</button>
          <button onclick="eliminarCliente('${cliente._id}')" class="btn-action btn-delete" title="Borrar Cliente">🗑️</button>
        </div>
      </td>
    `;
    tablaClientes.appendChild(fila);
  });
}

// 2. Cargar clientes desde la API de Render
async function cargarClientes() {
  try {
    const response = await fetch(URL_RENDER);
    if (!response.ok) {
      throw new Error("Error al cargar los clientes");
    }

    const clientes = await response.json();
    clientesCache = clientes;
    pintarTablaClientes(clientes);
  } catch (error) {
    console.error("Error de red:", error);
  }
}

// 3. Crear o editar cliente al enviar el formulario
clientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const datos = {
    name: document.getElementById("name").value.trim(),
    surname: document.getElementById("surname").value.trim(),
    dni: document.getElementById("dni").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  try {
    const url = editandoId ? `${URL_RENDER}/${editandoId}` : URL_RENDER;
    const method = editandoId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

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
      const errorData = await response.json().catch(() => ({}));
      responseMessage.textContent = `Error: ${errorData.message || "No se pudo guardar el cliente"}`;
      responseMessage.className = "message-box error";
    }
  } catch (error) {
    responseMessage.textContent = "Error de red al procesar la solicitud";
    responseMessage.className = "message-box error";
  }
});

// Redirige a la vista de dispositivos filtrando por clienteId
function verDispositivosCliente(clienteId) {
  window.location.href = `dispositivos.html?clienteId=${clienteId}`;
}

// Redirige a la vista de reparaciones filtrando por clienteId
function verReparacionesCliente(clienteId) {
  window.location.href = `reparaciones.html?clienteId=${clienteId}`;
}

// Abre el modal con todos los datos del cliente
function verPerfilCliente(clienteId) {
  const cliente = clientesCache.find((c) => c._id === clienteId);
  if (!cliente) return;

  profileDetails.innerHTML = `
    <p><strong>Nombre:</strong> ${cliente.name || "-"}</p>
    <p><strong>Apellidos:</strong> ${cliente.surname || "-"}</p>
    <p><strong>DNI:</strong> ${cliente.dni || "-"}</p>
    <p><strong>Teléfono:</strong> ${cliente.phone || "-"}</p>
    <p><strong>Email:</strong> ${cliente.email || "-"}</p>
    <p><strong>Dirección:</strong> ${cliente.address || "No especificada"}</p>
  `;
  profileModal.classList.remove("hidden");
}

btnCloseProfileModal.addEventListener("click", () => {
  profileModal.classList.add("hidden");
});

profileModal.addEventListener("click", (e) => {
  if (e.target === profileModal) {
    profileModal.classList.add("hidden");
  }
});

// Botón editar: cargar datos del cliente en el formulario
async function editarCliente(id) {
  try {
    const response = await fetch(`${URL_RENDER}/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener los datos del cliente");
    }
    const cliente = await response.json();

    document.getElementById("name").value = cliente.name || "";
    document.getElementById("surname").value = cliente.surname || "";
    document.getElementById("dni").value = cliente.dni || "";
    document.getElementById("phone").value = cliente.phone || "";
    document.getElementById("email").value = cliente.email || "";
    document.getElementById("address").value = cliente.address || "";

    editandoId = id;
    clientFormTitle.textContent = "Editar Cliente";
    responseMessage.className = "message-box";
    responseMessage.textContent = "";
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error("Error al cargar los datos del cliente:", error);
    alert("No se pudieron cargar los datos del cliente. Inténtalo de nuevo.");
  }
}

// Modal añadir dispositivo
function abrirDispositivo(clienteId) {
  modalCustomerId.value = clienteId;
  deviceForm.reset();
  deviceResponseMessage.className = "message-box";
  deviceResponseMessage.textContent = "";
  deviceModal.classList.remove("hidden");
}

btnCloseDeviceModal.addEventListener("click", () => {
  deviceModal.classList.add("hidden");
});

deviceModal.addEventListener("click", (e) => {
  if (e.target === deviceModal) {
    deviceModal.classList.add("hidden");
  }
});

deviceForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const clienteId = modalCustomerId.value;
  const deviceData = {
    customer: clienteId,
    type: document.getElementById("deviceType").value.trim(),
    brand: document.getElementById("deviceBrand").value.trim(),
    model: document.getElementById("deviceModel").value.trim(),
    serialNumber: document.getElementById("serialNumber").value.trim(),
    observations: document.getElementById("deviceObservations").value.trim(),
  };

  try {
    const response = await fetch(URL_DEVICES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deviceData),
    });

    if (response.ok) {
      deviceResponseMessage.textContent = "¡Dispositivo añadido con éxito!";
      deviceResponseMessage.className = "message-box success";
      setTimeout(() => {
        deviceModal.classList.add("hidden");
      }, 1500);
    } else {
      const err = await response.json().catch(() => ({}));
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
      console.error("Error al eliminar el cliente:", error);
      alert(
        "Error de red al intentar eliminar el cliente. Inténtalo de nuevo.",
      );
    }
  }
}

// Buscar en tiempo real mientras el usuario escribe
searchInput.addEventListener("input", async (e) => {
  const searchTerm = e.target.value.trim();

  try {
    const response = await fetch(
      `${URL_RENDER}?cliente=${encodeURIComponent(searchTerm)}`,
    );
    if (!response.ok) throw new Error("Error en la búsqueda");

    const clientes = await response.json();
    clientesCache = clientes;
    pintarTablaClientes(clientes);
  } catch (error) {
    console.error("Error al buscar clientes:", error);
  }
});

async function checkServerStatus() {
  const statusDot = document.getElementById("status-dot");
  const statusText = document.getElementById("status-text");

  if (!statusDot || !statusText) return;

  const urlRoot = "https://taller-informatica-daw.onrender.com/api/health";

  try {
    statusDot.className = "status-dot checking";
    statusText.textContent = "Conectando con servidor...";

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

cargarClientes();
checkServerStatus();
