// script.js

// Variable global para almacenar la cuota donde Capital supera a Interés
let cuotaCapitalSuperaInteres = null;

// Función para manejar la navegación principal
function setupMainNavigation() {
    const mainTabs = document.querySelectorAll('#main-nav .nav-tab');
    const mainSections = document.querySelectorAll('.section');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover la clase 'active' de todas las pestañas principales
            mainTabs.forEach(t => t.classList.remove('active'));
            // Agregar la clase 'active' a la pestaña seleccionada
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');

            // Remover la clase 'active' de todas las secciones principales
            mainSections.forEach(section => section.classList.remove('active'));
            // Agregar la clase 'active' a la sección seleccionada
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Mostrar u ocultar la barra de navegación secundaria
            const secondaryNav = document.getElementById('secondary-nav');
            if (target === 'iniciar-simulacion') {
                secondaryNav.style.display = 'flex';
                // Activar la primera subsección por defecto
                const firstSubTab = document.querySelector('#simulation-nav .nav-tab');
                if (firstSubTab) {
                    firstSubTab.click();
                }
            } else {
                secondaryNav.style.display = 'none';
            }

            // Si seleccionamos "Mis Simulaciones", actualizar la lista
            if (target === 'mis-simulaciones') {
                listarSimulacionesGuardadas();
            }

            // Si seleccionamos "Comparador", configurar el comparador
            if (target === 'comparador') {
                setupComparador();
            }
        });
    });
}

// Función para manejar la navegación secundaria
function setupSecondaryNavigation() {
    const subTabs = document.querySelectorAll('#simulation-nav .nav-tab');
    const subSections = document.querySelectorAll('.subsection');

    subTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remover la clase 'active' de todas las pestañas secundarias
            subTabs.forEach(t => t.classList.remove('active'));
            // Agregar la clase 'active' a la pestaña seleccionada
            tab.classList.add('active');

            const target = tab.getAttribute('data-tab');

            // Remover la clase 'active' de todas las subsecciones
            subSections.forEach(subsection => subsection.classList.remove('active'));
            // Agregar la clase 'active' a la subsección seleccionada
            const targetSubsection = document.getElementById(target);
            if (targetSubsection) {
                targetSubsection.classList.add('active');
            }
        });
    });
}

// Función para obtener el valor en euros basado en el tipo
function obtenerValorEnEuros(valor, tipo, precioPropiedad) {
    if (tipo === '%') {
        return (valor / 100) * precioPropiedad;
    } else {
        return valor;
    }
}

// Función para obtener el porcentaje basado en euros
function obtenerPorcentaje(valorEuros, precioPropiedad) {
    if (precioPropiedad === 0) return 0;
    return (valorEuros / precioPropiedad) * 100;
}

