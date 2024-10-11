// script.js

// Tu configuración de Firebase (reemplaza los valores con los de tu proyecto)
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
firebase.initializeApp(firebaseConfig);

// Inicializar servicios de Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Variable global para almacenar la cuota donde Capital supera a Interés
let cuotaCapitalSuperaInteres = null;

// Observador de cambios en el estado de autenticación (Definido una sola vez fuera de initializeApp)
auth.onAuthStateChanged(user => {
  if (user) {
    // Usuario está autenticado
    console.log("Usuario autenticado:", user);
    mostrarContenidoProtegido();
  } else {
    // Usuario no está autenticado
    console.log("No hay usuario autenticado");
    mostrarFormularioAutenticacion();
  }
});

// Función principal para inicializar todas las configuraciones
function initializeApp() {
  setupMainNavigation();
  setupSecondaryNavigation();
  setupDatosSimulacion();
  setupCondicionesHipoteca();
  setupCalculadoraEndeudamiento();
  setupNavigationButtons();

  // Añadir event listener al botón de guardar simulación
  const guardarSimulacionBtn = document.getElementById('guardar-simulacion');
  if (guardarSimulacionBtn) {
    guardarSimulacionBtn.addEventListener('click', guardarSimulacion);
  }

  // Añadir event listener al botón "Calcular cuota"
  const calcularCuotaBtn = document.getElementById('calcular-cuota');
  if (calcularCuotaBtn) {
    calcularCuotaBtn.addEventListener('click', actualizarCuotaMensual);
  }

  // Manejar el envío del formulario de registro
  const formRegistrar = document.getElementById('form-registrar');
  if (formRegistrar) {
    formRegistrar.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email-registro').value;
      const password = document.getElementById('password-registro').value;
      registrarUsuario(email, password);
    });
  }

  // Manejar el envío del formulario de inicio de sesión
  const formIniciarSesion = document.getElementById('form-iniciar-sesion');
  if (formIniciarSesion) {
    formIniciarSesion.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email-iniciar-sesion').value;
      const password = document.getElementById('password-iniciar-sesion').value;
      iniciarSesion(email, password);
    });
  }

  // Mostrar los formularios correspondientes
  const mostrarFormRegistroBtn = document.getElementById('mostrar-form-registro');
  if (mostrarFormRegistroBtn) {
    mostrarFormRegistroBtn.addEventListener('click', mostrarFormularioRegistro);
  }

  const mostrarFormIniciarSesionBtn = document.getElementById('mostrar-form-iniciar-sesion');
  if (mostrarFormIniciarSesionBtn) {
    mostrarFormIniciarSesionBtn.addEventListener('click', mostrarFormularioIniciarSesion);
  }

  // Inicializar la visibilidad de las secciones
  mostrarFormularioAutenticacion();
}

// Función para manejar la navegación principal
function setupMainNavigation() {
  const mainNav = document.getElementById('main-nav');
  const mainTabs = document.querySelectorAll('#main-nav .nav-tab');
  const mainSections = document.querySelectorAll('main > .section');

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

      // Remover la clase 'active' de todas las subsecciones
      const subSections = document.querySelectorAll('#iniciar-simulacion .subsection');
      subSections.forEach(subsection => subsection.classList.remove('active'));

      // Mostrar u ocultar la barra de navegación secundaria si estamos en 'Iniciar Simulación'
      const secondaryNav = document.getElementById('secondary-nav');
      if (target === 'iniciar-simulacion') {
        secondaryNav.style.display = 'flex';
        // Asegurarse de que la primera pestaña secundaria esté activa
        const subTabs = document.querySelectorAll('#simulation-nav .nav-tab');
        subTabs.forEach(t => t.classList.remove('active'));
        if (subTabs.length > 0) {
          subTabs[0].classList.add('active');
        }

        // Asegurarse de que la primera subsección esté activa
        const firstSubsection = document.querySelector('#iniciar-simulacion .subsection');
        if (firstSubsection) {
          firstSubsection.classList.add('active');
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

      // Si seleccionamos "Calculadora de Capacidad de Endeudamiento", no hacer nada especial
      if (target === 'calculadora-endeudamiento') {
        setupCalculadoraEndeudamiento();
      }

      // En móviles, cerrar el menú al seleccionar una opción
      if (window.innerWidth <= 480) {
        mainNav.classList.remove('active');
      }
    });
  });
}

