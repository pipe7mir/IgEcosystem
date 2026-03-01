import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { theme } from '../react-ui/styles/theme';
import Footer from '../react-ui/components/Footer';
import { useAuth } from '../context/AuthContext';
import useAppMode from '../hooks/useAppMode';
import AdminBottomNav from '../react-ui/components/AdminBottomNav';
import logoImg from '../img/logos/LOGO1.png';
import {
    Inbox,
    Megaphone,
    Image as ImageIcon,
    Radio,
    Users,
    Settings,
    Info,
    Layers,
    FileCheck,
    LogOut,
    ExternalLink,
    LayoutDashboard
} from 'lucide-react';

const AdminLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut, user, role } = useAuth();
    const { isMobile, isDesktop } = useAppMode();

    /**
     * RBAC SECURITY GUARD
     * Redirige editores si intentan entrar a rutas restringidas
     */
    useEffect(() => {
        const restrictedRoutes = ['/admin/recursos', '/admin/users', '/admin/about', '/admin/ajustes'];
        if (role === 'editor' && restrictedRoutes.some(path => location.pathname.startsWith(path))) {
            navigate('/admin/solicitudes', { replace: true });
        }
    }, [location.pathname, role, navigate]);

    // Configuración de enlaces para el Navbar
    const allLinks = [
        { to: '/admin', label: 'Inicio', Icon: LayoutDashboard },
        { to: '/admin/solicitudes', label: 'Solicitudes', Icon: Inbox },
        { to: '/admin/announcements', label: 'Anuncios', Icon: Megaphone },
        { to: '/admin/inscripciones', label: 'Inscripciones', Icon: FileCheck },
        { to: '/admin/cartelera', label: 'Cartelera', Icon: ImageIcon },
        { to: '/admin/live', label: 'En Vivo', Icon: Radio },
        { to: '/admin/recursos', label: 'Recursos', Icon: Layers, adminOnly: true },
        { to: '/admin/users', label: 'Usuarios', Icon: Users, adminOnly: true },
        { to: '/admin/about', label: 'Sobre Oasis', Icon: Info, adminOnly: true },
        { to: '/admin/ajustes', label: 'Ajustes', Icon: Settings, adminOnly: true },
    ];

    const links = allLinks.filter(l => !l.adminOnly || role === 'admin');

    return (
        <div style={{ minHeight: '100vh', background: '#f4f7f6', fontFamily: 'AdventSans, sans-serif' }}>

            {/* ─── DESKTOP HORIZONTAL NAVBAR ─── */}
            {isDesktop && (
                <header style={{
                    position: 'sticky', top: 0, zIndex: 1000,
                    backdropFilter: 'blur(24px) saturate(180%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                }}>
                    <div style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 24px', height: '64px', maxWidth: '100%'
                    }}>
                        {/* Left: Logo + OASIS */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img src={logoImg} alt="OASIS" style={{ width: '36px', height: '36px' }} />
                            <h6 style={{ margin: 0, fontWeight: 900, fontFamily: 'ModernAge', color: '#5b2ea6', fontSize: '1.25rem', letterSpacing: '0.5px' }}>OASIS</h6>
                        </div>

                        {/* Center/Right: Nav Links */}
                        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1, justifyContent: 'center' }}>
                            {links.map(({ to, label, Icon }) => {
                                const active = location.pathname === to || location.pathname.startsWith(to);
                                return (
                                    <Link key={to} to={to}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                            padding: '8px 16px', borderRadius: '10px',
                                            textDecoration: 'none', 
                                            background: active ? 'rgba(91,46,166,0.1)' : 'transparent',
                                            color: active ? '#5b2ea6' : '#435566', 
                                            fontWeight: active ? 700 : 500,
                                            fontSize: '0.9rem',
                                            transition: 'all 0.2s',
                                            borderBottom: active ? '2px solid #5b2ea6' : '2px solid transparent',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!active) e.currentTarget.style.background = 'rgba(91,46,166,0.05)';
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!active) e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                                        <span>{label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Right: User Info & Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <a href="/" target="_blank" title="Ver Sitio" 
                                style={{ 
                                    width: '36px', height: '36px', borderRadius: '10px', 
                                    background: '#f3f4f6', color: '#4b5563', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    transition: 'background 0.2s', textDecoration: 'none'
                                }}>
                                <ExternalLink size={16} />
                            </a>
                            {user && (
                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 12px', borderRadius: '10px',
                                    background: 'rgba(91,46,166,0.05)'
                                }}>
                                    <div style={{ 
                                        width: '32px', height: '32px', borderRadius: '10px', 
                                        background: 'linear-gradient(135deg, #5b2ea6, #7c3aed)', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        color: '#fff', fontWeight: 800, fontSize: '0.85rem'
                                    }}>
                                        {(user.name || user.email)[0].toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1f1f2e' }}>
                                            {user.name || user.email}
                                        </span>
                                        <span style={{ fontSize: '0.65rem', color: '#5b2ea6', textTransform: 'uppercase', fontWeight: 700 }}>
                                            {role}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <button onClick={signOut} title="Cerrar Sesión" 
                                style={{ 
                                    height: '36px', border: 'none', borderRadius: '10px', 
                                    background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                    gap: '6px', fontWeight: 700, cursor: 'pointer',
                                    padding: '0 12px', fontSize: '0.8rem'
                                }}>
                                <LogOut size={16} />
                                <span>Salir</span>
                            </button>
                        </div>
                    </div>
                </header>
            )}

            {/* ─── MOBILE HEADER (Liquid Glass) ─── */}
            {isMobile && (
                <header style={{
                    position: 'sticky', top: 0, zIndex: 1000,
                    padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    backdropFilter: 'blur(20px) saturate(180%)', backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 12px rgba(0,0,0,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={logoImg} alt="OASIS" style={{ width: '28px', height: '28px' }} />
                        <h6 style={{ margin: 0, fontWeight: 900, fontFamily: 'ModernAge', color: '#5b2ea6', fontSize: '0.9rem' }}>ADMIN</h6>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, background: 'rgba(91,46,166,0.1)', color: '#5b2ea6', padding: '4px 12px', borderRadius: '50px' }}>
                        {links.find(l => location.pathname.startsWith(l.to))?.label || 'Panel'}
                    </div>
                </header>
            )}

            {/* ─── MAIN CONTENT ─── */}
            <main style={{
                padding: '24px 16px',
                paddingBottom: isMobile ? '80px' : '24px',
                minHeight: '100vh',
                maxWidth: '100%',
                overflowX: 'hidden'
            }}>
                <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>

            {/* ─── MOBILE BOTTOM NAV ─── */}
            {isMobile && <AdminBottomNav />}

            {/* Global Footer (Desktop Only perhaps, or standard) */}
            <Footer />
        </div>
    );
};

export default AdminLayout;

