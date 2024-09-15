// script.js

// Inicializar Firebase
// Asegúrate de que este script esté después de la configuración de Firebase en index.html
// const firebaseConfig = { ... }; // Ya está definido en index.html
// firebase.initializeApp(firebaseConfig); // Ya está ejecutado en index.html
const db = firebase.firestore();
const auth = firebase.auth();

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

// Función para manejar la autenticación
function setupAuth() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const authForm = document.getElementById('auth-form');

    // Iniciar Sesión
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value.trim();

        auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                alert('Iniciada sesión exitosamente.');
                authForm.reset();
            })
            .catch(error => {
                alert(`Error al iniciar sesión: ${error.message}`);
            });
    });

    // Registrarse
    registerBtn.addEventListener('click', () => {
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value.trim();

        auth.createUserWithEmailAndPassword(email, password)
            .then(() => {
                alert('Registrado exitosamente.');
                authForm.reset();
            })
            .catch(error => {
                alert(`Error al registrarse: ${error.message}`);
            });
    });

    // Cerrar Sesión
    logoutBtn.addEventListener('click', () => {
        auth.signOut()
            .then(() => {
                alert('Sesión cerrada exitosamente.');
            })
            .catch(error => {
                alert(`Error al cerrar sesión: ${error.message}`);
            });
    });

    // Listener de Autenticación
    auth.onAuthStateChanged(user => {
        if (user) {
            // Usuario autenticado
            logoutBtn.style.display = 'block';
            authForm.style.display = 'none';
        } else {
            // Usuario no autenticado
            logoutBtn.style.display = 'none';
            authForm.style.display = 'block';
        }
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
function guardarSimulacion() {
    const nombreSimulacionInput = document.getElementById('nombre-simulacion');
    const nombreSimulacion = nombreSimulacionInput.value.trim();

    if (nombreSimulacion === "") {
        alert("Por favor, ingresa un nombre para la simulación.");
        return;
    }

    // Obtener el usuario actual
    const user = auth.currentUser;
    if (!user) {
        alert("Por favor, inicia sesión para guardar simulaciones.");
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

    // Referencia a la colección de simulaciones del usuario
    const simulacionesRef = db.collection('simulaciones').doc(user.uid).collection('userSimulaciones');

    // Verificar si ya existe una simulación con el mismo nombre
    simulacionesRef.where('nombre', '==', nombreSimulacion).get()
        .then(snapshot => {
            if (!snapshot.empty) {
                alert("Ya existe una simulación con este nombre. Por favor, elige otro nombre.");
                return;
            }

            // Añadir la nueva simulación
            simulacionesRef.add(simulacion)
                .then(() => {
                    alert("Simulación guardada exitosamente.");
                    nombreSimulacionInput.value = "";
                    listarSimulacionesGuardadas();
                })
                .catch(error => {
                    console.error("Error al guardar la simulación: ", error);
                    alert("Error al guardar la simulación. Por favor, inténtalo nuevamente.");
                });
        })
        .catch(error => {
            console.error("Error al verificar la simulación: ", error);
            alert("Error al verificar la simulación. Por favor, inténtalo nuevamente.");
        });
}

// Función para listar las simulaciones guardadas en Firestore
function listarSimulacionesGuardadas() {
    const listaSimulacionesDiv = document.getElementById('lista-simulaciones');
    listaSimulacionesDiv.innerHTML = ""; // Limpiar contenido previo

    const user = auth.currentUser;
    if (!user) {
        listaSimulacionesDiv.innerHTML = "<p>Inicia sesión para ver tus simulaciones guardadas.</p>";
        return;
    }

    const simulacionesRef = db.collection('simulaciones').doc(user.uid).collection('userSimulaciones');

    simulacionesRef.orderBy('fecha', 'desc').get()
        .then(snapshot => {
            if (snapshot.empty) {
                listaSimulacionesDiv.innerHTML = "<p>No hay simulaciones guardadas.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const simulacion = doc.data();
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
                editarBtn.addEventListener('click', () => editarSimulacion(doc.id, simulacion));
                accionesDiv.appendChild(editarBtn);

                // Botón Eliminar
                const eliminarBtn = document.createElement('button');
                eliminarBtn.textContent = 'Eliminar';
                eliminarBtn.classList.add('eliminar-btn');
                eliminarBtn.addEventListener('click', () => eliminarSimulacion(doc.id, simulacion.nombre));
                accionesDiv.appendChild(eliminarBtn);

                simulacionDiv.appendChild(accionesDiv);

                listaSimulacionesDiv.appendChild(simulacionDiv);
            });
        })
        .catch(error => {
            console.error("Error al listar simulaciones: ", error);
            listaSimulacionesDiv.innerHTML = "<p>Error al cargar las simulaciones. Por favor, inténtalo nuevamente.</p>";
        });
}

// Función para editar una simulación
function editarSimulacion(docId, simulacion) {
    // Cargar los datos de la simulación en los formularios
    document.getElementById('nombre-simulacion').value = simulacion.nombre;
    document.getElementById('precio-inmueble').value = simulacion.totalInicial; // Ajusta según tus cálculos
    // Suponiendo que tienes más campos calculados, necesitarás ajustar esto según tus datos
    
    // Navegar a la pestaña de Gastos Iniciales para editar
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.section');
    tabs.forEach(t => t.classList.remove('active'));
    sections.forEach(s => s.classList.remove('active'));
    tabs[0].classList.add('active');
    sections[0].classList.add('active');

    // Almacenar el ID del documento para actualizarlo después
    sessionStorage.setItem('editarDocId', docId);
}

// Función para eliminar una simulación
function eliminarSimulacion(docId, nombreSimulacion) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la simulación "${nombreSimulacion}"?`)) {
        return;
    }

    // Eliminar la simulación de Firestore
    db.collection('simulaciones').doc(auth.currentUser.uid).collection('userSimulaciones').doc(docId).delete()
        .then(() => {
            alert("Simulación eliminada exitosamente.");
            listarSimulacionesGuardadas();
        })
        .catch(error => {
            console.error("Error al eliminar la simulación: ", error);
            alert("Error al eliminar la simulación. Por favor, inténtalo nuevamente.");
        });
}

// Función para actualizar una simulación existente
function actualizarSimulacion(docId) {
    const nombreSimulacionInput = document.getElementById('nombre-simulacion');
    const nombreSimulacion = nombreSimulacionInput.value.trim();

    if (nombreSimulacion === "") {
        alert("Por favor, ingresa un nombre para la simulación.");
        return;
    }

    // Obtener el usuario actual
    const user = auth.currentUser;
    if (!user) {
        alert("Por favor, inicia sesión para actualizar simulaciones.");
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
        fecha: new Date().toLocaleString() // Actualizar la marca de tiempo
    };

    // Referencia a la simulación específica
    const simulacionRef = db.collection('simulaciones').doc(user.uid).collection('userSimulaciones').doc(docId);

    // Actualizar la simulación en Firestore
    simulacionRef.set(simulacion, { merge: true })
        .then(() => {
            alert("Simulación actualizada exitosamente.");
            nombreSimulacionInput.value = "";
            sessionStorage.removeItem('editarDocId');
            listarSimulacionesGuardadas();
        })
        .catch(error => {
            console.error("Error al actualizar la simulación: ", error);
            alert("Error al actualizar la simulación. Por favor, inténtalo nuevamente.");
        });
}

// Función para iniciar una nueva simulación o guardar una existente
function nuevaSimulacion() {
    // Verificar si estamos editando una simulación existente
    const editarDocId = sessionStorage.getItem('editarDocId');

    if (editarDocId) {
        actualizarSimulacion(editarDocId);
    } else {
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
}

// Función para manejar la actualización de Firestore al guardar
function initializeApp() {
    setupNavigation();
    setupAuth();
    setupGastosIniciales();
    setupGastosHipotecarios();
    calcularCuotaHipotecaria(); // Inicializar cálculos

    // Añadir event listener al botón de guardar simulación
    const guardarSimulacionBtn = document.getElementById('guardar-simulacion');
    guardarSimulacionBtn.addEventListener('click', guardarSimulacion);

    // Añadir event listener al botón de nueva simulación
    const nuevaSimulacionBtn = document.getElementById('nueva-simulacion');
    nuevaSimulacionBtn.addEventListener('click', nuevaSimulacion);

    // Listar simulaciones guardadas al iniciar y cada vez que cambie el estado de autenticación
    auth.onAuthStateChanged(user => {
        if (user) {
            listarSimulacionesGuardadas();
        } else {
            const listaSimulacionesDiv = document.getElementById('lista-simulaciones');
            listaSimulacionesDiv.innerHTML = "<p>Inicia sesión para ver tus simulaciones guardadas.</p>";
        }
    });
}

// Inicializar la aplicación al cargar la página
window.addEventListener('DOMContentLoaded', initializeApp);
