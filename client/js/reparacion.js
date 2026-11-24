const esLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE = esLocal
  ? "http://localhost:5000/api" // Cambia 3000 si tu backend local usa otro puerto
  : "https://taller-informatica-daw.onrender.com/api";

const URL_RENDER = `${API_BASE}/customers`;
const URL_clientes = `${API_BASE}/customers`;
const URL_dispositivos = `${API_BASE}/devices`;
const URL_devices = `${API_BASE}/devices`;
const URL_workOrders = `${API_BASE}/workOrders`;

const tablaReparaciones = document.getElementById("tabla-reparaciones-body");
const orderForm = document.getElementById("order-form");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const selectCustomer = document.getElementById("customer");
const selectDevice = document.getElementById("device");
const formTitle = document.getElementById("formTitle");
const searchInput = document.getElementById("searchInput");

// Leer filtro de cliente desde la URL si viene desde clientes.html
const urlParams = new URLSearchParams(window.location.search);
const clienteIdFiltro = urlParams.get("clienteId");

let editingOrderId = null;
let listaClientes = [];
let listaDispositivos = [];
let reparacionesCache = [];

const prioridadEstado = {
  Pendiente: 0,
  "En reparación": 1,
  Finalizado: 2,
  Entregada: 3,
  Entregado: 3,
};

// Mostrar formulario para CREAR
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editingOrderId = null;
  formTitle.textContent = "Registrar Nueva Orden de Reparación";
  orderForm.reset();
  if (clienteIdFiltro) {
    selectCustomer.value = clienteIdFiltro;
    selectCustomer.dispatchEvent(new Event("change"));
  }
  formContainer.classList.remove("hidden");
  mainGrid.classList.add("show-form");
});

// Ocultar formulario
btnCloseForm.addEventListener("click", () => {
  formContainer.classList.add("hidden");
  mainGrid.classList.remove("show-form");
  editingOrderId = null;
  orderForm.reset();
});

// Cargar datos iniciales para los desplegables
async function cargarCatalogos() {
  try {
    const [resClientes, resDevices] = await Promise.all([
      fetch(URL_clientes),
      fetch(URL_devices),
    ]);

    if (resClientes.ok) listaClientes = await resClientes.json();
    if (resDevices.ok) listaDispositivos = await resDevices.json();

    // Rellenar select de clientes
    selectCustomer.innerHTML =
      '<option value="">Seleccione un cliente...</option>';
    listaClientes.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c._id;
      opt.textContent = `${c.name} ${c.surname || ""} (DNI: ${c.dni})`;
      selectCustomer.appendChild(opt);
    });

    // Si venimos filtrando por clienteId, preseleccionarlo en el formulario
    if (clienteIdFiltro) {
      selectCustomer.value = clienteIdFiltro;
      selectCustomer.dispatchEvent(new Event("change"));
    }
  } catch (error) {
    console.error("Error al cargar catálogos:", error);
  }
}

// Al cambiar de cliente, filtramos los dispositivos de ese cliente en el select de dispositivos
selectCustomer.addEventListener("change", (e) => {
  const customerId = e.target.value;
  selectDevice.innerHTML =
    '<option value="">Seleccione un dispositivo...</option>';

  if (!customerId) return;

  const dispositivosFiltrados = listaDispositivos.filter((d) => {
    const cId = d.customer?._id || d.customer || d.customerId;
    return cId === customerId;
  });

  dispositivosFiltrados.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d._id;
    opt.textContent = `${d.type} - ${d.brand} ${d.model} (SN: ${d.serialNumber || "N/A"})`;
    selectDevice.appendChild(opt);
  });
});

function resolverDatosOrden(orden) {
  const devId = orden.device?._id || orden.device;
  const dispositivo = listaDispositivos.find((d) => d._id === devId);

  let nombreCliente = "N/A";
  let infoDisp = "Dispositivo desconocido";
  let cId = orden.customer?._id || orden.customer || "";

  if (dispositivo) {
    infoDisp = `${dispositivo.type} (${dispositivo.brand} ${dispositivo.model})`;
    cId =
      dispositivo.customer?._id ||
      dispositivo.customer ||
      dispositivo.customerId ||
      cId;
  }

  const cliente = listaClientes.find((c) => c._id === cId);
  if (cliente) {
    nombreCliente = `${cliente.name} ${cliente.surname || ""}`.trim();
  }

  return { infoDisp, nombreCliente, cId };
}