// Función para actualizar los cálculos en la sección de Datos de la Simulación
function setupDatosSimulacion() {
    // Obtener elementos del DOM
    const precioPropiedadInput = document.getElementById('precio-propiedad');

    // Entrada
    const entradaInput = document.getElementById('entrada');
    const tipoEntradaSelect = document.getElementById('tipo-entrada');
    const entradaCalculadoSpan = document.getElementById('entrada-calculado');

    // Arras
    const arrasInput = document.getElementById('arras');
    const tipoArrasSelect = document.getElementById('tipo-arras');
    const arrasCalculadoSpan = document.getElementById('arras-calculado');

    // Impuesto
    const impuestoInput = document.getElementById('impuesto');
    const impuestoCalculadoSpan = document.getElementById('impuesto-calculado');

    // Otros campos
    const tasacionInput = document.getElementById('tasacion');
    const notariaInput = document.getElementById('notaria');
    const gestorInput = document.getElementById('gestoria');
    const registroInput = document.getElementById('registro-propiedad');

    const totalInicialSpan = document.getElementById('total-inicial');

    // Variables para almacenar valores en euros
    let entradaEuros = 0;
    let arrasEuros = 0;
    let impuestoEuros = 0;

    // Función para actualizar los valores en euros basados en tipos
    function actualizarValores() {
        const precioPropiedad = parseFloat(precioPropiedadInput.value) || 0;

        // Entrada
        const entradaValor = parseFloat(entradaInput.value) || 0;
        const tipoEntrada = tipoEntradaSelect.value;
        if (tipoEntrada === '%') {
            entradaEuros = obtenerValorEnEuros(entradaValor, tipoEntrada, precioPropiedad);
            entradaCalculadoSpan.textContent = `€${entradaEuros.toFixed(2)}`;
        } else if (tipoEntrada === '€') {
            entradaEuros = entradaValor;
            const entradaPorcentaje = obtenerPorcentaje(entradaEuros, precioPropiedad);
            entradaCalculadoSpan.textContent = `${entradaPorcentaje.toFixed(2)}%`;
        }

        // Arras
        const arrasValor = parseFloat(arrasInput.value) || 0;
        const tipoArras = tipoArrasSelect.value;
        if (tipoArras === '%') {
            arrasEuros = obtenerValorEnEuros(arrasValor, tipoArras, precioPropiedad);
            arrasCalculadoSpan.textContent = `€${arrasEuros.toFixed(2)}`;
        } else if (tipoArras === '€') {
            arrasEuros = arrasValor;
            const arrasPorcentaje = obtenerPorcentaje(arrasEuros, precioPropiedad);
            arrasCalculadoSpan.textContent = `${arrasPorcentaje.toFixed(2)}%`;
        }

        // Impuesto (Siempre en %)
        const impuestoValor = parseFloat(impuestoInput.value) || 0;
        impuestoEuros = (impuestoValor / 100) * precioPropiedad;
        impuestoCalculadoSpan.textContent = `€${impuestoEuros.toFixed(2)}`;

        // Validación: Entrada + Arras no exceden Precio de la Propiedad
        if ((entradaEuros + arrasEuros) > precioPropiedad) {
            alert("La suma de Entrada y Arras no puede exceder el Precio de la Propiedad.");
            // Opcional: Puedes limpiar los campos o revertir los últimos cambios
            // Por ejemplo:
            // entradaInput.value = "";
            // arrasInput.value = "";
            // actualizarValores();
            return;
        }

        calcularTotalInicial();
    }

    // Función para calcular el total inicial necesario
    function calcularTotalInicial() {
        const tasacion = parseFloat(tasacionInput.value) || 0;
        const notaria = parseFloat(notariaInput.value) || 0;
        const gestor = parseFloat(gestorInput.value) || 0;
        const registro = parseFloat(registroInput.value) || 0;

        const totalInicial = entradaEuros + arrasEuros + impuestoEuros + tasacion + notaria + gestor + registro;
        totalInicialSpan.textContent = totalInicial.toFixed(2);
    }

    // Event Listeners para actualizar los cálculos en tiempo real
    precioPropiedadInput.addEventListener('input', actualizarValores);

    entradaInput.addEventListener('input', actualizarValores);
    tipoEntradaSelect.addEventListener('change', actualizarValores);

    arrasInput.addEventListener('input', actualizarValores);
    tipoArrasSelect.addEventListener('change', actualizarValores);

    impuestoInput.addEventListener('input', actualizarValores);

    tasacionInput.addEventListener('input', calcularTotalInicial);
    notariaInput.addEventListener('input', calcularTotalInicial);
    gestorInput.addEventListener('input', calcularTotalInicial);
    registroInput.addEventListener('input', calcularTotalInicial);

    // Inicializar valores al cargar la página
    actualizarValores();
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
    const entradaEuros = parseFloat(document.getElementById('entrada-calculado').textContent.replace('€', '').replace('%', '')) || 0;
    const arrasEuros = parseFloat(document.getElementById('arras-calculado').textContent.replace('€', '').replace('%', '')) || 0;

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
    cuotaCapitalSuperaInteres = null;
    actualizarCuotaComparador();
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

    // Reiniciar la variable antes de generar el calendario
    cuotaCapitalSuperaInteres = null;

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

        // Verificar si Capital > Interés y si aún no se ha encontrado la cuota
        if (capital > interes && cuotaCapitalSuperaInteres === null) {
            fila.classList.add('capital-supera-interes');
            cuotaCapitalSuperaInteres = i;
        }

        // Agregar la fila al cuerpo de la tabla
        tablaBody.appendChild(fila);
    }

    // Actualizar el Comparador con la cuota encontrada
    actualizarCuotaComparador();
}

