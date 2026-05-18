// Cargar indicadores al iniciar
document.addEventListener('DOMContentLoaded', function() {
    cargarIndicadores();
    cargarAlertas();
    cargarMapas();
});

// Función para cargar indicadores
function cargarIndicadores() {
    fetch('api/indicadores.php')
        .then(response => response.json())
        .then(data => {
            console.log('Datos recibidos:', data);
            
            if (data.max_ruido) {
                document.getElementById('maxRuido').textContent = data.max_ruido.toFixed(2) + ' dB';
                document.getElementById('maxSalon').textContent = data.salon_max_ruido || 'N/A';
            }
            
            if (data.min_ruido) {
                document.getElementById('minRuido').textContent = data.min_ruido.toFixed(2) + ' dB';
                document.getElementById('minSalon').textContent = data.salon_min_ruido || 'N/A';
            }
            
            if (data.promedio_ruido) {
                document.getElementById('promedioRuido').textContent = data.promedio_ruido.toFixed(2) + ' dB';
            }
            
            if (data.salones_alerta !== undefined) {
                document.getElementById('salonesAlerta').textContent = data.salones_alerta;
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar alertas
function cargarAlertas() {
    fetch('api/alertas.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('alertasContainer');
            container.innerHTML = '';
            
            if (data.alertas && data.alertas.length > 0) {
                data.alertas.forEach(alerta => {
                    const alertElement = document.createElement('div');
                    alertElement.className = `alert alert-${alerta.tipo}`;
                    alertElement.innerHTML = `
                        <h4>${alerta.titulo}</h4>
                        <p>${alerta.mensaje}</p>
                        <small>${alerta.fecha}</small>
                    `;
                    container.appendChild(alertElement);
                });
            } else {
                container.innerHTML = '<p style="text-align: center; color: #7f8c8d;">No hay alertas en este momento.</p>';
            }
        })
        .catch(error => console.error('Error:', error));
}

// Función para cargar mapas de calor
function cargarMapas() {
    fetch('api/mapas.php')
        .then(response => response.json())
        .then(data => {
            generarHeatmap('heatmapMañana', data.manana);
            generarHeatmap('heatmapTarde', data.tarde);
        })
        .catch(error => console.error('Error:', error));
}

// Función para generar heatmap
function generarHeatmap(elementId, datos) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    if (!datos || datos.length === 0) {
        container.innerHTML = '<p style="color: #666;">Sin datos disponibles</p>';
        return;
    }
    
    // Encontrar min y max para normalizar colores
    const decibeles = datos.map(d => d.decibeles);
    const minDb = Math.min(...decibeles);
    const maxDb = Math.max(...decibeles);
    
    datos.forEach((dato, index) => {
        const porcentaje = ((dato.decibeles - minDb) / (maxDb - minDb)) * 100;
        const salon = document.createElement('div');
        salon.className = 'heatmap-salon';
        salon.style.left = (index * 15) % 80 + '%';
        salon.style.top = (Math.floor(index / 6) * 25) + '%';
        salon.style.backgroundColor = obtenerColorPorRuido(dato.decibeles);
        salon.innerHTML = `<div><strong>${dato.salon}</strong><br>${dato.decibeles.toFixed(1)} dB</div>`;
        salon.title = `${dato.salon}: ${dato.decibeles.toFixed(1)} dB`;
        container.appendChild(salon);
    });
}

// Función para obtener color según ruido
function obtenerColorPorRuido(decibeles) {
    if (decibeles < 40) {
        return '#27ae60'; // Verde - Bajo
    } else if (decibeles < 70) {
        return '#f39c12'; // Naranja - Medio
    } else {
        return '#e74c3c'; // Rojo - Alto
    }
}

// Función para validar formularios
function validarFormulario() {
    const fecha = document.getElementById('fecha').value;
    const grado = document.getElementById('grado').value;
    const salon = document.getElementById('salon').value;
    const decibeles = document.getElementById('decibeles').value;
    const jornada = document.getElementById('jornada').value;
    
    if (!fecha || !grado || !salon || !decibeles || !jornada) {
        alert('Por favor complete todos los campos obligatorios');
        return false;
    }
    
    if (isNaN(decibeles) || decibeles < 0 || decibeles > 150) {
        alert('Los decibeles deben ser un número entre 0 y 150');
        return false;
    }
    
    return true;
}

// Función para enviar formulario
function enviarFormulario(event) {
    event.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    const formData = new FormData(document.getElementById('formularioMedicion'));
    
    fetch('api/guardar_medicion.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Medición guardada exitosamente');
            document.getElementById('formularioMedicion').reset();
            // Recargar indicadores
            cargarIndicadores();
            cargarAlertas();
            cargarMapas();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error al guardar la medición');
    });
}

// Mostrar clasificación según decibeles
function actualizarClasificacion() {
    const decibeles = parseFloat(document.getElementById('decibeles').value);
    const clasificacionElement = document.getElementById('clasificacion');
    
    if (isNaN(decibeles)) {
        clasificacionElement.textContent = '';
        return;
    }
    
    let clasificacion = '';
    if (decibeles < 40) {
        clasificacion = 'BAJO - Normal';
    } else if (decibeles < 70) {
        clasificacion = 'MEDIO - Aceptable';
    } else {
        clasificacion = 'ALTO - Dañino';
    }
    
    clasificacionElement.textContent = clasificacion;
}

// Función para filtrar reportes
function filtrarReportes() {
    const salon = document.getElementById('filtroSalon').value;
    const jornada = document.getElementById('filtroJornada').value;
    const fechaInicio = document.getElementById('filtroFechaInicio').value;
    const fechaFin = document.getElementById('filtroFechaFin').value;
    
    const params = new URLSearchParams();
    if (salon) params.append('salon', salon);
    if (jornada) params.append('jornada', jornada);
    if (fechaInicio) params.append('fecha_inicio', fechaInicio);
    if (fechaFin) params.append('fecha_fin', fechaFin);
    
    fetch('api/filtrar_mediciones.php?' + params)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';
            
            if (data.mediciones && data.mediciones.length > 0) {
                data.mediciones.forEach(medicion => {
                    const fila = document.createElement('tr');
                    const badge = `badge-${medicion.clasificacion.toLowerCase()}`;
                    fila.innerHTML = `
                        <td>${medicion.fecha}</td>
                        <td>${medicion.salon}</td>
                        <td>${medicion.grado}</td>
                        <td>${medicion.decibeles} dB</td>
                        <td>${medicion.jornada}</td>
                        <td><span class="badge ${badge}">${medicion.clasificacion}</span></td>
                    `;
                    tbody.appendChild(fila);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay datos disponibles</td></tr>';
            }
        })
        .catch(error => console.error('Error:', error));
}