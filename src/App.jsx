import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Users, FileText, Calendar, MessageSquare, LayoutDashboard, Plus, Search, Bell, Settings, LogOut, CheckCircle, AlertCircle, Clock, MoreVertical, ChevronRight, Menu, X, CreditCard, Smartphone, Filter, ArrowUpRight, ShieldCheck, Zap, Moon, Sun, Monitor, Lock, UserPlus, Upload, Info, Download, Mail, MapPin, Hash, Car, Building2, CalendarDays, DollarSign, ChevronDown, ChevronUp, Truck, Bike, Camera, Image as ImageIcon, Trash2, Send, Timer, Edit2, RefreshCcw, Ban, ArrowLeft, Printer, Table as TableIcon, Megaphone, Palette, Share2, Type, Bold, Italic, Link as LinkIcon, Database, UploadCloud, LayoutGrid, List, File, Link2, ShieldAlert, History
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, setDoc, deleteDoc, query, serverTimestamp, getDoc
} from 'firebase/firestore';
import { 
  getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken
} from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// --- CONFIGURACIÓN FIREBASE ---
const envFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let embeddedFirebaseConfig = {};
try {
  if (typeof __firebase_config !== 'undefined' && __firebase_config) {
    embeddedFirebaseConfig = JSON.parse(__firebase_config);
  }
} catch (_) {
  embeddedFirebaseConfig = {};
}

const embeddedHasValues = Boolean(
  embeddedFirebaseConfig.apiKey &&
  embeddedFirebaseConfig.projectId &&
  embeddedFirebaseConfig.appId
);
const firebaseConfig = embeddedHasValues ? embeddedFirebaseConfig : envFirebaseConfig;
const hasFirebaseConfig = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);
const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const storage = app ? getStorage(app) : null;
const appId = import.meta.env.VITE_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'insurance-manager-v5');

// --- COMPONENTES ATÓMICOS ---
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white dark:bg-slate-800 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 dark:border-slate-700/50 p-4 sm:p-5 transition-all ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''} ${className}`}>
    {children}
  </div>
);

const Badge = ({ status, company = false }) => {
  const styles = {
    pagado: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
    vencido: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    pendiente: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
    sin_informar: "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
    activa: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    baja: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-400",
    no_renovada: "bg-orange-50 text-orange-600 border-orange-100",
    company: "bg-slate-900 text-white border-slate-800 dark:bg-slate-100 dark:text-slate-900",
  };
  const label = typeof status === 'string' ? status : '';
  const displayLabel = label.replace('_', ' ').toUpperCase();
  return <span className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full text-[8px] sm:text-[9px] font-bold tracking-wider border whitespace-nowrap ${company ? styles.company : (styles[label] || "bg-slate-50 text-slate-500 border-slate-100")}`}>{displayLabel}</span>;
};

const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children, onSave }) => (
  <div className="mb-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 overflow-hidden shadow-sm transition-all">
    <button onClick={onToggle} className="w-full flex items-center justify-between p-5 sm:p-6 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors text-left outline-none">
       <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl"><Icon size={18} /></div>
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-widest text-slate-800 dark:text-white">{title}</h4>
       </div>
       <div className="p-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300">
          {isOpen ? <ChevronUp size={16} /> : <Plus size={16} />}
       </div>
    </button>
    {isOpen && (
      <div className="p-5 sm:p-6 border-t border-slate-100 dark:border-slate-700 animate-in slide-in-from-top-4 duration-300">
        {children}
        {onSave && (
           <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
              <button onClick={onSave} className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:-translate-y-1 active:scale-95 transition-all shadow-lg shadow-blue-500/20">Guardar Cambios</button>
           </div>
        )}
      </div>
    )}
  </div>
);

const BASE_PERMISSIONS = {
  dashboard: true,
  clients: true,
  vencimientos: true,
  settings: true,
  announcements: true,
  manageUsers: false
};

const ROLE_PERMISSIONS = {
  admin: { ...BASE_PERMISSIONS, manageUsers: true },
  agent: { ...BASE_PERMISSIONS, settings: false, manageUsers: false }
};

const normalizePermissions = (role = 'agent', permissions = {}) => ({
  ...(ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.agent),
  ...(permissions || {})
});

