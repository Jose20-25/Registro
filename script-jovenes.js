// script-jovenes.js
// Calcula la edad automáticamente al seleccionar la fecha de nacimiento

document.addEventListener('DOMContentLoaded', function() {
    // Exportar tabla a PDF
    document.getElementById('downloadPdfTable').addEventListener('click', function() {
        if (registros.length === 0) {
            alert('No hay registros para exportar.');
            return;
        }
        if (typeof window.jspdf === 'undefined' || typeof window.jspdf?.jsPDF === 'undefined' || typeof window.jspdf?.autoTable === 'undefined') {
            alert('jsPDF o autoTable no están cargados.');
            return;
        }
        const doc = new window.jspdf.jsPDF();
        const columns = [
            'Nombre', 'Iglesia', 'Género', 'Fecha de nacimiento', 'Edad', 'Padre', 'Madre', 'Dirección',
            'Institución Educativa', 'Carrera/Grado', 'Fecha de Conversión', 'Fecha de Bautismo', 'Ministerio',
            'Alergias', 'Condiciones médicas', 'Medicamentos', 'Seguro médico'
        ];
        const rows = registros.map(r => [
            r.nombre, r.iglesia, r.genero, r.nacimiento, r.edad, r.padre, r.madre, r.direccion,
            r.institucion, r.carrera, r.conversion || '', r.bautismo_fecha || '', r.ministerio,
            r.alergias || '', r.condiciones || '', r.medicamentos || '', r.seguro || ''
        ]);
        window.jspdf.autoTable(doc, { head: [columns], body: rows, styles: { font: 'helvetica', fontSize: 9 } });
        doc.save('Jovenes_registrados.pdf');
    });

    // Exportar tabla a XLS
    document.getElementById('downloadXlsTable').addEventListener('click', function() {
        if (registros.length === 0) {
            alert('No hay registros para exportar.');
            return;
        }
        if (typeof window.XLSX === 'undefined') {
            alert('La librería XLSX no está cargada.');
            return;
        }
        const columns = [
            'Nombre', 'Iglesia', 'Género', 'Fecha de nacimiento', 'Edad', 'Padre', 'Madre', 'Dirección',
            'Institución Educativa', 'Carrera/Grado', 'Fecha de Conversión', 'Fecha de Bautismo', 'Ministerio',
            'Alergias', 'Condiciones médicas', 'Medicamentos', 'Seguro médico'
        ];
        const data = [columns].concat(
            registros.map(r => [
                r.nombre, r.iglesia, r.genero, r.nacimiento, r.edad, r.padre, r.madre, r.direccion,
                r.institucion, r.carrera, r.conversion || '', r.bautismo_fecha || '', r.ministerio,
                r.alergias || '', r.condiciones || '', r.medicamentos || '', r.seguro || ''
            ])
        );
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Jóvenes');
        XLSX.writeFile(wb, 'Jovenes_registrados.xlsx');
    });
    const nacimientoInput = document.getElementById('nacimiento');
    const edadInput = document.getElementById('edad');
    const form = document.getElementById('memberForm');
    const tableBody = document.getElementById('tableBody');
    let registros = JSON.parse(localStorage.getItem('registros_jovenes')) || [];

    if (nacimientoInput && edadInput) {
        nacimientoInput.addEventListener('change', function() {
            const fechaNac = new Date(this.value);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const m = hoy.getMonth() - fechaNac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            edadInput.value = edad >= 0 ? edad : '';
        });
    }

    function renderTable() {
        tableBody.innerHTML = '';
        registros.forEach((member, idx) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${member.nombre}</td>
                <td>${member.iglesia}</td>
                <td>${member.genero}</td>
                <td>${member.nacimiento}</td>
                <td>${member.edad}</td>
                <td>${member.padre}</td>
                <td>${member.madre}</td>
                <td>${member.direccion}</td>
                <td>${member.institucion}</td>
                <td>${member.carrera}</td>
                <td>${member.conversion || ''}</td>
                <td>${member.bautismo_fecha || ''}</td>
                <td>${member.ministerio}</td>
                <td>${member.alergias || ''}</td>
                <td>${member.condiciones || ''}</td>
                <td>${member.medicamentos || ''}</td>
                <td>${member.seguro || ''}</td>
                <td>
                    <button class="delete-btn" data-idx="${idx}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function guardarRegistro(e) {
        e.preventDefault();
        const data = {
            nombre: form.nombre.value,
            iglesia: form.iglesia.value,
            genero: form.genero.value,
            nacimiento: form.nacimiento.value,
            edad: form.edad.value,
            padre: form.padre.value,
            madre: form.madre.value,
            direccion: form.direccion.value,
            institucion: form.institucion.value,
            carrera: form.carrera.value,
            conversion: form.conversion.value,
            bautismo_fecha: form.bautismo_fecha.value,
            ministerio: form.ministerio.value,
            alergias: form.alergias.value,
            condiciones: form.condiciones.value,
            medicamentos: form.medicamentos.value,
            seguro: form.seguro.value
        };
        registros.push(data);
        localStorage.setItem('registros_jovenes', JSON.stringify(registros));
        renderTable();
        form.reset();
        if (edadInput) edadInput.value = '';
    }

    form.addEventListener('submit', guardarRegistro);

    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-index');
            registros.splice(idx, 1);
            localStorage.setItem('registros_jovenes', JSON.stringify(registros));
            renderTable();
        }
    });

    renderTable();
});
