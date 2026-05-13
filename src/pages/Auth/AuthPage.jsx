import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import './AuthPage.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null); // Para saber si hay alguien logueado

    const navigate = useNavigate();

    // 1. Escuchar cambios de sesión al cargar
    useEffect(() => {
        // Obtener sesión actual
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();

        // Escuchar cambios (login/logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // Al loguear, el useEffect de arriba detectará el cambio y mostrará el perfil
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: { data: { full_name: name } }
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

    // VISTA DE PERFIL (Si está logueado)
    if (user) {
        return (
            <div className="auth-page">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-logo">🧉</div>
                        <h2>Mi Perfil</h2>
                        <p style={{ color: '#a5813a', fontWeight: 'bold' }}>{user.email}</p>
                    </div>
                    <div style={{ marginTop: '30px' }}>
                        <p style={{ color: '#888' }}>¡Bienvenido al Club de Cuyo Cebado!</p>
                        <button
                            onClick={handleLogout}
                            className="btn-auth-primary"
                            style={{ marginTop: '20px', background: '#1a1614', color: '#a5813a', border: '1px solid #a5813a' }}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // VISTA DE FORMULARIO (Si NO está logueado)
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
                        <div className="auth-input-group">
                            <label>Nombre Completo</label>
                            <input type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                    )}
                    <div className="auth-input-group">
                        <label>Correo Electrónico</label>
                        <input type="email" placeholder="email@ejemplo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="auth-input-group">
                        <label>Contraseña</label>
                        <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
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