export const products = [
    // --- MATES ---
    { id: 1, name: "Imperial Premium Cincelado", category: "mates", type: "Imperial", material: "Calabaza y Alpaca", price: 55000, bestSeller: true },
    { id: 2, name: "Torpedo Cuero Vaqueta", category: "mates", type: "Torpedo", material: "Calabaza y Cuero", price: 38000 },
    { id: 3, name: "Camionero de Acero", category: "mates", type: "Camionero", material: "Acero Inoxidable", price: 28000 },
    { id: 4, name: "Mate Galleta de Campo", category: "mates", type: "Galleta", material: "Calabaza", price: 12000 },
    { id: 5, name: "Mate de Palo Santo Tallado", category: "mates", type: "Tradicional", material: "Madera de Palo Santo", price: 19500 },
    { id: 6, name: "Mate Bocón Uruguayo", category: "mates", type: "Bocón", material: "Calabaza forrada", price: 32000 },
    { id: 7, name: "Mate de Algarrobo Pulido", category: "mates", type: "Tradicional", material: "Madera de Algarrobo", price: 14000 },
    { id: 8, name: "Mate Pampa PVC", category: "mates", type: "Pampa", material: "Plástico térmico", price: 9500 },
    { id: 9, name: "Mate de Vidrio Forrado", category: "mates", type: "Moderno", material: "Vidrio y Cuero", price: 16000 },

    // --- BOMBILLAS ---
    { id: 101, name: "Pico de Loro Maciza", category: "bombillas", type: "Curva", material: "Alpaca", price: 14500, bestSeller: true },
    { id: 102, name: "Bombillón de Resorte", category: "bombillas", type: "Resorte", material: "Acero Quirúrgico", price: 8500 },
    { id: 103, name: "Bombilla de Caña Natural", category: "bombillas", type: "Bambú", material: "Madera", price: 4500 },
    { id: 104, name: "Bombilla Plana Cuchara", category: "bombillas", type: "Cuchara", material: "Bronce Niquelado", price: 9800 },
    { id: 105, name: "Bombilla de Plata y Oro", category: "bombillas", type: "Lujo", material: "Plata y Oro", price: 65000 },

    // --- YERBAS ---
    { id: 201, name: "Canarias Amarilla 1kg", category: "yerbas", type: "Despalada", brand: "Canarias", price: 8200, bestSeller: true },
    { id: 202, name: "Baldo Tradicional", category: "yerbas", type: "Despalada", brand: "Baldo", price: 7900 },
    { id: 203, name: "Playadito con Palo", category: "yerbas", type: "Con Palo", brand: "Playadito", price: 5500 },
    { id: 204, name: "La Merced Barbacuá", category: "yerbas", type: "Barbacuá", brand: "La Merced", price: 9500 },
    { id: 205, name: "Yerba Sara Roja", category: "yerbas", type: "Fuerte", brand: "Sara", price: 7800 },
    { id: 206, name: "Yerba Rei Verde", category: "yerbas", type: "Exportación", brand: "Rei Verde", price: 11000 },
    { id: 207, name: "Yerba Kurupí Menta y Limón", category: "yerbas", type: "Compuesta", brand: "Kurupí", price: 6200 },

    // --- TERMOS ---
    { id: 701, name: "Stanley Classic 1.4L", category: "accesorios", type: "Termo", brand: "Stanley", capacity: "1.4L", price: 125000 },
    { id: 702, name: "Termolar R-Evolution", category: "accesorios", type: "Termo", brand: "Termolar", capacity: "1.0L", price: 85000 },
    { id: 703, name: "Coleman Growler 1.9L", category: "accesorios", type: "Termo", brand: "Coleman", capacity: "1.9L", price: 98000 },
    { id: 704, name: "Discovery Adventure 0.75L", category: "accesorios", type: "Termo", brand: "Discovery", capacity: "0.75L", price: 42000 },
    { id: 705, name: "Lumilagro de Vidrio 1.0L", category: "accesorios", type: "Termo", brand: "Lumilagro", capacity: "1.0L", price: 18000 },
    { id: 706, name: "Peabody con Termómetro Digital", category: "accesorios", type: "Termo", brand: "Peabody", capacity: "1.0L", price: 65000 },

    // --- TRANSPORTE Y MATERAS ---
    { id: 601, name: "Matera de Cuero Crudo", category: "transporte", type: "Bolso", material: "Cuero Legítimo", price: 48000 },
    { id: 602, name: "Mochila Matera Impermeable", category: "transporte", type: "Mochila", material: "Cordura", price: 35000 },
    { id: 603, name: "Morral de Tela Cuyo", category: "transporte", type: "Morral", material: "Lona y Cuero", price: 22000 },

    // --- DÚOS DE GUARDADO ---
    { id: 501, name: "Set Latón Forrado en Cuero", category: "duos", type: "Set", material: "Latón y Cuero", price: 25000 },
    { id: 502, name: "Yerbera y Azucarera de Plástico", category: "duos", type: "Set", material: "Plástico BPA Free", price: 8500 },

    // --- MATE LISTO ---
    { id: 801, name: "Autocebante de Acero", category: "mate-listo", type: "Autocebante", material: "Acero Inoxidable", capacity: "500ml", price: 28000 },
    { id: 802, name: "Mate Listo Plástico Premium", category: "mate-listo", type: "Autocebante", material: "Plástico", capacity: "400ml", price: 12000 },

    // --- CUYO 3D ---
    { id: 301, name: "Estuche de Truco Selección", category: "cuyo-3d", type: "Estuche", material: "PLA 3D", price: 14000 },
    { id: 302, name: "Posamate Universal para Auto", category: "cuyo-3d", type: "Accesorio", material: "Flexible", price: 6500 },
    { id: 303, name: "Pico Cebador Adaptable", category: "cuyo-3d", type: "Repuesto", material: "PLA 3D", price: 4000 },
    { id: 304, name: "Marcador de Yerba (Pared)", category: "cuyo-3d", type: "Utilidad", material: "PLA 3D", price: 2500 }
];

export const categories = [
    { id: "mates", label: "Mates", icon: "🧉" },
    { id: "bombillas", label: "Bombillas", icon: "🪄" },
    { id: "yerbas", label: "Yerba Mate", icon: "🌿" },
    { id: "kits", label: "Kits & Regalos", icon: "🎁" },
    { id: "duos", label: "Dúos de Guardado", icon: "🧂" },
    { id: "transporte", label: "Transporte", icon: "👜" },
    { id: "accesorios", label: "Termos & Accesorios", icon: "🌡️" },
    { id: "mate-listo", label: "Mate Listo", icon: "🥤" },
    { id: "cuyo-3d", label: "Cuyo 3D", icon: "⚙️" }
];