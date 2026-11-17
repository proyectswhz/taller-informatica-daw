const URL_workOrders =
  "https://taller-informatica-daw.onrender.com/api/workOrders";
const URL_devices = "https://taller-informatica-daw.onrender.com/api/devices";
const URL_clientes =
  "https://taller-informatica-daw.onrender.com/api/customers";

const tablaReparaciones = document.getElementById("tabla-reparaciones-body");
const orderForm = document.getElementById("order-form");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const selectDevice = document.getElementById("device");
const formTitle = document.getElementById("formTitle");

let editingOrderId = null;

// 1. Mostrar formulario para CREAR
btnToggleForm.addEventListener("click", (e) => {
  e.preventDefault();
  editingOrderId = null;
  formTitle.textContent = "Registrar Nueva Orden de Reparación";
  orderForm.reset();
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

// 2. Cargar dispositivos en el desplegable `<select>` del formulario
async function cargarDispositivosEnSelect() {
  try {
    const response = await fetch(URL_devices);
    const responseClientes = await fetch(URL_clientes);
    if (!response.ok || !responseClientes.ok)
      throw new Error("Error al obtener datos de apoyo");

    const dispositivos = await response.json();
    const clientes = await responseClientes.json();

    selectDevice.innerHTML =
      '<option value="">Seleccione un dispositivo...</option>';
    dispositivos.forEach((device) => {
      const clienteId =
        device.customer?._id || device.customer || device.customerId;
      const clienteEncontrado = clientes.find((c) => c._id === clienteId);
      const nombreCliente = clienteEncontrado
        ? `${clienteEncontrado.name} ${clienteEncontrado.surname || ""}`
        : "Sin cliente";

      const option = document.createElement("option");
      option.value = device._id;
      option.textContent = `${device.type} - ${device.brand} ${device.model} (Prop: ${nombreCliente})`;
      selectDevice.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar dispositivos en select:", error);
  }
}

// 3. Cargar listado de órdenes de reparación en la tabla
async function cargarReparaciones() {
  try {
    const response = await fetch(URL_workOrders);
    const responseDevices = await fetch(URL_devices);
    const responseClientes = await fetch(URL_clientes);

    if (!response.ok)
      throw new Error("Error al obtener las órdenes de reparación");

    const reparaciones = await response.json();
    const dispositivos = responseDevices.ok ? await responseDevices.json() : [];
    const clientes = responseClientes.ok ? await responseClientes.json() : [];

    tablaReparaciones.innerHTML = "";

    reparaciones.forEach((orden) => {
      // Buscar dispositivo asociado
      const deviceId = orden.device?._id || orden.device;
      const dispositivoEncontrado = dispositivos.find(
        (d) => d._id === deviceId,
      );

      // Buscar cliente propietario del dispositivo
      let nombreCliente = "N/A";
      if (dispositivoEncontrado) {
        const clienteId =
          dispositivoEncontrado.customer?._id ||
          dispositivoEncontrado.customer ||
          dispositivoEncontrado.customerId;
        const clienteEncontrado = clientes.find((c) => c._id === clienteId);
        if (clienteEncontrado) {
          nombreCliente = `${clienteEncontrado.name} ${clienteEncontrado.surname || ""}`;
        }
      }

      const infoDispositivo = dispositivoEncontrado
        ? `${dispositivoEncontrado.type} (${dispositivoEncontrado.brand} ${dispositivoEncontrado.model})`
        : "Dispositivo desconocido";

      // Color de badge según estado
      let badgeClass = "status-pendiente";
      if (orden.status === "En Proceso") badgeClass = "status-proceso";
      if (orden.status === "Completada") badgeClass = "status-completada";
      if (orden.status === "Entregada") badgeClass = "status-entregada";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><strong>${infoDispositivo}</strong></td>
        <td>${nombreCliente}</td>
        <td><span class="status-badge ${badgeClass}">${orden.status}</span></td>
        <td>${orden.diagnosis || "Sin diagnóstico registrado"}</td>
        <td>${orden.cost ? `${orden.cost} €` : "0.00 €"}</td>
        <td>
          <div class="action-buttons">
            <button onclick="editarReparacion('${orden._id}')" class="btn-action btn-edit" title="Editar Orden">✏️</button>
            <button onclick="eliminarReparacion('${orden._id}')" class="btn-action btn-delete" title="Eliminar Orden">🗑️</button>
          </div>
        </td>
      `;
      tablaReparaciones.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar reparaciones:", error);
  }
}

// 4. Crear o actualizar orden de reparación
orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(orderForm);
  const ordenData = Object.fromEntries(formData.entries());

  try {
    let response;
    if (editingOrderId) {
      response = await fetch(`${URL_workOrders}/${editingOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordenData),
      });
    } else {
      response = await fetch(URL_workOrders, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ordenData),
      });
    }

    if (!response.ok)
      throw new Error("Error al guardar la orden de reparación");

    orderForm.reset();
    editingOrderId = null;
    formContainer.classList.add("hidden");
    mainGrid.classList.remove("show-form");
    cargarReparaciones();
  } catch (error) {
    console.error("Error al guardar la orden:", error);
    alert("No se pudo guardar la orden de reparación.");
  }
});

// 5. Cargar datos para EDITAR
window.editarReparacion = async function (id) {
  try {
    const response = await fetch(`${URL_workOrders}/${id}`);
    if (!response.ok) throw new Error("Error al obtener la orden");
    const orden = await response.json();

    selectDevice.value = orden.device?._id || orden.device || "";
    document.getElementById("status").value = orden.status || "Pendiente";
    document.getElementById("diagnosis").value = orden.diagnosis || "";
    document.getElementById("cost").value = orden.cost || "";

    editingOrderId = id;
    formTitle.textContent = "Editar Orden de Reparación";
    formContainer.classList.remove("hidden");
    mainGrid.classList.add("show-form");
  } catch (error) {
    console.error("Error al cargar orden para editar:", error);
  }
};

// 6. Eliminar orden
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

// Inicialización al cargar la página
cargarDispositivosEnSelect();
cargarReparaciones();
