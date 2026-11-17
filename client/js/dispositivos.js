const URL_dispositivos =
  "https://taller-informatica-daw.onrender.com/api/devices";
const URL_clientes =
  "https://taller-informatica-daw.onrender.com/api/customers";

const tablaDispositivos = document.getElementById("tabla-dispositivos-body");
const dispositivosForm = document.getElementById("client-form");

// Cargar dispositivos al cargar la página
async function cargarDispositivos() {
  try {
    const response = await fetch(URL_dispositivos);
    const responseClientes = await fetch(URL_clientes);

    if (!response.ok) {
      throw new Error("Error al obtener los dispositivos");
    }
    if (!responseClientes.ok) {
      throw new Error("Error al obtener los clientes");
    }

    const dispositivos = await response.json();
    const clientes = await responseClientes.json();

    tablaDispositivos.innerHTML = ""; // Limpiar la tabla antes de llenarla
    dispositivos.forEach((dispositivo) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${dispositivo.customerId ? clientes.find((c) => c._id === dispositivo.customerId).name : "N/A"}</td>
                <td>${dispositivo.name}</td>
                <td>${dispositivo.brand}</td>
                <td>${dispositivo.model}</td>
                <td>${dispositivo.serialNumber}</td>
                <td>${dispositivo.observations}</td>
                <td>
                    <button  onclick="editarDispositivo('${dispositivo._id}')" class="btn-action btn-edit" data-id="${dispositivo._id}" title="Editar Dispositivo">✏️</button>
                    <button onclick="eliminarDispositivo('${dispositivo._id}')" class="btn-action btn-delete" data-id="${dispositivo._id}" title="Eliminar Dispositivo">🗑️</button>
                </td>
            `;
      tablaDispositivos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar los dispositivos:", error);
  }
}

cargarDispositivos();
