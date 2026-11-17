const URL_RENDER = "https://taller-informatica-daw.onrender.com/api/customers";
const tablaClientes = document.getElementById("tabla-clientes-body");
const btnToggleForm = document.getElementById("btnToggleForm");
const btnCloseForm = document.getElementById("btnCloseForm");
const formContainer = document.getElementById("formContainer");
const mainGrid = document.getElementById("mainGrid");
const clientForm = document.getElementById("client-form");
const responseMessage = document.getElementById("response-message");

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
function verReparacionesCliente(id) {
  // Puedes redirigir a una vista general o específica pasando el ID por URL
  window.location.href = `reparaciones.html?clienteId=${id}`;
}

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

cargarClientes();
