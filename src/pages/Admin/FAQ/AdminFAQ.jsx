import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import toast from 'react-hot-toast';
import './AdminFAQ.css';

export default function AdminFAQ() {
    const [faqs, setFaqs] = useState([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [isEditingFAQ, setIsEditingFAQ] = useState(false);
    const [editingFAQId, setEditingFAQId] = useState(null);
    const [faqForm, setFaqForm] = useState({ question: '', answer: '' });

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        setTabLoading(true);
        const { data } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
        setFaqs(data || []);
        setTabLoading(false);
    };

    const handleSaveFAQ = async (e) => {
        e.preventDefault();
        if (isEditingFAQ) {
            await supabase.from('faqs').update(faqForm).eq('id', editingFAQId);
            toast.success("Pregunta modificada");
        } else {
            await supabase.from('faqs').insert([faqForm]);
            toast.success("Pregunta guardada");
        }
        setFaqForm({ question: '', answer: '' });
        setIsEditingFAQ(false);
        fetchFaqs();
    };

    const handleDeleteFAQ = async (id) => {
        if (window.confirm("¿Borrar esta pregunta?")) {
            await supabase.from('faqs').delete().eq('id', id);
            fetchFaqs();
        }
    };

    return (
        <section className="fade-in">
            <h2>💬 FAQ y Guías</h2>
            {tabLoading ? <p>Cargando...</p> : (
                <div className="table-container">
                    <table className="refined-table">
                        <thead><tr><th>PREGUNTA</th><th>RESPUESTA</th><th>ACCIONES</th></tr></thead>
                        <tbody>
                            {faqs.map(f => (
                                <tr key={f.id}>
                                    <td><strong>{f.question}</strong></td>
                                    <td>{f.answer.substring(0, 50)}...</td>
                                    <td>
                                        <button className="btn-edit-modern" onClick={() => { setFaqForm(f); setIsEditingFAQ(true); setEditingFAQId(f.id); }}>EDITAR</button>
                                        <button className="btn-delete-pro" onClick={() => handleDeleteFAQ(f.id)}>BORRAR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="category-refined-add">
                <h3>{isEditingFAQ ? 'Modificar Pregunta' : 'Nueva Pregunta'}</h3>
                <form onSubmit={handleSaveFAQ} className="faq-form-pro">
                    <input className="refined-input" placeholder="Pregunta" value={faqForm.question} onChange={e => setFaqForm({...faqForm, question: e.target.value})} required />
                    <textarea className="refined-input" placeholder="Respuesta..." value={faqForm.answer} onChange={e => setFaqForm({...faqForm, answer: e.target.value})} required />
                    <button type="submit" className="btn-save-gold-full">{isEditingFAQ ? 'ACTUALIZAR' : 'AÑADIR'}</button>
                </form>
            </div>
        </section>
    );
}