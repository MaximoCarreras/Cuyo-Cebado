import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient'; // <-- IMPORTANTE
import './AuthPage.css';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isLogin) {
                // INICIO DE SESIÓN
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/'); // Al inicio tras loguearse
            } else {
                // REGISTRO NUEVO
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                        }
                    }
                });
                if (error) throw error;
                alert("¡Socio registrado! Por favor, revisá tu mail para confirmar tu cuenta.");
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

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
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div className="auth-input-group">
                        <label>Correo Electrónico</label>
                        <input
                            type="email"
                            placeholder="email@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="auth-input-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-auth-primary" disabled={loading}>
                        {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Crear Cuenta')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? '¿Aún no sos parte?' : '¿Ya tenés cuenta?'}
                        <button
                            className="btn-switch-auth"
                            onClick={() => setIsLogin(!isLogin)}
                        >
                            {isLogin ? 'Registrate aquí' : 'Iniciá sesión'}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}