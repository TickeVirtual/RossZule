// Obtener los parámetros de la URL
const params = new URLSearchParams(window.location.search);

// Obtener los valores de los parámetros
var nro_boleta = params.has('boleta') ? params.get('boleta') : "10000";
var nombre_cliente = params.has('cliente') ? params.get('cliente') : "NOMBRE CLIENTE";
var usuario = params.has('usuario') ? params.get('usuario') : "USUARIO";
var puntos = params.has('puntos') ? params.get('puntos') : "0";
var telefono = params.has('telefono') ? params.get('telefono') : "931200353";
var codigo_pais = params.has('codigo_pais') ? params.get('codigo_pais') : "+";
var fecha = params.has('fecha') ? params.get('fecha') : "31/05/2025 10:00:23";
var fecha_entrega = params.has('fecha_entrega') ? params.get('fecha_entrega') : "31/05/2025 10:00:23";
var total = params.has('total') ? params.get('total') : "100";
var total_a_pagar = params.has('total_a_pagar') ? params.get('total_a_pagar') : "50";
var descuento = params.has('descuento') ? params.get('descuento') : '0.00';
var a_cuenta = params.has('a_cuenta') ? params.get('a_cuenta') : "0";
var desc_por_prenda = params.has('desc_por_prenda') ? params.get('desc_por_prenda') : "0";
var pagado_con = params.has('pagado_con') ? params.get('pagado_con') : "0";
var a_cuenta_dos = params.has('a_cuenta_dos') ? params.get('a_cuenta_dos') : "0";
var pagado_con_dos = params.has('pagado_con_dos') ? params.get('pagado_con_dos') : "0";
var porcent_desc = params.has('porcent_desc') ? params.get('porcent_desc') : "0";
var porcent_desc_plata = params.has('porcent_desc_plata') ? params.get('porcent_desc_plata') : "0";
var total_por_pagar = params.has('total_por_pagar') ? params.get('total_por_pagar') : "0";
var estado = params.has('estado') ? params.get('estado') : "PAGADO";
var total_prendas = params.has('total_prendas') ? params.get('total_prendas') : "10";
var cantidades = params.has('cantidades') ? params.get('cantidades') : "2.55";
var descripciones = params.has('servicios') ? params.get('servicios') : "AL AGUA: SABANAS 2 PLZ Ploma cuadritos blancos basement home";
var detalle = params.has('detalles') ? params.get('detalles') : "TERNO";
var p_units = params.has('p_unit') ? params.get('p_unit') : "3";
var subtotal = params.has('subtotal') ? params.get('subtotal') : "150";

// Crea listas de cada columna
cantidades = cantidades.split(",");
descripciones = descripciones.split(",");
detalle = detalle.split(",");
p_units = p_units.split(",");

// Crear lista para mostrar en tabla
var result = [];
cantidades.forEach(function (value, id) {
    result[id] = {
        cantidad: cantidades[id],
        descripcion: descripciones[id],
        detalle: detalle[id],
        subtotal: subtotal[id],
        precio_unit: parseFloat(p_units[id]).toFixed(2),
    };
});

function abrirPopup(event, url) {
    event.preventDefault();
    window.open(url, 'Ticket', 'width=400,height=600,scrollbars=no,resizable=no,top=100,left=100');
}

var tablaBody = document.getElementById("tablaBody");
result.forEach(function (row) {
    var newRow = document.createElement("tr");
    newRow.className = "table-item";

    var subtotalCalculado = row.cantidad * parseFloat(row.precio_unit);
    var subtotal = redondearPersonalizado(subtotalCalculado);

    newRow.innerHTML = `
        <td class="itemtab" style="text-align: left; font-size: 0.5mm;">
            ${row.cantidad}
        </td>
        <td class="itemtab" style="text-align: right; font-size: 0.5mm;">
            ${row.descripcion} ${parseFloat(row.precio_unit).toFixed(2)}
        </td>
        <td class="itemtab" style="text-align: right; font-size: 0.5mm;">
            ${subtotal}
        </td>
    `;
    tablaBody.appendChild(newRow);
});

document.querySelectorAll('.printbutton').forEach(function (element) {
    element.addEventListener('click', function () {
        /*print();*/
    });
});

