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

// Función para actualizar los cálculos en la sección de Gastos Iniciales
function setupGastosIniciales() {
    // Obtener elementos del DOM
    const precioInmuebleInput = document.getElementById('precio-inmueble');
    const entradaPorcentajeInput = document.getElementById('entrada-porcentaje');
    const arrasPorcentajeInput = document.getElementById('arras-porcentaje');
    const itpPorcentajeInput = document.getElementById('itp-porcentaje');
    
    const entradaEurosSpan = document.getElementById('entrada-euros');
    const arrasEurosSpan = document.getElementById('arras-euros');
    const itpEurosSpan = document.getElementById('itp-euros');
    
    const tasacionInput = document.getElementById('tasacion');
    const notariaInput = document.getElementById('notaria');
    const gestorInput = document.getElementById('gestoria');
    const registroInput = document.getElementById('registro-propiedad');
    
    const totalInicialSpan = document.getElementById('total-inicial');
    
    // Función para actualizar los valores en euros basados en porcentajes
    function actualizarPorcentaje() {
        const precioInmueble = parseFloat(precioInmuebleInput.value) || 0;
    
        const entradaPorcentaje = parseFloat(entradaPorcentajeInput.value) || 0;
        const entradaEuros = (entradaPorcentaje / 100) * precioInmueble;
        entradaEurosSpan.textContent = entradaEuros.toFixed(2);
    
        const arrasPorcentaje = parseFloat(arrasPorcentajeInput.value) || 0;
        const arrasEuros = (arrasPorcentaje / 100) * precioInmueble;
        arrasEurosSpan.textContent = arrasEuros.toFixed(2);
    
        const itpPorcentaje = parseFloat(itpPorcentajeInput.value) || 0;
        const itpEuros = (itpPorcentaje / 100) * precioInmueble;
        itpEurosSpan.textContent = itpEuros.toFixed(2);
    
        calcularTotalInicial();
    }
    
    // Función para calcular el total inicial necesario
    function calcularTotalInicial() {
        const entradaEuros = parseFloat(entradaEurosSpan.textContent) || 0;
        const arrasEuros = parseFloat(arrasEurosSpan.textContent) || 0;
        const itpEuros = parseFloat(itpEurosSpan.textContent) || 0;
    
        const tasacion = parseFloat(tasacionInput.value) || 0;
        const notaria = parseFloat(notariaInput.value) || 0;
        const gestor = parseFloat(gestorInput.value) || 0;
        const registro = parseFloat(registroInput.value) || 0;
    
        const totalInicial = entradaEuros + arrasEuros + itpEuros + tasacion + notaria + gestor + registro;
        totalInicialSpan.textContent = totalInicial.toFixed(2);
    }
    
    // Event Listeners para actualizar los cálculos en tiempo real
    precioInmuebleInput.addEventListener('input', actualizarPorcentaje);
    entradaPorcentajeInput.addEventListener('input', actualizarPorcentaje);
    arrasPorcentajeInput.addEventListener('input', actualizarPorcentaje);
    itpPorcentajeInput.addEventListener('input', actualizarPorcentaje);
    
    tasacionInput.addEventListener('input', calcularTotalInicial);
    notariaInput.addEventListener('input', calcularTotalInicial);
    gestorInput.addEventListener('input', calcularTotalInicial);
    registroInput.addEventListener('input', calcularTotalInicial);
    
    // Inicializar valores al cargar la página
    window.addEventListener('DOMContentLoaded', () => {
        actualizarPorcentaje();
    });
}

