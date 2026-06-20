/*
================================================================================
ARCHIVO: script.js
FUNCION GENERAL:
Este archivo controla la logica del formulario.
Aqui se capturan los datos, se validan, se envian al backend y se muestran registros.
Los comentarios explican cada linea o cada bloque de forma detallada para uso en clase.
================================================================================
*/

// Guardamos en una constante la direccion base de la API del backend.
// Usamos una ruta relativa porque el frontend y el backend se ejecutan en el mismo servidor.
const API_URL = "/api/inscripciones";

// Buscamos en el HTML el formulario que tiene el id "formularioInscripcion".
// Esta constante nos permite escuchar cuando el usuario intenta enviar el formulario.
const formulario = document.getElementById("formularioInscripcion");

// Buscamos el campo donde el usuario escribe su nombre completo.
// Con esta referencia podremos leer y validar el nombre escrito.
const nombre = document.getElementById("nombre");

// Buscamos el campo donde el usuario escribe su correo electronico.
// Este dato sera validado para comprobar que tenga formato de correo.
const correo = document.getElementById("correo");

// Buscamos el campo donde el usuario escribe su edad.
// Este dato se validara para asegurar que sea un numero mayor o igual a 12.
const edad = document.getElementById("edad");

// Buscamos el campo donde el usuario escribe su numero de contacto.
// Este dato se validara para comprobar que tenga exactamente 10 digitos.
const telefono = document.getElementById("telefono");

// Buscamos la lista desplegable donde el usuario selecciona el taller de interes.
// Este campo se validara para asegurar que el usuario seleccione una opcion real.
const taller = document.getElementById("taller");

// Buscamos el campo de observacion.
// Este campo sera opcional, por eso no se obliga al usuario a llenarlo.
const observacion = document.getElementById("observacion");

// Buscamos el contenedor del mensaje general.
// Aqui mostraremos mensajes como "Inscripcion guardada" o "Corrige los errores".
const mensajeGeneral = document.getElementById("mensajeGeneral");

// Buscamos el espacio donde se mostrara el error del nombre.
// Tener un espacio separado para cada error permite orientar mejor al usuario.
const errorNombre = document.getElementById("errorNombre");

// Buscamos el espacio donde se mostrara el error del correo.
const errorCorreo = document.getElementById("errorCorreo");

// Buscamos el espacio donde se mostrara el error de la edad.
const errorEdad = document.getElementById("errorEdad");

// Buscamos el espacio donde se mostrara el error del telefono.
const errorTelefono = document.getElementById("errorTelefono");

// Buscamos el espacio donde se mostrara el error del taller.
const errorTaller = document.getElementById("errorTaller");

// Buscamos el contenedor donde se van a mostrar las inscripciones guardadas.
const listaInscripciones = document.getElementById("listaInscripciones");

/*
================================================================================
FUNCION: limpiarErrores
OBJETIVO:
Borrar los mensajes de error anteriores antes de hacer una nueva validacion.
Esto evita que queden mensajes viejos en pantalla cuando el usuario corrige los datos.
================================================================================
*/
function limpiarErrores() {
    // Dejamos vacio el mensaje de error del nombre.
    errorNombre.textContent = "";

    // Dejamos vacio el mensaje de error del correo.
    errorCorreo.textContent = "";

    // Dejamos vacio el mensaje de error de la edad.
    errorEdad.textContent = "";

    // Dejamos vacio el mensaje de error del telefono.
    errorTelefono.textContent = "";

    // Dejamos vacio el mensaje de error del taller.
    errorTaller.textContent = "";

    // Ocultamos el mensaje general para que no se mezcle con una nueva validacion.
    mensajeGeneral.className = "mensaje oculto";

    // Borramos el texto del mensaje general.
    mensajeGeneral.textContent = "";
}

/*
================================================================================
FUNCION: mostrarMensaje
PARAMETROS:
texto: mensaje que queremos mostrar.
tipo: puede ser "exito" o "fallo" para cambiar el color del mensaje.
================================================================================
*/
function mostrarMensaje(texto, tipo) {
    // Insertamos el texto recibido dentro del contenedor de mensajes.
    mensajeGeneral.textContent = texto;

    // Asignamos las clases CSS necesarias para mostrar el mensaje con el color correcto.
    mensajeGeneral.className = `mensaje ${tipo}`;
}