// Función para manejar la navegación secundaria
function setupSecondaryNavigation() {
    const subTabs = document.querySelectorAll('#simulation-nav .nav-tab');
    const subSections = document.querySelectorAll('#iniciar-simulacion .subsection');

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

// Arreglo con el orden de las subsecciones
const subsectionsOrder = [
  'datos-simulacion',
  'condiciones-hipoteca',
  'cuota-mensual',
  'tabla-amortizacion',
  'resumen'
];

// Función para activar una subsección
function activarSubseccion(subsectionId) {
  const subTabs = document.querySelectorAll('#simulation-nav .nav-tab');
  const subSections = document.querySelectorAll('#iniciar-simulacion .subsection');

  // Remover la clase 'active' de todas las subsecciones y pestañas
  subSections.forEach(subsection => subsection.classList.remove('active'));
  subTabs.forEach(tab => tab.classList.remove('active'));

  // Activar la subsección y pestaña correspondientes
  const targetSubsection = document.getElementById(subsectionId);
  if (targetSubsection) {
      targetSubsection.classList.add('active');
  }

  const targetTab = document.querySelector(`#simulation-nav .nav-tab[data-tab="${subsectionId}"]`);
  if (targetTab) {
      targetTab.classList.add('active');
  }
}

// Función para configurar los botones de navegación
function setupNavigationButtons() {
  subsectionsOrder.forEach((subsectionId, index) => {
      const subsection = document.getElementById(subsectionId);
      if (!subsection) return;

      // Botón "Siguiente"
      const btnSiguiente = subsection.querySelector('.btn-siguiente');
      if (btnSiguiente) {
          btnSiguiente.addEventListener('click', () => {
              // Validar el formulario si es necesario
              const form = subsection.querySelector('form');

              const nextIndex = index + 1;
              if (nextIndex < subsectionsOrder.length) {
                  activarSubseccion(subsectionsOrder[nextIndex]);
              }
          });
      }

      // Botón "Anterior"
      const btnAnterior = subsection.querySelector('.btn-anterior');
      if (btnAnterior) {
          btnAnterior.addEventListener('click', () => {
              const prevIndex = index - 1;
              if (prevIndex >= 0) {
                  activarSubseccion(subsectionsOrder[prevIndex]);
              }
          });
      }
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
  
// Función para guardar la simulación en Firestore
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
    cuotaCapitalSuperaInteres: cuotaCapitalSuperaInteres || 'N/A',
    fecha: new Date().toLocaleString()
  };

  // Obtener las simulaciones guardadas desde el Local Storage
  let simulacionesGuardadas = JSON.parse(localStorage.getItem('simulaciones')) || [];

  const user = auth.currentUser;
  if (user) {
    // Guardar la simulación en Firestore
    db.collection('usuarios').doc(user.uid).collection('simulaciones').doc(nombreSimulacion).set(simulacion)
      .then(() => {
        console.log("Simulación guardada en Firestore");
        alert("Simulación guardada exitosamente.");
        // Limpiar el campo de nombre
        nombreSimulacionInput.value = "";
        // Actualizar la lista de simulaciones
        listarSimulacionesGuardadas();
      })
      .catch(error => {
        console.error("Error al guardar la simulación:", error);
        alert("Error al guardar la simulación.");
      });
  } else {
    alert("Debes iniciar sesión para guardar simulaciones.");
  }
}

// Función para configurar la Calculadora de Capacidad de Endeudamiento
function setupCalculadoraEndeudamiento() {
  const calcularBtn = document.getElementById('calcular-endeudamiento');
  if (calcularBtn) {
    calcularBtn.addEventListener('click', calcularEndeudamiento);
  }
}

// Función para calcular la capacidad de endeudamiento
function calcularEndeudamiento() {
  const ingresosNetos = parseFloat(document.getElementById('ingresos-netos').value) || 0;
  const tasaEndeudamiento = parseFloat(document.getElementById('tasa-endeudamiento').value) || 0;
  const tin = parseFloat(document.getElementById('tin-endeudamiento').value) || 0;
  const plazo = parseInt(document.getElementById('plazo-endeudamiento').value) || 0;

  if (ingresosNetos === 0 || tasaEndeudamiento === 0 || tin === 0 || plazo === 0) {
    alert("Por favor, completa todos los campos para realizar el cálculo.");
    return;
  }

  // Calcular la cuota mensual máxima
  const cuotaMensualMaxima = (ingresosNetos * tasaEndeudamiento) / 100;

  // Calcular el importe máximo financiable
  const numeroCuotas = plazo * 12;
  const interesMensual = (tin / 100) / 12;
  const importeMaximoFinanciable = cuotaMensualMaxima * (1 - Math.pow(1 + interesMensual, -numeroCuotas)) / interesMensual;

  // Mostrar los resultados
  document.getElementById('cuota-mensual-maxima').textContent = cuotaMensualMaxima.toFixed(2);
  document.getElementById('importe-maximo-financiable').textContent = importeMaximoFinanciable.toFixed(2);

  // Mostrar la sección de resultados
  document.getElementById('resultados-endeudamiento').classList.add('active');
}

// Función para listar las simulaciones guardadas desde Firestore
function listarSimulacionesGuardadas() {
  const listaSimulacionesDiv = document.getElementById('lista-simulaciones');
  listaSimulacionesDiv.innerHTML = ""; // Limpiar contenido previo

  const user = auth.currentUser;
  if (user) {
    db.collection('usuarios').doc(user.uid).collection('simulaciones').get()
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          listaSimulacionesDiv.innerHTML = "<p>No hay simulaciones guardadas.</p>";
          return;
        }
        querySnapshot.forEach(doc => {
          const simulacion = doc.data();
          // Crear elementos de interfaz
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
          pTotalInicial.innerHTML = `<strong>Ahorro inicial necesario (€):</strong> €${simulacion.totalInicial.toFixed(2)}`;
          detallesDiv.appendChild(pTotalInicial);

          const pFinanciacionSolicitada = document.createElement('p');
          pFinanciacionSolicitada.innerHTML = `<strong>Financiación solicitada (€):</strong> €${simulacion.financiacionSolicitada.toFixed(2)}`;
          detallesDiv.appendChild(pFinanciacionSolicitada);

          const pCuotaEstimada = document.createElement('p');
          pCuotaEstimada.innerHTML = `<strong>Cuota mensual sin seguros ni productos vinculados (€):</strong> €${simulacion.cuotaEstimada.toFixed(2)}`;
          detallesDiv.appendChild(pCuotaEstimada);

          const pCuotaTotal = document.createElement('p');
          pCuotaTotal.innerHTML = `<strong>Cuota mensual con seguros y productos vinculados (€):</strong> €${simulacion.cuotaTotal.toFixed(2)}`;
          detallesDiv.appendChild(pCuotaTotal);

          const pCosteTotalHipoteca = document.createElement('p');
          pCosteTotalHipoteca.innerHTML = `<strong>Coste total de la hipoteca (€):</strong> €${simulacion.costeTotalHipoteca.toFixed(2)}`;
          detallesDiv.appendChild(pCosteTotalHipoteca);

          const pCuotaCapital = document.createElement('p');
          const cuotaText = simulacion.cuotaCapitalSuperaInteres ? simulacion.cuotaCapitalSuperaInteres : 'N/A';
          pCuotaCapital.innerHTML = `<strong>Cuota donde el pago de capital supera al pago de intereses:</strong> ${cuotaText}`;
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
      })
      .catch(error => {
        console.error("Error al obtener las simulaciones:", error);
      });
  } else {
    listaSimulacionesDiv.innerHTML = "<p>Debes iniciar sesión para ver tus simulaciones guardadas.</p>";
  }
}

// Función para eliminar una simulación de Firestore
function eliminarSimulacion(nombreSimulacion) {
  if (!confirm(`¿Estás seguro de que deseas eliminar la simulación "${nombreSimulacion}"?`)) {
    return;
  }

  const user = auth.currentUser;
  if (user) {
    db.collection('usuarios').doc(user.uid).collection('simulaciones').doc(nombreSimulacion).delete()
      .then(() => {
        console.log("Simulación eliminada de Firestore");
        listarSimulacionesGuardadas();
        alert("Simulación eliminada exitosamente.");
      })
      .catch(error => {
        console.error("Error al eliminar la simulación:", error);
        alert("Error al eliminar la simulación.");
      });
  } else {
    alert("Debes iniciar sesión para eliminar simulaciones.");
  }
}
  
// Función para configurar el comparador
function setupComparador() {
  const comparadorContenido = document.getElementById('comparador-contenido');
  comparadorContenido.innerHTML = ''; // Limpiar contenido previo

  const user = auth.currentUser;
  if (user) {
    db.collection('usuarios').doc(user.uid).collection('simulaciones').get()
      .then(querySnapshot => {
        const simulacionesGuardadas = [];
        querySnapshot.forEach(doc => {
          simulacionesGuardadas.push(doc.data());
        });

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
        compararBtn.classList.add('btn', 'btn-comparar');
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
      })
      .catch(error => {
        console.error("Error al obtener las simulaciones para comparar:", error);
      });
  } else {
    comparadorContenido.innerHTML = "<p>Debes iniciar sesión para utilizar el comparador.</p>";
  }
}
  
// Función para mostrar la comparación de simulaciones
// Función para mostrar la comparación de simulaciones
function mostrarComparacion(simulaciones) {
  const comparadorContenido = document.getElementById('comparador-contenido');
  comparadorContenido.innerHTML = ''; // Limpiar contenido previo

  // Crear una tabla con la misma clase que la tabla de amortización
  const tabla = document.createElement('table');
  tabla.classList.add('tabla-amortizacion'); // Usamos la misma clase

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

  // Lista de propiedades a comparar
  const propiedades = [
      { clave: 'totalInicial', etiqueta: 'Ahorro inicial necesario (€)' },
      { clave: 'financiacionSolicitada', etiqueta: 'Financiación solicitada (€)' },
      { clave: 'cuotaEstimada', etiqueta: 'Cuota mensual sin seguros ni productos vinculados (€)' },
      { clave: 'cuotaTotal', etiqueta: 'Cuota mensual con seguros y productos vinculados (€)' },
      { clave: 'costeTotalHipoteca', etiqueta: 'Coste total de la hipoteca (€)' },
      { clave: 'cuotaCapitalSuperaInteres', etiqueta: 'Cuota donde el pago de capital supera al pago de intereses' }
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
              celdaValor.textContent = valor !== 'N/A' ? `Mes ${valor}` : 'N/A';
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
  
// Función para mostrar el formulario de registro
function mostrarFormularioRegistro() {
  document.getElementById('form-iniciar-sesion').style.display = 'none';
  document.getElementById('form-registrar').style.display = 'block';
}

// Función para mostrar el formulario de inicio de sesión
function mostrarFormularioIniciarSesion() {
  document.getElementById('form-registrar').style.display = 'none';
  document.getElementById('form-iniciar-sesion').style.display = 'block';
}

// Mostrar los formularios correspondientes
document.getElementById('mostrar-form-registro').addEventListener('click', mostrarFormularioRegistro);
document.getElementById('mostrar-form-iniciar-sesion').addEventListener('click', mostrarFormularioIniciarSesion);

// Función para registrar un nuevo usuario
function registrarUsuario(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Registro exitoso
      console.log("Usuario registrado:", userCredential.user);
      alert("Registro exitoso. Ahora puedes iniciar sesión.");
      mostrarFormularioIniciarSesion();
    })
    .catch(error => {
      console.error("Error en el registro:", error.message);
      alert("Error en el registro: " + error.message);
    });
}
  
// Función para iniciar sesión
function iniciarSesion(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Inicio de sesión exitoso
      console.log("Usuario inició sesión:", userCredential.user);
      alert("Inicio de sesión exitoso.");
    })
    .catch(error => {
      console.error("Error en el inicio de sesión:", error.message);
      alert("Error en el inicio de sesión: " + error.message);
    });
}
  
