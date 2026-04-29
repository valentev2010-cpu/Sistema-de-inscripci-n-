/*
================================================================================
ARCHIVO: server.js
PROYECTO: Sistema de Inscripcion a Talleres Comunitarios
FUNCION GENERAL DEL ARCHIVO:
Este archivo crea un servidor con Node.js y Express.
El servidor permite que el formulario del navegador envie datos a una base de datos SQLite.
SQLite es una base de datos sencilla porque guarda la informacion en un archivo local.
================================================================================
*/

// Importamos Express, que es una herramienta de Node.js para crear servidores web.
// Sin Express, tendriamos que escribir mucho mas codigo para recibir peticiones del navegador.
const express = require("express");

// Importamos CORS, que permite controlar la comunicacion entre el frontend y el backend.
// En este proyecto se usa para evitar bloqueos cuando el navegador envia datos al servidor.
const cors = require("cors");

// Importamos sqlite3, que nos permite crear y manipular una base de datos SQLite desde JavaScript.
// SQLite guarda los datos en un archivo, por eso es muy util para proyectos educativos y locales.
const sqlite3 = require("sqlite3").verbose();

// Importamos path, una herramienta nativa de Node.js para construir rutas de archivos correctamente.
// Esto ayuda a que el proyecto funcione mejor en Windows, Linux o Mac.
const path = require("path");

// Creamos una aplicacion de Express.
// Esta variable representa nuestro servidor y nos permite definir rutas, recibir datos y responder al navegador.
const app = express();

// Definimos el puerto donde se ejecutara el servidor.
// Si el sistema tiene una variable de entorno PORT, se usa esa; si no, se usa el puerto 3000.
const PORT = process.env.PORT || 3000;

// Activamos CORS en el servidor.
// Esto permite que el frontend pueda comunicarse con las rutas del backend sin problemas de permisos.
app.use(cors());

// Permitimos que Express entienda datos en formato JSON.
// Esto es necesario porque el archivo script.js enviara la informacion del formulario como JSON.
app.use(express.json());

// Servimos la carpeta public como contenido estatico.
// Gracias a esta linea, el navegador puede cargar index.html, estilos.css y script.js.
app.use(express.static(path.join(__dirname, "public")));

// Creamos la ruta completa donde se guardara el archivo de base de datos.
// El archivo se llamara inscripciones.db y estara dentro de la carpeta data.
const databasePath = path.join(__dirname, "data", "inscripciones.db");

// Abrimos o creamos la base de datos SQLite.
// Si el archivo inscripciones.db no existe, SQLite lo crea automaticamente.
const db = new sqlite3.Database(databasePath, (error) => {
    // Revisamos si ocurrio un error al abrir la base de datos.
    if (error) {
        // Mostramos el error en consola para que el desarrollador pueda identificar el problema.
        console.error("Error al conectar con la base de datos:", error.message);
    } else {
        // Mostramos un mensaje positivo cuando la conexion se realiza correctamente.
        console.log("Base de datos SQLite conectada correctamente.");
    }
});

