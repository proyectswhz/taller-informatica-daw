const form = document.getElementById("client-form");
const responseMessage = document.getElementById("response-message");
const URL_RENDER = "https://taller-informatica-daw.onrender.com/api/customers";

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const datos = {
    name: document.getElementById("name").value,
    surname: document.getElementById("surname").value,
    dni: document.getElementById("dni").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    address: document.getElementById("address").value,
  };

  try {
    const response = await fetch(URL_RENDER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datos),
    });
    if (response.ok) {
      const result = await response.json();
      responseMessage.textContent = "Cliente creado con éxito.";
      responseMessage.classList.add("success");
      form.reset();
    } else {
      const errorData = await response.json();
      responseMessage.textContent = `Error al crear el cliente: ${errorData.message}`;
      responseMessage.classList.add("error");
    }
  } catch (error) {
    responseMessage.textContent =
      "Error al crear el cliente. Por favor, inténtelo de nuevo más tarde.";
    responseMessage.classList.add("error");
  }
});
