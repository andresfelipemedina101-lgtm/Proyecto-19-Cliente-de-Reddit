
const agregar = document.getElementById("agregar");
const guardar = document.getElementById("guardar");
const cancelar = document.getElementById("cancelar");
const formulario = document.getElementById("formulario");
const idUsuario = document.getElementById("idUsuario");
const carriles = document.getElementById("carriles");
const mensaje = document.getElementById("mensaje");

let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

agregar.addEventListener("click", () => {
    formulario.hidden = false;
});

cancelar.addEventListener("click", () => {
    formulario.hidden = true;
});

guardar.addEventListener("click", async () => {
    const id = Number(idUsuario.value);

    if (!id || id < 1 || id > 10) {
        mensaje.textContent = "Ingrese un ID entre 1 y 10";
        return;
    }

    if (usuarios.includes(id)) {
        mensaje.textContent = "Este usuario ya existe";
        return;
    }

    mensaje.textContent = "Cargando...";

    try {
        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/users/" + id
        );

        if (!respuesta.ok) throw new Error();

        const usuario = await respuesta.json();

        usuarios.push(id);
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        mostrarUsuario(usuario);

        formulario.hidden = true;
        idUsuario.value = "";
        mensaje.textContent = "Usuario agregado";

    } catch (error) {
        mensaje.textContent = "Error al consultar el usuario";
    }
});

function mostrarUsuario(usuario) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "carril";
    tarjeta.id = "usuario-" + usuario.id;

    tarjeta.innerHTML = `
        <h2>${usuario.name}</h2>
        <p><b>ID:</b> ${usuario.id}</p>
        <p><b>Usuario:</b> ${usuario.username}</p>
        <p><b>Correo:</b> ${usuario.email}</p>
        <p><b>Ciudad:</b> ${usuario.address.city}</p>
        <p><b>Empresa:</b> ${usuario.company.name}</p>
        <button onclick="actualizarUsuario(${usuario.id})">Actualizar</button>
        <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
    `;

    carriles.appendChild(tarjeta);
}

async function actualizarUsuario(id) {
    mensaje.textContent = "Actualizando...";

    try {
        const respuesta = await fetch(
            "https://jsonplaceholder.typicode.com/users/" + id
        );

        if (!respuesta.ok) throw new Error();

        const usuario = await respuesta.json();

        document.getElementById("usuario-" + id).remove();
        mostrarUsuario(usuario);

        mensaje.textContent = "Usuario actualizado";

    } catch (error) {
        mensaje.textContent = "Error al actualizar";
    }
}

function eliminarUsuario(id) {
    usuarios = usuarios.filter(usuario => usuario !== id);

    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    document.getElementById("usuario-" + id).remove();

    mensaje.textContent = "Usuario eliminado";
}

async function cargarUsuarios() {
    for (const id of usuarios) {
        await actualizarUsuario(id);
    }

    mensaje.textContent = "";
}

cargarUsuarios();
