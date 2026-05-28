import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminCategories.css';

export default function AdminCategories() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [newCategory, setNewCategory] = useState({ label: '', icon: '🧉', image_url: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setTabLoading(true);
        try {
            const { data: cData } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
            setCategoriesList(cData || []);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar las categorías");
        }
        setTabLoading(false);
    };

    const uploadImage = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files[0];
            if (!file) return;
            const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
            await supabase.storage.from('productos').upload(fileName, file);
            const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
            
            setNewCategory(prev => ({ ...prev, image_url: data.publicUrl }));
            toast.success("Imagen guardada");
        } catch (e) { 
            toast.error("Error al subir"); 
        } finally { 
            setUploading(false); 
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategory.label) {
            toast.error("El nombre es obligatorio");
            return;
        }
        const id = newCategory.label.toLowerCase().trim().replace(/ /g, '-');
        const { error } = await supabase.from('categories').insert([{ 
            id, 
            label: newCategory.label, 
            icon: newCategory.icon, 
            image_url: newCategory.image_url 
        }]);
        
        if (!error) {
            setNewCategory({ label: '', icon: '🧉', image_url: '' });
            fetchCategories();
            toast.success("Categoría creada");
        } else {
            toast.error("Error al crear categoría");
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("¿Estás seguro de borrar esta categoría?")) {
            await supabase.from('categories').delete().eq('id', id);
            fetchCategories();
            toast.success("Categoría eliminada");
        }
    };

    return (
        <section className="fade-in">
            {tabLoading ? (
                <div className="tab-internal-loader"><p>Cargando categorías...</p></div>
            ) : (
                <>
                    <div className="table-container">
                        <table className="refined-table">
                            <thead>
                                <tr>
                                    <th>ICONO / IMAGEN</th>
                                    <th>NOMBRE</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categoriesList.length > 0 ? categoriesList.map(c => (
                                    <tr key={c.id}>
                                        <td className="cell-icon">
                                            {c.image_url ? (
                                                <img src={c.image_url} alt={c.label} className="cat-mini-thumb" />
                                            ) : (
                                                <span style={{ fontSize: '2rem' }}>{c.icon}</span>
                                            )}
                                        </td>
                                        <td className="cell-name"><strong>{c.label}</strong></td>
                                        <td>
                                            <button className="btn-delete-pro" onClick={() => handleDeleteCategory(c.id)}>
                                                ELIMINAR
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '40px' }}>No hay categorías registradas.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="category-refined-add">
                        <div className="card-header-pro">
                            <span className="material-symbols-outlined">category</span>
                            <h3>Nueva Categoría</h3>
                        </div>
                        <div className="cat-inputs">
                            <div className="cat-img-box">
                                <input type="file" id="cat-img" className="hidden-input" onChange={uploadImage} disabled={uploading} />
                                <label htmlFor="cat-img">
                                    {newCategory.image_url ? (
                                        <img src={newCategory.image_url} className="image-preview" alt="Preview" />
                                    ) : (
                                        <span className="material-symbols-outlined">add_a_photo</span>
                                    )}
                                </label>
                            </div>
                            <div className="input-with-label">
                                <label>Nombre</label>
                                <input className="refined-input" value={newCategory.label} onChange={e => setNewCategory({ ...newCategory, label: e.target.value })} required placeholder="Ej: Termos Stanley" />
                            </div>
                            <div className="input-with-label" style={{ width: '100px' }}>
                                <label>Icono</label>
                                <input className="refined-input" style={{ textAlign: 'center' }} value={newCategory.icon} onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })} />
                            </div>
                            <button className="btn-save-gold-full" style={{ marginTop: '22px', height: '54px' }} onClick={handleCreateCategory} disabled={uploading}>
                                {uploading ? 'SUBIENDO...' : 'CREAR CATEGORÍA'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}