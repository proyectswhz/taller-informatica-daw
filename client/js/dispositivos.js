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
    if (!response.ok) {
      throw new Error("Error al obtener los dispositivos");
    }
    const dispositivos = await response.json();
    tablaDispositivos.innerHTML = ""; // Limpiar la tabla antes de llenarla
    dispositivos.forEach((dispositivo) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${dispositivo.customerId ? dispositivo.customerId.name : "N/A"}</td>
                <td>${dispositivo.name}</td>
                <td>${dispositivo.brand}</td>
                <td>${dispositivo.model}</td>
                <td>${dispositivo.serialNumber}</td>
                <td>${dispositivo.observations}</td>
            `;
      tablaDispositivos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al cargar los dispositivos:", error);
  }
}

cargarDispositivos();
