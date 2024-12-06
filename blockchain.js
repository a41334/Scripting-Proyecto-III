// Función para calcular el hash SHA-256 de un mensaje
function sha256(message) {
    const encoder = new TextEncoder(); // Convierte el mensaje en datos codificados
    const data = encoder.encode(message);
    return crypto.subtle.digest("SHA-256", data).then(hashBuffer => {
        // Convierte el resultado del hash en una cadena hexadecimal
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
    });
}

// Función principal para generar la blockchain
async function generarBlockchain() {
    // Obtiene los valores de los inputs
    const primerNombre = document.getElementById("primerNombre").value.trim();
    const segundoNombre = document.getElementById("segundoNombre").value.trim() || "N/A";
    const primerApellido = document.getElementById("primerApellido").value.trim();
    const segundoApellido = document.getElementById("segundoApellido").value.trim();

    // Verifica que los campos obligatorios estén llenos
    if (!primerNombre || !primerApellido || !segundoApellido) {
        alert("El primer nombre y ambos apellidos son obligatorios.");
        return; // Finaliza si falta algún dato obligatorio
    }

    // Muestra el indicador de carga y limpia el contenedor de bloques
    const loading = document.getElementById("loading");
    const blockchainContainer = document.getElementById("blockchain");
    loading.hidden = false;
    blockchainContainer.innerHTML = "";

    // Inicializa la blockchain y otros datos necesarios
    const blockchain = [];
    let previousHash = ""; // Hash inicial
    const sal = "1987"; // Prefijo requerido para los hashes

    // Define el contenido de cada bloque
    const bloques = [
        primerNombre,      // Bloque 1: Primer nombre
        segundoNombre,     // Bloque 2: Segundo nombre (o "N/A")
        primerApellido,    // Bloque 3: Primer apellido
        segundoApellido    // Bloque 4: Segundo apellido
    ];

    // Procesa cada bloque
    for (const contenido of bloques) {
        let nonce = 0; // Variable para asegurar que el hash sea válido
        let hash = "";

        // Genera un hash que inicie con el prefijo "1987"
        while (!hash.startsWith(sal)) {
            nonce++; // Incrementa el nonce en cada intento
            const data = `${sal}${previousHash}${contenido}${nonce}`;
            hash = await sha256(data); // Calcula el hash
        }

        // Crea un bloque con su contenido, nonce y hash
        const bloque = {
            contenido: `${previousHash}${contenido}`, // Incluye el hash anterior en el contenido
            nonce,
            hash
        };

        // Agrega el bloque a la blockchain y actualiza el hash previo
        blockchain.push(bloque);
        previousHash = hash;
    }

    // Oculta el indicador de carga y muestra la blockchain
    loading.hidden = true;
    mostrarBlockchain(blockchain);
}

// Función para mostrar los bloques generados (funcionalidad visual omitida aquí)
function mostrarBlockchain(blockchain) {
    const container = document.getElementById("blockchain");
    container.innerHTML = "";

    // Crea un bloque visual para cada elemento de la blockchain
    blockchain.forEach((bloque, index) => {
        const blockDiv = document.createElement("div");
        blockDiv.className = "block";
        blockDiv.innerHTML = `
            <p><strong>Bloque ${index + 1}</strong></p>
            <p><strong>Contenido:</strong> ${bloque.contenido}</p>
            <p><strong>Nonce:</strong> ${bloque.nonce}</p>
            <p><strong>Hash:</strong> ${bloque.hash}</p>
        `;
        container.appendChild(blockDiv);
    });
}
