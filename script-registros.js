// script-registros.js
// Este script gestiona la carga y visualización de los registros en la página registros.html

// Simulación de registros (puedes conectar con almacenamiento real más adelante)
const registros = [
    {
        iglesia: "Central",
        tipo: "Niño",
        nombre: "Juan Pérez",
        edad: 10,
        fecha: "2025-07-25"
    },
    {
        iglesia: "El Pital",
        tipo: "Joven",
        nombre: "Ana López",
        edad: 15,
        fecha: "2025-07-24"
    },
    {
        iglesia: "El Sauce",
        tipo: "Adulto",
        nombre: "Carlos Ruiz",
        edad: 32,
        fecha: "2025-07-23"
    }
];

function cargarRegistros() {
    const tbody = document.getElementById('records-body');
    tbody.innerHTML = '';
    registros.forEach((reg, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${reg.iglesia}</td>
            <td>${reg.tipo}</td>
            <td>${reg.nombre}</td>
            <td>${reg.edad}</td>
            <td>${reg.fecha}</td>
            <td><button onclick="verRegistro(${idx})">Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function verRegistro(idx) {
    const reg = registros[idx];
    alert(`Registro:\nIglesia: ${reg.iglesia}\nTipo: ${reg.tipo}\nNombre: ${reg.nombre}\nEdad: ${reg.edad}\nFecha: ${reg.fecha}`);
}

window.onload = cargarRegistros;