// Función para cerrar sesión
function cerrarSesion() {
  auth.signOut()
    .then(() => {
      // Cierre de sesión exitoso
      console.log("Usuario cerró sesión");
      alert("Has cerrado sesión.");
    })
    .catch(error => {
      console.error("Error al cerrar sesión:", error.message);
    });
}

// Función para mostrar el contenido protegido
function mostrarContenidoProtegido() {
  // Ocultar el formulario de autenticación
  document.getElementById('autenticacion').style.display = 'none';
  // Mostrar las secciones protegidas
  document.getElementById('iniciar-simulacion').style.display = 'block';
  document.getElementById('main-nav').style.display = 'flex';
  document.getElementById('secondary-nav').style.display = 'flex';

  // Añadir botón de cerrar sesión si no existe
  if (!document.getElementById('btn-cerrar-sesion')) {
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Cerrar Sesión';
    logoutBtn.id = 'btn-cerrar-sesion';
    logoutBtn.classList.add('btn', 'btn-login');
    logoutBtn.addEventListener('click', cerrarSesion);
    document.querySelector('.top-bar-content').appendChild(logoutBtn);
  }

  // Listar simulaciones guardadas al iniciar
  listarSimulacionesGuardadas();
}

// Función para mostrar el formulario de autenticación
function mostrarFormularioAutenticacion() {
  // Mostrar el formulario de autenticación
  document.getElementById('autenticacion').style.display = 'block';
  // Ocultar las secciones protegidas
  document.getElementById('iniciar-simulacion').style.display = 'none';
  document.getElementById('main-nav').style.display = 'none';
  document.getElementById('secondary-nav').style.display = 'none';

  // Remover el botón de cerrar sesión si existe
  const logoutBtn = document.getElementById('btn-cerrar-sesion');
  if (logoutBtn) {
    logoutBtn.remove();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const recursoTitles = document.querySelectorAll('.recurso-title');
  
  recursoTitles.forEach(title => {
    title.addEventListener('click', () => {
      const recursoItem = title.closest('.recurso-item');
      recursoItem.classList.toggle('active');
    });
  });
});

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});
  
