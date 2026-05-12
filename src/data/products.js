// Solo dejamos las categorías aquí. 
// Los productos ahora se cargan automáticamente desde Supabase.
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

// Exportamos un array vacío para que las páginas que aún lo importan no tiren error de compilación
export const products = [];