export const products = [
    {
        id: 1,
        name: "Mate Imperial Premium",
        category: "mates",
        type: "imperial",
        material: "alpaca",
        price: 45000,
        image: "/assets/mate-imperial.png",
        bestSeller: true
    },
    {
        id: 2,
        name: "Yerba Canarias 1kg",
        category: "yerbas",
        brand: "canarias",
        price: 6500,
        image: "/assets/yerba-canarias.png",
        bestSeller: true
    },
    {
        id: 3,
        name: "Estuche de Truco Selección",
        category: "cuyo-3d",
        material: "PLA 3D",
        price: 12000,
        image: "/assets/estuche-truco.png",
        customizable: true
    },
    {
        id: 4,
        name: "Bombilla de Alpaca Cincelada",
        category: "bombillas",
        material: "alpaca",
        price: 8500,
        image: "/assets/bombilla.png"
    }
    // Aquí seguiremos agregando todos los que nombraste
];

export const categories = [
    { id: "mates", label: "Mates", icon: "🍵" },
    { id: "bombillas", label: "Bombillas", icon: "🪄" },
    { id: "yerbas", label: "Yerba Mate", icon: "🌿" },
    { id: "kits", label: "Kits & Regalos", icon: "🎁" },
    { id: "duos", label: "Dúos de Guardado", icon: "🧂" },
    { id: "transporte", label: "Transporte", icon: "👜" },
    { id: "accesorios", label: "Termos & Accesorios", icon: "🌡️" },
    { id: "mate-listo", label: "Mate Listo", icon: "🥤" },
    { id: "cuyo-3d", label: "Cuyo 3D", icon: "⚙️" }
];