export default function App() {
  // --- AUTH Y ROLES ---
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [appUser, setAppUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ user: '', pass: '' });
  const [loginError, setLoginError] = useState('');
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || localStorage.getItem('seflow-installed') === '1';
  });
  const [isMobileInput, setIsMobileInput] = useState(false);

  const validUsers = [
    { id: 'u1', user: 'admin', pass: '1234', role: 'admin', name: 'Administrador General', permissions: normalizePermissions('admin') },
    { id: 'u2', user: 'atencion', pass: '1234', role: 'agent', name: 'Atención al Público', permissions: normalizePermissions('agent') }
  ];

  // --- ESTADOS PRINCIPALES ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 
  const [cobrosFilter, setCobrosFilter] = useState('todos');
  
  // Modals
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedClientForPolicy, setSelectedClientForPolicy] = useState(null);
  const [policyToRenew, setPolicyToRenew] = useState(null);
  const [duplicateAlert, setDuplicateAlert] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState('');
  const [notification, setNotification] = useState(null);
  const [isAutomating, setIsAutomating] = useState(false);
  const [printType, setPrintType] = useState('single'); 
  const [printWithPhotos, setPrintWithPhotos] = useState(true); 
  
  // Form State
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [policyPhotos, setPolicyPhotos] = useState([]);
  const [vigenciaDesde, setVigenciaDesde] = useState('');
  const [vigenciaHasta, setVigenciaHasta] = useState('');
  const [calculatedInstallments, setCalculatedInstallments] = useState(6);
  const [policyLink, setPolicyLink] = useState('');
  const [policyPdf, setPolicyPdf] = useState('');

  // Broadcast
  const initialBroadcastHtml = useRef('Le informamos que a partir de hoy contamos con <b>nuevos beneficios</b> en su póliza. Quedamos a su entera disposición.');
  const [broadcastTitle, setBroadcastTitle] = useState('Aviso Importante');
  const [broadcastHtml, setBroadcastHtml] = useState(initialBroadcastHtml.current);
  const [sponsorImage, setSponsorImage] = useState('');
  const [titleColor, setTitleColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#cbd5e1');
  const [broadcastBg, setBroadcastBg] = useState('linear-gradient(135deg, #1e293b 0%, #0f172a 100%)');
  const [selectedTitleFont, setSelectedTitleFont] = useState('Inter');
  const [selectedTextFont, setSelectedTextFont] = useState('Inter');
  const [hasShadow, setHasShadow] = useState(true);
  const [bgEffect, setBgEffect] = useState('none');
  const [selectedPreset, setSelectedPreset] = useState(0);
  const editorRef = useRef(null);
  const logoInputRef = useRef(null);
  const sponsorInputRef = useRef(null);

  // Settings
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    return localStorage.getItem('seflow-theme') || 'light';
  }); 
  const [agencySettings, setAgencySettings] = useState({
    name: 'Se-Flow', logo: '', phone: '', address: '', installmentNotifyMode: 'manual', policyNotifyMode: 'manual', notifyHour: '09:00', reminderDays: [3, 1, 0] 
  });
  const [openSettingsTab, setOpenSettingsTab] = useState('identidad');
  const [managedUsers, setManagedUsers] = useState([]);
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    user: '',
    pass: '',
    role: 'agent',
    permissions: normalizePermissions('agent')
  });
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingSponsor, setIsUploadingSponsor] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Datos
  const [clients, setClients] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Importación Masiva
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvMapping, setCsvMapping] = useState({});
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const designPresets = [
    { name: 'Dark Pro', bg: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', title: '#60a5fa', text: '#cbd5e1', titleFont: 'Inter', textFont: 'Inter', effect: 'none' },
    { name: 'Emergencia', bg: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)', title: '#ffffff', text: '#fecaca', titleFont: 'Oswald', textFont: 'Inter', effect: 'glow' },
    { name: 'Elegante', bg: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', title: '#1e293b', text: '#475569', titleFont: 'Playfair Display', textFont: 'Georgia', effect: 'none' },
    { name: 'Neón', bg: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)', title: '#ffffff', text: '#ede9fe', titleFont: 'Montserrat', textFont: 'Inter', effect: 'blobs' },
    { name: 'Premium', bg: 'linear-gradient(to bottom right, #0f172a, #000000)', title: '#fbbf24', text: '#94a3b8', titleFont: 'Playfair Display', textFont: 'Montserrat', effect: 'gold-glow' }
  ];

  // UI Setup
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&family=Playfair+Display:wght@700&family=Montserrat:wght@500;700&family=Oswald:wght@500&display=swap';
    link.rel = 'stylesheet';
    if (!document.querySelector('meta[name="viewport"]')) {
      const meta = document.createElement('meta'); meta.name = 'viewport'; meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'; document.head.appendChild(meta);
    }
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --safe-top: env(safe-area-inset-top, 0px);
        --safe-right: env(safe-area-inset-right, 0px);
        --safe-bottom: env(safe-area-inset-bottom, 0px);
        --safe-left: env(safe-area-inset-left, 0px);
      }
      html, body, #root { min-height: 100%; }
      body { font-family: 'Inter', sans-serif; font-weight: 300; letter-spacing: -0.01em; margin: 0; padding: 0; overflow-x: hidden; } 
      h1, h2, h3, h4, h5, h6 { font-weight: 600; }
      .app-shell { min-height: 100svh; min-height: 100dvh; }
      .app-viewport { height: 100svh; height: 100dvh; }
      .safe-top { padding-top: var(--safe-top); }
      .safe-bottom { padding-bottom: var(--safe-bottom); }
      .safe-x { padding-left: var(--safe-left); padding-right: var(--safe-right); }
      @media (display-mode: standalone) {
        .app-shell { min-height: 100lvh; }
        .app-viewport { height: 100lvh; }
      }
      @media print {
        .no-print { display: none !important; } .print-only { display: block !important; } body { background: white !important; padding: 0 !important; }
        @page { size: A4 portrait; margin: 1cm; }
      }
      .print-only { display: none; }
      .font-playfair { font-family: 'Playfair Display', serif; }
      .font-montserrat { font-family: 'Montserrat', sans-serif; }
      .font-oswald { font-family: 'Oswald', sans-serif; }
      .bg-blob-1 { position: absolute; top: -10%; left: -10%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%); filter: blur(40px); border-radius: 50%; }
      .bg-blob-2 { position: absolute; bottom: -10%; right: -10%; width: 60%; height: 60%; background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%); filter: blur(50px); border-radius: 50%; }
      .bg-glow { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.4) 100%); }
      .bg-gold-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(251, 191, 36, 0.15) 0%, transparent 60%); }
      .editable-container b, .editable-container strong { font-weight: 700; }
      .editable-container i, .editable-container em { font-style: italic; }
      .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      .progress-bar-striped { background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent); background-size: 1rem 1rem; animation: progress-bar-stripes 1s linear infinite; }
      @keyframes progress-bar-stripes { 0% { background-position: 1rem 0; } 100% { background-position: 0 0; } }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('seflow-theme', theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia('(pointer: coarse)');
    const apply = () => setIsMobileInput(media.matches || /Mobi|Android|iPhone|iPad/i.test(window.navigator.userAgent));
    apply();
    media.addEventListener?.('change', apply);
    return () => media.removeEventListener?.('change', apply);
  }, []);

  useEffect(() => {
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
      setCanInstall(true);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredInstallPrompt(null);
      localStorage.setItem('seflow-installed', '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      onInstalled();
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  // Firebase Init
  useEffect(() => {
    if (!auth || !db) {
      setLoading(false);
      setSyncError('Firebase no está configurado correctamente.');
      return;
    }

    let authAttemptFinished = false;
    let unsubscribed = false;

    const setAuthError = (message) => {
      if (unsubscribed) return;
      setLoading(false);
      setSyncError(message);
    };

    const initAuth = async () => {
      try {
        const tokenFromEnv = import.meta.env.VITE_INITIAL_AUTH_TOKEN || '';
        if (tokenFromEnv) {
          await signInWithCustomToken(auth, tokenFromEnv);
        } else if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error(error);
        setAuthError('No se pudo autenticar con Firebase. Activa Authentication > Anonymous y agrega dominios autorizados (localhost, 127.0.0.1, shsegur.github.io).');
      } finally {
        authAttemptFinished = true;
        if (!auth.currentUser && !unsubscribed) {
          setAuthError('No se pudo iniciar sesión anónima. Revisa Authentication > Anonymous y Authorized domains.');
        }
      }
    };
    initAuth();
    
    const syncTimeout = setTimeout(() => {
      if (!unsubscribed) {
        setAuthError('La sincronización con Firebase tardó demasiado. Revisa conexión, Authentication y Authorized domains.');
      }
    }, 12000);

    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setFirebaseUser(u);
      if (!u) {
        if (authAttemptFinished) {
          setAuthError('No hay sesión Firebase activa. Verifica Authentication > Anonymous y dominios autorizados.');
        }
        return;
      }
      if (u) {
        clearTimeout(syncTimeout);
        setSyncError('');
        // No bloqueamos la interfaz por listeners en tiempo real.
        setLoading(false);
        onSnapshot(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'agency'), (snap) => {
          if (snap.exists()) setAgencySettings(prev => ({...prev, ...snap.data()}));
        });
        onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'clients'), (snap) => {
          setClients(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'policies'), (snap) => {
          setPolicies(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
        onSnapshot(
          collection(db, 'artifacts', appId, 'public', 'data', 'installments'),
          (snap) => {
            setInstallments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
            setLoading(false);
          },
          (error) => {
            console.error(error);
            setSyncError('No se pudo leer Firestore. Revisa reglas y permisos de Firebase.');
            setLoading(false);
          }
        );
        onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'logs'), (snap) => {
          setAuditLogs(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.timestamp - a.timestamp));
        });
        onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'users'), (snap) => {
          setManagedUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        });
      }
    });

    return () => {
      unsubscribed = true;
      clearTimeout(syncTimeout);
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (vigenciaDesde && vigenciaHasta) {
      const d1 = new Date(vigenciaDesde); const d2 = new Date(vigenciaHasta);
      let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      if (d2.getDate() >= d1.getDate()) months++; 
      setCalculatedInstallments(Math.max(1, months));
    }
  }, [vigenciaDesde, vigenciaHasta]);

  // Derived State Memos
  const todayStr = new Date().toISOString().split('T')[0];

  const processedInstallments = useMemo(() => {
    return installments.map(inst => {
      let currentStatus = inst.status;
      if (inst.status === 'pendiente' && inst.dueDate < todayStr) {
         currentStatus = 'sin_informar';
      }
      return { ...inst, computedStatus: currentStatus };
    });
  }, [installments, todayStr]);

  const filteredInstallments = useMemo(() => {
    let result = processedInstallments;
    if (cobrosFilter !== 'todos') {
      result = result.filter(i => i.computedStatus === cobrosFilter || i.status === cobrosFilter);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(i => {
         const client = clients.find(c => c.id === i.clientId);
         return i.matricula.toLowerCase().includes(lowerTerm) || (client && (client.name.toLowerCase().includes(lowerTerm) || client.dni?.includes(lowerTerm)));
      });
    }
    return result.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [processedInstallments, cobrosFilter, searchTerm, clients]);

  const getCoverageStatus = (policy) => {
    if (policy.status === 'baja') return { label: 'Dada de Baja', style: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' };
    if (policy.vigenciaHasta < todayStr) return { label: 'SIN COBERTURA - VENCIDA', style: 'bg-rose-100 text-rose-700 border border-rose-300 font-bold' };
    const polInsts = processedInstallments.filter(i => i.policyId === policy.id && (i.computedStatus === 'sin_informar' || i.status === 'vencido'));
    if (polInsts.length > 0) return { label: 'SIN COBERTURA - FALTA PAGO', style: 'bg-orange-100 text-orange-700 border border-orange-300 font-bold animate-pulse' };
    return { label: 'ACTIVA - CON COBERTURA', style: 'bg-emerald-50 text-emerald-600 border border-emerald-100' };
  };

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients.filter(c => c.status !== 'baja');
    const lowerTerm = searchTerm.toLowerCase();
    return clients.filter(c => {
       if (c.status === 'baja') return false;
       const matchName = c.name.toLowerCase().includes(lowerTerm);
       const matchDni = c.dni?.includes(lowerTerm);
       const clientPols = policies.filter(p => p.clientId === c.id);
       const matchPol = clientPols.some(p => p.matricula.toLowerCase().includes(lowerTerm));
       return matchName || matchDni || matchPol;
    });
  }, [clients, searchTerm, policies]);

  const dashMetrics = useMemo(() => {
    const actPol = policies.filter(p => p.status === 'activa');
    const vigentes = actPol.filter(p => p.vigenciaHasta >= todayStr).length;
    const vencidas = actPol.filter(p => p.vigenciaHasta < todayStr).length;
    const renovarHoy = actPol.filter(p => p.vigenciaHasta === todayStr).length;
    const sinInformar = processedInstallments.filter(i => i.computedStatus === 'sin_informar').length;
    
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    const endOfNextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 2, 0);
    const proxRenov = actPol.filter(p => { const end = new Date(p.vigenciaHasta); return end >= nextMonth && end <= endOfNextMonth; }).length;

    return { vigentes, vencidas, renovarHoy, sinInformar, proxRenov };
  }, [policies, processedInstallments, todayStr]);

  const nextMonthRenewals = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    return policies.filter(p => {
      const end = new Date(p.vigenciaHasta);
      return end >= nextMonth && end <= endOfNextMonth && p.status === 'activa';
    });
  }, [policies]);

  const autoNotifyQueue = useMemo(() => {
    if (agencySettings.installmentNotifyMode === 'off') return [];
    const today = new Date();
    today.setHours(0,0,0,0);
    return installments.filter(inst => {
      if (inst.status !== 'pendiente') return false;
      const dueDate = new Date(inst.dueDate);
      dueDate.setHours(0,0,0,0);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return agencySettings.reminderDays?.includes(diffDays);
    });
  }, [installments, agencySettings.installmentNotifyMode, agencySettings.reminderDays]);

  const loginUsers = useMemo(() => {
    const dynamicUsers = managedUsers
      .filter(u => u.user && u.pass && u.status !== 'inactive')
      .map(u => ({
        ...u,
        permissions: normalizePermissions(u.role, u.permissions)
      }));
    return [...validUsers, ...dynamicUsers];
  }, [managedUsers]);

  const allowedTabs = useMemo(() => {
    const perms = appUser?.permissions || normalizePermissions(appUser?.role);
    return [
      perms.dashboard ? 'dashboard' : null,
      perms.clients ? 'clients' : null,
      perms.vencimientos ? 'vencimientos' : null,
      perms.settings ? 'settings' : null
    ].filter(Boolean);
  }, [appUser]);

  const tabTitles = {
    dashboard: 'Inicio',
    clients: 'Clientes',
    vencimientos: 'Cobros',
    settings: 'Ajustes',
  };

  useEffect(() => {
    if (!appUser) return;
    if (!allowedTabs.length) return;
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [appUser, activeTab, allowedTabs]);

  // Actions
  const logAction = async (action, details, userObj = appUser) => {
    if (!userObj) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'logs'), {
        user: userObj.name, role: userObj.role, action, details, timestamp: new Date().getTime()
      });
    } catch (e) { console.error("Error logging:", e); }
  };

  const showNotify = (msg, type = 'success') => { setNotification({ msg, type }); setTimeout(() => setNotification(null), 3000); };

  const handleLogin = (e) => {
    e.preventDefault();
    const found = loginUsers.find(u => u.user === loginForm.user && u.pass === loginForm.pass);
    if (found) {
      const normalized = { ...found, permissions: normalizePermissions(found.role, found.permissions) };
      setAppUser(normalized);
      setLoginError('');
      logAction('Inicio Sesión', 'Acceso al sistema', normalized);
    } 
    else { setLoginError('Usuario o contraseña incorrectos'); }
  };

  const handleInstallApp = async () => {
    if (isInstalled) return;
    if (!deferredInstallPrompt) {
      showNotify('Para instalar: menú del navegador > Instalar app. Si no aparece, recarga la página.', 'info');
      return;
    }

    try {
      setIsInstalling(true);
      await deferredInstallPrompt.prompt();
      const result = await deferredInstallPrompt.userChoice;
      if (result?.outcome === 'accepted') {
        setIsInstalled(true);
        setCanInstall(false);
        localStorage.setItem('seflow-installed', '1');
      }
    } catch (error) {
      console.error(error);
      showNotify('No se pudo iniciar la instalación', 'error');
    } finally {
      setDeferredInstallPrompt(null);
      setIsInstalling(false);
    }
  };

  const navigateToCobros = (filter) => { setActiveTab('vencimientos'); setCobrosFilter(filter); setSidebarOpen(false); };
  const navigateToPolicies = (term) => { setActiveTab('clients'); setSearchTerm(term); setSidebarOpen(false); };

  const fileToDataUrl = async (file) => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const withTimeout = async (promise, ms = 20000) => {
    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error('timeout')), ms);
      promise
        .then((value) => {
          clearTimeout(timeoutId);
          resolve(value);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  };

  const uploadFileToStorage = async (file, folder) => {
    if (storage) {
      try {
        const safeName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `artifacts/${appId}/${folder}/${safeName}`);
        return await withTimeout((async () => {
          await uploadBytes(storageRef, file, { contentType: file.type || 'image/jpeg' });
          return await getDownloadURL(storageRef);
        })(), 15000);
      } catch (error) {
        console.error('Storage upload fallback:', error);
      }
    }
    return await fileToDataUrl(file);
  };

  const handleAgencyLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotify('El archivo debe ser JPG o PNG', 'error');
      return;
    }
    try {
      setIsUploadingLogo(true);
      const uploadedUrl = await uploadFileToStorage(file, 'agency-logos');
      setAgencySettings(prev => ({ ...prev, logo: uploadedUrl }));
      showNotify(uploadedUrl?.startsWith?.('data:') ? 'Logo cargado localmente (sin Storage)' : 'Logo subido correctamente');
    } catch (error) {
      console.error(error);
      showNotify('No se pudo subir el logo', 'error');
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleSponsorImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotify('El archivo debe ser JPG o PNG', 'error');
      return;
    }
    try {
      setIsUploadingSponsor(true);
      const uploadedUrl = await uploadFileToStorage(file, 'sponsor-banners');
      setSponsorImage(uploadedUrl);
      showNotify(uploadedUrl?.startsWith?.('data:') ? 'Banner cargado localmente (sin Storage)' : 'Banner subido correctamente');
    } catch (error) {
      console.error(error);
      showNotify('No se pudo subir el banner', 'error');
    } finally {
      setIsUploadingSponsor(false);
      e.target.value = '';
    }
  };

  const handleRoleChangeForNewUser = (role) => {
    setNewUserForm(prev => ({
      ...prev,
      role,
      permissions: normalizePermissions(role, prev.permissions)
    }));
  };

  const handleNewPermissionToggle = (key) => {
    setNewUserForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] }
    }));
  };

  const createManagedUser = async () => {
    if (!db) {
      showNotify('Base de datos no disponible', 'error');
      return;
    }
    if (!newUserForm.name || !newUserForm.user || !newUserForm.pass) {
      showNotify('Completa nombre, usuario y contraseña', 'error');
      return;
    }
    const username = newUserForm.user.trim().toLowerCase();
    const exists = loginUsers.some(u => u.user.toLowerCase() === username);
    if (exists) {
      showNotify('Ese usuario ya existe', 'error');
      return;
    }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'users'), {
        name: newUserForm.name.trim(),
        user: username,
        pass: newUserForm.pass,
        role: newUserForm.role,
        status: 'active',
        permissions: normalizePermissions(newUserForm.role, newUserForm.permissions),
        createdAt: serverTimestamp()
      });
      setNewUserForm({
        name: '',
        user: '',
        pass: '',
        role: 'agent',
        permissions: normalizePermissions('agent')
      });
      showNotify('Usuario creado');
      logAction('Alta Usuario', `Creó ${username}`);
    } catch (error) {
      console.error(error);
      showNotify('No se pudo crear el usuario', 'error');
    }
  };

  const updateManagedUser = async (userId, patchData) => {
    if (!db) return;
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', userId), patchData);
    } catch (error) {
      console.error(error);
      showNotify('No se pudo actualizar el usuario', 'error');
    }
  };

  const toggleManagedUserPermission = async (userObj, permissionKey) => {
    const nextPermissions = {
      ...normalizePermissions(userObj.role, userObj.permissions),
      [permissionKey]: !normalizePermissions(userObj.role, userObj.permissions)[permissionKey]
    };
    await updateManagedUser(userObj.id, { permissions: nextPermissions });
  };

  const toggleManagedUserStatus = async (userObj) => {
    const nextStatus = userObj.status === 'inactive' ? 'active' : 'inactive';
    await updateManagedUser(userObj.id, { status: nextStatus });
  };

  const executeSavePolicy = async (formDataObj, overrideClientId = null) => {
    const matricula = formDataObj.matricula.toUpperCase();
    const montoCuota = parseFloat(formDataObj.montoCuota) || 0;
    try {
      let clientId = overrideClientId || selectedClientForPolicy?.id;
      if (!clientId) {
        const clientDoc = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'clients'), {
          name: formDataObj.name, dni: formDataObj.dni, phone: formDataObj.phone, landline: formDataObj.landline, email: formDataObj.email, street: formDataObj.street, door: formDataObj.door, locality: formDataObj.locality, notes: formDataObj.notes, status: 'activo', createdAt: serverTimestamp(),
        });
        clientId = clientDoc.id;
      }
      
      const policyDoc = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'policies'), {
        clientId, matricula, company: formDataObj.company, vehicleType: formDataObj.vehicleType, vigenciaDesde, vigenciaHasta, photos: policyPhotos, linkPago: policyLink, pdfPóliza: policyPdf, status: 'activa', createdAt: serverTimestamp()
      });
      
      for (let i = 0; i < calculatedInstallments; i++) {
        const dueDate = new Date(vigenciaDesde); dueDate.setMonth(dueDate.getMonth() + i);
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'installments'), {
          clientId, policyId: policyDoc.id, matricula, amount: montoCuota, installmentNumber: i + 1, dueDate: dueDate.toISOString().split('T')[0], status: 'pendiente', createdAt: serverTimestamp()
        });
      }
      logAction('Alta Póliza', `Matrícula: ${matricula}`);
      setModalOpen(false); setSelectedClientForPolicy(null); setVigenciaDesde(''); setVigenciaHasta(''); setPolicyPhotos([]); setPolicyLink(''); setPolicyPdf('');
      showNotify(`Alta completa para ${matricula}`);
    } catch (error) { showNotify('Error al procesar la carga', 'error'); }
  };

  const handleCreateOrUpdateClientAndPolicy = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataObj = Object.fromEntries(formData.entries());
    
    if (!selectedClientForPolicy && formDataObj.dni) {
      const existingClient = clients.find(c => c.dni === formDataObj.dni && c.status !== 'baja');
      if (existingClient) { setDuplicateAlert({ existing: existingClient, formDataObj }); return; }
    }
    executeSavePolicy(formDataObj);
  };

  const updateInstallmentStatus = async (inst, newStatus) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'installments', inst.id), { status: newStatus });
      logAction('Cambio Estado Cobro', `Cuota ${inst.installmentNumber} de ${inst.matricula} a ${newStatus}`);
      showNotify(`Estado actualizado a ${newStatus}`);
    } catch (e) { showNotify('Error', 'error'); }
  };

  const sendWhatsApp = async (client, inst) => {
    if (!client?.phone) return;
    const clean = client.phone.replace(/\D/g, '');
    const paymentStr = inst.linkPago || 'Por favor coordine el pago con la agencia.';
    const msg = `Hola ${client.name}, te recordamos que tu cuota ${inst.installmentNumber} de la patente ${inst.matricula} se encuentra ${inst.computedStatus === 'sin_informar' ? 'vencida/sin informar' : 'próxima a vencer'}. Monto: $${inst.amount}.\nLink: ${paymentStr}`;
    window.open(`https://wa.me/${clean}?text=${encodeURIComponent(msg)}`, '_blank');
    
    await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'clients', client.id), { lastNotified: new Date().toISOString() });
    logAction('Aviso WhatsApp', `A ${client.name} por patente ${inst.matricula}`);
  };

  const handlePrintAllClients = () => { setPrintType('list'); setTimeout(() => window.print(), 100); };
  
  const exportToExcel = () => {
    const headers = ["Razón Social", "DNI/CUIT", "Celular (WA)", "Fijo", "Email", "Dirección", "Localidad", "Observaciones", "Detalle Polizas"];
    const rows = filteredClients.map(c => {
      const address = `${c.street || ''} ${c.door || ''}`.trim();
      const clientPolicies = policies.filter(p => p.clientId === c.id);
      const pDetail = clientPolicies.map(p => `${p.matricula} (${p.company} - Vence: ${p.vigenciaHasta})`).join(" | ");
      return [c.name, c.dni, c.phone, c.landline || '-', c.email || '-', address || '-', c.locality || '-', c.notes || '-', pDetail];
    });
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.map(e => `"${e.join('","')}"`).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", `cartera_${new Date().toISOString().split('T')[0]}.csv`); link.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotify('El archivo debe ser JPG o PNG', 'error');
      return;
    }

    try {
      const uploadedUrl = await uploadFileToStorage(file, 'policy-photos');
      setPolicyPhotos(prev => [...prev, uploadedUrl]);
      showNotify(uploadedUrl?.startsWith?.('data:') ? 'Imagen cargada localmente (sin Storage)' : 'Imagen subida correctamente');
    } catch (error) {
      console.error(error);
      showNotify('No se pudo subir la imagen', 'error');
    }

    e.target.value = '';
  };

  const addPhotoUrl = () => { if (!tempPhotoUrl) return; setPolicyPhotos([...policyPhotos, tempPhotoUrl]); setTempPhotoUrl(''); };
  const removePhoto = (index) => setPolicyPhotos(policyPhotos.filter((_, i) => i !== index));

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
      if (lines.length > 0) {
        const firstLine = lines[0];
        const delimiter = firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
        const parseLine = (line) => line.split(delimiter).map(c => c.trim().replace(/^"|"$/g, ''));
        const headers = parseLine(lines[0]);
        const data = lines.slice(1).map(parseLine);
        setCsvHeaders(headers); setCsvData(data);
        showNotify(`Archivo cargado. ${data.length} filas detectadas. Mapea las columnas.`, 'info');
      }
    };
    reader.readAsText(file);
  };

  const handleCsvMappingChange = (field, value) => { setCsvMapping(prev => ({ ...prev, [field]: value })); };

  const parseDateStr = (dateStr) => {
    if (!dateStr) return '';
    if (dateStr.includes('/')) {
      const parts = dateStr.split('/');
      if (parts.length === 3 && parts[2].length === 4) return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
    }
    return dateStr;
  };

  const executeCsvImport = async () => {
    if (!csvMapping.name || !csvMapping.matricula) { showNotify('Nombre y Matrícula son obligatorios para importar', 'error'); return; }
    setIsImporting(true); setImportProgress(0);
    let successCount = 0;
    const total = csvData.length;
    
    for (let i = 0; i < total; i++) {
      const row = csvData[i];
      try {
        const getVal = (field) => {
          if (!csvMapping[field]) return ''; 
          const colIndex = csvHeaders.indexOf(csvMapping[field]);
          return colIndex !== -1 && row[colIndex] !== undefined ? row[colIndex].trim() : '';
        };

        const name = getVal('name'); const matricula = getVal('matricula').toUpperCase();
        if (!name || !matricula) continue; 

        let clientId = null; const dni = getVal('dni');
        const existingClient = clients.find(c => (dni && c.dni === dni) || c.name.toLowerCase() === name.toLowerCase());
        
        if (existingClient) { clientId = existingClient.id; } else {
           const cRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'clients'), {
              name, dni, phone: getVal('phone'), landline: getVal('landline'), email: getVal('email'), street: getVal('street'), door: getVal('door'), locality: getVal('locality'), notes: getVal('notes'), status: 'activo', createdAt: serverTimestamp()
           });
           clientId = cRef.id;
        }

        const rawVigDesde = getVal('vigenciaDesde'); const rawVigHasta = getVal('vigenciaHasta');
        const vigDesde = parseDateStr(rawVigDesde) || new Date().toISOString().split('T')[0];
        const vigHasta = parseDateStr(rawVigHasta) || new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0];
        
        const pRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'policies'), {
           clientId, matricula, company: getVal('company') || 'Otra', vehicleType: getVal('vehicleType') || 'Auto', vigenciaDesde: vigDesde, vigenciaHasta: vigHasta, status: 'activa', createdAt: serverTimestamp()
        });

        const d1 = new Date(vigDesde); const d2 = new Date(vigHasta);
        let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
        if (d2.getDate() >= d1.getDate()) months++; months = Math.max(1, months);
        const monto = parseFloat(getVal('montoCuota')) || 0;

        for (let j = 0; j < months; j++) {
           const dueDate = new Date(vigDesde); dueDate.setMonth(dueDate.getMonth() + j);
           await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'installments'), {
              clientId, policyId: pRef.id, matricula, amount: monto, installmentNumber: j + 1, dueDate: dueDate.toISOString().split('T')[0], status: 'pendiente', createdAt: serverTimestamp()
           });
        }
        successCount++;
      } catch (e) { console.error("Error fila", i, e); }
      
      setImportProgress(Math.round(((i + 1) / total) * 100));
      await new Promise(r => setTimeout(r, 0)); 
    }
    setIsImporting(false); setCsvHeaders([]); setCsvData([]);
    logAction('Importación Masiva', `${successCount} vehículos importados`);
    showNotify(`Importación completada: ${successCount} vehículos procesados.`);
  };

  const handleEditClientSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'clients', selectedClient.id), {
        name: fd.get('name'), dni: fd.get('dni'), phone: fd.get('phone'), landline: fd.get('landline'), email: fd.get('email'), street: fd.get('street'), door: fd.get('door'), locality: fd.get('locality'), notes: fd.get('notes')
      });
      setIsEditClientOpen(false);
      logAction('Edición Cliente', `Modificó a ${fd.get('name')}`);
      showNotify('Cliente actualizado con éxito');
      setSelectedClient(prev => ({...prev, name: fd.get('name'), dni: fd.get('dni'), phone: fd.get('phone'), landline: fd.get('landline'), email: fd.get('email'), street: fd.get('street'), door: fd.get('door'), locality: fd.get('locality'), notes: fd.get('notes')}));
    } catch (error) { showNotify('Error al actualizar', 'error'); }
  };

  const handleRenewPolicySubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const vDesde = fd.get('vigenciaDesde');
    const vHasta = fd.get('vigenciaHasta');
    const monto = parseFloat(fd.get('montoCuota')) || 0;
    
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'policies', policyToRenew.id), {
        vigenciaDesde: vDesde, vigenciaHasta: vHasta, status: 'activa'
      });
      for (let i = 0; i < calculatedInstallments; i++) {
        const dueDate = new Date(vDesde); dueDate.setMonth(dueDate.getMonth() + i);
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'installments'), {
          clientId: policyToRenew.clientId, policyId: policyToRenew.id, matricula: policyToRenew.matricula, amount: monto, installmentNumber: i + 1, dueDate: dueDate.toISOString().split('T')[0], status: 'pendiente', createdAt: serverTimestamp()
        });
      }
      logAction('Renovación Póliza', `Renovó ${policyToRenew.matricula}`);
      setIsRenewOpen(false); setPolicyToRenew(null); setVigenciaDesde(''); setVigenciaHasta('');
      showNotify('Póliza renovada exitosamente.');
    } catch (err) { showNotify('Error al renovar', 'error'); }
  };

  const deleteClient = async (id) => {
    if (!window.confirm('¿Seguro quieres dar de baja a este cliente? Se ocultará de la lista activa.')) return;
    try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'clients', id), { status: 'baja' }); logAction('Baja Cliente', `ID: ${id}`); setIsDetailOpen(false); showNotify('Cliente dado de baja'); } catch (e) { showNotify('Error', 'error'); }
  };

  const toggleReminderDay = (day) => {
    let newDays = [...(agencySettings.reminderDays || [])];
    if (newDays.includes(day)) { newDays = newDays.filter(d => d !== day); } else { newDays.push(day); }
    setAgencySettings({...agencySettings, reminderDays: newDays.sort((a,b) => b-a)});
  };

  const handleFormat = (command) => {
    document.execCommand(command, false, null);
    if (editorRef.current) setBroadcastHtml(editorRef.current.innerHTML);
    editorRef.current?.focus();
  };

  const htmlToWhatsApp = (html) => {
    let text = html || '';
    text = text.replace(new RegExp('<br\\s*/?>', 'gi'), '\n');
    text = text.replace(new RegExp('</div>', 'gi'), '\n');
    text = text.replace(new RegExp('<div[^>]*>', 'gi'), '');
    text = text.replace(new RegExp('<(b|strong)[^>]*>(.*?)</\\1>', 'gi'), '*$2*');
    text = text.replace(new RegExp('<(i|em)[^>]*>(.*?)</\\1>', 'gi'), '_$2_');
    text = text.replace(new RegExp('<[^>]+>', 'g'), '');
    text = text.replace(/&nbsp;/g, ' ');
    return text.trim();
  };

  const handleApplyPreset = (idx) => {
    const p = designPresets[idx];
    setSelectedPreset(idx); setBroadcastBg(p.bg); setTitleColor(p.title); setTextColor(p.text); setSelectedTitleFont(p.titleFont); setSelectedTextFont(p.textFont); setBgEffect(p.effect);
  };

  const handleSendBroadcastText = () => {
    const parsedText = htmlToWhatsApp(broadcastHtml);
    const finalMsg = `*${broadcastTitle}*\n\n${parsedText}\n\n_${agencySettings.name}_`;
    const url = `https://wa.me/?text=${encodeURIComponent(finalMsg)}`;
    window.open(url, '_blank');
  };

  const handleMassBroadcast = () => {
    setIsAutomating(true);
    setTimeout(() => { setIsAutomating(false); showNotify(`Envío masivo simulado a ${clients.length} clientes`); }, 2500);
  };

  const confirmDuplicateAssignment = () => {
    if (!duplicateAlert) return;
    executeSavePolicy(duplicateAlert.formDataObj, duplicateAlert.existing.id);
    setDuplicateAlert(null);
  };

  // --- VISTAS EN FUNCIONES ---
  const renderDashboard = () => (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700 no-print">
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        <Card onClick={() => navigateToCobros('todos')} className="bg-white dark:bg-slate-800 border-none group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Clientes<br/>Activos</p><Users size={16} className="text-blue-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{clients.filter(c=>c.status!=='baja').length}</h3>
        </Card>
        <Card onClick={() => navigateToPolicies('')} className="bg-white dark:bg-slate-800 border-none group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Pólizas<br/>Vigentes</p><Car size={16} className="text-indigo-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">{dashMetrics.vigentes}</h3>
        </Card>
        <Card onClick={() => navigateToPolicies('')} className="bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30 group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-rose-500 uppercase tracking-widest leading-tight">Pólizas<br/>Vencidas</p><AlertCircle size={16} className="text-rose-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-rose-600">{dashMetrics.vencidas}</h3>
        </Card>
        <Card onClick={() => navigateToPolicies('')} className="bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-amber-600 uppercase tracking-widest leading-tight">Renovar<br/>Hoy</p><RefreshCcw size={16} className="text-amber-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-amber-600">{dashMetrics.renovarHoy}</h3>
        </Card>
        <Card onClick={() => navigateToCobros('sin_informar')} className="bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-900/30 group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-orange-600 uppercase tracking-widest leading-tight">Cupones<br/>Sin Informar</p><Clock size={16} className="text-orange-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-orange-600 animate-pulse">{dashMetrics.sinInformar}</h3>
        </Card>
        <Card onClick={() => navigateToPolicies('')} className="bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 group flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2"><p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-tight">Próximas<br/>Renov. (Mes)</p><CalendarDays size={16} className="text-emerald-500/40" /></div>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-600">{dashMetrics.proxRenov}</h3>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
         <Card className="h-fit">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-sm sm:text-md font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2"><Clock size={16} className="text-orange-500" /> Urgente: Sin Informar Pago</h4>
               <button onClick={() => navigateToCobros('sin_informar')} className="text-[10px] font-bold text-blue-600 uppercase">Ver Todos</button>
            </div>
            <div className="space-y-3">
               {processedInstallments.filter(i => i.computedStatus === 'sin_informar').slice(0, 5).map(inst => {
                  const client = clients.find(c => c.id === inst.clientId);
                  return (
                     <div key={inst.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-orange-200 dark:border-orange-900/50 shadow-sm">
                        <div className="flex items-center gap-3 w-full overflow-hidden">
                           <div className="w-10 h-8 shrink-0 rounded bg-slate-900 text-white flex items-center justify-center font-black text-[9px] uppercase">{inst.matricula}</div>
                           <div className="truncate pr-2">
                              <h5 className="font-bold text-slate-800 dark:text-white text-xs truncate">{client?.name}</h5>
                              <p className="text-[9px] text-orange-500 font-bold uppercase truncate">Venció el {inst.dueDate}</p>
                           </div>
                        </div>
                        <button onClick={() => sendWhatsApp(client, inst)} className="shrink-0 p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"><Send size={14} /></button>
                     </div>
                  );
               })}
               {processedInstallments.filter(i => i.computedStatus === 'sin_informar').length === 0 && <p className="text-center py-6 text-slate-400 text-xs italic">No hay cupones sin informar.</p>}
            </div>
         </Card>

         <Card className="h-fit">
            <div className="flex items-center justify-between mb-6">
               <h4 className="text-sm sm:text-md font-black text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2"><RefreshCcw size={16} className="text-indigo-500" /> A Renovar Hoy</h4>
               <button onClick={() => navigateToPolicies('')} className="text-[10px] font-bold text-blue-600 uppercase">Ver Pólizas</button>
            </div>
            <div className="space-y-3">
               {policies.filter(p => p.vigenciaHasta === todayStr && p.status === 'activa').map(p => {
                  const client = clients.find(c => c.id === p.clientId);
                  return (
                     <div key={p.id} className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                        <div className="truncate pr-2">
                           <p className="text-[10px] font-black text-indigo-900 dark:text-indigo-300 truncate">{p.matricula} • {p.company}</p>
                           <p className="text-[9px] text-slate-500 uppercase font-medium truncate">{client?.name}</p>
                        </div>
                        <button onClick={() => { setSelectedClient(client); setIsDetailOpen(true); }} className="text-[9px] font-bold text-indigo-600 uppercase bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg shadow-sm">Abrir Ficha</button>
                     </div>
                  )
               })}
               {policies.filter(p => p.vigenciaHasta === todayStr && p.status === 'activa').length === 0 && <p className="text-center py-6 text-slate-400 text-xs italic">No hay renovaciones urgentes hoy.</p>}
            </div>
         </Card>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 no-print">
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-center justify-between bg-white dark:bg-slate-800/50 p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input type="text" placeholder="Nombre, DNI o patente..." className="w-full pl-9 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-50 dark:bg-slate-900/50 border-none rounded-xl sm:rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500/10 dark:text-white font-medium outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 w-full md:w-auto justify-end">
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl sm:rounded-2xl p-1 mr-2 hidden sm:flex">
             <button onClick={() => setViewMode('grid')} className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
             <button onClick={() => setViewMode('list')} className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={16} /></button>
          </div>
          <button onClick={exportToExcel} className="p-2.5 sm:p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl sm:rounded-2xl shrink-0" title="Excel"><Download size={18} /></button>
          <button onClick={handlePrintAllClients} className="p-2.5 sm:p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl sm:rounded-2xl shrink-0" title="PDF"><Printer size={18} /></button>
          <button onClick={() => { setSelectedClientForPolicy(null); setModalOpen(true); }} className="flex-1 md:flex-none bg-slate-900 dark:bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-semibold flex items-center justify-center gap-2 text-xs sm:text-sm shadow-lg"><Plus size={16} /> Nuevo</button>
        </div>
      </div>

      {viewMode === 'grid' ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
           {filteredClients.map(client => {
             const clientPolicies = policies.filter(p => p.clientId === client.id);
             let statusAlert = false;
             for (let p of clientPolicies) { if (getCoverageStatus(p).label.includes('SIN COBERTURA')) statusAlert = true; }
             
             return (
               <Card key={client.id} onClick={() => { setSelectedClient(client); setIsDetailOpen(true); }} className={`relative group cursor-pointer hover:-translate-y-1 ${statusAlert ? 'border-rose-200 dark:border-rose-900/50' : ''}`}>
                 {statusAlert && <div className="absolute top-4 right-4 w-2 h-2 bg-rose-500 rounded-full animate-pulse" title="Atención requerida" />}
                 <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                   <div className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl sm:rounded-2xl flex items-center justify-center font-light text-sm sm:text-base transition-all duration-500 ${statusAlert ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white' : 'bg-slate-50 dark:bg-slate-900 text-slate-300 group-hover:bg-blue-600 group-hover:text-white'}`}>{client.name?.[0] || 'C'}</div>
                   <div className="truncate"><h4 className="text-xs sm:text-sm font-semibold dark:text-white truncate pr-4">{client.name}</h4><p className="text-[8px] sm:text-[9px] text-emerald-500 font-bold uppercase truncate">{client.phone}</p></div>
                 </div>
                 <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-50 dark:border-slate-700/50">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400">{clientPolicies.length} Unidades</span>
                    {client.lastNotified ? <span className="text-[8px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">Notif: {new Date(client.lastNotified).toLocaleDateString()}</span> : <span className="text-[8px] font-bold text-slate-300">Sin notificar</span>}
                 </div>
               </Card>
             );
           })}
         </div>
      ) : (
         <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Contacto</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Patentes</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado / Últ. Aviso</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredClients.map(client => {
                     const clientPolicies = policies.filter(p => p.clientId === client.id);
                     let hasAlert = false;
                     for (let p of clientPolicies) { if (getCoverageStatus(p).label.includes('SIN COBERTURA')) hasAlert = true; }
                     return (
                        <tr key={client.id} onClick={() => { setSelectedClient(client); setIsDetailOpen(true); }} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors">
                           <td className="p-4"><p className="text-sm font-semibold dark:text-white">{client.name}</p><p className="text-[9px] text-slate-400 uppercase">{client.dni}</p></td>
                           <td className="p-4"><p className="text-xs font-bold text-emerald-600 dark:text-emerald-500">{client.phone}</p></td>
                           <td className="p-4"><div className="flex flex-wrap gap-1">{clientPolicies.map(p=><span key={p.id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded text-[9px] font-black uppercase">{p.matricula}</span>)}</div></td>
                           <td className="p-4">
                             <div className="flex flex-col gap-1">
                               {hasAlert ? <span className="text-[10px] font-bold text-rose-500 animate-pulse">REVISAR POLIZAS</span> : <span className="text-[10px] font-bold text-emerald-500">AL DÍA</span>}
                               {client.lastNotified && <span className="text-[8px] text-slate-400 font-medium italic">Aviso: {new Date(client.lastNotified).toLocaleDateString()}</span>}
                             </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );

  const renderCobros = () => (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-500 no-print">
      <div className="bg-white dark:bg-slate-800/50 p-4 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 dark:border-slate-700 flex flex-col gap-4">
         <div className="flex flex-col md:flex-row gap-3 items-center justify-between w-full">
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 w-full md:w-auto overflow-x-auto scrollbar-hide">
               {['todos', 'pendientes', 'pagados', 'vencidos', 'sin_informar'].map(f => (
                 <button key={f} onClick={() => setCobrosFilter(f)} className={`px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black uppercase whitespace-nowrap transition-all ${cobrosFilter === f ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>{f.replace('_', ' ')}</button>
               ))}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
               <div className="relative flex-1 md:w-64">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                 <input type="text" placeholder="Buscar patente o cliente..." className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border-none rounded-xl text-xs focus:ring-2 focus:ring-blue-500/20 dark:text-white font-medium outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
               <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1 shrink-0 hidden sm:flex">
                  <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={14} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><List size={14} /></button>
               </div>
            </div>
         </div>
      </div>

      {viewMode === 'grid' ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredInstallments.map(inst => {
              const client = clients.find(c => c.id === inst.clientId);
              return (
                <Card key={inst.id} className={`border-l-4 ${inst.computedStatus === 'sin_informar' ? 'border-l-orange-500 bg-orange-50/30 dark:bg-orange-900/10' : inst.status === 'pagado' ? 'border-l-emerald-500' : inst.status === 'vencido' ? 'border-l-rose-500' : 'border-l-blue-500'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded tracking-widest">{inst.matricula}</span>
                    <Badge status={inst.computedStatus} />
                  </div>
                  <p className="text-sm font-bold dark:text-white mb-1 truncate">{client?.name || 'Cliente'}</p>
                  <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                    <span>Cuota {inst.installmentNumber}</span>
                    <span>Vence: <span className="text-slate-800 dark:text-slate-200">{inst.dueDate}</span></span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap justify-between items-center gap-2">
                    <span className="text-md font-black text-slate-900 dark:text-white">${inst.amount.toLocaleString()}</span>
                    <div className="flex gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl">
                       <button onClick={() => updateInstallmentStatus(inst, 'pagado')} className={`px-2 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${inst.status === 'pagado' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-500'}`}>Pagado</button>
                       <button onClick={() => updateInstallmentStatus(inst, 'pendiente')} className={`px-2 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${inst.status === 'pendiente' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-amber-500'}`}>Pend.</button>
                       <button onClick={() => updateInstallmentStatus(inst, 'vencido')} className={`px-2 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${inst.status === 'vencido' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-rose-500'}`}>Venc.</button>
                    </div>
                  </div>
                </Card>
              );
            })}
         </div>
      ) : (
         <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/20">
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Patente / Cliente</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Detalle</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Monto</th>
                     <th className="p-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Estado / Acción</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredInstallments.map(inst => {
                     const client = clients.find(c => c.id === inst.clientId);
                     return (
                        <tr key={inst.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                           <td className="p-4"><p className="text-xs font-black dark:text-white uppercase">{inst.matricula}</p><p className="text-[10px] text-slate-500 font-medium truncate w-32">{client?.name}</p></td>
                           <td className="p-4"><p className="text-[10px] font-bold text-slate-600 dark:text-slate-300">Cuota {inst.installmentNumber}</p><p className="text-[9px] text-slate-400 uppercase font-medium">Vence: {inst.dueDate}</p></td>
                           <td className="p-4"><p className="text-sm font-bold text-slate-800 dark:text-white">${inst.amount.toLocaleString()}</p></td>
                           <td className="p-4">
                              <div className="flex items-center gap-3">
                                 <Badge status={inst.computedStatus} />
                                 <div className="flex gap-1 border border-slate-100 dark:border-slate-700 p-0.5 rounded-lg">
                                    <button onClick={() => updateInstallmentStatus(inst, 'pagado')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${inst.status === 'pagado' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-emerald-500'}`}>P</button>
                                    <button onClick={() => updateInstallmentStatus(inst, 'vencido')} className={`px-2 py-1 rounded text-[8px] font-black uppercase transition-all ${inst.status === 'vencido' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-rose-500'}`}>V</button>
                                 </div>
                              </div>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );

  const renderSettings = () => {
    const selectedMappingValues = Object.values(csvMapping).filter(Boolean);

    return (
      <div className="max-w-3xl mx-auto space-y-2 animate-in fade-in duration-500 no-print">
        <div className="flex items-center gap-3 sm:gap-4 mb-6">
          <div className="p-2 sm:p-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl sm:rounded-2xl"><Settings size={20} /></div>
          <div><h2 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Ajustes</h2><p className="text-[10px] sm:text-xs text-slate-400 font-medium">Configuraciones centralizadas y auditoría.</p></div>
        </div>

        <AccordionItem 
          title="Datos Empresa" icon={Palette} isOpen={openSettingsTab === 'identidad'} 
          onToggle={() => setOpenSettingsTab(openSettingsTab === 'identidad' ? null : 'identidad')}
          onSave={() => { setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'agency'), agencySettings); logAction('Ajustes', 'Datos Empresa'); showNotify('Datos guardados'); }}
        >
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Nombre Agencia</label><input value={agencySettings.name} onChange={e=>setAgencySettings({...agencySettings, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-medium text-xs dark:text-white border border-slate-100 dark:border-slate-700" /></div>
              <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">WhatsApp Oficial</label><input value={agencySettings.phone} onChange={e=>setAgencySettings({...agencySettings, phone: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-medium text-xs dark:text-white border border-slate-100 dark:border-slate-700" /></div>
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Logo URL o Archivo (PNG/JPG)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input value={agencySettings.logo} onChange={e=>setAgencySettings({...agencySettings, logo: e.target.value})} className="flex-1 w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-medium text-xs dark:text-white border border-slate-100 dark:border-slate-700" placeholder="" />
                  <input ref={logoInputRef} type="file" accept="image/png,image/jpeg" onChange={handleAgencyLogoUpload} className="hidden" />
                  <button type="button" onClick={() => logoInputRef.current?.click()} className="px-4 py-3 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{isUploadingLogo ? 'Subiendo...' : 'Subir JPG/PNG'}</button>
                </div>
                <p className="mt-2 text-[10px] font-medium text-slate-400">Tamaño recomendado para logo: 512x512 px, fondo transparente.</p>
              </div>
           </div>
        </AccordionItem>

        <AccordionItem 
          title="Motor de Avisos (WhatsApp)" icon={MessageSquare} isOpen={openSettingsTab === 'avisos'} 
          onToggle={() => setOpenSettingsTab(openSettingsTab === 'avisos' ? null : 'avisos')}
          onSave={() => { setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'agency'), agencySettings); logAction('Ajustes', 'Motor de Avisos'); showNotify('Avisos guardados'); }}
        >
           <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Modo Avisos Cuotas</p>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl">{['auto', 'manual', 'off'].map(mode => (<button key={mode} onClick={() => setAgencySettings({...agencySettings, installmentNotifyMode: mode})} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${agencySettings.installmentNotifyMode === mode ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>{mode}</button>))}</div>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Modo Avisos Pólizas</p>
                    <div className="grid grid-cols-3 gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl">{['auto', 'manual', 'off'].map(mode => (<button key={mode} onClick={() => setAgencySettings({...agencySettings, policyNotifyMode: mode})} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${agencySettings.policyNotifyMode === mode ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-slate-400'}`}>{mode}</button>))}</div>
                 </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-3">Cronograma de Disparadores</p>
                 <div className="flex flex-wrap gap-2 mb-4">
                    {[7, 5, 3, 2, 1, 0].map(day => (<button key={day} onClick={() => toggleReminderDay(day)} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${agencySettings.reminderDays?.includes(day) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-700'}`}>{day === 0 ? 'Hoy' : day === 1 ? 'Mañana' : `${day} d antes`}</button>))}
                 </div>
                 <div className="flex items-center gap-4"><label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hora de envío:</label><input type="time" value={agencySettings.notifyHour} onChange={(e) => setAgencySettings({...agencySettings, notifyHour: e.target.value})} className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none dark:text-white text-xs font-bold" /></div>
              </div>
           </div>
        </AccordionItem>

        <AccordionItem 
          title="Importación Excel / CSV" icon={Database} isOpen={openSettingsTab === 'import'} 
          onToggle={() => setOpenSettingsTab(openSettingsTab === 'import' ? null : 'import')}
        >
           {!csvHeaders.length ? (
              <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-3xl p-8 text-center bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-all cursor-pointer">
                 <input type="file" accept=".csv" onChange={handleCsvUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                 <UploadCloud size={24} className="mx-auto text-blue-500 mb-2" />
                 <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Toca para subir archivo .CSV</p>
              </div>
           ) : (
              <div className="space-y-4">
                 {isImporting && <div className="w-full h-1.5 bg-blue-600 progress-bar-striped transition-all rounded-full mb-2" style={{ width: `${importProgress}%` }}></div>}
                 <div className="flex justify-between items-center"><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Mapeo de Columnas</p><button onClick={() => { setCsvHeaders([]); setCsvData([]); setImportProgress(0); }} className="text-[9px] font-bold text-rose-500 uppercase">Cancelar</button></div>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-48 overflow-y-auto pr-2 scrollbar-hide">
                    {[{field:'name',label:'Razón Social'},{field:'matricula',label:'Patente'},{field:'dni',label:'DNI'},{field:'phone',label:'Celular'}].map(m => (
                       <div key={m.field}>
                          <label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{m.label}</label>
                          <select value={csvMapping[m.field]||''} onChange={e=>handleCsvMappingChange(m.field, e.target.value)} className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 outline-none dark:text-white">
                             <option value="">- Ignorar -</option>
                             {csvHeaders.map(h => {
                                 const isUsed = selectedMappingValues.includes(h) && csvMapping[m.field] !== h;
                                 return <option key={h} value={h} disabled={isUsed} className={isUsed ? 'text-slate-300 italic' : ''}>{h}</option>;
                              })}
                          </select>
                       </div>
                    ))}
                 </div>
                 <button onClick={executeCsvImport} disabled={isImporting} className="w-full py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl disabled:opacity-50">{isImporting ? `Procesando (${importProgress}%)` : 'Importar Datos'}</button>
              </div>
           )}
        </AccordionItem>

        {(appUser?.permissions?.manageUsers || appUser?.role === 'admin') && (
           <AccordionItem 
              title="Auditoría y Roles" icon={History} isOpen={openSettingsTab === 'audit'} 
              onToggle={() => setOpenSettingsTab(openSettingsTab === 'audit' ? null : 'audit')}
           >
              <div className="space-y-4">
                 <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-900/10 space-y-3">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Crear Usuario</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input value={newUserForm.name} onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Nombre visible" className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white" />
                      <input value={newUserForm.user} onChange={(e) => setNewUserForm(prev => ({ ...prev, user: e.target.value }))} placeholder="Usuario" className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white" />
                      <input value={newUserForm.pass} onChange={(e) => setNewUserForm(prev => ({ ...prev, pass: e.target.value }))} placeholder="Contraseña" className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white" />
                      <select value={newUserForm.role} onChange={(e) => handleRoleChangeForNewUser(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white">
                        <option value="agent">Agente</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        ['dashboard', 'Inicio'],
                        ['clients', 'Clientes'],
                        ['vencimientos', 'Cobros'],
                        ['settings', 'Ajustes'],
                        ['announcements', 'Anuncios'],
                        ['manageUsers', 'Usuarios']
                      ].map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 text-[10px] font-bold uppercase text-slate-500">
                          <input type="checkbox" checked={Boolean(newUserForm.permissions[key])} onChange={() => handleNewPermissionToggle(key)} />
                          {label}
                        </label>
                      ))}
                    </div>
                    <button type="button" onClick={createManagedUser} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest">Crear Usuario</button>
                 </div>

                 <div className="space-y-2">
                   {managedUsers.map(u => (
                     <div key={u.id} className="p-3 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="text-xs font-black dark:text-white uppercase">{u.user}</p>
                            <p className="text-[9px] text-slate-500">{u.name} · {u.role}</p>
                          </div>
                          <button type="button" onClick={() => toggleManagedUserStatus(u)} className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${u.status === 'inactive' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {u.status === 'inactive' ? 'Bloqueado' : 'Activo'}
                          </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            ['dashboard', 'Inicio'],
                            ['clients', 'Clientes'],
                            ['vencimientos', 'Cobros'],
                            ['settings', 'Ajustes'],
                            ['announcements', 'Anuncios'],
                            ['manageUsers', 'Usuarios']
                          ].map(([key, label]) => {
                            const permissions = normalizePermissions(u.role, u.permissions);
                            return (
                              <label key={`${u.id}-${key}`} className="flex items-center gap-2 text-[9px] font-bold uppercase text-slate-500">
                                <input type="checkbox" checked={Boolean(permissions[key])} onChange={() => toggleManagedUserPermission(u, key)} />
                                {label}
                              </label>
                            );
                          })}
                        </div>
                     </div>
                   ))}
                   {managedUsers.length === 0 && <p className="text-xs text-slate-400 italic">No hay usuarios creados por el administrador.</p>}
                 </div>

                 <div className="flex items-center justify-between mb-4"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registro de Actividad</p><span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded">Solo Admin</span></div>
                 <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                    {auditLogs.map(log => (
                       <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-start">
                          <div>
                             <p className="text-xs font-bold dark:text-white">{log.action}</p>
                             <p className="text-[9px] text-slate-500 font-medium mt-0.5">{log.details}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Por {log.user} ({log.role})</p>
                          </div>
                          <p className="text-[8px] font-bold text-slate-400">{new Date(log.timestamp).toLocaleString()}</p>
                       </div>
                    ))}
                    {auditLogs.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No hay registros aún.</p>}
                 </div>
              </div>
           </AccordionItem>
        )}
      </div>
    );
  };
  
  // --- INICIO APP / RUTAS ---
  if (!hasFirebaseConfig) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-8 space-y-4">
          <h2 className="text-xl font-black uppercase tracking-wide">Configura Firebase para iniciar Se-Flow</h2>
          <p className="text-sm text-slate-300">La pantalla en blanco aparece cuando faltan credenciales. Carga tus variables en <code className="bg-slate-800 px-1 py-0.5 rounded">.env</code> y reinicia la app.</p>
          <pre className="text-xs bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-x-auto text-emerald-300">
{`VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_APP_ID=se-flow`}
          </pre>
        </div>
      </div>
    );
  }

  if (!appUser) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 flex items-center justify-center p-4">
         <Card className="w-full max-w-md p-8 sm:p-10 text-center border-t-4 border-t-blue-600">
            <div className="w-16 h-16 bg-slate-900 dark:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"><ShieldCheck className="text-white" size={32} /></div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter mb-1">Se-Flow</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Acceso al Sistema</p>
            <form onSubmit={handleLogin} className="space-y-4 text-left">
               <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Usuario</label><input required value={loginForm.user} onChange={e=>setLoginForm({...loginForm, user: e.target.value})} className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-medium text-sm dark:text-white border border-slate-100 dark:border-slate-800" /></div>
               <div><label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contraseña</label><input required type="password" value={loginForm.pass} onChange={e=>setLoginForm({...loginForm, pass: e.target.value})} className="w-full mt-1 px-4 py-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none font-medium text-sm dark:text-white border border-slate-100 dark:border-slate-800" /></div>
               {loginError && <p className="text-rose-500 text-[10px] font-bold text-center animate-pulse">{loginError}</p>}
               <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all mt-4">Ingresar</button>
               {!isInstalled && (
                 <button type="button" onClick={handleInstallApp} disabled={isInstalling} className="w-full py-3 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/20 hover:-translate-y-1 transition-all disabled:opacity-50">
                   {isInstalling ? 'Instalando...' : 'Instalar'}
                 </button>
               )}
               {!isInstalled && !canInstall && (
                 <p className="text-[10px] text-slate-400 text-center">Si no aparece el instalador automático, usa el menú del navegador.</p>
               )}
            </form>
         </Card>
      </div>
    );
  }

  return (
    <div className="app-shell safe-x safe-bottom bg-[#FDFDFD] dark:bg-slate-950 flex font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-500 w-full">
      {isSidebarOpen && <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-in fade-in" onClick={() => setSidebarOpen(false)}></div>}

      <aside className={`safe-top safe-bottom fixed inset-y-0 left-0 z-50 w-[80%] max-w-[280px] lg:max-w-none lg:w-72 bg-white dark:bg-slate-900 border-r border-slate-50 dark:border-slate-800 transform transition-transform duration-500 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} no-print flex flex-col`}>
        <div className="p-6 lg:p-8 flex flex-col h-full overflow-y-auto scrollbar-hide">
          <div className="flex items-center gap-3 sm:gap-4 mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 bg-slate-900 dark:bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
              {agencySettings.logo ? <img src={agencySettings.logo} alt="Logo empresa" className="w-full h-full object-contain p-1 bg-white" /> : <ShieldCheck className="text-white" size={20} />}
            </div>
            <div className="leading-tight">
              <h1 className="text-base sm:text-lg font-semibold tracking-tighter uppercase dark:text-white">{agencySettings.name?.trim() || 'SE-FLOW'}</h1>
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Se-Flow</span>
            </div>
          </div>
          
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-8 flex items-center gap-3 border border-slate-100 dark:border-slate-700/50">
             <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs uppercase shrink-0">{appUser.name[0]}</div>
             <div className="overflow-hidden"><p className="text-[11px] font-black uppercase text-slate-800 dark:text-white truncate">{appUser.role === 'admin' ? 'ADMIN' : 'AGENTE'}</p></div>
          </div>

          <nav className="flex-1 space-y-1 sm:space-y-2">
            {[ { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' }, { id: 'clients', icon: Users, label: 'Clientes' }, { id: 'vencimientos', icon: CalendarDays, label: 'Cobros' }, { id: 'settings', icon: Settings, label: 'Ajustes' } ].filter(item => allowedTabs.includes(item.id)).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs font-semibold transition-all ${activeTab === item.id ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-white'}`}>
                <item.icon size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-40'} /> {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-2">
            <button onClick={() => setIsInfoOpen(v => !v)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isInfoOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
              <Info size={14} /> Info
            </button>
            {isInfoOpen && (
              <p className="mt-2 px-4 text-[10px] leading-relaxed text-slate-400">
                Desarrollado por Mauro Polini. WhatsApp: +54 9 3735500082.
              </p>
            )}
          </div>
          {appUser?.permissions?.announcements !== false && (
            <div className="mt-4 mb-4">
               <button onClick={() => setIsBroadcastOpen(true)} className="w-full flex items-center justify-center gap-2 sm:gap-3 px-4 py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] sm:rounded-[2.5rem] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"><Megaphone size={16} className="animate-pulse shrink-0" /> Anuncios</button>
            </div>
          )}
          <button onClick={() => { setAppUser(null); logAction('Cierre Sesión', 'Salió del sistema'); }} className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/5 transition-all mt-auto"><LogOut size={16} /> Cerrar Sesión</button>
        </div>
      </aside>

      <div className="app-viewport flex-1 flex flex-col relative no-print w-full max-w-full overflow-x-hidden">
        <header className="safe-top min-h-16 sm:min-h-20 bg-white/50 dark:bg-slate-950/50 backdrop-blur-3xl border-b border-slate-50 dark:border-slate-900 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4"><button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 sm:p-2.5 text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-lg sm:rounded-xl"><Menu size={18} /></button><h2 className="text-sm sm:text-md font-semibold text-slate-800 dark:text-white tracking-tight">{tabTitles[activeTab] || 'Inicio'}</h2></div>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl sm:rounded-2xl">
            {[ { id: 'light', icon: Sun }, { id: 'dark', icon: Moon }, ...(isMobileInput ? [{ id: 'system', icon: Monitor }] : []) ].map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)} className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl transition-all ${theme === t.id ? 'bg-white dark:bg-slate-800 shadow-sm text-blue-600' : 'text-slate-400'}`}><t.icon size={14} /></button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 scroll-smooth w-full">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-slate-900 dark:border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[8px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">Sincronizando Sistema</p>
            </div>
          ) : syncError ? (
            <div className="max-w-xl mx-auto bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-2xl p-6">
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300 mb-2">Error de sincronización</p>
              <p className="text-xs text-rose-600 dark:text-rose-200">{syncError}</p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && renderDashboard()}
              {activeTab === 'clients' && renderClients()}
              {activeTab === 'settings' && renderSettings()}
              {activeTab === 'vencimientos' && renderCobros()}
            </>
          )}
        </div>
      </div>

      {/* NOTIFICACIONES Y ALERTAS */}
      {notification && (
        <div className={`fixed top-6 right-6 z-[200] px-6 py-4 rounded-3xl shadow-2xl animate-in slide-in-from-right-8 duration-500 flex items-center gap-3 font-medium text-xs border ${notification.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-100 dark:border-slate-700'} no-print`}>
          <div className={`p-1.5 rounded-lg ${notification.type === 'error' ? 'bg-rose-100' : 'bg-emerald-100 text-emerald-600'}`}>
            {notification.type === 'error' ? <X size={14} /> : <CheckCircle size={14} />}
          </div>
          {notification.msg}
        </div>
      )}

      {duplicateAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm animate-in fade-in" onClick={() => setDuplicateAlert(null)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in p-8 text-center border border-amber-200 dark:border-amber-900/50">
             <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/20"><AlertCircle size={40} /></div>
             <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Cliente Existente</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">El DNI <b>{duplicateAlert.formDataObj.dni}</b> ya se encuentra registrado a nombre de <b>{duplicateAlert.existing.name}</b>. ¿Deseas agregar esta nueva póliza a su cuenta existente para evitar duplicados?</p>
             <div className="flex flex-col gap-3">
                <button type="button" onClick={confirmDuplicateAssignment} className="w-full py-4 rounded-2xl bg-amber-500 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs hover:-translate-y-1 transition-all shadow-lg shadow-amber-500/30">Sí, asignar a este cliente</button>
                <button type="button" onClick={() => setDuplicateAlert(null)} className="w-full py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px] sm:text-xs hover:bg-slate-200 transition-all">Cancelar y corregir</button>
             </div>
          </div>
        </div>
      )}

      {/* MODAL ALTA/EDICIÓN COMPLETO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-2 sm:p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 flex flex-col max-h-[95vh]">
            <div className="p-5 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-white tracking-tight">Registro de Póliza</h3>
                <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-1">Configuración de cobertura</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-300 hover:text-slate-600 p-1.5 sm:p-2"><X size={18} className="sm:w-5 sm:h-5" /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateClientAndPolicy} className="p-5 sm:p-8 overflow-y-auto flex-1">
              {!selectedClientForPolicy && (
                <div className="mb-6 sm:mb-8">
                  <h4 className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 border-b border-blue-100 pb-2">1. Titular</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="md:col-span-2"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Razón Social / Nombre y Apellido (*)</label><input required name="name" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium transition-all" /></div>
                    <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">DNI / CUIT (*)</label><input required name="dni" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                    <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Email</label><input name="email" type="email" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                    <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Celular (WhatsApp)</label><input name="phone" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                    <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Teléfono Fijo</label><input name="landline" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                    <div className="md:col-span-2 grid grid-cols-3 gap-4 sm:gap-6">
                       <div className="col-span-2 sm:col-span-1"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Calle</label><input name="street" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                       <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Puerta</label><input name="door" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                       <div className="col-span-3 sm:col-span-1"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Localidad</label><input name="locality" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium" /></div>
                    </div>
                    <div className="md:col-span-2"><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Observaciones</label><textarea name="notes" rows="2" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-xs sm:text-sm font-medium resize-none" /></div>
                  </div>
                </div>
              )}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-[9px] sm:text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 border-b border-indigo-100 pb-2">2. Vehículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Tipo</label>
                    <select required name="vehicleType" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white text-xs sm:text-sm font-medium">
                      <option value="Auto">Automóvil</option><option value="Pick Up">Pick Up</option><option value="Moto">Motocicleta</option><option value="Camión">Camión</option>
                    </select>
                  </div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Matrícula (*)</label><input required name="matricula" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-900 text-white border-none rounded-xl sm:rounded-2xl outline-none font-black text-sm sm:text-md uppercase tracking-widest" placeholder="AE 123 ZZ" /></div>
                  <div className="md:col-span-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Compañía</label>
                    <select name="company" className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white text-xs sm:text-sm font-medium">
                      <option value="San Cristóbal">San Cristóbal</option><option value="Rivadavia">Rivadavia</option><option value="Federación Pat.">Federación Patronal</option><option value="Sancor">Sancor</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <h4 className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 border-b border-emerald-100 pb-2">3. Vigencia y Cuotas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Desde (*)</label><input required name="vigenciaDesde" type="date" value={vigenciaDesde} onChange={(e) => setVigenciaDesde(e.target.value)} className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-xs sm:text-sm font-medium" /></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Hasta (*)</label><input required name="vigenciaHasta" type="date" value={vigenciaHasta} onChange={(e) => setVigenciaHasta(e.target.value)} className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-xs sm:text-sm font-medium" /></div>
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 p-3 sm:p-4 rounded-xl sm:rounded-2xl flex flex-col justify-center border border-emerald-100"><p className="text-[8px] sm:text-[9px] font-black text-emerald-600 uppercase mb-1">Duración Detectada</p><p className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">{calculatedInstallments} Cuotas</p></div>
                  <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Monto Cuota</label><div className="relative"><DollarSign className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} /><input required name="montoCuota" type="number" step="0.01" className="w-full pl-9 sm:pl-10 pr-4 sm:pr-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-xs sm:text-sm font-medium" /></div></div>
                </div>
              </div>
              <div className="mb-6 sm:mb-8">
                <h4 className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] mb-4 sm:mb-6 border-b border-rose-100 pb-2">4. Documentos e Inspección</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                   <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">Link de Pago (MercadoPago/Aseguradora)</label><input type="text" value={policyLink} onChange={(e) => setPolicyLink(e.target.value)} placeholder="https://..." className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-xs sm:text-sm font-medium" /></div>
                   <div><label className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase mb-1.5 sm:mb-2 block tracking-widest">URL Póliza PDF</label><input type="text" value={policyPdf} onChange={(e) => setPolicyPdf(e.target.value)} placeholder="https://..." className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-xs sm:text-sm font-medium" /></div>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col sm:flex-row gap-3">
                     <div className="relative flex-1 group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input type="text" value={tempPhotoUrl} onChange={(e) => setTempPhotoUrl(e.target.value)} placeholder="Pegar URL de foto..." className="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl sm:rounded-2xl outline-none dark:text-white text-sm font-medium transition-all" />
                     </div>
                     <button type="button" onClick={addPhotoUrl} className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-6 py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase shadow-sm active:scale-95 transition-all">Sumar URL</button>
                     <div className="relative w-full sm:w-auto">
                        <input type="file" accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleImageUpload} />
                        <button type="button" className="w-full h-full bg-rose-500 text-white px-6 py-4 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase shadow-lg shadow-rose-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"><Camera size={16} /> Capturar / Subir</button>
                     </div>
                   </div>
                   <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {policyPhotos.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                           <img src={url} className="w-full h-full object-cover" alt="Inspección" />
                           <button type="button" onClick={() => removePhoto(i)} className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg shadow-md"><Trash2 size={12} /></button>
                        </div>
                      ))}
                      {policyPhotos.length === 0 && <div className="col-span-full py-6 text-center text-slate-400 text-xs italic bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">No hay fotos de inspección.</div>}
                   </div>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-black py-4 sm:py-5 rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl hover:-translate-y-1 active:scale-95 transition-all text-xs sm:text-sm uppercase tracking-widest">Finalizar Alta</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL STUDIO CREATIVO TOTALMENTE RESPONSIVE */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-2 sm:p-4 overflow-hidden no-print">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in" onClick={() => setIsBroadcastOpen(false)}></div>
          <div className="relative bg-[#FDFDFD] dark:bg-slate-900 w-full max-w-6xl rounded-[2rem] sm:rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 flex flex-col lg:flex-row h-[92vh] max-h-[92vh]">
             <div className="p-4 sm:p-6 lg:p-6 flex-1 overflow-y-auto lg:overflow-y-hidden bg-white dark:bg-slate-900 scrollbar-hide lg:border-r border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                   <div>
                     <h3 className="text-lg sm:text-xl font-semibold dark:text-white tracking-tight flex items-center gap-2"><Palette className="text-blue-500" size={20} /> Anuncios Rápidos</h3>
                     <p className="text-[10px] sm:text-xs text-slate-400 font-medium mt-1">Marketing y Comunicados</p>
                   </div>
                   <button onClick={() => setIsBroadcastOpen(false)} className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-800"><X size={18} /></button>
                </div>

                <div className="space-y-4 sm:space-y-5">
                   <div>
                      <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 sm:mb-3 block">Estilos Predefinidos</label>
                      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-2 scrollbar-hide">
                         {designPresets.map((p, i) => (
                            <button key={i} onClick={() => handleApplyPreset(i)} className={`shrink-0 flex flex-col items-center gap-1 sm:gap-2 group`}>
                               <div style={{ background: p.bg }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border-2 transition-all ${selectedPreset === i ? 'border-blue-500 scale-105 shadow-xl shadow-blue-500/20' : 'border-transparent opacity-70 group-hover:opacity-100'}`} />
                               <span className="text-[8px] sm:text-[9px] font-bold text-slate-500 uppercase">{p.name}</span>
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3 sm:space-y-4">
                      <div className="p-4 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl space-y-3 sm:space-y-3 border border-slate-100 dark:border-slate-700/50">
                         <div className="flex items-center justify-between">
                           <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block">Título</label>
                           <input type="color" value={titleColor} onChange={(e) => setTitleColor(e.target.value)} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-none cursor-pointer bg-transparent" />
                         </div>
                         <input value={broadcastTitle} onChange={(e) => setBroadcastTitle(e.target.value)} className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 outline-none focus:border-blue-500 dark:text-white font-bold text-base sm:text-lg pb-1 sm:pb-2 transition-colors" />
                         
                         <div className="flex items-center justify-between pt-2">
                           <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mensaje</label>
                           <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-none cursor-pointer bg-transparent" />
                         </div>
                         
                         <div className="border border-slate-200 dark:border-slate-700 rounded-xl sm:rounded-2xl overflow-hidden bg-white dark:bg-slate-800">
                            <div className="flex gap-1 p-1 border-b border-slate-100 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50">
                               <button type="button" onMouseDown={(e) => { e.preventDefault(); handleFormat('bold'); }} className="p-1.5 sm:p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"><Bold size={14}/></button>
                               <button type="button" onMouseDown={(e) => { e.preventDefault(); handleFormat('italic'); }} className="p-1.5 sm:p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"><Italic size={14}/></button>
                            </div>
                            <div 
                               ref={editorRef}
                               contentEditable
                               suppressContentEditableWarning={true}
                               onInput={(e) => setBroadcastHtml(e.currentTarget.innerHTML)}
                               className="w-full h-24 sm:h-24 p-3 sm:p-4 outline-none text-xs sm:text-sm editable-container text-slate-800 dark:text-slate-200 overflow-y-auto"
                               dangerouslySetInnerHTML={{ __html: initialBroadcastHtml.current }}
                            />
                         </div>
                      </div>
                   </div>

                   <div className="p-4 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-700/50 space-y-3">
                      <label className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest block flex items-center gap-2"><LinkIcon size={12} /> Banner Auspiciante</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                           type="text" 
                           value={sponsorImage} 
                           onChange={(e) => setSponsorImage(e.target.value)} 
                           placeholder="URL de imagen externa" 
                           className="flex-1 w-full px-3 py-2 sm:px-4 sm:py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 dark:text-white text-[10px] sm:text-xs transition-all" 
                        />
                        <input ref={sponsorInputRef} type="file" accept="image/png,image/jpeg" onChange={handleSponsorImageUpload} className="hidden" />
                        <button type="button" onClick={() => sponsorInputRef.current?.click()} className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{isUploadingSponsor ? 'Subiendo...' : 'Subir JPG/PNG'}</button>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">Recomendado: 1080x1080 px (o 1080x1350 px) para mejor calidad.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl">
                         <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase block mb-1 sm:mb-2">Fuente Título</span>
                         <select value={selectedTitleFont} onChange={(e) => setSelectedTitleFont(e.target.value)} className="w-full bg-transparent text-[10px] sm:text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer">
                            <option value="Inter">Moderna</option><option value="Playfair Display">Elegante</option><option value="Oswald">Fuerte</option><option value="Montserrat">Limpia</option>
                         </select>
                      </div>
                      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl">
                         <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase block mb-1 sm:mb-2">Fuente Texto</span>
                         <select value={selectedTextFont} onChange={(e) => setSelectedTextFont(e.target.value)} className="w-full bg-transparent text-[10px] sm:text-xs font-bold text-slate-800 dark:text-white outline-none cursor-pointer">
                            <option value="Inter">Moderna</option><option value="Georgia">Clásica</option><option value="Montserrat">Limpia</option>
                         </select>
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl sm:rounded-2xl">
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase">Resaltar con Sombras</span>
                      <button type="button" onClick={() => setHasShadow(!hasShadow)} className={`w-8 h-5 sm:w-10 sm:h-6 rounded-full transition-colors relative ${hasShadow ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                         <div className={`absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-all ${hasShadow ? 'right-0.5 sm:right-1' : 'left-0.5 sm:left-1'}`} />
                      </button>
                   </div>
                </div>
             </div>

             <div className="bg-slate-100 dark:bg-slate-950 p-4 sm:p-6 lg:p-10 flex flex-col items-center justify-center lg:w-[45%] relative border-t lg:border-t-0 border-slate-200 dark:border-slate-800">
                <div className="w-full max-w-xs sm:max-w-sm flex gap-2 sm:gap-3 mb-4 sm:mb-6 shrink-0">
                   <button onClick={handleMassBroadcast} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-3 bg-blue-600 text-white font-black rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all shadow-blue-500/20">
                      <Users size={14} className="sm:w-4 sm:h-4" /> Envío Masivo
                   </button>
                   <button onClick={handleSendBroadcastText} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-3 bg-emerald-600 text-white font-black rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all shadow-emerald-500/20">
                      <MessageSquare size={14} className="sm:w-4 sm:h-4" /> Texto WA
                   </button>
                   <button onClick={() => window.print()} className="flex-1 flex flex-col items-center justify-center gap-1 py-2 sm:py-3 bg-slate-900 text-white font-black rounded-xl sm:rounded-2xl text-[8px] sm:text-[9px] uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all">
                      <Download size={14} className="sm:w-4 sm:h-4" /> Flyer
                   </button>
                </div>

                <div 
                  id="broadcast-story"
                  style={{ background: broadcastBg }}
                  className="aspect-[9/16] w-[200px] sm:w-full sm:max-w-[280px] rounded-[2rem] sm:rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center text-center border-2 sm:border-4 border-slate-900 dark:border-black shrink-0"
                >
                   {bgEffect === 'blobs' && <><div className="bg-blob-1" /><div className="bg-blob-2" /></>}
                   {bgEffect === 'glow' && <div className="bg-glow" />}
                   {bgEffect === 'gold-glow' && <div className="bg-gold-glow" />}

                   <div className="relative z-10 w-full h-full flex flex-col p-4 sm:p-8 justify-center">
                       <div className="absolute top-6 sm:top-10 left-0 w-full flex flex-col items-center gap-2 sm:gap-3">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20 shadow-xl">
                             {agencySettings.logo ? <img src={agencySettings.logo} className="w-6 h-6 sm:w-8 sm:h-8 object-contain brightness-0 invert" /> : <ShieldCheck className="text-white" size={20} />}
                          </div>
                          <p className="text-[7px] sm:text-[9px] font-black text-white/50 uppercase tracking-[0.4em]">{agencySettings.name}</p>
                       </div>

                       <div className={`space-y-4 sm:space-y-6 w-full ${hasShadow ? 'drop-shadow-2xl' : ''}`}>
                          <h4 style={{ color: titleColor, fontFamily: selectedTitleFont }} className="text-xl sm:text-3xl font-bold leading-tight">{broadcastTitle}</h4>
                          <div 
                             style={{ color: textColor, fontFamily: selectedTextFont }} 
                             className="text-xs sm:text-md leading-relaxed opacity-95 editable-container"
                             dangerouslySetInnerHTML={{ __html: broadcastHtml }}
                          />
                       </div>

                       {sponsorImage && (
                          <div className="mt-4 sm:mt-8 rounded-xl sm:rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black/20 backdrop-blur-sm p-1.5 sm:p-2">
                             <img src={sponsorImage} alt="Sponsor" className="w-full h-16 sm:h-24 object-contain rounded-lg sm:rounded-xl" />
                          </div>
                       )}

                       <div className="absolute bottom-6 sm:bottom-10 left-0 w-full flex flex-col items-center opacity-40">
                          <div className="w-6 sm:w-8 h-1 bg-white/50 rounded-full mb-1.5 sm:mb-2"></div>
                          <p className="text-[6px] sm:text-[8px] font-bold text-white uppercase tracking-[0.2em]">{agencySettings.phone || 'Tu Asesor Experto'}</p>
                       </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* MODAL DETALLE Y FICHA CLIENTE RESPONSIVE */}
      {isDetailOpen && selectedClient && (
        <div className="fixed inset-0 z-[110] flex justify-end no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDetailOpen(false)}></div>
          <div className="relative bg-[#FDFDFD] dark:bg-slate-900 w-full md:max-w-3xl h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500 p-6 sm:p-10 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10 shrink-0">
               <div className="flex items-center gap-4">
                  <button onClick={() => setIsDetailOpen(false)} className="p-2 sm:p-3 bg-slate-50 dark:bg-slate-800 rounded-xl sm:rounded-2xl text-slate-400 hover:text-slate-800"><ArrowLeft size={18} className="sm:w-5 sm:h-5" /></button>
                  <label className="flex items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                     <input type="checkbox" checked={printWithPhotos} onChange={(e) => setPrintWithPhotos(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3 h-3 sm:w-4 sm:h-4" />
                     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Incluir fotos PDF</span>
                  </label>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => { setIsEditClientOpen(true); setIsDetailOpen(false); }} className="p-2 sm:p-3 bg-amber-50 text-amber-600 rounded-xl sm:rounded-2xl hover:bg-amber-100" title="Editar Contacto"><Edit2 size={16} className="sm:w-4 sm:h-4" /></button>
                 <button onClick={() => setPrintType('single')} className="p-2 sm:p-3 bg-blue-50 text-blue-600 rounded-xl sm:rounded-2xl hover:bg-blue-100 flex items-center gap-1 sm:gap-2 font-bold text-[10px] sm:text-xs"><Printer size={16} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Exportar Ficha</span></button>
                 <button onClick={() => deleteClient(selectedClient.id)} className="p-2 sm:p-3 bg-rose-50 text-rose-600 rounded-xl sm:rounded-2xl hover:bg-rose-100" title="Dar de baja"><Trash2 size={16} className="sm:w-5 sm:h-5" /></button>
               </div>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 shrink-0">
               <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-blue-600 flex items-center justify-center text-2xl sm:text-3xl font-light text-white shadow-xl shadow-blue-500/20 shrink-0">{selectedClient.name[0]}</div>
               <div>
                 <h3 className="text-xl sm:text-2xl font-semibold dark:text-white leading-tight">{selectedClient.name}</h3>
                 <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1 uppercase tracking-widest">{selectedClient.dni || 'Sin DNI'}</p>
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-12 shrink-0">
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700/50"><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Celular / WA</p><p className="text-xs sm:text-sm font-semibold dark:text-white truncate">{selectedClient.phone}</p></div>
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700/50"><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Fijo</p><p className="text-xs sm:text-sm font-semibold dark:text-white truncate">{selectedClient.landline || '-'}</p></div>
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700/50"><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Email</p><p className="text-xs sm:text-sm font-semibold dark:text-white truncate">{selectedClient.email || '-'}</p></div>
               <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-50 dark:border-slate-700/50 md:col-span-3"><p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Dirección</p><p className="text-xs sm:text-sm font-semibold dark:text-white">{`${selectedClient.street || ''} ${selectedClient.door || ''}`.trim() || '-'} {selectedClient.locality ? `- ${selectedClient.locality}` : ''}</p></div>
               
               {selectedClient.notes && (
                  <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl border border-amber-100 dark:border-amber-500/20 md:col-span-3">
                     <p className="text-[9px] sm:text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1 sm:mb-2">Observaciones</p>
                     <p className="text-xs sm:text-sm font-medium text-amber-900 dark:text-amber-200">{selectedClient.notes}</p>
                  </div>
               )}
            </div>

            <div className="space-y-4 sm:space-y-6 flex-1">
               <div className="flex items-center justify-between px-1 sm:px-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Pólizas Vinculadas</h4>
                  <button onClick={() => { setSelectedClientForPolicy(selectedClient); setModalOpen(true); setIsDetailOpen(false); }} className="text-[9px] sm:text-[10px] font-black text-blue-600 uppercase bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">+ Añadir Vehículo</button>
               </div>
               {policies.filter(p => p.clientId === selectedClient.id).map(p => {
                 const statusBadge = getCoverageStatus(p);
                 return (
                 <Card key={p.id} className={`relative overflow-hidden ${statusBadge.label.includes('SIN COBERTURA') ? 'border-rose-200 dark:border-rose-900' : ''}`}>
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-4">
                       <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-12 h-9 sm:w-14 sm:h-10 rounded bg-slate-900 flex flex-col items-center justify-center text-white border border-slate-700 font-black text-[9px] sm:text-[10px] uppercase">{p.matricula}</div>
                          <div>
                            <p className="text-xs sm:text-sm font-bold dark:text-white leading-none mb-1.5">{p.company} • {p.vehicleType}</p>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold tracking-wider ${statusBadge.style}`}>{statusBadge.label}</span>
                          </div>
                       </div>
                       <div className="flex gap-1.5 sm:gap-2 self-end sm:self-auto">
                          <button onClick={() => { setPolicyToRenew(p); setVigenciaDesde(p.vigenciaHasta); setIsRenewOpen(true); setIsDetailOpen(false); }} className="p-1.5 sm:p-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 transition-colors" title="Renovar Póliza"><RefreshCcw size={14} /></button>
                          <button onClick={() => { updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'policies', p.id), { status: 'no_renovada' }); logAction('Póliza No Renovada', p.matricula); }} className="p-1.5 sm:p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 transition-colors" title="Marcar No Renovada"><AlertCircle size={14} /></button>
                          <button onClick={() => { updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'policies', p.id), { status: 'baja' }); logAction('Póliza Dada de Baja', p.matricula); }} className="p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-500 hover:text-rose-500 transition-colors" title="Dar de baja"><Ban size={14} /></button>
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl mb-4">
                       <div><p className="text-[9px] font-bold text-slate-400 uppercase">Inicio</p><p className="text-xs font-semibold dark:text-white">{p.vigenciaDesde}</p></div>
                       <div><p className="text-[9px] font-bold text-slate-400 uppercase">Vencimiento</p><p className="text-xs font-semibold dark:text-white">{p.vigenciaHasta}</p></div>
                       <div className="col-span-2">
                          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Documentos (Póliza / Pago)</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="URL PDF Póliza" 
                              defaultValue={p.pdfPóliza || ''}
                              onBlur={(e) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'policies', p.id), { pdfPóliza: e.target.value })}
                              className="w-full bg-white dark:bg-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 outline-none" 
                            />
                            <input 
                              type="text" 
                              placeholder="Link Cupones de Pago" 
                              defaultValue={p.linkPago || ''}
                              onBlur={(e) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'policies', p.id), { linkPago: e.target.value })}
                              className="w-full bg-white dark:bg-slate-800 text-[10px] px-2 py-1.5 rounded border border-slate-200 dark:border-slate-700 outline-none" 
                            />
                          </div>
                       </div>
                    </div>
                 </Card>
               )})}
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE RENOVACIÓN DE PÓLIZA ESPECÍFICA */}
      {isRenewOpen && policyToRenew && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsRenewOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Renovar Póliza</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Vehículo: {policyToRenew.matricula} ({policyToRenew.company})</p>
              </div>
              <button onClick={() => setIsRenewOpen(false)} className="text-slate-300 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleRenewPolicySubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Desde</label><input required name="vigenciaDesde" type="date" value={vigenciaDesde} onChange={(e) => setVigenciaDesde(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Hasta</label><input required name="vigenciaHasta" type="date" value={vigenciaHasta} onChange={(e) => setVigenciaHasta(e.target.value)} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl flex flex-col justify-center border border-emerald-100"><p className="text-[9px] font-black text-emerald-600 uppercase mb-1">Duración Detectada</p><p className="text-lg font-black text-emerald-700 dark:text-emerald-400">{calculatedInstallments} Cuotas</p></div>
                <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Monto Cuota Actualizado</label><div className="relative"><DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} /><input required name="montoCuota" type="number" step="0.01" className="w-full pl-10 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div></div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-sm uppercase tracking-widest">Confirmar Renovación</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL EDICIÓN CLIENTE */}
      {isEditClientOpen && selectedClient && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 no-print">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditClientOpen(false)}></div>
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
              <div><h3 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">Editar Contacto</h3><p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Los cambios se guardarán con tu usuario ({appUser.name})</p></div>
              <button onClick={() => setIsEditClientOpen(false)} className="text-slate-300 hover:text-slate-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleEditClientSubmit} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Razón Social / Nombre</label><input required name="name" defaultValue={selectedClient.name} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">DNI / CUIT</label><input required name="dni" defaultValue={selectedClient.dni} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Email</label><input name="email" defaultValue={selectedClient.email} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Celular (WA)</label><input required name="phone" defaultValue={selectedClient.phone} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Fijo</label><input name="landline" defaultValue={selectedClient.landline} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div className="col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Calle</label><input name="street" defaultValue={selectedClient.street} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                    <div><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Nro/Puerta</label><input name="door" defaultValue={selectedClient.door} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                    <div className="col-span-3"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Localidad</label><input name="locality" defaultValue={selectedClient.locality} className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium" /></div>
                 </div>
                 <div className="md:col-span-2"><label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-widest">Observaciones</label><textarea name="notes" defaultValue={selectedClient.notes} rows="2" className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none dark:text-white text-sm font-medium resize-none" /></div>
              </div>
              <button type="submit" className="w-full mt-6 bg-amber-500 text-white font-black py-4 rounded-[2rem] shadow-xl hover:-translate-y-1 active:scale-95 transition-all text-xs uppercase tracking-widest">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* FICHA IMPRIMIBLE INDIVIDUAL (OCULTA EN PANTALLA) */}
      {printType === 'single' && selectedClient && (
        <div className="print-only w-full">
           <div className="flex items-center justify-between border-b-2 border-slate-900 pb-6 mb-8">
              <div className="flex items-center gap-4">
                 {agencySettings.logo && <img src={agencySettings.logo} className="h-12 w-12 object-contain" alt="Logo" />}
                 <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter">{agencySettings.name}</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ficha Técnica del Cliente</p>
                 </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold uppercase">Fecha de Emisión</p>
                 <p className="text-sm font-black">{new Date().toLocaleDateString()}</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-8 mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div>
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Datos del Titular</h2>
                 <p className="text-lg font-bold text-slate-900">{selectedClient.name}</p>
                 <p className="text-sm text-slate-600 font-medium mt-1">DNI/CUIT: {selectedClient.dni}</p>
                 <p className="text-sm text-slate-600 font-medium mt-1">Dirección: {`${selectedClient.street || ''} ${selectedClient.door || ''}`.trim() || '-'} {selectedClient.locality ? `(${selectedClient.locality})` : ''}</p>
              </div>
              <div>
                 <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Información de Contacto</h2>
                 <p className="text-sm text-slate-900 font-bold">Celular: {selectedClient.phone}</p>
                 <p className="text-sm text-slate-900 font-bold mt-1">Fijo: {selectedClient.landline || '-'}</p>
                 <p className="text-sm text-slate-600 mt-1">{selectedClient.email || 'Email no registrado'}</p>
              </div>
              {selectedClient.notes && (
                 <div className="col-span-2 mt-4 pt-4 border-t border-slate-200">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Observaciones</h2>
                    <p className="text-sm text-slate-700 italic">{selectedClient.notes}</p>
                 </div>
              )}
           </div>

           <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 border-b pb-2">Patentes y Coberturas Asociadas</h2>
           <div className="space-y-6">
              {policies.filter(p => p.clientId === selectedClient.id).map(p => {
                const badgeInfo = getCoverageStatus(p);
                return (
                <div key={p.id} className="border-2 border-slate-100 rounded-3xl p-6 break-inside-avoid">
                   <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                         <div className="px-4 py-2 bg-slate-900 text-white rounded-lg font-black text-lg tracking-widest uppercase">{p.matricula}</div>
                         <div className="font-bold text-[10px] uppercase text-slate-500">{badgeInfo.label}</div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black uppercase text-slate-400">Compañía</p>
                         <p className="text-md font-bold">{p.company}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-6">
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Vehículo</p><p className="text-sm font-semibold">{p.vehicleType}</p></div>
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Inicio Vigencia</p><p className="text-sm font-semibold">{p.vigenciaDesde}</p></div>
                      <div><p className="text-[9px] font-bold text-slate-400 uppercase">Fin Vigencia</p><p className="text-sm font-semibold">{p.vigenciaHasta}</p></div>
                   </div>
                   
                   {printWithPhotos && p.photos && p.photos.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                         <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Inspección Fotográfica</h3>
                         <div className="grid grid-cols-4 gap-4">
                            {p.photos.map((ph, idx) => (
                               <img key={idx} src={ph} className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm" alt="Inspección" />
                            ))}
                         </div>
                      </div>
                   )}
                </div>
              )})}
           </div>
        </div>
      )}
    </div>
  );
}
