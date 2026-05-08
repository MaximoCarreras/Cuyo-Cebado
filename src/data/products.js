// src/data/products.js

export const products = [
    // --- MATES (Los Reyes) ---
    { id: 1, name: "Mate Imperial Premium", category: "mates", type: "Imperial", material: "Alpaca y Cuero", price: 48000, image: "mate-1.jpg", bestSeller: true },
    { id: 2, name: "Mate Torpedo Vaqueta", category: "mates", type: "Torpedo", material: "Cuero Legítimo", price: 35000, image: "mate-2.jpg" },
    { id: 3, name: "Mate Camionero Cincelado", category: "mates", type: "Camionero", material: "Acero y Cuero", price: 28000, image: "mate-3.jpg" },
    { id: 4, name: "Mate de Palo Santo", category: "mates", type: "Madera", material: "Palo Santo", price: 18500, image: "mate-4.jpg" },
    { id: 5, name: "Mate de Algarrobo", category: "mates", type: "Madera", material: "Algarrobo", price: 12000, image: "mate-5.jpg" },
    { id: 6, name: "Mate de Vidrio Forrado", category: "mates", type: "Vidrio", material: "Cuero Croco", price: 14500, image: "mate-6.jpg" },
    { id: 7, name: "Mate Cerámica Artesanal", category: "mates", type: "Cerámica", material: "Gres", price: 9800, image: "mate-7.jpg" },
    { id: 8, name: "Mate de Acero Térmico", category: "mates", type: "Acero", material: "Inoxidable", price: 22000, image: "mate-8.jpg" },

    // --- BOMBILLAS (Variedad Total) ---
    { id: 101, name: "Bombilla Pico de Loro", category: "bombillas", type: "Pico de Loro", material: "Alpaca", price: 12500, image: "b-1.jpg", bestSeller: true },
    { id: 102, name: "Bombilla de Resorte", category: "bombillas", type: "Resorte", material: "Acero", price: 6500, image: "b-2.jpg" },
    { id: 103, name: "Bombilla Cuchara", category: "bombillas", type: "Cuchara", material: "Bronce", price: 8900, image: "b-3.jpg" },
    { id: 104, name: "Bombilla Plana de Lujo", category: "bombillas", type: "Cincelada", material: "Plata y Oro", price: 35000, image: "b-4.jpg" },
    { id: 105, name: "Bombilla Desmontable", category: "bombillas", type: "Fácil Limpieza", material: "Acero Quirúrgico", price: 11000, image: "b-5.jpg" },

    // --- YERBAS (El motor del negocio) ---
    { id: 201, name: "Yerba Canarias Amarilla", category: "yerbas", type: "Despalada", material: "Uruguaya", price: 7500, image: "y-1.jpg", bestSeller: true },
    { id: 202, name: "Yerba Baldo", category: "yerbas", type: "Tradicional", material: "Uruguaya", price: 7200, image: "y-2.jpg" },
    { id: 203, name: "Yerba Barbacuá", category: "yerbas", type: "Ahumada", material: "Argentina", price: 8900, image: "y-3.jpg" },
    { id: 204, name: "Yerba Orgánica Premium", category: "yerbas", type: "Sin Agroquímicos", material: "Argentina", price: 9500, image: "y-4.jpg" },
    { id: 205, name: "Yerba Compuesta", category: "yerbas", type: "Con Hierbas", material: "Argentina", price: 6800, image: "y-5.jpg" },

    // --- CUYO 3D (El Diferencial) ---
    { id: 301, name: "Estuche de Truco Selección", category: "cuyo-3d", type: "Estuche", material: "PLA 3D", price: 14000, image: "3d-1.jpg", bestSeller: true },
    { id: 302, name: "Posamate Auto", category: "cuyo-3d", type: "Accesorio", material: "Flexible TPU", price: 5500, image: "3d-2.jpg" },
    { id: 303, name: "Pico Cebador Adaptable", category: "cuyo-3d", type: "Repuesto", material: "PLA 3D", price: 3500, image: "3d-3.jpg" },
    { id: 304, name: "Llavero Mate Personalizado", category: "cuyo-3d", type: "Regalo", material: "PLA 3D", price: 2500, image: "3d-4.jpg" },

    // --- KITS, DÚOS Y TRANSPORTE ---
    { id: 401, name: "Kit Regalo Empresarial", category: "kits", type: "Set Completo", material: "Premium", price: 85000, image: "k-1.jpg" },
    { id: 501, name: "Dúo Yerbera y Azucarera", category: "duos", type: "Set Guardado", material: "Latón Forrado", price: 22000, image: "d-1.jpg" },
    { id: 601, name: "Matera de Cuero", category: "transporte", type: "Bolso", material: "Cuero Crudo", price: 42000, image: "t-1.jpg" },
    { id: 701, name: "Termo Media Manija", category: "accesorios", type: "Termo", material: "Acero", price: 55000, image: "a-1.jpg" },
    { id: 801, name: "Mate Listo Autocebante", category: "mate-listo", type: "Botella", material: "Plástico BPA Free", price: 11500, image: "ml-1.jpg" }
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