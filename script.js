// script.js

// Función para manejar la navegación entre secciones
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover la clase 'active' de todas las pestañas
            tabs.forEach(t => t.classList.remove('active'));
            // Agregar la clase 'active' a la pestaña seleccionada
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');

            // Remover la clase 'active' de todas las secciones
            sections.forEach(section => section.classList.remove('active'));
            // Agregar la clase 'active' a la sección seleccionada
            document.getElementById(target).classList.add('active');
        });
    });
}

// Función para actualizar los cálculos en la sección de Datos de la Simulación
function setupDatosSimulacion() {
    // Obtener elementos del DOM
    const precioPropiedadInput = document.getElementById('precio-propiedad');
    const entradaPorcentajeInput = document.getElementById('entrada-porcentaje');
    const arrasPorcentajeInput = document.getElementById('arras-porcentaje');
    const impuestoPorcentajeInput = document.getElementById('impuesto');

    const entradaEurosSpan = document.getElementById('entrada-euros');
    const arrasEurosSpan = document.getElementById('arras-euros');
    const impuestoEurosSpan = document.getElementById('impuesto-euros');

    const tasacionInput = document.getElementById('tasacion');
    const notariaInput = document.getElementById('notaria');
    const gestorInput = document.getElementById('gestoria');
    const registroInput = document.getElementById('registro-propiedad');

    const totalInicialSpan = document.getElementById('total-inicial');

    // Función para actualizar los valores en euros basados en porcentajes
    function actualizarPorcentajes() {
        const precioPropiedad = parseFloat(precioPropiedadInput.value) || 0;

        const entradaPorcentaje = parseFloat(entradaPorcentajeInput.value) || 0;
        const entradaEuros = (entradaPorcentaje / 100) * precioPropiedad;
        entradaEurosSpan.textContent = entradaEuros.toFixed(2);

        const arrasPorcentaje = parseFloat(arrasPorcentajeInput.value) || 0;
        const arrasEuros = (arrasPorcentaje / 100) * precioPropiedad;
        arrasEurosSpan.textContent = arrasEuros.toFixed(2);

        const impuestoPorcentaje = parseFloat(impuestoPorcentajeInput.value) || 0;
        const impuestoEuros = (impuestoPorcentaje / 100) * precioPropiedad;
        impuestoEurosSpan.textContent = impuestoEuros.toFixed(2);

        calcularTotalInicial();
    }

    // Función para calcular el total inicial necesario
    function calcularTotalInicial() {
        const entradaEuros = parseFloat(entradaEurosSpan.textContent) || 0;
        const arrasEuros = parseFloat(arrasEurosSpan.textContent) || 0;
        const impuestoEuros = parseFloat(impuestoEurosSpan.textContent) || 0;

        const tasacion = parseFloat(tasacionInput.value) || 0;
        const notaria = parseFloat(notariaInput.value) || 0;
        const gestor = parseFloat(gestorInput.value) || 0;
        const registro = parseFloat(registroInput.value) || 0;

        const totalInicial = entradaEuros + arrasEuros + impuestoEuros + tasacion + notaria + gestor + registro;
        totalInicialSpan.textContent = totalInicial.toFixed(2);
    }

    // Event Listeners para actualizar los cálculos en tiempo real
    precioPropiedadInput.addEventListener('input', actualizarPorcentajes);
    entradaPorcentajeInput.addEventListener('input', actualizarPorcentajes);
    arrasPorcentajeInput.addEventListener('input', actualizarPorcentajes);
    impuestoPorcentajeInput.addEventListener('input', actualizarPorcentajes);

    tasacionInput.addEventListener('input', calcularTotalInicial);
    notariaInput.addEventListener('input', calcularTotalInicial);
    gestorInput.addEventListener('input', calcularTotalInicial);
    registroInput.addEventListener('input', calcularTotalInicial);

    // Inicializar valores al cargar la página
    actualizarPorcentajes();
}

