export const products = [
    // --- PRODUCTOS REALES (CONECTADOS A TU SUPABASE) ---
    // Estos productos ya existen en tu base de datos y tienen el ID correcto (UUID).
    {
        id: "939a1f06-6e48-47e1-a5a1-4cc4e74eafe8",
        name: "Mate Lapacho Imperial",
        category: "mates",
        type: "Imperial",
        material: "Madera de Lapacho",
        price: 45000,
        bestSeller: true
    },
    {
        id: "4668527e-d5b2-4302-9985-b55d87dc5f80",
        name: "Mate Quebracho Rústico",
        category: "mates",
        type: "Rústico",
        material: "Madera de Quebracho",
        price: 52000
    },
    {
        id: "977e492d-990e-4934-8227-6ae0a8203ef5",
        name: "Mate Cerámica Tierra",
        category: "mates",
        type: "Cerámica",
        material: "Cerámica Esmaltada",
        price: 28000
    },
    {
        id: "9852b131-00e1-4b09-8ab1-ed94984568b2",
        name: "Bombilla Alpaca Clásica",
        category: "bombillas",
        type: "Clásica",
        material: "Alpaca",
        price: 12000
    },
    {
        id: "6acf35f1-8a23-4717-971e-5fe657c5ed35",
        name: "Kit Regalo Premium",
        category: "kits",
        type: "Kit",
        material: "Varios",
        price: 89000,
        bestSeller: true
    }
    // Nota: Si querés agregar más productos, primero crealos en Supabase 
    // y después pegá acá el ID largo (UUID) que te genere la base de datos.
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