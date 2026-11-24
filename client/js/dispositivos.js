const URL_dispositivos =
  "https://taller-informatica-daw.onrender.com/api/devices";
const URL_clientes =
  "https://taller-informatica-daw.onrender.com/api/customers";

const tablaDispositivos = document.getElementById("tabla-dispositivos-body");
const dispositivosForm = document.getElementById("device-form");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const selectCliente = document.getElementById("customer");
const formTitle = document.getElementById("formTitle");
const searchInput =
  document.getElementById("searchInput") ||
  document.getElementById("searchDeviceInput");

const urlParams = new URLSearchParams(window.location.search);
const clienteIdFiltro = urlParams.get("clienteId");

let editingDeviceId = null;
let dispositivosCache = [];
let clientesCache = [];

function obtenerClienteId(dispositivo) {
  return (
    dispositivo.customer?._id ||
    dispositivo.customer ||
    dispositivo.customerId ||
    ""
  );
}

// 1. Mostrar formulario para CREAR
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editingDeviceId = null;
  formTitle.textContent = "Registrar Nuevo Dispositivo";
  dispositivosForm.reset();
  if (clienteIdFiltro && selectCliente) {
    selectCliente.value = clienteIdFiltro;
  }
  formContainer.classList.remove("hidden");
  mainGrid.classList.add("show-form");
});

// Ocultar formulario
btnCloseForm.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  mainGrid.classList.remove("show-form");
  editingDeviceId = null;
  dispositivosForm.reset();
});

// 2. Cargar clientes en el desplegable `<select>`
async function cargarClientesEnSelect(clientes = clientesCache) {
  try {
    if (!selectCliente) return;

    selectCliente.innerHTML =
      '<option value="">Seleccione un cliente...</option>';
    clientes.forEach((cliente) => {
      const option = document.createElement("option");
      option.value = cliente._id;
      option.textContent = `${cliente.name} ${cliente.surname || ""} (DNI: ${cliente.dni})`;
      selectCliente.appendChild(option);
    });

    if (clienteIdFiltro) {
      selectCliente.value = clienteIdFiltro;
    }
  } catch (error) {
    console.error("Error al poblar clientes en el select:", error);
  }
}

// Pintar tabla filtrando por clienteId (URL) y/o nombre de cliente (buscador)
function pintarDispositivos(textoBusqueda = "") {
  const termino = textoBusqueda.trim().toLowerCase();
  let filtrados = [...dispositivosCache];

  if (clienteIdFiltro) {
    filtrados = filtrados.filter(
      (d) => obtenerClienteId(d) === clienteIdFiltro,
    );
  }

  if (termino) {
    const idsClientesCoincidentes = clientesCache
      .filter((c) => {
        const nombreCompleto = `${c.name || ""} ${c.surname || ""}`
          .trim()
          .toLowerCase();
        return nombreCompleto.includes(termino);
      })
      .map((c) => c._id);

    filtrados = filtrados.filter((d) =>
      idsClientesCoincidentes.includes(obtenerClienteId(d)),
    );
  }

  tablaDispositivos.innerHTML = "";

  if (filtrados.length === 0) {
    tablaDispositivos.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #6b7280;">
          ${
            termino
              ? "No se encontraron dispositivos para ese nombre de cliente."
              : clienteIdFiltro
                ? "Este cliente no tiene dispositivos registrados."
                : "No hay dispositivos registrados."
          }
        </td>
      </tr>
    `;
    return;
  }

  filtrados.forEach((dispositivo) => {
    const clienteId = obtenerClienteId(dispositivo);
    const clienteEncontrado = clientesCache.find((c) => c._id === clienteId);
    const nombreCliente = clienteEncontrado
      ? `${clienteEncontrado.name} ${clienteEncontrado.surname || ""}`.trim()
      : "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${nombreCliente}</strong></td>
      <td>${dispositivo.type}</td>
      <td>${dispositivo.brand}</td>
      <td>${dispositivo.model}</td>
      <td>${dispositivo.serialNumber || "-"}</td>
      <td>${dispositivo.observations || "-"}</td>
      <td>
        <div class="action-buttons">
          <button onclick="editarDispositivo('${dispositivo._id}')" class="btn-action btn-edit" title="Editar Dispositivo">✏️</button>
          <button onclick="eliminarDispositivo('${dispositivo._id}')" class="btn-action btn-delete" title="Eliminar Dispositivo">🗑️</button>
        </div>
      </td>
    `;
    tablaDispositivos.appendChild(row);
  });
}

// 3. Cargar listado de dispositivos y asociarlos con su cliente
async function cargarDispositivos() {
  try {
    const [response, responseClientes] = await Promise.all([
      fetch(URL_dispositivos),
      fetch(URL_clientes),
    ]);

    if (!response.ok) throw new Error("Error al obtener los dispositivos");
    if (!responseClientes.ok) throw new Error("Error al obtener los clientes");

    dispositivosCache = await response.json();
    clientesCache = await responseClientes.json();

    await cargarClientesEnSelect(clientesCache);
    pintarDispositivos(searchInput ? searchInput.value : "");
  } catch (error) {
    console.error("Error al cargar los dispositivos:", error);
  }
}

// Búsqueda en tiempo real por nombre de cliente
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    pintarDispositivos(e.target.value);
  });
}

// 4. Crear o actualizar dispositivo (Submit)
dispositivosForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(dispositivosForm);
  const dispositivoData = Object.fromEntries(formData.entries());

  try {
    const url = editingDeviceId
      ? `${URL_dispositivos}/${editingDeviceId}`
      : URL_dispositivos;
    const method = editingDeviceId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dispositivoData),
    });

    if (!response.ok) throw new Error("Error al guardar el dispositivo");

    dispositivosForm.reset();
    editingDeviceId = null;
    formContainer.classList.add("hidden");
    mainGrid.classList.remove("show-form");
    cargarDispositivos();
  } catch (error) {
    console.error("Error al guardar el dispositivo:", error);
    alert("No se pudo guardar el dispositivo.");
  }
});

// 5. Cargar datos en el formulario para EDITAR
window.editarDispositivo = async function (id) {
  try {
    const response = await fetch(`${URL_dispositivos}/${id}`);
    if (!response.ok)
      throw new Error("Error al obtener los datos del dispositivo");
    const dispositivo = await response.json();

    if (selectCliente) {
      selectCliente.value = obtenerClienteId(dispositivo);
    }
    document.getElementById("type").value = dispositivo.type || "";
    document.getElementById("brand").value = dispositivo.brand || "";
    document.getElementById("model").value = dispositivo.model || "";
    document.getElementById("serialNumber").value =
      dispositivo.serialNumber || "";
    document.getElementById("observations").value =
      dispositivo.observations || "";

    editingDeviceId = id;
    formTitle.textContent = "Editar Dispositivo";
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error(
      "Error al cargar los datos del dispositivo para editar:",
      error,
    );
  }
};

// 6. Eliminar dispositivo
window.eliminarDispositivo = async function (id) {
  if (!confirm("¿Estás seguro de que deseas eliminar este dispositivo?"))
    return;

  try {
    const response = await fetch(`${URL_dispositivos}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar el dispositivo");
    cargarDispositivos();
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar el dispositivo.");
  }
};

// Inicialización al cargar la página
cargarDispositivos();
