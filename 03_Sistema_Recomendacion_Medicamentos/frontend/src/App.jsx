import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Search, Pill, AlertCircle, Info, Star, 
  Database, ShieldCheck, Microscope, ArrowUpRight,
  ChevronDown, BrainCircuit, HeartPulse, Zap, Activity
} from 'lucide-react';

const API_URL = 'http://localhost:8001';

const App = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [conditions, setConditions] = useState([]);
  
  const [systemStats, setSystemStats] = useState({ cpu: 12, mem: 38, latency: 12 });

  useEffect(() => {
    const fetchConditions = async () => {
      try {
        const response = await axios.get(`${API_URL}/conditions`);
        setConditions(response.data);
      } catch (err) {
        console.error("Conexión con el Servidor Tricell no disponible.");
      }
    };
    fetchConditions();

    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.floor(Math.random() * 8) + 10,
        mem: Math.floor(Math.random() * 3) + 36,
        latency: Math.floor(Math.random() * 5) + 8
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/recommend`, {
        user_input: query,
        top_n: 8
      });
      setResults(response.data);
      // Desplazamiento suave hacia los resultados
      setTimeout(() => {
        window.scrollTo({ top: 600, behavior: 'smooth' });
      }, 500);
    } catch (err) {
      setError("Autenticación fallida: El Mainframe de Tricell rechaza la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const TricellLogo = ({ className }) => (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polygon points="46,12 46,46 15,64 6,40 25,8" fill="#1b3f1e" />
        <polygon points="54,12 54,46 85,64 94,40 75,8" fill="#afe6e6" />
        <polygon points="20,73 50,55 80,73 65,95 35,95" fill="#10b981" />
      </svg>
      <div className="absolute inset-0 bg-[#10b981]/10 blur-[24px] rounded-full -z-10"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050705] text-[#e2e8f0] pb-24">
      {/* CABECERA UNIFICADA */}
      <header className="glass-header sticky top-0 z-50 px-10 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <TricellLogo className="w-9 h-9 transition-transform group-hover:rotate-12 duration-500" />
            <div>
              <h1 className="text-sm font-black tracking-[0.5em] text-white opacity-90 leading-tight">TRICELL</h1>
              <p className="text-[8px] font-mono text-[#10b981] tracking-[0.2em] uppercase opacity-60">Pharmaceutics .INC</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-12 text-[9px] font-mono tracking-widest text-slate-500 uppercase">
             <div className="flex items-center gap-2 group hover:text-[#10b981] transition-all">
                <ShieldCheck size={12} className="text-[#1b3f1e] group-hover:text-[#10b981]" /> Cifrado Bio-Seguro
             </div>
             <div className="flex items-center gap-6">
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></span> CPU: {systemStats.cpu}%</span>
                <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#06b6d4] rounded-full animate-pulse animation-delay-500"></span> LATENCY: {systemStats.latency}ms</span>
             </div>
          </div>

          <button className="px-5 py-2 glass-card rounded-full text-[9px] font-mono uppercase tracking-[0.3em] hover:text-[#10b981] transition-all">
             Protocolo MedRec
          </button>
        </div>
      </header>

      {/* SECCIÓN HERO Y BÚSQUEDA FLUIDA */}
      <section className="page-container py-32 flex flex-col items-center">
         <div className="animate-reveal text-center">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#1b3f1e]/10 border border-[#1b3f1e]/40 rounded-full mb-10">
               <BrainCircuit size={14} className="text-[#10b981]" />
               <span className="text-[9px] font-mono text-[#10b981] uppercase tracking-[0.4em]">Algoritmo de Terapéutica Predictiva</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tighter leading-[0.95] max-w-4xl mx-auto uppercase">
               Análisis de Compuestos <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4]">Biotecnológicos</span>
            </h2>
            <p className="text-sm font-light text-slate-500 max-w-xl mx-auto tracking-widest uppercase leading-loose border-l border-[#1b3f1e] pl-6 mt-6">
              El mainframe analiza en tiempo real condiciones clínicas y experiencias farmacológicas para derivar tratamientos de alta precisión genética.
            </p>
         </div>

         {/* Barra de Búsqueda Majestuosa */}
         <div className="w-full max-w-3xl mt-24 animate-reveal animation-delay-300">
            <form onSubmit={handleSearch} className="relative group input-glow">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Escanee un síntoma o diagnóstico clínico..."
                className="w-full bg-[#0a0c0a]/60 border border-[#1b3f1e] py-6 px-16 text-xl font-light tracking-[0.05em] text-[#afe6e6] rounded-full backdrop-blur-xl outline-none focus:border-[#10b981]/50 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)] placeholder:opacity-20 flex-1"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1b3f1e] group-focus-within:text-[#10b981] transition-all" size={28} />
              <button 
                type="submit"
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#1b3f1e]/40 hover:bg-[#10b981] p-3.5 rounded-full text-[#10b981] hover:text-black transition-all border border-[#1b3f1e]/50 disabled:opacity-30 active:scale-95 shadow-xl shadow-black/20"
              >
                {loading ? <Activity className="animate-spin" size={20} /> : <Zap size={20} />}
              </button>
            </form>

            {/* Chips de acceso rápido */}
            <div className="flex flex-wrap justify-center gap-4 mt-12 opacity-40 hover:opacity-100 transition-opacity">
              {conditions.slice(0, 6).map(cond => (
                <button 
                  key={cond} 
                  onClick={() => { setQuery(cond); handleSearch(); }}
                  className="px-5 py-2 glass-card rounded-full text-[9px] font-mono tracking-widest text-slate-400 hover:text-[#10b981] transition-all uppercase"
                >
                  {cond}
                </button>
              ))}
            </div>
         </div>
         
         {!results.length && !loading && (
           <div className="mt-20 animate-bounce transition-opacity opacity-20">
              <ChevronDown size={32} className="text-[#10b981]" />
           </div>
         )}
      </section>

      {/* SECCIÓN DE RESULTADOS (CUADRÍCULA ELEGANTE) */}
      <section id="results" className="page-container py-20 min-h-screen">
         {error && (
            <div className="max-w-2xl mx-auto p-6 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-500 font-mono text-[10px] tracking-widest text-center uppercase mb-16 shadow-2xl">
               [ALERTA NIVEL 04] {error}
            </div>
         )}

         {loading && (
            <div className="text-center py-40">
               <div className="w-16 h-16 border-t-2 border-r-2 border-[#10b981] rounded-full animate-spin mx-auto mb-10"></div>
               <p className="text-[11px] font-mono text-slate-500 tracking-[0.5em] uppercase opacity-50">Sincronizando con Mainframe Tricell...</p>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((drug, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-[40px] p-10 flex flex-col h-[400px] animate-reveal"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex justify-between items-start mb-10">
                   <div className="p-4 bg-[#1b3f1e]/10 border border-[#1b3f1e]/30 rounded-3xl text-[#10b981]">
                      <Pill size={28} />
                   </div>
                   <div className="flex items-center gap-2 bg-[#10b981]/5 px-3 py-1 rounded-full border border-[#10b981]/10">
                      <span className="text-2xl font-black text-[#10b981]">{drug.rating}</span>
                      <Star size={16} fill="#10b981" stroke="none" />
                   </div>
                </div>

                <div className="flex-1">
                   <h3 className="text-2xl font-black text-white leading-none mb-3 tracking-tighter uppercase">{drug.drugName}</h3>
                   <div className="text-[9px] font-mono text-[#afe6e6]/50 tracking-[0.2em] uppercase mb-8">Compuesto Farmacológico TRC-{idx + 104}</div>
                   <p className="text-slate-400 text-xs leading-relaxed font-light opacity-90 border-l border-[#1b3f1e] pl-6 overflow-hidden h-24 italic">
                      "{drug.review}"
                   </p>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-mono text-[#10b981]/60 uppercase tracking-widest">{drug.condition}</span>
                   <button className="text-white/40 hover:text-[#10b981] transition-all"><ArrowUpRight size={18} /></button>
                </div>
              </div>
            ))}
         </div>

         {!results.length && !loading && (
            <div className="flex flex-col items-center py-40 opacity-10">
               <HeartPulse size={64} className="mb-10 text-[#10b981]" />
               <p className="text-xs font-mono tracking-widest uppercase">Protocolo MedRec en reposo</p>
            </div>
         )}
      </section>

      {/* PIE DE PÁGINA PROFESIONAL (AVISO MÉDICO) */}
      <footer className="page-container mt-20">
         <div className="glass-card rounded-[40px] p-10 flex flex-col md:flex-row items-center gap-10">
            <div className="p-4 bg-red-500/10 rounded-3xl text-red-500 border border-red-500/20">
               <AlertCircle size={28} />
            </div>
            <div className="flex-1">
               <div className="flex items-center gap-3 mb-3">
                  <h4 className="text-[10px] font-mono font-bold text-red-500 tracking-[0.3em] uppercase">Tricell Biosafety Compliance</h4>
                  <div className="h-px bg-red-500/30 flex-1"></div>
               </div>
               <p className="text-[11px] text-slate-500 font-mono leading-relaxed uppercase pr-10">
                 Este sistema automatizado es para fines demostrativos de ingeniería de datos. El uso indebido de los datos farmacológicos presentados sin supervisión de un médico certificado de Tricell (Nivel 4+) está prohibido. Verifique siempre con sus autoridades sanitarias locales antes de cualquier intervención biogenética.
               </p>
            </div>
            <div className="flex items-center gap-6 opacity-30 text-xs grayscale">
               <TricellLogo className="w-10 h-10" />
            </div>
         </div>
      </footer>
    </div>
  );
};

export default App;