// Función para actualizar la cuota en el Comparador
function actualizarCuotaComparador() {
    const cuotaIndicador = document.getElementById('cuota-capital-supera-interes');
    if (cuotaIndicador) {
        if (cuotaCapitalSuperaInteres) {
            cuotaIndicador.innerText = cuotaCapitalSuperaInteres;
        } else {
            cuotaIndicador.innerText = 'N/A';
        }
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
        cuotaCapitalSuperaInteres: cuotaCapitalSuperaInteres, // Nuevo campo
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

        // Mostrar la cuota donde Capital supera a Interés
        const pCuotaCapital = document.createElement('p');
        const cuotaText = simulacion.cuotaCapitalSuperaInteres ? simulacion.cuotaCapitalSuperaInteres : 'N/A';
        pCuotaCapital.innerHTML = `<strong>Cuota Capital > Interés:</strong> ${cuotaText}`;
        detallesDiv.appendChild(pCuotaCapital);

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

// Función para configurar el comparador
function setupComparador() {
    const comparadorContenido = document.getElementById('comparador-contenido');
    comparadorContenido.innerHTML = ''; // Limpiar contenido previo

    // Obtener las simulaciones guardadas desde el Local Storage
    const simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

    if (simulacionesGuardadas.length === 0) {
        comparadorContenido.innerHTML = "<p>No hay simulaciones guardadas para comparar.</p>";
        return;
    }

    // Crear una lista de checkboxes para seleccionar simulaciones
    const formComparador = document.createElement('form');
    formComparador.id = 'form-comparador';

    simulacionesGuardadas.forEach((simulacion, index) => {
        const label = document.createElement('label');
        label.style.display = 'block';
        label.style.marginBottom = '10px';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'simulacion';
        checkbox.value = index;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${simulacion.nombre}`));
        formComparador.appendChild(label);
    });

    // Botón para comparar
    const compararBtn = document.createElement('button');
    compararBtn.type = 'button';
    compararBtn.textContent = 'Comparar Simulaciones';
    compararBtn.classList.add('btn', 'btn-comparar'); // Añadir clase 'btn-comparar'
    compararBtn.style.marginTop = '20px';
    compararBtn.addEventListener('click', () => {
        const seleccionadas = Array.from(formComparador.elements['simulacion'])
            .filter(checkbox => checkbox.checked)
            .map(checkbox => simulacionesGuardadas[checkbox.value]);

        if (seleccionadas.length < 2) {
            alert('Por favor, selecciona al menos dos simulaciones para comparar.');
            return;
        }

        mostrarComparacion(seleccionadas);
    });

    formComparador.appendChild(compararBtn);
    comparadorContenido.appendChild(formComparador);
}

// Función para mostrar la comparación de simulaciones
function mostrarComparacion(simulaciones) {
    const comparadorContenido = document.getElementById('comparador-contenido');
    comparadorContenido.innerHTML = ''; // Limpiar contenido previo

    // Crear una tabla comparativa de parámetros financieros y cuotaCapitalSuperaInteres
    const tabla = document.createElement('table');
    tabla.classList.add('tabla-comparacion');

    // Crear encabezados de la tabla
    const thead = document.createElement('thead');
    const encabezadoFila = document.createElement('tr');

    const encabezadoVacio = document.createElement('th');
    encabezadoVacio.textContent = 'Parámetro';
    encabezadoFila.appendChild(encabezadoVacio);

    simulaciones.forEach(simulacion => {
        const th = document.createElement('th');
        th.textContent = simulacion.nombre;
        encabezadoFila.appendChild(th);
    });
    thead.appendChild(encabezadoFila);
    tabla.appendChild(thead);

    // Crear cuerpo de la tabla
    const tbody = document.createElement('tbody');

    // Lista de propiedades a comparar incluyendo cuotaCapitalSuperaInteres
    const propiedades = [
        { clave: 'totalInicial', etiqueta: 'Total Inicial (€)' },
        { clave: 'financiacionSolicitada', etiqueta: 'Financiación Solicitada (€)' },
        { clave: 'costeTotalHipoteca', etiqueta: 'Coste Total Hipoteca (€)' },
        { clave: 'cuotaEstimada', etiqueta: 'Cuota Mensual Estimada (€)' },
        { clave: 'cuotaTotal', etiqueta: 'Cuota Mensual Total (€)' },
        { clave: 'cuotaCapitalSuperaInteres', etiqueta: 'Cuota donde Capital > Interés' } // Nueva propiedad
    ];

    propiedades.forEach(prop => {
        const fila = document.createElement('tr');
        const celdaEtiqueta = document.createElement('td');
        celdaEtiqueta.textContent = prop.etiqueta;
        fila.appendChild(celdaEtiqueta);

        simulaciones.forEach(simulacion => {
            const celdaValor = document.createElement('td');
            const valor = simulacion[prop.clave];

            // Formatear el valor según la propiedad
            if (prop.clave === 'cuotaCapitalSuperaInteres') {
                celdaValor.textContent = valor ? valor : 'N/A';
            } else {
                celdaValor.textContent = `€${valor.toFixed(2)}`;
            }

            fila.appendChild(celdaValor);
        });

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    comparadorContenido.appendChild(tabla);
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

            // Obtener simulaciones existentes
            let simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

            // Filtrar simulaciones duplicadas basadas en el nombre
            simulacionesImportadas.forEach(sim => {
                const existe = simulacionesGuardadas.some(existingSim => existingSim.nombre.toLowerCase() === sim.nombre.toLowerCase());
                if (!existe) {
                    simulacionesGuardadas.push(sim);
                }
            });

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
    setupMainNavigation();
    setupSecondaryNavigation();
    setupDatosSimulacion();
    setupCondicionesHipoteca();

    // Añadir event listener al botón de guardar simulación
    const guardarSimulacionBtn = document.getElementById('guardar-simulacion');
    if (guardarSimulacionBtn) {
        guardarSimulacionBtn.addEventListener('click', guardarSimulacion);
    }

    // Event listeners para exportar e importar
    const exportarBtn = document.getElementById('exportar-simulaciones');
    if (exportarBtn) {
        exportarBtn.addEventListener('click', exportarSimulaciones);
    }

    const importarBtn = document.getElementById('importar-simulaciones-btn');
    if (importarBtn) {
        importarBtn.addEventListener('click', () => document.getElementById('importar-simulaciones').click());
    }

    const importarInput = document.getElementById('importar-simulaciones');
    if (importarInput) {
        importarInput.addEventListener('change', importarSimulaciones);
    }

    // Añadir event listener al botón "Calcular cuota"
    const calcularCuotaBtn = document.getElementById('calcular-cuota');
    if (calcularCuotaBtn) {
        calcularCuotaBtn.addEventListener('click', actualizarCuotaMensual);
    }

    // Listar simulaciones guardadas al iniciar
    listarSimulacionesGuardadas();
}

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', initializeApp);