function pintarReparaciones(textoBusqueda = "") {
  const termino = textoBusqueda.trim().toLowerCase();
  let lista = [...reparacionesCache];

  if (clienteIdFiltro) {
    lista = lista.filter((orden) => {
      const { cId } = resolverDatosOrden(orden);
      return cId === clienteIdFiltro;
    });
  }

  if (termino) {
    lista = lista.filter((orden) => {
      const { infoDisp, nombreCliente } = resolverDatosOrden(orden);
      const estado = (orden.status || "").toLowerCase();
      const averia = (orden.issueDescription || "").toLowerCase();
      const diagnostico = (orden.technicianNotes || "").toLowerCase();

      return (
        estado.includes(termino) ||
        nombreCliente.toLowerCase().includes(termino) ||
        infoDisp.toLowerCase().includes(termino) ||
        averia.includes(termino) ||
        diagnostico.includes(termino)
      );
    });
  }

  // Ordenar siempre priorizando "Pendiente" primero
  lista.sort((a, b) => {
    const prioA = prioridadEstado[a.status] ?? 99;
    const prioB = prioridadEstado[b.status] ?? 99;
    return prioA - prioB;
  });

  tablaReparaciones.innerHTML = "";

  if (lista.length === 0) {
    tablaReparaciones.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: #6b7280;">
          ${
            termino
              ? "No se encontraron órdenes que coincidan con la búsqueda."
              : clienteIdFiltro
                ? "Este cliente no tiene órdenes de reparación registradas."
                : "No hay órdenes de reparación registradas."
          }
        </td>
      </tr>
    `;
    return;
  }

  lista.forEach((orden) => {
    const { infoDisp, nombreCliente } = resolverDatosOrden(orden);

    // Clases para el badge de estado
    let badgeClass = "status-pendiente";
    if (orden.status === "En reparación") badgeClass = "status-proceso";
    if (orden.status === "Finalizado") badgeClass = "status-completada";
    if (orden.status === "Entregada" || orden.status === "Entregado")
      badgeClass = "status-entregada";

    const diagnostico = orden.technicianNotes?.trim() || "Sin diagnóstico aún";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${infoDisp}</strong></td>
      <td>${nombreCliente}</td>
      <td><span class="status-badge ${badgeClass}">${orden.status}</span></td>
      <td>${orden.issueDescription || "-"}</td>
      <td>${diagnostico}</td>
      <td>${orden.finalCost ? `${orden.finalCost} €` : orden.estimatedCost ? `${orden.estimatedCost} € (Est.)` : "0.00 €"}</td>
      <td>
        <div class="action-buttons">
          <button onclick="editarReparacion('${orden._id}')" class="btn-action btn-edit" title="Editar Orden">✏️</button>
          <button onclick="eliminarReparacion('${orden._id}')" class="btn-action btn-delete" title="Eliminar Orden">🗑️</button>
        </div>
      </td>
    `;
    tablaReparaciones.appendChild(row);
  });
}

// Cargar listado de órdenes en la tabla
async function cargarReparaciones() {
  try {
    const response = await fetch(URL_workOrders);
    if (!response.ok) throw new Error("Error al obtener las órdenes");

    reparacionesCache = await response.json();
    pintarReparaciones(searchInput ? searchInput.value : "");
  } catch (error) {
    console.error("Error al cargar reparaciones:", error);
  }
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    pintarReparaciones(e.target.value);
  });
}

// Crear o actualizar orden (Submit)
orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const ordenData = Object.fromEntries(formData.entries());

  try {
    const url = editingOrderId
      ? `${URL_workOrders}/${editingOrderId}`
      : URL_workOrders;
    const method = editingOrderId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ordenData),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.message || "Error al guardar la orden");
    }

    orderForm.reset();
    editingOrderId = null;
    formContainer.classList.add("hidden");
    mainGrid.classList.remove("show-form");
    cargarReparaciones();
  } catch (error) {
    console.error("Error al guardar la orden:", error);
    alert(`No se pudo guardar la orden: ${error.message}`);
  }
});

// Cargar datos para EDITAR
window.editarReparacion = async function (id) {
  try {
    const response = await fetch(`${URL_workOrders}/${id}`);
    if (!response.ok) throw new Error("Error al obtener la orden");
    const orden = await response.json();

    const devId = orden.device?._id || orden.device || "";
    const dispositivo = listaDispositivos.find((d) => d._id === devId);

    if (dispositivo) {
      const cId =
        dispositivo.customer?._id ||
        dispositivo.customer ||
        dispositivo.customerId;
      selectCustomer.value = cId || "";

      // Disparar cambio para rellenar dispositivos del cliente
      selectCustomer.dispatchEvent(new Event("change"));
    }

    selectDevice.value = devId;
    document.getElementById("issueDescription").value =
      orden.issueDescription || "";
    document.getElementById("status").value = orden.status || "Pendiente";
    document.getElementById("estimatedCost").value = orden.estimatedCost || "";
    document.getElementById("finalCost").value = orden.finalCost || "";
    document.getElementById("technicianNotes").value =
      orden.technicianNotes || "";

    editingOrderId = id;
    formTitle.textContent = "Editar Orden de Reparación";
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error("Error al cargar orden para editar:", error);
  }
};

// Eliminar orden
window.eliminarReparacion = async function (id) {
  if (
    !confirm("¿Estás seguro de que deseas eliminar esta orden de reparación?")
  )
    return;

  try {
    const response = await fetch(`${URL_workOrders}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar la orden");
    cargarReparaciones();
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("No se pudo eliminar la orden.");
  }
};

// Inicialización
async function init() {
  await cargarCatalogos();
  await cargarReparaciones();
}

init();