// Función para configurar los cálculos en la sección de Condiciones de la Hipoteca
function setupCondicionesHipoteca() {
    const tinInput = document.getElementById('tin');
    const taeInput = document.getElementById('tae');
    const plazoInput = document.getElementById('plazo');
    const segurosProductosInput = document.getElementById('seguros-productos');

    // Event Listeners para actualizar los cálculos en tiempo real
    tinInput.addEventListener('input', actualizarCuotaMensual);
    taeInput.addEventListener('input', actualizarCuotaMensual);
    plazoInput.addEventListener('input', actualizarCuotaMensual);
    segurosProductosInput.addEventListener('input', actualizarCuotaMensual);

    // Inicializar cálculos al cargar la página
    actualizarCuotaMensual();
}

// Función para calcular la cuota mensual
function actualizarCuotaMensual() {
    const montoPrestamoSpan = document.getElementById('monto-prestamo');
    const cuotaEstimadaSpan = document.getElementById('cuota-estimada');
    const cuotaTotalSpan = document.getElementById('cuota-total');

    const precioPropiedad = parseFloat(document.getElementById('precio-propiedad').value) || 0;
    const entradaEuros = parseFloat(document.getElementById('entrada-euros').textContent) || 0;
    const arrasEuros = parseFloat(document.getElementById('arras-euros').textContent) || 0;

    const montoPrestamo = precioPropiedad - entradaEuros - arrasEuros;
    montoPrestamoSpan.textContent = montoPrestamo.toFixed(2);

    const tin = parseFloat(document.getElementById('tin').value) || 0;
    const plazo = parseInt(document.getElementById('plazo').value) || 0;
    const segurosProductos = parseFloat(document.getElementById('seguros-productos').value) || 0;

    if (montoPrestamo === 0 || plazo === 0 || tin === 0) {
        cuotaEstimadaSpan.textContent = '0.00';
        cuotaTotalSpan.textContent = '0.00';
        actualizarResumenFinanciero();
        limpiarCalendarioPagos();
        return;
    }

    const numeroCuotas = plazo * 12;
    const interesMensual = (tin / 100) / 12;
    const cuotaMensual = (montoPrestamo * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    cuotaEstimadaSpan.textContent = cuotaMensual.toFixed(2);

    const cuotaMensualTotal = cuotaMensual + segurosProductos;
    cuotaTotalSpan.textContent = cuotaMensualTotal.toFixed(2);

    // Llamar a generar el calendario de pagos después de actualizar la cuota
    generarCalendarioPagos();

    // Actualizar el resumen financiero
    actualizarResumenFinanciero();
}

// Función para limpiar el calendario de pagos
function limpiarCalendarioPagos() {
    const tablaBody = document.getElementById('tabla-amortizacion-body');
    tablaBody.innerHTML = ''; // Limpiar contenido
}

// Función para generar el calendario de pagos
function generarCalendarioPagos() {
    const tablaBody = document.getElementById('tabla-amortizacion-body');
    tablaBody.innerHTML = ''; // Limpiar contenido previo

    const montoPrestamo = parseFloat(document.getElementById('monto-prestamo').textContent) || 0;
    const tin = parseFloat(document.getElementById('tin').value) || 0;
    const plazo = parseInt(document.getElementById('plazo').value) || 0;

    if (montoPrestamo === 0 || plazo === 0 || tin === 0) {
        // Si no hay datos suficientes, no generamos el calendario
        return;
    }

    const numeroCuotas = plazo * 12;
    const interesMensual = (tin / 100) / 12;
    const cuotaMensual = (montoPrestamo * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    let saldoPendiente = montoPrestamo;

    for (let i = 1; i <= numeroCuotas; i++) {
        const interes = saldoPendiente * interesMensual;
        const capital = cuotaMensual - interes;
        saldoPendiente -= capital;

        // Aseguramos que el saldo pendiente no sea negativo debido a decimales
        if (saldoPendiente < 0) saldoPendiente = 0;

        // Crear una fila para la tabla
        const fila = document.createElement('tr');

        // Columna Mes
        const columnaMes = document.createElement('td');
        columnaMes.textContent = i;
        fila.appendChild(columnaMes);

        // Columna Cuota
        const columnaCuota = document.createElement('td');
        columnaCuota.textContent = '€' + cuotaMensual.toFixed(2);
        fila.appendChild(columnaCuota);

        // Columna Interés
        const columnaInteres = document.createElement('td');
        columnaInteres.textContent = '€' + interes.toFixed(2);
        fila.appendChild(columnaInteres);

        // Columna Capital
        const columnaCapital = document.createElement('td');
        columnaCapital.textContent = '€' + capital.toFixed(2);
        fila.appendChild(columnaCapital);

        // Columna Capital Pendiente
        const columnaSaldo = document.createElement('td');
        columnaSaldo.textContent = '€' + saldoPendiente.toFixed(2);
        fila.appendChild(columnaSaldo);

        // Agregar la fila al cuerpo de la tabla
        tablaBody.appendChild(fila);
    }
}

// Función para actualizar el Resumen Financiero
function actualizarResumenFinanciero() {
    const ahorroNecesarioSpan = document.getElementById('ahorro-necesario');
    const financiacionSolicitadaSpan = document.getElementById('financiacion-solicitada');
    const costeTotalHipotecaSpan = document.getElementById('coste-total-hipoteca');

    const totalInicial = parseFloat(document.getElementById('total-inicial').textContent) || 0;
    const montoPrestamo = parseFloat(document.getElementById('monto-prestamo').textContent) || 0;

    ahorroNecesarioSpan.textContent = totalInicial.toFixed(2);
    financiacionSolicitadaSpan.textContent = montoPrestamo.toFixed(2);

    // Calcular el coste total de la hipoteca
    const plazo = parseInt(document.getElementById('plazo').value) || 0;
    const numeroCuotas = plazo * 12;
    const cuotaMensualTotal = parseFloat(document.getElementById('cuota-total').textContent) || 0;
    const costeTotalHipoteca = cuotaMensualTotal * numeroCuotas;
    costeTotalHipotecaSpan.textContent = costeTotalHipoteca.toFixed(2);
}

// Función para guardar la simulación
function guardarSimulacion() {
    const nombreSimulacionInput = document.getElementById('nombre-simulacion');
    const nombreSimulacion = nombreSimulacionInput.value.trim();

    if (nombreSimulacion === "") {
        alert("Por favor, ingresa un nombre para la simulación.");
        return;
    }

    // Obtener los datos de la simulación actual
    const simulacion = {
        nombre: nombreSimulacion,
        totalInicial: parseFloat(document.getElementById('total-inicial').textContent) || 0,
        financiacionSolicitada: parseFloat(document.getElementById('financiacion-solicitada').textContent) || 0,
        costeTotalHipoteca: parseFloat(document.getElementById('coste-total-hipoteca').textContent) || 0,
        cuotaEstimada: parseFloat(document.getElementById('cuota-estimada').textContent) || 0,
        cuotaTotal: parseFloat(document.getElementById('cuota-total').textContent) || 0,
        fecha: new Date().toLocaleString()
    };

    // Obtener las simulaciones guardadas desde el Local Storage
    let simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

    // Verificar si ya existe una simulación con el mismo nombre
    const existe = simulacionesGuardadas.some(sim => sim.nombre.toLowerCase() === nombreSimulacion.toLowerCase());
    if (existe) {
        alert("Ya existe una simulación con este nombre. Por favor, elige otro nombre.");
        return;
    }

    // Añadir la nueva simulación
    simulacionesGuardadas.push(simulacion);

    // Guardar de nuevo en el Local Storage
    localStorage.setItem('simulaciones', JSON.stringify(simulacionesGuardadas));

    // Limpiar el campo de nombre
    nombreSimulacionInput.value = "";

    // Actualizar la lista de simulaciones guardadas en la UI
    listarSimulacionesGuardadas();

    alert("Simulación guardada exitosamente.");
}

// Función para listar las simulaciones guardadas en la sección correspondiente
function listarSimulacionesGuardadas() {
    const listaSimulacionesDiv = document.getElementById('lista-simulaciones');
    listaSimulacionesDiv.innerHTML = ""; // Limpiar contenido previo

    // Obtener las simulaciones guardadas desde el Local Storage
    const simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

    if (simulacionesGuardadas.length === 0) {
        listaSimulacionesDiv.innerHTML = "<p>No hay simulaciones guardadas.</p>";
        return;
    }

    simulacionesGuardadas.forEach(simulacion => {
        const simulacionDiv = document.createElement('div');
        simulacionDiv.classList.add('simulacion-item');

        const titulo = document.createElement('h3');
        titulo.textContent = simulacion.nombre;
        simulacionDiv.appendChild(titulo);

        const detallesDiv = document.createElement('div');
        detallesDiv.classList.add('simulacion-details');

        const pFecha = document.createElement('p');
        pFecha.innerHTML = `<strong>Fecha de Creación:</strong> ${simulacion.fecha}`;
        detallesDiv.appendChild(pFecha);

        const pTotalInicial = document.createElement('p');
        pTotalInicial.innerHTML = `<strong>Total Inicial Necesario (€):</strong> €${simulacion.totalInicial.toFixed(2)}`;
        detallesDiv.appendChild(pTotalInicial);

        const pFinanciacionSolicitada = document.createElement('p');
        pFinanciacionSolicitada.innerHTML = `<strong>Financiación Solicitada (€):</strong> €${simulacion.financiacionSolicitada.toFixed(2)}`;
        detallesDiv.appendChild(pFinanciacionSolicitada);

        const pCosteTotalHipoteca = document.createElement('p');
        pCosteTotalHipoteca.innerHTML = `<strong>Coste Total de la Hipoteca (€):</strong> €${simulacion.costeTotalHipoteca.toFixed(2)}`;
        detallesDiv.appendChild(pCosteTotalHipoteca);

        const pCuotaEstimada = document.createElement('p');
        pCuotaEstimada.innerHTML = `<strong>Cuota Mensual Estimada (€):</strong> €${simulacion.cuotaEstimada.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaEstimada);

        const pCuotaTotal = document.createElement('p');
        pCuotaTotal.innerHTML = `<strong>Cuota Mensual Total (€):</strong> €${simulacion.cuotaTotal.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaTotal);

        simulacionDiv.appendChild(detallesDiv);

        // Añadir botones de acción
        const accionesDiv = document.createElement('div');
        accionesDiv.classList.add('simulacion-actions');

        // Botón Eliminar
        const eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.classList.add('eliminar-btn');
        eliminarBtn.addEventListener('click', () => eliminarSimulacion(simulacion.nombre));
        accionesDiv.appendChild(eliminarBtn);

        simulacionDiv.appendChild(accionesDiv);

        listaSimulacionesDiv.appendChild(simulacionDiv);
    });
}

// Función para eliminar una simulación
function eliminarSimulacion(nombreSimulacion) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la simulación "${nombreSimulacion}"?`)) {
        return;
    }

    // Obtener las simulaciones guardadas desde el Local Storage
    let simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

    // Filtrar la simulación a eliminar
    simulacionesGuardadas = simulacionesGuardadas.filter(sim => sim.nombre !== nombreSimulacion);

    // Guardar de nuevo en el Local Storage
    localStorage.setItem('simulaciones', JSON.stringify(simulacionesGuardadas));

    // Actualizar la lista de simulaciones guardadas en la UI
    listarSimulacionesGuardadas();

    alert("Simulación eliminada exitosamente.");
}

// Función para iniciar una nueva simulación
function nuevaSimulacion() {
    // Limpiar todos los campos de entrada
    document.getElementById('datos-simulacion-form').reset();
    document.getElementById('condiciones-hipoteca-form').reset();
    document.getElementById('cuota-mensual-form').reset();

    // Restablecer los valores calculados a cero
    document.getElementById('entrada-euros').textContent = '0.00';
    document.getElementById('arras-euros').textContent = '0.00';
    document.getElementById('impuesto-euros').textContent = '0.00';
    document.getElementById('total-inicial').textContent = '0.00';
    document.getElementById('monto-prestamo').textContent = '0.00';
    document.getElementById('cuota-estimada').textContent = '0.00';
    document.getElementById('cuota-total').textContent = '0.00';
    document.getElementById('ahorro-necesario').textContent = '0.00';
    document.getElementById('financiacion-solicitada').textContent = '0.00';
    document.getElementById('coste-total-hipoteca').textContent = '0.00';

    // Limpiar el calendario de pagos
    limpiarCalendarioPagos();

    // Limpiar el nombre de la simulación
    document.getElementById('nombre-simulacion').value = '';

    // Navegar a la primera pestaña
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    tabs[0].classList.add('active');
    sections[0].classList.add('active');
}

// Función para exportar simulaciones guardadas a un archivo JSON
function exportarSimulaciones() {
    const simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];
    if (simulacionesGuardadas.length === 0) {
        alert("No hay simulaciones para exportar.");
        return;
    }

    const blob = new Blob([JSON.stringify(simulacionesGuardadas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulaciones_mutuo.json';
    document.body.appendChild(a); // Necesario para Firefox
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Función para importar simulaciones desde un archivo JSON
function importarSimulaciones(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const simulacionesImportadas = JSON.parse(e.target.result);
            // Validar que simulacionesImportadas sea un array
            if (!Array.isArray(simulacionesImportadas)) {
                throw new Error("El archivo no contiene un array válido de simulaciones.");
            }

            // Combinar simulaciones existentes con las importadas
            let simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];
            simulacionesGuardadas = simulacionesGuardadas.concat(simulacionesImportadas);

            localStorage.setItem('simulaciones', JSON.stringify(simulacionesGuardadas));
            listarSimulacionesGuardadas();
            alert("Simulaciones importadas correctamente.");
        } catch (error) {
            console.error(error);
            alert("Error al importar las simulaciones. Asegúrate de que el archivo tenga el formato correcto.");
        }
    };
    reader.readAsText(file);
}

// Función principal para inicializar todas las configuraciones
function initializeApp() {
    setupNavigation();
    setupDatosSimulacion();
    setupCondicionesHipoteca();

    // Añadir event listener al botón de calcular cuota
    const calcularCuotaBtn = document.getElementById('calcular-cuota');
    calcularCuotaBtn.addEventListener('click', () => {
        actualizarCuotaMensual();
        actualizarResumenFinanciero();
    });

    // Añadir event listener al botón de guardar simulación
    const guardarSimulacionBtn = document.getElementById('guardar-simulacion');
    guardarSimulacionBtn.addEventListener('click', guardarSimulacion);

    // Añadir event listener al botón de nueva simulación si existe
    const nuevaSimulacionBtn = document.getElementById('nueva-simulacion');
    if (nuevaSimulacionBtn) {
        nuevaSimulacionBtn.addEventListener('click', nuevaSimulacion);
    }

    // Event listeners para exportar e importar
    document.getElementById('exportar-simulaciones').addEventListener('click', exportarSimulaciones);
    document.getElementById('importar-simulaciones-btn').addEventListener('click', () => document.getElementById('importar-simulaciones').click());
    document.getElementById('importar-simulaciones').addEventListener('change', importarSimulaciones);

    // Listar simulaciones guardadas al iniciar
    listarSimulacionesGuardadas();
}

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', initializeApp);

