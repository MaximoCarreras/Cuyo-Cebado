import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AuthPage.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // 🔥 NUEVO ESTADO
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [myOrders, setMyOrders] = useState([]);
    const [fetchingData, setFetchingData] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchClientData(session.user.id);
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchClientData(session.user.id);
            } else {
                setProfile(null);
                setMyOrders([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchClientData = async (userId) => {
        setFetchingData(true);
        try {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            
            if (profileData) {
                if (profileData.role === 'admin') {
                    navigate('/admin');
                    return; 
                }
                setProfile(profileData);
                // 🔥 REDIRECCIÓN AL NUEVO DASHBOARD PARA CLIENTES
                navigate('/mi-cuenta/dashboard'); 
            }

            const { data: ordersData } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (ordersData) setMyOrders(ordersData);

        } catch (error) {
            console.error("Error al cargar datos del cliente:", error);
        } finally {
            setFetchingData(false);
        }
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        
        // 🔥 VALIDACIÓN DE CONTRASEÑA EN REGISTRO
        if (!isLogin && password !== confirmPassword) {
            return alert("Las contraseñas no coinciden. Por favor, verificalas.");
        }

        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { 
                        data: { 
                            full_name: name,
                            phone: phone 
                        } 
                    }
                });
                if (error) throw error;
                alert("¡Cuenta creada! Ya podés iniciar sesión.");
                setIsLogin(true);
            }
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    // CORRECCIÓN ACÁ: Mapeo exacto de los estados
    const renderStatusBadge = (status) => {
        const statusMap = {
            'pending': { text: 'Pago Pendiente', class: 'status-pending' },
            'approved': { text: 'Pagado ✅', class: 'status-prep' }, // Agregado 'approved'
            'paid': { text: 'Pagado ✅', class: 'status-prep' },
            'en_preparacion': { text: 'En Preparación 🛠️', class: 'status-prep' },
            'en_distribucion': { text: 'En Distribución 🚚', class: 'status-dist' },
            'listo_para_retirar': { text: 'Listo para Retirar 🏠', class: 'status-ready' },
            'completed': { text: 'Entregado ✔️', class: 'status-done' },
            'cancelled': { text: 'Cancelado ❌', class: 'status-cancelled' }
        };
        const current = statusMap[status] || statusMap['pending'];
        return <span className={`client-status-badge ${current.class}`}>{current.text}</span>;
    };

    if (user) {
        if (!profile || profile.role === 'admin') {
            return (
                <div className="client-dashboard-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <p style={{ color: '#a5813a', fontWeight: 'bold', fontSize: '1.2rem' }}>Verificando credenciales...</p>
                </div>
            );
        }

        return (
            <div className="client-dashboard-page">
                <div className="dashboard-container">
                    <div className="dashboard-header">
                        <div className="user-greeting">
                            <h2>Hola, {profile?.full_name || 'Matero'}</h2>
                            <p>{user.email}</p>
                        </div>
                        <button onClick={handleLogout} className="btn-logout-minimal">
                            <span className="material-symbols-outlined">logout</span> Salir
                        </button>
                    </div>

                    <div className="club-card-premium">
                        <div className="club-card-content">
                            <div className="club-logo">🧉 Cuyo Cebado Club</div>
                            <div className="club-points">
                                <h3>{profile?.puntos || 0}</h3>
                                <span>Cuyo Puntos ✨</span>
                            </div>
                            <p className="club-perk">
                                Equivalen a <strong>${((profile?.puntos || 0) * 3).toLocaleString()}</strong> de crédito a favor.
                            </p>
                        </div>
                    </div>

                    <div className="dashboard-history">
                        <h3>Mis Rituales</h3>
                        
                        {fetchingData ? (
                            <p className="loading-text">Buscando tus piezas en la estancia...</p>
                        ) : myOrders.length === 0 ? (
                            <div className="no-orders-box">
                                <span className="material-symbols-outlined">shopping_bag</span>
                                <p>Aún no tenés compras registradas.</p>
                                <button onClick={() => navigate('/productos')} className="btn-auth-primary">
                                    Ir al Catálogo
                                </button>
                            </div>
                        ) : (
                            <div className="orders-grid">
                                {myOrders.map(order => (
                                    <div key={order.id} className="client-order-card">
                                        <div className="order-card-header">
                                            <span className="order-date">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </span>
                                            {renderStatusBadge(order.tracking_status !== 'pending' ? order.tracking_status : order.status)}
                                        </div>
                                        
                                        <div className="order-items-list">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="order-item-row">
                                                    <span>{item.quantity}x {item.title || item.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-card-footer">
                                            <div className="order-total-col">
                                                <span className="label">Total Abonado</span>
                                                <span className="amount">${order.total?.toLocaleString()}</span>
                                            </div>
                                            <div className="order-points-col">
                                                {order.puntos_ganados > 0 && (
                                                    <span className="points-earned">+ {order.puntos_ganados} pts</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo">🧉</div>
                    <h2>{isLogin ? 'Bienvenido Socio' : 'Unirse al Club'}</h2>
                    <p>{isLogin ? 'Ingresá a tu cuenta exclusiva' : 'Completá tus datos para empezar'}</p>
                </div>

                <form className="auth-form" onSubmit={handleAuth}>
                    {!isLogin && (
                        <>
                            <div className="auth-input-group">
                                <label>Nombre Completo</label>
                                <input type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="auth-input-group">
                                <label>Teléfono / WhatsApp</label>
                                <input type="tel" placeholder="Ej: 2611234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                        </>
                    )}
                    <div className="auth-input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="auth-input-group">
                        <label>Contraseña</label>
                        <div className="password-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                            <button 
                                type="button" 
                                className="btn-toggle-password" 
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? 'visibility_off' : 'visibility'}
                                </span>
                            </button>
                        </div>
                    </div>
                    
                    {/* 🔥 CAMPO DE CONFIRMAR CONTRASEÑA SOLO EN REGISTRO */}
                    {!isLogin && (
                        <div className="auth-input-group">
                            <label>Confirmar Contraseña</label>
                            <div className="password-wrapper">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn-auth-primary" disabled={loading}>
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? '¿Aún no sos parte?' : '¿Ya tenés cuenta?'}
                        <button className="btn-switch-auth" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Registrate aquí' : 'Iniciá sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}