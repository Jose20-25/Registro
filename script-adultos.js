// script-adultos.js
// Lógica para exportar la tabla de adultos a PDF y XLS

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('memberForm');
    const tableBody = document.getElementById('tableBody');
    let registros = JSON.parse(localStorage.getItem('registros_adultos')) || [];

    function renderTable() {
        tableBody.innerHTML = '';
        registros.forEach((reg, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reg.nombre}</td>
                <td>${reg.iglesia}</td>
                <td>${reg.cargo_iglesia}</td>
                <td>${reg.genero}</td>
                <td>${reg.nacimiento}</td>
                <td>${reg.edad}</td>
                <td>${reg.estado_civil}</td>
                <td>${reg.ocupacion}</td>
                <td>${reg.telefono}</td>
                <td>${reg.dui}</td>
                <td>${reg.correo}</td>
                <td>${reg.conyuge}</td>
                <td>${reg.cantidad_hijos}</td>
                <td>${(reg.nombres_hijos || []).join(', ')}</td>
                <td>${reg.direccion}</td>
                <td>${reg.emergencia_nombre}</td>
                <td>${reg.emergencia_parentesco}</td>
                <td>${reg.emergencia_telefono}</td>
                <td>${reg.conversion || ''}</td>
                <td>${reg.bautismo_fecha || ''}</td>
                <td>${reg.ministerio}</td>
                <td>${reg.alergias || ''}</td>
                <td>${reg.condiciones || ''}</td>
                <td>${reg.medicamentos || ''}</td>
                <td>${reg.seguro || ''}</td>
                <td><button class="delete-btn" data-idx="${idx}">Eliminar</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function guardarRegistro(e) {
        e.preventDefault();
        const nombresHijos = [];
        const cantidad = parseInt(form.cantidad_hijos.value);
        for (let i = 1; i <= cantidad; i++) {
            const hijoInput = form['hijo_' + i];
            if (hijoInput && hijoInput.value.trim()) {
                nombresHijos.push(hijoInput.value.trim());
            }
        }
        const data = {
            nombre: form.nombre.value,
            iglesia: form.iglesia.value,
            cargo_iglesia: form.cargo_iglesia.value,
            genero: form.genero.value,
            nacimiento: form.nacimiento.value,
            edad: form.edad.value,
            estado_civil: form.estado_civil.value,
            ocupacion: form.ocupacion.value,
            telefono: form.telefono.value,
            dui: form.dui.value,
            correo: form.correo.value,
            conyuge: form.conyuge.value,
            cantidad_hijos: form.cantidad_hijos.value,
            nombres_hijos: nombresHijos,
            direccion: form.direccion.value,
            emergencia_nombre: form.emergencia_nombre.value,
            emergencia_parentesco: form.emergencia_parentesco.value,
            emergencia_telefono: form.emergencia_telefono.value,
            conversion: form.conversion.value,
            bautismo_fecha: form.bautismo_fecha.value,
            ministerio: form.ministerio.value,
            alergias: form.alergias.value,
            condiciones: form.condiciones.value,
            medicamentos: form.medicamentos.value,
            seguro: form.seguro.value
        };
        registros.push(data);
        localStorage.setItem('registros_adultos', JSON.stringify(registros));
        renderTable();
        form.reset();
        if (form.edad) form.edad.value = '';
        document.getElementById('nombresHijosContainer').innerHTML = '';
    }

    form.addEventListener('submit', guardarRegistro);

    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            registros.splice(idx, 1);
            localStorage.setItem('registros_adultos', JSON.stringify(registros));
            renderTable();
        }
    });

    renderTable();
    // Exportar tabla a PDF
    document.getElementById('downloadPdfTable').addEventListener('click', function() {
        if (!window.jspdf || !window.jspdf.jsPDF || !window.jspdf.autoTable) {
            alert('jsPDF o autoTable no están cargados.');
            return;
        }
        const registros = JSON.parse(localStorage.getItem('registros_adultos')) || [];
        if (registros.length === 0) {
            alert('No hay registros para exportar.');
            return;
        }
        const doc = new window.jspdf.jsPDF();
        const columns = [
            'Nombre', 'Iglesia', 'Cargo', 'Género', 'Fecha de nacimiento', 'Edad', 'Estado civil', 'Ocupación', 'Teléfono', 'DUI', 'Correo',
            'Cónyuge', 'Cantidad de hijos', 'Nombres de hijos', 'Dirección', 'Contacto emergencia', 'Parentesco emergencia', 'Tel. emergencia',
            'Fecha de conversión', 'Fecha de bautismo', 'Ministerio', 'Alergias', 'Condiciones médicas', 'Medicamentos', 'Seguro médico'
        ];
        const rows = registros.map(r => [
            r.nombre, r.iglesia, r.cargo_iglesia, r.genero, r.nacimiento, r.edad, r.estado_civil, r.ocupacion, r.telefono, r.dui, r.correo,
            r.conyuge, r.cantidad_hijos, (r.nombres_hijos || []).join(', '), r.direccion, r.emergencia_nombre, r.emergencia_parentesco, r.emergencia_telefono,
            r.conversion || '', r.bautismo_fecha || '', r.ministerio, r.alergias || '', r.condiciones || '', r.medicamentos || '', r.seguro || ''
        ]);
        window.jspdf.autoTable(doc, { head: [columns], body: rows, styles: { font: 'helvetica', fontSize: 9 } });
        doc.save('Adultos_registrados.pdf');
    });

    // Exportar tabla a XLS
    document.getElementById('downloadXlsTable').addEventListener('click', function() {
        if (!window.XLSX) {
            alert('La librería XLSX no está cargada.');
            return;
        }
        const registros = JSON.parse(localStorage.getItem('registros_adultos')) || [];
        if (registros.length === 0) {
            alert('No hay registros para exportar.');
            return;
        }
        const columns = [
            'Nombre', 'Iglesia', 'Cargo', 'Género', 'Fecha de nacimiento', 'Edad', 'Estado civil', 'Ocupación', 'Teléfono', 'DUI', 'Correo',
            'Cónyuge', 'Cantidad de hijos', 'Nombres de hijos', 'Dirección', 'Contacto emergencia', 'Parentesco emergencia', 'Tel. emergencia',
            'Fecha de conversión', 'Fecha de bautismo', 'Ministerio', 'Alergias', 'Condiciones médicas', 'Medicamentos', 'Seguro médico'
        ];
        const data = [columns].concat(
            registros.map(r => [
                r.nombre, r.iglesia, r.cargo_iglesia, r.genero, r.nacimiento, r.edad, r.estado_civil, r.ocupacion, r.telefono, r.dui, r.correo,
                r.conyuge, r.cantidad_hijos, (r.nombres_hijos || []).join(', '), r.direccion, r.emergencia_nombre, r.emergencia_parentesco, r.emergencia_telefono,
                r.conversion || '', r.bautismo_fecha || '', r.ministerio, r.alergias || '', r.condiciones || '', r.medicamentos || '', r.seguro || ''
            ])
        );
        const ws = XLSX.utils.aoa_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Adultos');
        XLSX.writeFile(wb, 'Adultos_registrados.xlsx');
    });
});
