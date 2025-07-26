// script.js
// Manejo de formularios dinámicos y registro de miembros

const formSection = document.getElementById('formSection');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const downloadPdfBtn = document.getElementById('downloadPdf');
// const formSection = document.getElementById('formSection'); // Eliminado, ya no se usa
// const tableHeader = document.getElementById('tableHeader'); // Eliminado, ya no se usa
// const tableBody = document.getElementById('tableBody'); // Eliminado, ya no se usa
// const downloadPdfBtn = document.getElementById('downloadPdf'); // Eliminado, ya no se usa
const menuBtns = document.querySelectorAll('.menu-btn');

// Estructura de formularios por iglesia
const forms = {
    central: {
        fields: [
            { label: 'Nombre completo', name: 'nombre', type: 'text' },
            { label: 'Edad', name: 'edad', type: 'number' },
            { label: 'Correo electrónico', name: 'correo', type: 'email' },
            { label: 'Teléfono', name: 'telefono', type: 'text' },
            { label: 'Fecha de bautismo', name: 'bautismo', type: 'date' }
        ],
        header: ['Nombre', 'Edad', 'Correo', 'Teléfono', 'Bautismo']
    },
    pital: {
        fields: [
            { label: 'Nombre completo', name: 'nombre', type: 'text' },
            { label: 'Dirección', name: 'direccion', type: 'text' },
            { label: 'Fecha de nacimiento', name: 'nacimiento', type: 'date' }
        ],
        header: ['Nombre', 'Dirección', 'Nacimiento']
    },
    sauce: {
        fields: [
            { label: 'Nombre completo', name: 'nombre', type: 'text' },
            { label: 'Estado civil', name: 'estado', type: 'select', options: ['Soltero', 'Casado', 'Viudo'] },
            { label: 'Teléfono', name: 'telefono', type: 'text' }
        ],
        header: ['Nombre', 'Estado civil', 'Teléfono']
    },
    tekera: {
        fields: [
            { label: 'Nombre completo', name: 'nombre', type: 'text' },
            { label: 'Edad', name: 'edad', type: 'number' },
            { label: 'Ministerio', name: 'ministerio', type: 'text' }
        ],
        header: ['Nombre', 'Edad', 'Ministerio']
    }
};

let miembros = [];
let iglesiaActual = 'central';

function renderForm(iglesia) {
    iglesiaActual = iglesia;
    // Resaltar botón activo
    if (menuBtns.length) {
        menuBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.church === iglesia);
        });
    }
    const { fields } = forms[iglesia];
    let html = '<form id="memberForm">';
    fields.forEach(f => {
        html += `<label for="${f.name}">${f.label}</label>`;
        if (f.type === 'select') {
            html += `<select name="${f.name}" required>`;
            f.options.forEach(opt => {
                html += `<option value="${opt}">${opt}</option>`;
            });
            html += '</select>';
        } else {
            html += `<input type="${f.type}" name="${f.name}" required />`;
        }
    });
    html += '<button type="submit">Registrar miembro</button></form>';
    formSection.innerHTML = html;
    document.getElementById('memberForm').onsubmit = handleSubmit;
    renderTableHeader();
    renderTableBody();
}

function renderTableHeader() {
    tableHeader.innerHTML = '';
    forms[iglesiaActual].header.forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        tableHeader.appendChild(th);
    });
}

function renderTableBody() {
    tableBody.innerHTML = '';
    miembros.filter(m => m.iglesia === iglesiaActual).forEach(m => {
        const tr = document.createElement('tr');
        forms[iglesiaActual].fields.forEach(f => {
            const td = document.createElement('td');
            td.textContent = m[f.name] || '';
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function handleSubmit(e) {
    e.preventDefault();
    const data = {};
    forms[iglesiaActual].fields.forEach(f => {
        data[f.name] = e.target[f.name].value;
    });
    miembros.push({ ...data, iglesia: iglesiaActual });
    renderTableBody();
    e.target.reset();
}

// Menú moderno: cambio de iglesia
if (menuBtns.length) {
    menuBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            renderForm(btn.dataset.church);
        });
    });
}

// PDF
function descargarPDF() {
    const { header, fields } = forms[iglesiaActual];
    const miembrosFiltrados = miembros.filter(m => m.iglesia === iglesiaActual);
    const doc = new window.jspdf.jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    // Obtener nombre de iglesia desde el botón activo
    const iglesiaNombre = document.querySelector('.menu-btn.active')?.textContent.trim() || '';
    doc.text(`Registro de Miembros - ${iglesiaNombre}`, 14, 18);
    let y = 30;
    // Encabezado
    header.forEach((h, i) => {
        doc.text(h, 14 + i * 45, y);
    });
    y += 8;
    // Filas
    miembrosFiltrados.forEach(m => {
        fields.forEach((f, i) => {
            doc.text(String(m[f.name] || ''), 14 + i * 45, y);
        });
        y += 8;
        if (y > 270) {
            doc.addPage();
            y = 18;
        }
    });
    doc.save(`registro_${iglesiaActual}.pdf`);
}

downloadPdfBtn.onclick = descargarPDF;

// Inicializar
renderForm('central');