// Función para configurar los cálculos en la sección de Gastos Hipotecarios
function setupGastosHipotecarios() {
    const gastosHipotecaForm = document.getElementById('gastos-hipotecarios-form');
    const seguroHogarInput = document.getElementById('seguro-hogar');
    const seguroVidaInput = document.getElementById('seguro-vida');
    const tinInput = document.getElementById('tin');
    const taeInput = document.getElementById('tae');
    const plazoInput = document.getElementById('plazo');
    
    // Función para actualizar los gastos hipotecarios y recalcular la cuota
    function actualizarGastosHipoteca() {
        const seguroHogar = parseFloat(seguroHogarInput.value) || 0;
        const seguroVida = parseFloat(seguroVidaInput.value) || 0;
        const tin = parseFloat(tinInput.value) || 0;
        const tae = parseFloat(taeInput.value) || 0;
        const plazo = parseInt(plazoInput.value) || 0;
        
        // Actualizar el monto del préstamo en la sección de Cuota Hipotecaria
        const precioInmueble = parseFloat(document.getElementById('precio-inmueble').value) || 0;
        const entrada = parseFloat(document.getElementById('entrada-euros').textContent) || 0;
        const arras = parseFloat(document.getElementById('arras-euros').textContent) || 0;
        const montoPrestamo = precioInmueble - entrada - arras;
        document.getElementById('monto-prestamo').textContent = montoPrestamo.toFixed(2);
        
        // Actualizar el plazo en años y número de cuotas en la sección de Cuota Hipotecaria
        document.getElementById('plazo-anios').textContent = plazo;
        document.getElementById('numero-cuotas').textContent = plazo * 12;
        
        // Mostrar TIN y TAE en la sección de Cuota Hipotecaria
        document.getElementById('mostrar-tin').textContent = tin.toFixed(2);
        document.getElementById('mostrar-tae').textContent = tae.toFixed(2);
        
        // Calcular y mostrar la cuota hipotecaria
        calcularCuotaHipotecaria();
    }
    
    // Event Listeners para actualizar los gastos hipotecarios en tiempo real
    gastosHipotecaForm.addEventListener('input', actualizarGastosHipoteca);
    
    // Inicializar cálculos al cargar la página
    window.addEventListener('DOMContentLoaded', () => {
        actualizarGastosHipoteca();
    });
}

// Función para calcular la cuota hipotecaria
function calcularCuotaHipotecaria() {
    const montoPrestamo = parseFloat(document.getElementById('monto-prestamo').textContent) || 0;
    const tin = parseFloat(document.getElementById('mostrar-tin').textContent) || 0;
    const tae = parseFloat(document.getElementById('mostrar-tae').textContent) || 0;
    const plazo = parseInt(document.getElementById('plazo-anios').textContent) || 0;
    const numeroCuotas = parseInt(document.getElementById('numero-cuotas').textContent) || 0;
    
    // Obtener los seguros (asumiendo que son costos mensuales)
    const seguroHogarMensual = parseFloat(document.getElementById('seguro-hogar').value) || 0;
    const seguroVidaMensual = parseFloat(document.getElementById('seguro-vida').value) || 0;
    
    if (montoPrestamo === 0 || plazo === 0) {
        document.getElementById('cuota-tin').textContent = '0.00';
        document.getElementById('cuota-con-seguros').textContent = '0.00';
        document.getElementById('costo-total-hipoteca').textContent = '0.00';
        actualizarCostoTotal();
        return;
    }
    
    // Cálculo de la cuota hipotecaria usando la fórmula de amortización con TIN
    const interesMensual = (tin / 100) / 12;
    const cuota = (montoPrestamo * interesMensual) / (1 - Math.pow(1 + interesMensual, -numeroCuotas));
    document.getElementById('cuota-tin').textContent = cuota.toFixed(2);
    
    // Cálculo de la cuota incluyendo seguros
    const cuotaConSeguros = cuota + seguroHogarMensual + seguroVidaMensual;
    document.getElementById('cuota-con-seguros').textContent = cuotaConSeguros.toFixed(2);
    
    // Cálculo del costo total de la hipoteca basado en TAE
    // Considerando TAE como tasa efectiva anual
    const interesEfectivoMensual = (tae / 100) / 12;
    const cuotaTAE = (montoPrestamo * interesEfectivoMensual) / (1 - Math.pow(1 + interesEfectivoMensual, -numeroCuotas));
    const costoTotalHipoteca = cuotaTAE * numeroCuotas;
    document.getElementById('costo-total-hipoteca').textContent = costoTotalHipoteca.toFixed(2);
    
    // Actualizar el Costo Total de Vivienda en la sección correspondiente
    actualizarCostoTotal();
}