// Creamos la tabla inscripciones si todavia no existe.
// Esta tabla sera donde se guardaran los datos enviados desde el formulario.
db.run(`
    CREATE TABLE IF NOT EXISTS inscripciones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        edad INTEGER NOT NULL,
        telefono TEXT NOT NULL,
        taller TEXT NOT NULL,
        observacion TEXT,
        fecha_registro TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

/*
================================================================================
RUTA GET /api/inscripciones
FUNCION:
Devuelve todas las inscripciones guardadas en la base de datos.
El frontend usa esta ruta para mostrar la lista de personas inscritas.
================================================================================
*/
app.get("/api/inscripciones", (req, res) => {
    // Escribimos la consulta SQL que selecciona todos los registros de la tabla.
    // ORDER BY id DESC muestra primero las inscripciones mas recientes.
    const sql = "SELECT * FROM inscripciones ORDER BY id DESC";

    // Ejecutamos la consulta con db.all porque esperamos recibir varios registros.
    db.all(sql, [], (error, rows) => {
        // Revisamos si ocurrio un error al consultar la base de datos.
        if (error) {
            // Respondemos con estado 500 porque es un error interno del servidor.
            return res.status(500).json({ mensaje: "Error al consultar las inscripciones." });
        }

        // Si no hay error, enviamos los registros al navegador en formato JSON.
        res.json(rows);
    });
});

/*
================================================================================
RUTA POST /api/inscripciones
FUNCION:
Recibe los datos del formulario y los guarda en la base de datos.
Tambien hace una validacion en el backend para reforzar la seguridad.
================================================================================
*/
app.post("/api/inscripciones", (req, res) => {
    // Extraemos del cuerpo de la peticion los datos enviados desde el formulario.
    // Estos nombres deben coincidir con los nombres usados en el objeto enviado desde script.js.
    const { nombre, correo, edad, telefono, taller, observacion } = req.body;

    // Validamos que los campos obligatorios lleguen con informacion.
    // Aunque ya validamos en el navegador, tambien validamos en el servidor porque es una buena practica profesional.
    if (!nombre || !correo || !edad || !telefono || !taller) {
        // Si falta un dato obligatorio, respondemos con error 400 porque la peticion esta incompleta.
        return res.status(400).json({ mensaje: "Todos los campos obligatorios deben estar completos." });
    }

    // Validamos que la edad sea mayor o igual a 12.
    // Number(edad) convierte el dato a numero para poder compararlo correctamente.
    if (Number(edad) < 12) {
        // Si la edad no cumple la regla, respondemos con un mensaje claro.
        return res.status(400).json({ mensaje: "La edad debe ser mayor o igual a 12 anos." });
    }

    // Validamos que el telefono tenga exactamente 10 digitos numericos.
    // La expresion regular /^\d{10}$/ significa: inicio, 10 digitos, final.
    if (!/^\d{10}$/.test(telefono)) {
        // Si el telefono no cumple, se devuelve un error al frontend.
        return res.status(400).json({ mensaje: "El telefono debe tener exactamente 10 digitos." });
    }

    // Escribimos la consulta SQL para insertar una nueva inscripcion.
    // Los signos ? son marcadores seguros donde luego colocaremos los datos del usuario.
    const sql = `
        INSERT INTO inscripciones (nombre, correo, edad, telefono, taller, observacion)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Creamos un arreglo con los valores que se insertaran en la base de datos.
    // El orden de estos valores debe coincidir con el orden de los signos ? en la consulta SQL.
    const valores = [nombre, correo, edad, telefono, taller, observacion || ""];

    // Ejecutamos la consulta de insercion con db.run.
    db.run(sql, valores, function (error) {
        // Revisamos si ocurrio un error al guardar los datos.
        if (error) {
            // Si ocurre un error, respondemos con estado 500 porque fallo el servidor o la base de datos.
            return res.status(500).json({ mensaje: "Error al guardar la inscripcion." });
        }

        // Si todo sale bien, respondemos con estado 201 porque se creo un nuevo registro.
        // this.lastID contiene el id del registro que SQLite acaba de crear.
        res.status(201).json({
            mensaje: "Inscripcion guardada correctamente.",
            id: this.lastID
        });
    });
});

/*
================================================================================
RUTA DELETE /api/inscripciones/:id
FUNCION:
Elimina una inscripcion especifica usando su id.
Esto permite administrar la informacion guardada.
================================================================================
*/
app.delete("/api/inscripciones/:id", (req, res) => {
    // Tomamos el id que viene en la URL.
    // Por ejemplo, si la URL es /api/inscripciones/3, el id sera 3.
    const { id } = req.params;

    // Creamos la consulta SQL para eliminar un registro por su id.
    const sql = "DELETE FROM inscripciones WHERE id = ?";

    // Ejecutamos la eliminacion pasando el id como parametro seguro.
    db.run(sql, [id], function (error) {
        // Revisamos si hubo error al eliminar.
        if (error) {
            // Respondemos con error si la base de datos no pudo eliminar el registro.
            return res.status(500).json({ mensaje: "Error al eliminar la inscripcion." });
        }

        // Si no se elimino ninguna fila, significa que no existia una inscripcion con ese id.
        if (this.changes === 0) {
            // Respondemos con estado 404 porque el registro no fue encontrado.
            return res.status(404).json({ mensaje: "Inscripcion no encontrada." });
        }

        // Si se elimino correctamente, enviamos un mensaje de confirmacion.
        res.json({ mensaje: "Inscripcion eliminada correctamente." });
    });
});

// Iniciamos el servidor y lo dejamos escuchando peticiones en el puerto definido.
app.listen(PORT, () => {
    // Mostramos en consola la direccion donde se puede abrir el proyecto.
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
