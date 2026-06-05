import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './ClientDashboard.css';

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'address', 'orders'
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);

    // Estados para los formularios
    const [profileData, setProfileData] = useState({
        fullName: '', phone: '', address: '', city: '', zipCode: '', avatarUrl: '', puntos: 0
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '', newPassword: '', confirmPassword: ''
    });

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/mi-cuenta'); // Si no hay sesión, al login
            } else {
                setUser(session.user);
                fetchProfile(session.user.id);
                fetchUserOrders(session.user.email);
            }
        };
        checkSession();
    }, [navigate]);

    // Traer datos de la tabla profiles
    const fetchProfile = async (userId) => {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
        if (!error && data) {
            setProfileData({
                fullName: data.full_name || '',
                phone: data.phone || '',
                address: data.address || '',
                city: data.city || '',
                zipCode: data.zip_code || '',
                avatarUrl: data.avatar_url || '',
                puntos: data.puntos || 0
            });
        }
    };

    // Traer historial de pedidos
    const fetchUserOrders = async (email) => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('customer_email', email)
            .order('created_at', { ascending: false });
        if (!error && data) setOrders(data);
    };

    // Guardar cambios del perfil o dirección
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: profileData.fullName,
            phone: profileData.phone,
            address: profileData.address,
            city: profileData.city,
            zip_code: profileData.zipCode,
            avatar_url: profileData.avatarUrl,
            updated_at: new Date().toISOString()
        });

        setLoading(false);
        if (error) {
            toast.error("Error al actualizar los datos");
        } else {
            toast.success("¡Datos guardados correctamente! 🧉");
        }
    };

    // Subir imagen de perfil al Storage
    const handleAvatarUpload = async (e) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) throw new Error('Debes seleccionar una imagen.');
            
            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            // Subir al bucket 'avatars'
            const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
            if (uploadError) {
                console.error("Error subiendo foto:", uploadError);
                throw new Error("No se pudo subir la imagen al servidor.");
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Actualizar estado local
            setProfileData(prev => ({ ...prev, avatarUrl: publicUrl }));
            
            // Actualizar en base de datos
            const { error: dbError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);
                
            if (dbError) {
                console.error("Error guardando en base de datos:", dbError);
                throw new Error("La foto se subió, pero no se guardó en tu perfil.");
            }
            
            toast.success("Foto de perfil actualizada");
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error al procesar la imagen");
        } finally {
            setUploading(false);
        }
    };

    // Cambiar contraseña de forma segura
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Las nuevas contraseñas no coinciden");
        }
        if (passwordData.newPassword.length < 6) {
            return toast.error("La contraseña debe tener al menos 6 caracteres");
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
        setLoading(false);

        if (error) {
            toast.error(error.message);
        } else {
            toast.success("Contraseña cambiada con éxito");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
    };

    // Autodestrucción de cuenta
    const handleDeleteAccount = async () => {
        const confirmar = window.confirm("🚨 ¿Estás seguro de que querés eliminar tu cuenta? Esta acción borrará tus datos y puntos acumulados de manera permanente.");
        if (!confirmar) return;

        try {
            const { error } = await supabase.rpc('delete_user');
            if (error) throw error;
            
            await supabase.auth.signOut();
            toast.success("Cuenta eliminada correctamente");
            navigate('/');
        } catch (err) {
            console.error(err);
            toast.error("No se pudo eliminar la cuenta de forma automática. Contactate con soporte.");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

    // 🔥 FUNCIÓN RECUPERADA Y MEJORADA: Decide si muestra el estado de pago o logístico
    const renderStatusBadge = (order) => {
        // Si hay un estado logístico cargado (y no es nulo ni 'pending'), lo priorizamos
        const displayStatus = (order.tracking_status && order.tracking_status !== 'pending') 
            ? order.tracking_status 
            : order.status;

        const statusMap = {
            'pending': { text: 'Pago Pendiente', bgColor: '#fef3c7', color: '#d97706' },
            'approved': { text: 'Pagado ✅', bgColor: '#dcfce7', color: '#15803d' },
            'paid': { text: 'Pagado ✅', bgColor: '#dcfce7', color: '#15803d' },
            'en_preparacion': { text: 'En Preparación 🛠️', bgColor: '#f3e8ff', color: '#7e22ce' },
            'en_distribucion': { text: 'En Distribución 🚚', bgColor: '#e0f2fe', color: '#0369a1' },
            'listo_para_retirar': { text: 'Listo para Retirar 🏠', bgColor: '#fce7f3', color: '#be185d' },
            'completed': { text: 'Entregado ✔️', bgColor: '#dcfce7', color: '#15803d' },
            'cancelled': { text: 'Cancelado ❌', bgColor: '#fee2e2', color: '#b91c1c' }
        };

        const current = statusMap[displayStatus] || statusMap['pending'];
        
        return (
            <span className="status-pill" style={{ background: current.bgColor, color: current.color }}>
                {current.text}
            </span>
        );
    };

    return (
        <div className="dashboard-page-modern">
            <Toaster position="top-center" />
            <div className="dashboard-layout-container">
                
                {/* HEADER DEL PANEL */}
                <header className="dashboard-user-header">
                    <div className="avatar-uploader-wrapper">
                        <img 
                            src={profileData.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=mate'} 
                            alt="Avatar" 
                            className="user-dashboard-avatar" 
                        />
                        <label className="avatar-edit-badge" htmlFor="avatar-file">
                            <span className="material-symbols-outlined">photo_camera</span>
                            <input type="file" id="avatar-file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} style={{display:'none'}} />
                        </label>
                    </div>
                    <div className="user-header-text">
                        <h2>¡Hola, {profileData.fullName || 'Matero'}!</h2>
                        <p className="user-email-sub">{user?.email}</p>
                    </div>
                    <button className="btn-logout-dashboard" onClick={handleLogout}>
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </header>

                {/* TARJETA PREMIUM DEL CLUB DE BENEFICIOS */}
                <div className="club-card-premium" style={{ marginTop: '20px', marginBottom: '5px' }}>
                    <div className="club-card-content">
                        <div className="club-logo">🧉 Cuyo Cebado Club</div>
                        <div className="club-points">
                            <h3>{profileData.puntos}</h3>
                            <span>Cuyo Puntos ✨</span>
                        </div>
                        <p className="club-perk">
                            Equivalen a <strong>{formatCurrency(profileData.puntos * 3)}</strong> de crédito a favor.
                        </p>
                    </div>
                </div>

                {/* NAVEGACIÓN DE PESTAÑAS */}
                <nav className="dashboard-tabs-nav">
                    <button className={`tab-link-btn ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <span className="material-symbols-outlined">person</span> Perfil
                    </button>
                    <button className={`tab-link-btn ${activeTab === 'address' ? 'active' : ''}`} onClick={() => setActiveTab('address')}>
                        <span className="material-symbols-outlined">home_pin</span> Direcciones
                    </button>
                    <button className={`tab-link-btn ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                        <span className="material-symbols-outlined">package_2</span> Pedidos
                    </button>
                </nav>

                {/* CONTENIDO DINÁMICO */}
                <main className="dashboard-main-content-panel">
                    
                    {/* TAB 1: PERFIL Y SEGURIDAD */}
                    {activeTab === 'profile' && (
                        <div className="tab-pane-content animate-fade">
                            <form className="dashboard-card-form" onSubmit={handleUpdateProfile}>
                                <h3>Información Personal</h3>
                                <div className="input-field-group">
                                    <label>Nombre y Apellido</label>
                                    <input type="text" required value={profileData.fullName} onChange={e => setProfileData({...profileData, fullName: e.target.value})} />
                                </div>
                                <div className="input-field-group">
                                    <label>Teléfono / WhatsApp</label>
                                    <input type="tel" required value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-gold-panel" disabled={loading}>Guardar Datos</button>
                            </form>

                            <form className="dashboard-card-form" onSubmit={handleChangePassword}>
                                <h3>Seguridad y Contraseña</h3>
                                <div className="input-field-group">
                                    <label>Nueva Contraseña</label>
                                    <input type="password" required value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} placeholder="Mínimo 6 caracteres" />
                                </div>
                                <div className="input-field-group">
                                    <label>Repetir Nueva Contraseña</label>
                                    <input type="password" required value={passwordData.confirmPassword} onChange={e => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-gold-panel" disabled={loading}>Actualizar Contraseña</button>
                            </form>

                            <div className="dashboard-card-form danger-zone-card">
                                <h3>Zona de Peligro</h3>
                                <p>Si eliminás tu cuenta perderás permanentemente todo tu historial y los puntos del club de beneficios acumulados.</p>
                                <button type="button" className="btn-danger-panel" onClick={handleDeleteAccount}>Eliminar Mi Cuenta</button>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: DIRECCIONES GUARDADAS */}
                    {activeTab === 'address' && (
                        <div className="tab-pane-content animate-fade">
                            <form className="dashboard-card-form" onSubmit={handleUpdateProfile}>
                                <h3>Dirección de Envío / Facturación</h3>
                                <p className="subtitle-info-form">Dejá tus datos guardados para que tus próximas compras sean automáticas.</p>
                                <div className="input-field-group">
                                    <label>Calle y Número</label>
                                    <input type="text" placeholder="Ej: Av. Colón 701, Piso 2" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} />
                                </div>
                                <div className="input-field-group">
                                    <label>Localidad / Ciudad</label>
                                    <input type="text" placeholder="Ej: Las Heras" value={profileData.city} onChange={e => setProfileData({...profileData, city: e.target.value})} />
                                </div>
                                <div className="input-field-group">
                                    <label>Código Postal</label>
                                    <input type="text" placeholder="Ej: 5500" value={profileData.zipCode} onChange={e => setProfileData({...profileData, zipCode: e.target.value})} />
                                </div>
                                <button type="submit" className="btn-gold-panel" disabled={loading}>Guardar Dirección</button>
                            </form>
                        </div>
                    )}

                    {/* TAB 3: HISTORIAL DE PEDIDOS */}
                    {activeTab === 'orders' && (
                        <div className="tab-pane-content animate-fade">
                            <div className="dashboard-orders-wrapper">
                                <h3>Mis Compras</h3>
                                {orders.length === 0 ? (
                                    <div className="empty-orders-dashboard">
                                        <span className="material-symbols-outlined">shopping_bag</span>
                                        <p>Aún no realizaste ninguna compra.</p>
                                    </div>
                                ) : (
                                    <div className="orders-dashboard-list">
                                        {orders.map((order) => (
                                            <div key={order.id} className="order-dashboard-card">
                                                <div className="order-card-row-top">
                                                    <div>
                                                        <span className="order-id-tag">Pedido #{order.id.slice(0,8)}</span>
                                                        <p className="order-date-tag">{new Date(order.created_at).toLocaleDateString('es-AR')}</p>
                                                    </div>
                                                    
                                                    {/* 🔥 REEMPLAZAMOS EL RENDERIZADO DEL ESTADO ACÁ */}
                                                    {renderStatusBadge(order)}

                                                </div>
                                                <div className="order-card-items-preview">
                                                    {order.items?.map((item, i) => (
                                                        <p key={i} className="item-preview-text">
                                                            • {item.name} <strong>(x{item.quantity})</strong>
                                                        </p>
                                                    ))}
                                                </div>
                                                <div className="order-card-footer">
                                                    <span>Total:</span>
                                                    <span className="order-total-price">{formatCurrency(order.total)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}