// Función para actualizar el Costo Total de Vivienda
function actualizarCostoTotal() {
    const totalInicial = parseFloat(document.getElementById('total-inicial').textContent) || 0;
    const costoTotalHipoteca = parseFloat(document.getElementById('costo-total-hipoteca').textContent) || 0;
    const costoTotalVivienda = totalInicial + costoTotalHipoteca;
    
    document.getElementById('total-inicial-costo').textContent = totalInicial.toFixed(2);
    document.getElementById('total-hipotecarios').textContent = costoTotalHipoteca.toFixed(2);
    document.getElementById('costo-total-vivienda').textContent = costoTotalVivienda.toFixed(2);
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
        totalHipotecarios: parseFloat(document.getElementById('costo-total-hipoteca').textContent) || 0,
        costoTotalVivienda: parseFloat(document.getElementById('costo-total-vivienda').textContent) || 0,
        cuotaTin: parseFloat(document.getElementById('cuota-tin').textContent) || 0,
        cuotaConSeguros: parseFloat(document.getElementById('cuota-con-seguros').textContent) || 0,
        costoTotalHipoteca: parseFloat(document.getElementById('costo-total-hipoteca').textContent) || 0,
        fecha: new Date().toLocaleString() // Añadimos una marca de tiempo para referencia
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
        pFecha.innerHTML = `<strong>Fecha de creación:</strong> ${simulacion.fecha}`;
        detallesDiv.appendChild(pFecha);

        const pTotalInicial = document.createElement('p');
        pTotalInicial.innerHTML = `<strong>Total inicial necesario (€):</strong> €${simulacion.totalInicial.toFixed(2)}`;
        detallesDiv.appendChild(pTotalInicial);

        const pTotalHipotecarios = document.createElement('p');
        pTotalHipotecarios.innerHTML = `<strong>Total gastos hipotecarios (€):</strong> €${simulacion.totalHipotecarios.toFixed(2)}`;
        detallesDiv.appendChild(pTotalHipotecarios);

        const pCostoTotalVivienda = document.createElement('p');
        pCostoTotalVivienda.innerHTML = `<strong>Costo total de la vivienda basado en la TAE (€):</strong> €${simulacion.costoTotalVivienda.toFixed(2)}`;
        detallesDiv.appendChild(pCostoTotalVivienda);

        const pCuotaTin = document.createElement('p');
        pCuotaTin.innerHTML = `<strong>Cuota mensual basada en la TIN (€):</strong> €${simulacion.cuotaTin.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaTin);

        const pCuotaConSeguros = document.createElement('p');
        pCuotaConSeguros.innerHTML = `<strong>Cuota mensual basada en la TIN e incluyendo seguros (€):</strong> €${simulacion.cuotaConSeguros.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaConSeguros);

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
    document.getElementById('gastos-iniciales-form').reset();
    document.getElementById('gastos-hipotecarios-form').reset();
    document.getElementById('cuota-hipotecaria-form').reset();
    
    // Restablecer los valores calculados a cero
    document.getElementById('entrada-euros').textContent = '0.00';
    document.getElementById('arras-euros').textContent = '0.00';
    document.getElementById('itp-euros').textContent = '0.00';
    document.getElementById('total-inicial').textContent = '0.00';
    document.getElementById('monto-prestamo').textContent = '0.00';
    document.getElementById('plazo-anios').textContent = '0';
    document.getElementById('numero-cuotas').textContent = '0';
    document.getElementById('mostrar-tin').textContent = '0.00';
    document.getElementById('mostrar-tae').textContent = '0.00';
    document.getElementById('cuota-tin').textContent = '0.00';
    document.getElementById('cuota-con-seguros').textContent = '0.00';
    document.getElementById('costo-total-hipoteca').textContent = '0.00';
    document.getElementById('total-inicial-costo').textContent = '0.00';
    document.getElementById('total-hipotecarios').textContent = '0.00';
    document.getElementById('costo-total-vivienda').textContent = '0.00';
    
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
        pTotalInicial.innerHTML = `<strong>Total Inicial Necesario:</strong> €${simulacion.totalInicial.toFixed(2)}`;
        detallesDiv.appendChild(pTotalInicial);

        const pTotalHipotecarios = document.createElement('p');
        pTotalHipotecarios.innerHTML = `<strong>Total Gastos Hipotecarios:</strong> €${simulacion.totalHipotecarios.toFixed(2)}`;
        detallesDiv.appendChild(pTotalHipotecarios);

        const pCostoTotalVivienda = document.createElement('p');
        pCostoTotalVivienda.innerHTML = `<strong>Costo Total de la Vivienda:</strong> €${simulacion.costoTotalVivienda.toFixed(2)}`;
        detallesDiv.appendChild(pCostoTotalVivienda);

        const pCuotaTin = document.createElement('p');
        pCuotaTin.innerHTML = `<strong>Cuota Mensual Basada en TIN:</strong> €${simulacion.cuotaTin.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaTin);

        const pCuotaConSeguros = document.createElement('p');
        pCuotaConSeguros.innerHTML = `<strong>Cuota Mensual Incluyendo Seguros:</strong> €${simulacion.cuotaConSeguros.toFixed(2)}`;
        detallesDiv.appendChild(pCuotaConSeguros);

        const pCostoTotalHipoteca = document.createElement('p');
        pCostoTotalHipoteca.innerHTML = `<strong>Costo Total de la Hipoteca Basado en TAE:</strong> €${simulacion.costoTotalHipoteca.toFixed(2)}`;
        detallesDiv.appendChild(pCostoTotalHipoteca);

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
    document.getElementById('gastos-iniciales-form').reset();
    document.getElementById('gastos-hipotecarios-form').reset();
    document.getElementById('cuota-hipotecaria-form').reset();
    
    // Restablecer los valores calculados a cero
    document.getElementById('entrada-euros').textContent = '0.00';
    document.getElementById('arras-euros').textContent = '0.00';
    document.getElementById('itp-euros').textContent = '0.00';
    document.getElementById('total-inicial').textContent = '0.00';
    document.getElementById('monto-prestamo').textContent = '0.00';
    document.getElementById('plazo-anios').textContent = '0';
    document.getElementById('numero-cuotas').textContent = '0';
    document.getElementById('mostrar-tin').textContent = '0.00';
    document.getElementById('mostrar-tae').textContent = '0.00';
    document.getElementById('cuota-tin').textContent = '0.00';
    document.getElementById('cuota-con-seguros').textContent = '0.00';
    document.getElementById('costo-total-hipoteca').textContent = '0.00';
    document.getElementById('total-inicial-costo').textContent = '0.00';
    document.getElementById('total-hipotecarios').textContent = '0.00';
    document.getElementById('costo-total-vivienda').textContent = '0.00';
    
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

// Función principal para inicializar todas las configuraciones
function initializeApp() {
    setupNavigation();
    setupGastosIniciales();
    setupGastosHipotecarios();
    calcularCuotaHipotecaria(); // Inicializar cálculos

    // Añadir event listener al botón de guardar simulación
    const guardarSimulacionBtn = document.getElementById('guardar-simulacion');
    guardarSimulacionBtn.addEventListener('click', guardarSimulacion);

    // Añadir event listener al botón de nueva simulación
    const nuevaSimulacionBtn = document.getElementById('nueva-simulacion');
    nuevaSimulacionBtn.addEventListener('click', nuevaSimulacion);

    // Listar simulaciones guardadas al iniciar
    listarSimulacionesGuardadas();
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
    a.click();
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
            localStorage.setItem('simulaciones', JSON.stringify(simulacionesImportadas));
            listarSimulacionesGuardadas();
            alert("Simulaciones importadas correctamente.");
        } catch (error) {
            alert("Error al importar las simulaciones. Asegúrate de que el archivo tenga el formato correcto.");
        }
    };
    reader.readAsText(file);
}

// Event listeners para exportar e importar
document.getElementById('exportar-simulaciones').addEventListener('click', exportarSimulaciones);
document.getElementById('importar-simulaciones-btn').addEventListener('click', () => document.getElementById('importar-simulaciones').click());
document.getElementById('importar-simulaciones').addEventListener('change', importarSimulaciones);

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', initializeApp);
