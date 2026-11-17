const URL_dispositivos =
  "https://taller-informatica-daw.onrender.com/api/devices";
const URL_clientes =
  "https://taller-informatica-daw.onrender.com/api/customers";

const tablaDispositivos = document.getElementById("tabla-dispositivos-body");
const dispositivosForm = document.getElementById("device-form"); // Corregido: era client-form
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
let editingDeviceId = null; // Variable para almacenar el ID del dispositivo que se está editando

let editandoId = null;
// 1. Mostrar/Ocultar el formulario al hacer clic en "Nuevo Cliente"
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editandoId = null; // Limpiamos el ID por si veníamos de editar
  formContainer.classList.remove("hidden");
  mainGrid.classList.add("show-form");
});

btnCloseForm.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  mainGrid.classList.remove("show-form");
  editandoId = null;
  dispositivosForm.reset();
});
// 1. Cargar dispositivos al cargar la página
async function cargarDispositivos() {
  try {
    const response = await fetch(URL_dispositivos);
    const responseClientes = await fetch(URL_clientes);

    if (!response.ok) throw new Error("Error al obtener los dispositivos");
    if (!responseClientes.ok) throw new Error("Error al obtener los clientes");

    const dispositivos = await response.json();
    const clientes = await responseClientes.json();

    tablaDispositivos.innerHTML = ""; // Limpiar la tabla antes de llenarla

    dispositivos.forEach((dispositivo) => {
      // Buscamos el cliente asociado (manejando si viene como objeto ID o string)
      const clienteId =
        dispositivo.customer?._id ||
        dispositivo.customer ||
        dispositivo.customerId;
      const clienteEncontrado = clientes.find((c) => c._id === clienteId);
      const nombreCliente = clienteEncontrado
        ? `${clienteEncontrado.name} ${clienteEncontrado.surname || ""}`
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
  } catch (error) {
    console.error("Error al cargar los dispositivos:", error);
  }
}

// 2. Crear o actualizar dispositivo
dispositivosForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(dispositivosForm);
  const dispositivoData = Object.fromEntries(formData.entries());

  try {
    let response;
    if (editingDeviceId) {
      // Actualizar dispositivo existente
      response = await fetch(`${URL_dispositivos}/${editingDeviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dispositivoData),
      });
    } else {
      // Crear nuevo dispositivo
      response = await fetch(URL_dispositivos, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dispositivoData),
      });
    }

    if (!response.ok) throw new Error("Error al guardar el dispositivo");

    dispositivosForm.reset();
    editingDeviceId = null;
    formContainer.classList.add("hidden");
    mainGrid.classList.remove("show-form");
    cargarDispositivos(); // Recargar la lista
  } catch (error) {
    console.error("Error al guardar el dispositivo:", error);
    alert("No se pudo guardar el dispositivo.");
  }
});

// 3. Cargar datos en el formulario para editar
window.editarDispositivo = async function (id) {
  try {
    const response = await fetch(`${URL_dispositivos}/${id}`);
    if (!response.ok)
      throw new Error("Error al obtener los datos del dispositivo");
    const dispositivo = await response.json();

    // Rellenamos los campos del formulario
    document.getElementById("type").value = dispositivo.type || "";
    document.getElementById("brand").value = dispositivo.brand || "";
    document.getElementById("model").value = dispositivo.model || "";
    document.getElementById("serialNumber").value =
      dispositivo.serialNumber || "";
    document.getElementById("observations").value =
      dispositivo.observations || "";

    editingDeviceId = id; // Guardar el ID para saber que estamos editando
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error("Error al cargar los datos del dispositivo:", error);
  }
};

// 4. Eliminar dispositivo
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

// Inicializar listado al cargar la página
cargarDispositivos();
