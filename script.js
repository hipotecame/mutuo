// script.js

// Importar las funciones necesarias de los SDK de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    doc,
    getDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyALraPSeUz2na5U39Id5xARwhBl0i287DM",
    authDomain: "mutuotest-7d923.firebaseapp.com",
    projectId: "mutuotest-7d923",
    storageBucket: "mutuotest-7d923.appspot.com",
    messagingSenderId: "606174907620",
    appId: "1:606174907620:web:1d64c186a7876b6c2a70f1",
    measurementId: "G-CGCDJLYMK8"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

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

// Función para guardar la simulación en Firestore
async function guardarSimulacion() {
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

    try {
        // Verificar si ya existe una simulación con el mismo nombre
        const simulacionesRef = collection(db, "simulaciones");
        const q = query(simulacionesRef, where("nombre", "==", nombreSimulacion));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            alert("Ya existe una simulación con este nombre. Por favor, elige otro nombre.");
            return;
        }

        // Añadir la nueva simulación a Firestore
        await addDoc(simulacionesRef, simulacion);

        // Limpiar el campo de nombre
        nombreSimulacionInput.value = "";

        // Actualizar la lista de simulaciones guardadas en la UI
        listarSimulacionesGuardadas();

        alert("Simulación guardada exitosamente.");
    } catch (error) {
        console.error("Error al guardar la simulación: ", error);
        alert("Hubo un error al guardar la simulación. Por favor, inténtalo de nuevo.");
    }
}

// Función para listar las simulaciones guardadas desde Firestore
async function listarSimulacionesGuardadas() {
    const listaSimulacionesDiv = document.getElementById('lista-simulaciones');
    listaSimulacionesDiv.innerHTML = ""; // Limpiar contenido previo

    try {
        const simulacionesRef = collection(db, "simulaciones");
        const simulacionesSnapshot = await getDocs(simulacionesRef);

        if (simulacionesSnapshot.empty) {
            listaSimulacionesDiv.innerHTML = "<p>No hay simulaciones guardadas.</p>";
            return;
        }

        simulacionesSnapshot.forEach(docSnapshot => {
            const simulacion = docSnapshot.data();

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

            // Botón Editar
            const editarBtn = document.createElement('button');
            editarBtn.textContent = 'Editar';
            editarBtn.classList.add('editar-btn');
            editarBtn.addEventListener('click', () => editarSimulacion(simulacion.nombre));
            accionesDiv.appendChild(editarBtn);

            // Botón Eliminar
            const eliminarBtn = document.createElement('button');
            eliminarBtn.textContent = 'Eliminar';
            eliminarBtn.classList.add('eliminar-btn');
            eliminarBtn.addEventListener('click', () => eliminarSimulacion(simulacion.nombre));
            accionesDiv.appendChild(eliminarBtn);

            simulacionDiv.appendChild(accionesDiv);

            listaSimulacionesDiv.appendChild(simulacionDiv);
        });
    } catch (error) {
        console.error("Error al listar las simulaciones: ", error);
        listaSimulacionesDiv.innerHTML = "<p>Hubo un error al cargar las simulaciones guardadas.</p>";
    }
}

// Función para editar una simulación
async function editarSimulacion(nombreSimulacion) {
    try {
        // Obtener la referencia a la simulación específica
        const simulacionesRef = collection(db, "simulaciones");
        const q = query(simulacionesRef, where("nombre", "==", nombreSimulacion));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Simulación no encontrada.");
            return;
        }

        const simulacionDoc = querySnapshot.docs[0];
        const simulacionData = simulacionDoc.data();

        // Cargar los datos de la simulación en los formularios
        document.getElementById('nombre-simulacion').value = simulacionData.nombre;
        document.getElementById('precio-inmueble').value = simulacionData.totalInicial;
        // Calculamos los porcentajes basados en totalInicial
        // Este es un ejemplo, ajusta según cómo desees manejar los porcentajes
        const entradaPorcentaje = (simulacionData.cuotaTin / simulacionData.totalInicial) * 100 || 0;
        document.getElementById('entrada-porcentaje').value = entradaPorcentaje.toFixed(2);
        document.getElementById('arras-porcentaje').value = 0; // Ajusta si tienes datos para arras
        document.getElementById('itp-porcentaje').value = 0; // Ajusta si tienes datos para ITP

        document.getElementById('tasacion').value = 0; // Ajusta si tienes datos
        document.getElementById('notaria').value = 0; // Ajusta si tienes datos
        document.getElementById('gestoria').value = 0; // Ajusta si tienes datos
        document.getElementById('registro-propiedad').value = 0; // Ajusta si tienes datos

        document.getElementById('seguro-hogar').value = simulacionData.cuotaConSeguros - simulacionData.cuotaTin || 0;
        document.getElementById('seguro-vida').value = 0; // Ajusta si tienes datos
        document.getElementById('tin').value = 0; // Ajusta si tienes datos
        document.getElementById('tae').value = 0; // Ajusta si tienes datos
        document.getElementById('plazo').value = 0; // Ajusta si tienes datos

        // Recalcular los valores
        actualizarPorcentaje();
        actualizarGastosHipoteca();
        calcularCuotaHipotecaria();
        actualizarCostoTotal();

        // Navegar a la pestaña de Gastos Iniciales para editar
        const tabs = document.querySelectorAll('.nav-tab');
        const sections = document.querySelectorAll('.section');
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        tabs[0].classList.add('active');
        sections[0].classList.add('active');

        // Informar al usuario que puede editar los campos
        alert(`Edite los campos de la simulación "${nombreSimulacion}" y guárdela nuevamente.`);
    } catch (error) {
        console.error("Error al editar la simulación: ", error);
        alert("Hubo un error al editar la simulación. Por favor, inténtalo de nuevo.");
    }
}

// Función para eliminar una simulación de Firestore
async function eliminarSimulacion(nombreSimulacion) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la simulación "${nombreSimulacion}"?`)) {
        return;
    }

    try {
        // Obtener la referencia a la simulación específica
        const simulacionesRef = collection(db, "simulaciones");
        const q = query(simulacionesRef, where("nombre", "==", nombreSimulacion));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert("Simulación no encontrada.");
            return;
        }

        const simulacionDoc = querySnapshot.docs[0];
        await deleteDoc(doc(db, "simulaciones", simulacionDoc.id));

        // Actualizar la lista de simulaciones guardadas en la UI
        listarSimulacionesGuardadas();

        alert("Simulación eliminada exitosamente.");
    } catch (error) {
        console.error("Error al eliminar la simulación: ", error);
        alert("Hubo un error al eliminar la simulación. Por favor, inténtalo de nuevo.");
    }
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

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', initializeApp);

