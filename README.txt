SISTEMA DE INSCRIPCION A TALLERES COMUNITARIOS

OBJETIVO DEL PROYECTO
Este proyecto permite registrar personas interesadas en talleres comunitarios mediante un formulario web.
El sistema valida los datos del usuario, muestra mensajes de error o confirmacion y guarda los registros en una base de datos SQLite.

ESTRUCTURA DEL PROYECTO
sistema-inscripcion-talleres-db/
├── server.js
├── package.json
├── data/
│   └── inscripciones.db  (se crea automaticamente al ejecutar el servidor)
└── public/
    ├── index.html
    ├── estilos.css
    └── script.js

REQUISITOS
1. Tener instalado Node.js.
2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Abrir una terminal en la carpeta del proyecto.
4. Ejecutar: npm install
5. Ejecutar: npm start
6. Abrir en el navegador: http://localhost:3000

QUE APRENDE EL ESTUDIANTE
- Estructura HTML de un formulario.
- Diseno visual con CSS.
- Captura de datos con JavaScript.
- Validaciones simples.
- Mensajes de error y confirmacion.
- Conexion entre frontend y backend.
- Guardado de datos en SQLite.
- Consulta y eliminacion de registros.

NOTA PEDAGOGICA
El codigo incluye comentarios explicativos dentro de los archivos para que el docente pueda explicar linea por linea o por bloques detallados durante la clase.
