import { supabase } from './supabaseClient';

let fetchPromise = null;

export const getGlobalCatalog = () => {
    if (fetchPromise) return fetchPromise;

    fetchPromise = Promise.all([
        supabase.from('products').select('*'),
        supabase.from('categories').select('*')
    ]).then(([prodData, catData]) => {
        return { 
            products: prodData.data || [], 
            categories: catData.data || [] 
        };
    }).catch(error => {
        console.error("Error cargando catálogo global:", error);
        fetchPromise = null; 
        return { products: [], categories: [] };
    });

    return fetchPromise;
};