/* (INICIA EL CÓDIGO DE ACORTAR URL) */

// ✅ Función para acortar la URL
async function shortURL(url) {
    /*
    // 🔸 TinyURL (antiguo)
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);
    if (response.ok) {
        return await response.text();
    } else {
        throw new Error("Error al acortar la URL");
    }
    */

    // 🔹 Nuevo acortador propio en tu servidor (miticket.sysventa.com)
    try {
        const response = await fetch("https://miticket.sysventa.com/acortar.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `url=${encodeURIComponent(url)}`
        });

        const text = await response.text();
        const match = text.match(/https?:\/\/[^\s"<]+/);

        if (match) {
            return match[0]; // Devolver la URL acortada
        } else {
            console.error("⚠️ No se encontró una URL en la respuesta:", text);
            throw new Error("No se pudo acortar la URL");
        }
    } catch (error) {
        console.error("❌ Error al conectar con el acortador:", error);
        throw error;
    }
}

/* FINALIZA EL CÓDIGO DE ACORTAR URL */

// Modificamos la función para enviar el mensaje de WhatsApp
async function sendWhatsAppMessage() {
    var currentURL = window.location.href;

    try {
        var shortedURL = await shortURL(currentURL);

        var message = 'Hola!! somos de la lavandería, adjuntamos su ticket de atención virtual. Click en el link para ver el ticket 👇 ' + shortedURL;

        var whatsappLink = 'https://api.whatsapp.com/send?phone=' + codigo_pais + telefono + '&text=' + encodeURIComponent(message) + '?sharelink=1';

        window.open(whatsappLink, '_blank');
    } catch (error) {
        console.error("Error al acortar la URL:", error);
        alert("Hubo un error al acortar la URL. Por favor, intente nuevamente.");
    }
}

/* FINALIZA EL CÓDIGO DE WHATSAPP */

// Función para imprimir el ticket
function printTicket() {
    window.print();
}

// Asignar la función al evento click del botón de impresión
document.getElementById('impresoraButton').addEventListener('click', printTicket);

var nroBoletaElement = document.getElementById("nro_boleta_id").textContent = nro_boleta;
var fechaElement = document.getElementById("fecha").textContent = fecha;
var nombre_clientElement = document.getElementById("nombre_client").textContent = nombre_cliente;
var usuarioElement = document.getElementById("usuario").textContent = usuario;
var puntosElement = document.getElementById("puntos").textContent = puntos;
var fecha_entregaElement = document.getElementById("fecha_entrega").textContent = fecha_entrega;
var totalElement = document.getElementById("total"); totalElement.textContent = parseFloat(total).toFixed(2);
var descuentoElement = document.getElementById("descuento"); descuentoElement.textContent = parseFloat(descuento).toFixed(2);
var a_cuentaElement = document.getElementById("a_cuenta"); a_cuentaElement.textContent = parseFloat(a_cuenta).toFixed(2);
var a_cuenta_dosElement = document.getElementById("a_cuenta_dos"); a_cuenta_dosElement.textContent = parseFloat(a_cuenta_dos).toFixed(2);
var total_por_pagarElement = document.getElementById("total_por_pagar"); total_por_pagarElement.textContent = parseFloat(total_por_pagar).toFixed(2);
var estadoElement = document.getElementById("estado").textContent = estado;
var total_prendasElement = document.getElementById("total_prendas").textContent = total_prendas;

// Ocultar botones si la URL contiene "sharelink=1"
var whatsappButton = document.getElementById('whatsappButton');
var impresoraButton = document.getElementById('impresoraButton');
var currentURL = window.location.href;

if (currentURL.indexOf('sharelink=1') !== -1) {
    whatsappButton.style.display = 'none';
    impresoraButton.style.display = 'none';
}

console.log(`Teléfono obtenido: ${telefono}`);

// Generar código QR desde parámetro 'qr'
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const qr = params.has('qr') ? params.get('qr') : "sddsd12";

    const qrElement = new QRious({
        element: document.getElementById('qr-code'),
        value: qr,
        size: 100
    });
});

// Redondear valores (personalizado)
function redondearPersonalizado(valor) {
    let decimas = Math.floor(valor * 10 + 0.51);
    let resultado = decimas / 10;
    return resultado.toFixed(2);
}


                        