/*
================================================================================
FUNCION: parseJsonResponse
OBJETIVO:
Intentar convertir la respuesta del servidor a JSON.
Si el cuerpo no es JSON, lanzar un error con el texto devuelto.
================================================================================
*/
async function parseJsonResponse(respuesta) {
    const texto = await respuesta.text();

    if (!texto) {
        return null;
    }

    try {
        return JSON.parse(texto);
    } catch (error) {
        throw new Error(`Respuesta no valida del servidor: ${texto}`);
    }
}

/*
================================================================================
FUNCION: validarFormulario
OBJETIVO:
Revisar que los datos ingresados cumplan las reglas del proyecto.
Si todo esta correcto, devuelve true.
Si hay errores, devuelve false.
================================================================================
*/
function validarFormulario() {
    // Limpiamos errores anteriores para comenzar la validacion desde cero.
    limpiarErrores();

    // Creamos una variable booleana llamada esValido.
    // Inicia en true porque asumimos que el formulario esta bien hasta encontrar un error.
    let esValido = true;

    // Obtenemos el valor del campo nombre y usamos trim para quitar espacios al inicio y al final.
    const valorNombre = nombre.value.trim();

    // Obtenemos el valor del campo correo y quitamos espacios innecesarios.
    const valorCorreo = correo.value.trim();

    // Obtenemos el valor del campo edad y quitamos espacios innecesarios.
    const valorEdad = edad.value.trim();

    // Obtenemos el valor del campo telefono y quitamos espacios innecesarios.
    const valorTelefono = telefono.value.trim();

    // Obtenemos el valor seleccionado en la lista de talleres.
    const valorTaller = taller.value;

    // Creamos una expresion regular para validar correos de forma sencilla.
    // Esta regla revisa que haya texto antes y despues del simbolo @ y un punto al final.
    const reglaCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Creamos una expresion regular para validar telefonos de 10 digitos.
    // \d representa un digito y {10} significa exactamente diez veces.
    const reglaTelefono = /^\d{10}$/;

    // Validamos si el nombre esta vacio.
    if (valorNombre === "") {
        // Mostramos un mensaje de error debajo del campo nombre.
        errorNombre.textContent = "El nombre completo es obligatorio.";

        // Cambiamos esValido a false porque encontramos un error.
        esValido = false;
    } else if (valorNombre.length < 3) {
        // Si el nombre no esta vacio pero tiene menos de 3 caracteres, tambien es invalido.
        errorNombre.textContent = "El nombre debe tener minimo 3 caracteres.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el correo esta vacio.
    if (valorCorreo === "") {
        // Mostramos un error si no se escribio correo.
        errorCorreo.textContent = "El correo electronico es obligatorio.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (!reglaCorreo.test(valorCorreo)) {
        // test revisa si el correo cumple la expresion regular.
        // El simbolo ! significa negacion, es decir, si NO cumple la regla.
        errorCorreo.textContent = "Escribe un correo valido. Ejemplo: usuario@gmail.com";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si la edad esta vacia.
    if (valorEdad === "") {
        // Mostramos error si el usuario no escribio edad.
        errorEdad.textContent = "La edad es obligatoria.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (Number(valorEdad) < 12) {
        // Convertimos la edad a numero y revisamos si es menor que 12.
        errorEdad.textContent = "La edad debe ser mayor o igual a 12 anos.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el telefono esta vacio.
    if (valorTelefono === "") {
        // Mostramos error si no se escribio telefono.
        errorTelefono.textContent = "El numero de contacto es obligatorio.";

        // Marcamos el formulario como invalido.
        esValido = false;
    } else if (!reglaTelefono.test(valorTelefono)) {
        // Si el telefono no tiene exactamente 10 digitos, mostramos error.
        errorTelefono.textContent = "El telefono debe tener exactamente 10 digitos numericos.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Validamos si el usuario no selecciono un taller.
    if (valorTaller === "") {
        // Mostramos error debajo de la lista desplegable.
        errorTaller.textContent = "Debes seleccionar un taller.";

        // Marcamos el formulario como invalido.
        esValido = false;
    }

    // Devolvemos true si no hubo errores o false si se encontro al menos uno.
    return esValido;
}

/*
================================================================================
FUNCION: obtenerDatosFormulario
OBJETIVO:
Construir un objeto con los datos que el usuario escribio.
Ese objeto se enviara al backend para guardarlo en SQLite.
================================================================================
*/
function obtenerDatosFormulario() {
    // Retornamos un objeto JavaScript con los datos del formulario.
    return {
        // Guardamos el nombre sin espacios sobrantes al inicio o al final.
        nombre: nombre.value.trim(),

        // Guardamos el correo sin espacios sobrantes.
        correo: correo.value.trim(),

        // Guardamos la edad convertida a numero.
        edad: Number(edad.value.trim()),

        // Guardamos el telefono como texto porque no se usara para operaciones matematicas.
        telefono: telefono.value.trim(),

        // Guardamos el taller seleccionado.
        taller: taller.value,

        // Guardamos la observacion; si esta vacia, simplemente se enviara un texto vacio.
        observacion: observacion.value.trim()
    };
}

/*
================================================================================
FUNCION: cargarInscripciones
OBJETIVO:
Pedir al backend la lista de inscripciones guardadas y mostrarlas en pantalla.
================================================================================
*/
async function cargarInscripciones() {
    try {
        // fetch hace una peticion HTTP al backend para obtener los registros.
        const respuesta = await fetch(API_URL);

        // Convertimos la respuesta del backend a formato JSON o texto valido.
        const inscripciones = await parseJsonResponse(respuesta);

        // Llamamos a la funcion que dibuja los registros en la pagina.
        mostrarInscripciones(Array.isArray(inscripciones) ? inscripciones : []);
    } catch (error) {
        // Si ocurre un error de conexion, mostramos un mensaje en la lista.
        console.error('Error cargando inscripciones:', error);
        listaInscripciones.innerHTML = "<p>No fue posible conectar con el servidor: " + (error.message || error) + "</p>";
    }
}

/*
================================================================================
FUNCION: mostrarInscripciones
PARAMETRO:
inscripciones: arreglo con los registros que vienen desde la base de datos.
================================================================================
*/
function mostrarInscripciones(inscripciones) {
    // Limpiamos el contenedor antes de insertar la lista actualizada.
    listaInscripciones.innerHTML = "";

    // Revisamos si no hay inscripciones guardadas.
    if (inscripciones.length === 0) {
        // Mostramos un mensaje cuando la base de datos aun esta vacia.
        listaInscripciones.innerHTML = "<p>Aun no hay inscripciones registradas.</p>";

        // Usamos return para terminar la funcion y no ejecutar el resto del codigo.
        return;
    }

    // Recorremos cada inscripcion recibida desde la base de datos.
    inscripciones.forEach((inscripcion) => {
        // Creamos un elemento div para representar visualmente una inscripcion.
        const tarjeta = document.createElement("div");

        // Asignamos la clase registro para que CSS le aplique diseno.
        tarjeta.className = "registro";

        // Insertamos dentro de la tarjeta la informacion de la persona inscrita.
        tarjeta.innerHTML = `
            <h3>${inscripcion.nombre}</h3>
            <p><strong>Correo:</strong> ${inscripcion.correo}</p>
            <p><strong>Edad:</strong> ${inscripcion.edad}</p>
            <p><strong>Telefono:</strong> ${inscripcion.telefono}</p>
            <p><strong>Taller:</strong> ${inscripcion.taller}</p>
            <p><strong>Observacion:</strong> ${inscripcion.observacion || "Sin observacion"}</p>
            <button class="boton-eliminar" onclick="eliminarInscripcion(${inscripcion.id})">Eliminar</button>
        `;

        // Agregamos la tarjeta creada dentro del contenedor de inscripciones.
        listaInscripciones.appendChild(tarjeta);
    });
}

/*
================================================================================
FUNCION: eliminarInscripcion
OBJETIVO:
Eliminar de la base de datos una inscripcion especifica usando su id.
================================================================================
*/
async function eliminarInscripcion(id) {
    // Pedimos confirmacion al usuario antes de eliminar, para evitar borrados accidentales.
    const confirmar = confirm("Deseas eliminar esta inscripcion?");

    // Si el usuario cancela, detenemos la funcion.
    if (!confirmar) {
        return;
    }

    try {
        // Enviamos una peticion DELETE al backend indicando el id que queremos eliminar.
        const respuesta = await fetch(`${API_URL}/${id}`, {
            // method define el tipo de peticion HTTP; DELETE significa eliminar.
            method: "DELETE"
        });

        // Convertimos la respuesta del backend a JSON.
        const resultado = await parseJsonResponse(respuesta);

        // Revisamos si el backend respondio con error.
        if (!respuesta.ok) {
            // Si hubo error, mostramos el mensaje enviado por el servidor.
            mostrarMensaje(resultado && resultado.mensaje ? resultado.mensaje : "Error en la respuesta del servidor.", "fallo");

            // Terminamos la funcion porque no se elimino correctamente.
            return;
        }

        // Si se elimino correctamente, mostramos un mensaje de exito.
        mostrarMensaje(resultado.mensaje, "exito");

        // Recargamos la lista para que el registro eliminado desaparezca de la pantalla.
        cargarInscripciones();
    } catch (error) {
        // Si hubo un problema de conexion, mostramos un mensaje de error.
        console.error('Error eliminando inscripcion:', error);
        mostrarMensaje("No fue posible eliminar la inscripcion: " + (error.message || error), "fallo");
    }
}

/*
================================================================================
EVENTO: submit del formulario
OBJETIVO:
Controlar lo que ocurre cuando el usuario presiona el boton Guardar inscripcion.
================================================================================
*/
formulario.addEventListener("submit", async function (evento) {
    // preventDefault evita que el navegador recargue la pagina al enviar el formulario.
    evento.preventDefault();

    // Validamos el formulario antes de enviar datos al servidor.
    const formularioValido = validarFormulario();

    // Si el formulario no es valido, mostramos mensaje general y detenemos el proceso.
    if (!formularioValido) {
        // Mensaje general para indicar que hay errores pendientes.
        mostrarMensaje("Revisa los campos marcados antes de guardar la inscripcion.", "fallo");

        // return detiene la funcion para que no se envie informacion incorrecta al backend.
        return;
    }

    // Obtenemos los datos del formulario en forma de objeto JavaScript.
    const datos = obtenerDatosFormulario();

    try {
        // Enviamos los datos al backend usando fetch.
        const respuesta = await fetch(API_URL, {
            // method POST indica que queremos crear un nuevo registro.
            method: "POST",

            // headers informa al servidor que estamos enviando datos en formato JSON.
            headers: {
                "Content-Type": "application/json"
            },

            // body contiene los datos que se enviaran al backend.
            // JSON.stringify convierte el objeto JavaScript en texto JSON.
            body: JSON.stringify(datos)
        });

        // Convertimos la respuesta del backend a JSON para poder leer el mensaje.
        const resultado = await parseJsonResponse(respuesta);

        // Revisamos si el backend respondio con error.
        if (!respuesta.ok) {
            // Si hubo error, mostramos el mensaje enviado por el backend.
            mostrarMensaje(resultado && resultado.mensaje ? resultado.mensaje : "Error en la respuesta del servidor.", "fallo");

            // Detenemos la funcion porque no se guardo correctamente.
            return;
        }

        // Mostramos mensaje de confirmacion cuando la inscripcion se guarda correctamente.
        mostrarMensaje(resultado && resultado.mensaje ? resultado.mensaje : "Inscripcion guardada correctamente.", "exito");

        // Limpiamos los campos del formulario para permitir registrar otra persona.
        formulario.reset();

        // Actualizamos la lista de inscripciones para mostrar el nuevo registro.
        cargarInscripciones();
    } catch (error) {
        // Si no hay conexion con el servidor o ocurre otro problema, mostramos un error general.
        console.error('Error enviando inscripcion:', error);
        mostrarMensaje("No fue posible conectar con el servidor: " + (error.message || error), "fallo");
    }
});

// Cuando el navegador carga este archivo, llamamos a cargarInscripciones.
// Esto permite mostrar automaticamente los registros guardados al abrir la pagina.
cargarInscripciones();

// Si el HTML se abre directamente desde el sistema de archivos, informar al usuario
if (window.location.protocol === 'file:') {
    console.warn('Página abierta desde file:// — las peticiones fetch fallarán.');
    mostrarMensaje('Abre la aplicación desde http://localhost:3000 (inicia el servidor con `npm start`).', 'fallo');
}
