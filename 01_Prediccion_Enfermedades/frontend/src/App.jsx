import React, { useState } from 'react';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    radius_mean: 13.5,
    texture_mean: 14.3,
    perimeter_mean: 87.4,
    area_mean: 566.3,
    smoothness_mean: 0.09
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handlePrediction = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/predecir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error("El servidor no responde");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Conexión perdida con la Mainframe Central.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0b] text-slate-100 flex items-center justify-center p-6 font-sans selection:bg-[#88e31a]/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1b3f1e]/30 blur-[130px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#afe6e6]/5 blur-[130px]"></div>
      </div>

      <div className="max-w-xl w-full">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex items-center justify-center p-5 bg-black/50 rounded-full ring-1 ring-[#88e31a]/20 mb-2 shadow-[0_0_40px_rgba(136,227,26,0.1)]">
            <svg 
              className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top-Left Dark Green Pentagon */}
              <polygon points="46,12 46,46 15,64 6,40 25,8" fill="#1b3f1e" />
              {/* Top-Right Light Cyan Pentagon */}
              <polygon points="54,12 54,46 85,64 94,40 75,8" fill="#afe6e6" />
              {/* Bottom Lime Green Pentagon */}
              <polygon points="20,73 50,55 80,73 65,95 35,95" fill="#88e31a" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(136,227,26,0.2)]">
            TRICELL <span className="text-2xl tracking-[0.1em] text-[#afe6e6] opacity-80">.INC</span>
          </h1>
          <p className="text-[#88e31a] text-[10px] font-mono tracking-[0.2em] uppercase mt-1 opacity-80">
            Dpto. Oncología - Diagnóstico Predictivo Celular
          </p>
        </div>

        <div className="bg-[#0f1711]/80 backdrop-blur-xl border border-[#1b3f1e] rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative overflow-hidden group transition-all duration-500">
          
          <div className="absolute top-0 w-full h-1 left-0 bg-gradient-to-r from-[#1b3f1e] via-[#88e31a] to-[#afe6e6] opacity-20"></div>

          <div className="space-y-6">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 text-[#afe6e6] opacity-80 font-mono tracking-widest border-b border-[#1b3f1e] pb-2 mb-2 text-xs uppercase flex items-center justify-between">
                <span>&gt; Parámetros Morfológicos (Tejido)</span>
                <span className="text-[#88e31a] animate-pulse">● EN LÍNEA</span>
              </div>
              
              <div className="bg-[#0a0f0b] rounded-xl p-3 border border-[#1b3f1e] focus-within:border-[#88e31a] transition-colors">
                <label className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 block">Radius-M</label>
                <input 
                  type="number" step="0.1" name="radius_mean"
                  value={formData.radius_mean} onChange={handleChange}
                  className="w-full bg-transparent text-[#afe6e6] font-mono outline-none"
                />
              </div>
              <div className="bg-[#0a0f0b] rounded-xl p-3 border border-[#1b3f1e] focus-within:border-[#88e31a] transition-colors">
                <label className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 block">Texture-M</label>
                <input 
                  type="number" step="0.1" name="texture_mean"
                  value={formData.texture_mean} onChange={handleChange}
                  className="w-full bg-transparent text-[#afe6e6] font-mono outline-none"
                />
              </div>
              <div className="bg-[#0a0f0b] rounded-xl p-3 border border-[#1b3f1e] focus-within:border-[#88e31a] transition-colors">
                <label className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 block">Perim-M</label>
                <input 
                  type="number" step="0.1" name="perimeter_mean"
                  value={formData.perimeter_mean} onChange={handleChange}
                  className="w-full bg-transparent text-[#afe6e6] font-mono outline-none"
                />
              </div>
              <div className="bg-[#0a0f0b] rounded-xl p-3 border border-[#1b3f1e] focus-within:border-[#88e31a] transition-colors">
                <label className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 block">Area-M</label>
                <input 
                  type="number" step="0.1" name="area_mean"
                  value={formData.area_mean} onChange={handleChange}
                  className="w-full bg-transparent text-[#afe6e6] font-mono outline-none"
                />
              </div>
              <div className="bg-[#0a0f0b] rounded-xl p-3 border border-[#1b3f1e] focus-within:border-[#88e31a] transition-colors col-span-2 sm:col-span-1">
                <label className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mb-1 block">Smooth-M</label>
                <input 
                  type="number" step="0.01" name="smoothness_mean"
                  value={formData.smoothness_mean} onChange={handleChange}
                  className="w-full bg-transparent text-[#afe6e6] font-mono outline-none"
                />
              </div>
            </div>

            <button 
              onClick={handlePrediction}
              disabled={loading}
              className="w-full relative mt-4 py-4 px-6 bg-[#0a0f0b] hover:bg-[#1b3f1e]/40 border border-[#88e31a]/40 text-[#88e31a] rounded-xl font-mono tracking-widest uppercase font-bold text-sm shadow-[0_0_20px_rgba(136,227,26,0.15)] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden group"
            >
              <div className="absolute inset-0 bg-[#88e31a]/5 translate-y-full hover:-translate-y-full transition-transform duration-500 ease-in-out"></div>
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-[#88e31a] border-t-transparent rounded-full animate-spin"></div>
                  Procesando Random Forest...
                </span>
              ) : (
                "Ejecutar Diagnóstico Clínico IA"
              )}
            </button>

            {error && (
              <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl text-red-500 text-xs font-mono tracking-widest uppercase text-center mt-4">
                [ ERROR CRÍTICO ] {error}
              </div>
            )}

            <div className={`transition-all duration-700 ease-out overflow-hidden ${result ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              {result && (
                <div className={`p-6 border rounded-xl relative ${result.status === 'safe' ? 'bg-[#1b3f1e]/30 border-[#88e31a]/40' : 'bg-red-950/50 border-red-500/50'}`}>
                  <div className={`absolute top-0 left-0 w-1 h-full rounded-l-xl ${result.status === 'safe' ? 'bg-[#88e31a]' : 'bg-red-500 shadow-[0_0_15px_red]'}`}></div>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className={`font-mono text-[10px] tracking-widest uppercase mb-1 ${result.status === 'safe' ? 'text-[#afe6e6]' : 'text-red-400'}`}>Reporte Clínico</p>
                      <h3 className={`text-2xl font-bold mb-2 uppercase tracking-[0.2em] font-mono ${result.status === 'safe' ? 'text-white' : 'text-red-500 drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]'}`}>
                        {result.status === 'safe' ? 'TUMOR BENIGNO' : 'TUMOR MALIGNO'}
                      </h3>
                      <p className="text-slate-400 text-xs font-mono pr-4">
                        {result.status === 'safe' 
                          ? 'Morfología celular estable. Probabilidad casi nula de diseminación cancerígena (No-Oncológico).' 
                          : '¡ALERTA! Elevada irregularidad y densidad. Alta probabilidad oncológica. Se recomienda derivación para biopsia urgente.'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] uppercase font-mono tracking-wider mb-1">Confianza</p>
                      <div className={`inline-block font-mono font-bold px-3 py-1 rounded-md border text-sm ${result.status === 'safe' ? 'bg-[#88e31a]/10 text-[#88e31a] border-[#88e31a]/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                        {result.confidence}%
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
