// script-ninos.js
// Calcula la edad automáticamente al seleccionar la fecha de nacimiento

document.addEventListener('DOMContentLoaded', function() {
    // Limpia registros antiguos solo si tienen formato incorrecto
    try {
        const registrosTest = JSON.parse(localStorage.getItem('registros_ninos'));
        if (Array.isArray(registrosTest) && registrosTest.length > 0 && !('genero' in registrosTest[0])) {
            localStorage.removeItem('registros_ninos');
        }
    } catch {}
    const nacimientoInput = document.getElementById('nacimiento');
    const edadInput = document.getElementById('edad');
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

    // Lógica para guardar y mostrar registros
    const form = document.getElementById('memberForm');
    const tableBody = document.getElementById('tableBody');
    let registros = JSON.parse(localStorage.getItem('registros_ninos')) || [];

    function renderTable() {
        tableBody.innerHTML = '';
        registros.forEach((reg, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${reg.iglesia}</td>
                <td>${reg.nombre}</td>
                <td>${reg.genero || ''}</td>
                <td>${reg.nacimiento}</td>
                <td>${reg.edad}</td>
                <td>${reg.padre}</td>
                <td>${reg.madre}</td>
                <td>${reg.grado}</td>
                <td>${reg.escuela}</td>
                <td>${reg.alergias}</td>
                <td>${reg.condiciones}</td>
                <td>${reg.contacto_emergencia}</td>
                <td>${reg.telefono_emergencia}</td>
                <td><button onclick="eliminarRegistro(${idx})">Eliminar</button></td>
            `;
            tableBody.appendChild(tr);
        });
    }

    function guardarRegistro(e) {
        e.preventDefault();
        const data = {
            iglesia: form.iglesia.value,
            nombre: form.nombre.value,
            genero: form.genero.value,
            nacimiento: form.nacimiento.value,
            edad: form.edad.value,
            padre: form.padre.value,
            madre: form.madre.value,
            grado: form.grado.value,
            escuela: form.escuela.value,
            alergias: form.alergias.value,
            condiciones: form.condiciones.value,
            contacto_emergencia: form.contacto_emergencia.value,
            telefono_emergencia: form.telefono_emergencia.value
        };
        registros.push(data);
        localStorage.setItem('registros_ninos', JSON.stringify(registros));
        renderTable();
        form.reset();
        edadInput.value = '';
    }

    form.addEventListener('submit', guardarRegistro);

    window.eliminarRegistro = function(idx) {
        registros.splice(idx, 1);
        localStorage.setItem('registros_ninos', JSON.stringify(registros));
        renderTable();
    };

    renderTable();

    // Funcionalidad para descargar PDF del registro actual
    const pdfBtn = document.getElementById('descargarPdf');
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            const { jsPDF } = window.jspdf || {};
            if (!jsPDF) {
                alert('No se encontró la librería jsPDF.');
                return;
            }
            // Tomar los datos actuales del formulario
            const data = {
                iglesia: form.iglesia.value,
                nombre: form.nombre.value,
                nacimiento: form.nacimiento.value,
                edad: form.edad.value,
                padre: form.padre.value,
                madre: form.madre.value,
                grado: form.grado.value,
                escuela: form.escuela.value,
                alergias: form.alergias.value,
                condiciones: form.condiciones.value,
                contacto_emergencia: form.contacto_emergencia.value,
                telefono_emergencia: form.telefono_emergencia.value
            };
            const doc = new jsPDF();
            let y = 20;
            // Intentar agregar el logo si se puede cargar
            try {
                const img = new Image();
                img.src = 'logo/central.png';
                img.onload = function() {
                    doc.addImage(img, 'PNG', 150, 10, 40, 20);
                    renderPDFContent(doc, data);
                };
                img.onerror = function() {
                    renderPDFContent(doc, data);
                };
                // Si la imagen no carga rápido, igual renderiza el PDF después de 1 segundo
                setTimeout(() => {
                    if (doc.internal.getNumberOfPages() === 1 && doc.internal.getCurrentPageInfo().userUnit === 1) {
                        renderPDFContent(doc, data);
                    }
                }, 1000);
            } catch {
                renderPDFContent(doc, data);
            }
            function renderPDFContent(doc, data) {
                let y = 30;
                doc.setFontSize(16);
                doc.text('Registro de Niño', 20, y);
                y += 10;
                doc.setFontSize(12);
                Object.entries(data).forEach(([key, value]) => {
                    let label = '';
                    switch(key) {
                        case 'iglesia': label = 'Iglesia'; break;
                        case 'nombre': label = 'Nombre completo'; break;
                        case 'nacimiento': label = 'Fecha de nacimiento'; break;
                        case 'edad': label = 'Edad'; break;
                        case 'padre': label = 'Nombre del padre'; break;
                        case 'madre': label = 'Nombre de la madre'; break;
                        case 'grado': label = 'Grado escolar'; break;
                        case 'escuela': label = 'Nombre de la escuela'; break;
                        case 'alergias': label = 'Alergias'; break;
                        case 'condiciones': label = 'Condiciones médicas'; break;
                        case 'contacto_emergencia': label = 'Contacto de emergencia'; break;
                        case 'telefono_emergencia': label = 'Teléfono de emergencia'; break;
                        default: label = key;
                    }
                    doc.text(`${label}: ${value}`, 20, y);
                    y += 8;
                });
                doc.save(`registro_nino_${data.nombre || 'sin_nombre'}.pdf`);
            }
        });
    }
    // Función para descargar la tabla en PDF
document.getElementById('downloadPdfTable').addEventListener('click', function () {
    // Verificar jsPDF y autoTable (compatibilidad UMD)
    const jsPDF = window.jspdf && window.jspdf.jsPDF;
    const autoTable = jsPDF && jsPDF.API && jsPDF.API.autoTable;
    if (!jsPDF) {
        alert('No se encontró la librería jsPDF. Verifica la conexión a Internet o el enlace en el HTML.');
        return;
    }
    if (!autoTable) {
        alert('No se encontró la extensión autoTable de jsPDF.');
        return;
    }
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'A4' });
    const table = document.getElementById('membersTable');
    // Título y logo
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Registro de Niños', 40, 50);
    const exportTableToPDF = function(doc, table) {
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => {
            if (th.innerText.trim() !== 'Acciones' && th.innerText.trim() !== 'Reporte') headers.push(th.innerText);
        });
        const data = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach((td, i) => {
                if (i < headers.length) row.push(td.innerText);
            });
            if (row.length) data.push(row);
        });
        jsPDF.API.autoTable.call(doc, {
            head: [headers],
            body: data,
            startY: 90,
            theme: 'grid',
            headStyles: { fillColor: [45, 137, 239], textColor: 255, fontStyle: 'bold', fontSize: 12 },
            bodyStyles: { fontSize: 11 },
            alternateRowStyles: { fillColor: [240, 248, 255] },
            margin: { left: 40, right: 40 },
            styles: { cellPadding: 6, font: 'helvetica' }
        });
        doc.save('Registro_Ninos.pdf');
    };
    try {
        const img = new Image();
        img.src = 'logo/central.png';
        img.onload = function () {
            doc.addImage(img, 'PNG', doc.internal.pageSize.getWidth() - 120, 20, 80, 60);
            exportTableToPDF(doc, table);
        };
        img.onerror = function () {
            exportTableToPDF(doc, table);
        };
        // Si la imagen tarda, igual exporta después de 1 segundo
        setTimeout(() => exportTableToPDF(doc, table), 1000);
    } catch {
        exportTableToPDF(doc, table);
    }
});

    // Función para descargar la tabla en XLS
    document.getElementById('downloadXlsTable').addEventListener('click', function () {
        const table = document.getElementById('membersTable');
        const headers = [];
        table.querySelectorAll('thead th').forEach(th => {
            if (th.innerText.trim() !== 'Acciones' && th.innerText.trim() !== 'Reporte') headers.push(th.innerText);
        });
        const data = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            const row = [];
            tr.querySelectorAll('td').forEach((td, i) => {
                if (i < headers.length) row.push(td.innerText);
            });
            if (row.length) data.push(row);
        });
        const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Registro');
        XLSX.writeFile(wb, 'Registro_Ninos.xlsx');
    });
});
