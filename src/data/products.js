// src/data/products.js

export const products = [
    // --- MATES ---
    { id: 1, name: "Mate Imperial Premium", category: "mates", type: "Imperial", material: "Alpaca y Cuero", price: 48000, bestSeller: true },
    { id: 2, name: "Mate Torpedo Vaqueta", category: "mates", type: "Torpedo", material: "Cuero", price: 35000 },
    { id: 4, name: "Mate de Palo Santo", category: "mates", type: "Tradicional", material: "Madera", price: 18500 },

    // --- YERBAS ---
    { id: 201, name: "Yerba Canarias Amarilla", category: "yerbas", type: "Sin Palo", brand: "Canarias", price: 7500, bestSeller: true },
    { id: 202, name: "Yerba Baldo", category: "yerbas", type: "Sin Palo", brand: "Baldo", price: 7200 },
    { id: 203, name: "Yerba Playadito 1kg", category: "yerbas", type: "Con Palo", brand: "Playadito", price: 5800 },
    { id: 204, name: "Yerba La Merced", category: "yerbas", type: "Barbacuá", brand: "La Merced", price: 8500 },

    // --- BOMBILLAS ---
    { id: 101, name: "Bombilla Pico de Loro", category: "bombillas", type: "Curva", material: "Alpaca", price: 12500 },
    { id: 102, name: "Bombilla de Resorte", category: "bombillas", type: "Resorte", material: "Acero", price: 6500 },

    // --- TERMOS ---
    { id: 701, name: "Termo Stanley Classic", category: "accesorios", type: "Termo", brand: "Stanley", capacity: "1.0L", price: 95000 },
    { id: 702, name: "Termo Media Manija", category: "accesorios", type: "Termo", brand: "Termolar", capacity: "1.0L", price: 55000 },
    { id: 703, name: "Termo Personal", category: "accesorios", type: "Termo", brand: "Lumilagro", capacity: "0.5L", price: 15000 },

    // --- CUYO 3D ---
    { id: 301, name: "Estuche de Truco AFA", category: "cuyo-3d", type: "Estuche", material: "PLA 3D", price: 14000 }
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