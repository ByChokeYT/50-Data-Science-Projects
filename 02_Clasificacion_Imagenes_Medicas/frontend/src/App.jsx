import React, { useState, useEffect } from 'react';

// Componente para el Recuadro de Enfoque (ROI)
const DiagnosticOverlay = ({ show, status, anatomy }) => {
  if (!show || status !== 'danger') return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center animate-in fade-in duration-700">
      {/* Simulation of a localized finding */}
      <div className="relative w-48 h-48 border-2 border-red-500/60 rounded-sm shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-[pulse-fast_1.5s_infinite_ease-in-out]">
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t-2 border-l-2 border-red-400"></div>
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t-2 border-r-2 border-red-400"></div>
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-2 border-l-2 border-red-400"></div>
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-2 border-r-2 border-red-400"></div>
        
        <div className="absolute -top-10 left-0 flex flex-col items-start">
          <span className="bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-tighter animate-[flicker_2s_infinite] border border-red-400/50">
            [ ALERTA: ANOMALÍA DETECTADA ]
          </span>
          <span className="bg-black/80 text-red-400 text-[6px] font-mono mt-1 px-1 py-0.5 uppercase border border-red-900/50">
            Región: {anatomy || "SISTEMA"} // Protocolo V2.1
          </span>
        </div>

        <div className="absolute top-1/2 left-[-15px] right-[-15px] h-[1px] bg-red-500/40"></div>
        <div className="absolute left-1/2 top-[-15px] bottom-[-15px] w-[1px] bg-red-500/40"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div>
      </div>
    </div>
  );
};

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showROI, setShowROI] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setShowROI(false);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setShowROI(false);
  };

  const handleAnalysis = async () => {
    if (!selectedFile) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    setShowROI(false);
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
      const response = await fetch('http://127.0.0.1:8002/analizar_placa', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error("Fallo en enlace Mainframe.");
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setResult(data);
      if (data.status === 'danger') {
        setTimeout(() => setShowROI(true), 1200);
      }
    } catch (err) {
      setError(err.message === 'Failed to fetch' ? "Pérdida de señal con el Núcleo." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a110d] text-slate-100 flex flex-col items-center justify-center p-6 font-sans selection:bg-[#88e31a]/30 relative overflow-hidden">
      
      {/* Background visual elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#1b3f1e]/30 blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      <div className="max-w-6xl w-full z-10 flex flex-col items-center">
        
        {/* Header V2.1 */}
        <div className="text-center mb-10 space-y-4 animate-in fade-in slide-in-from-top duration-1000">
          <div className="inline-flex items-center justify-center p-6 bg-black/80 rounded-full ring-2 ring-[#88e31a]/20 mb-2 shadow-[0_0_60px_rgba(136,227,26,0.15)] relative scale-90 sm:scale-100">
            <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <polygon points="46,12 46,46 15,64 6,40 25,8" fill="#1b3f1e" />
              <polygon points="54,12 54,46 85,64 94,40 75,8" fill="#afe6e6" />
              <polygon points="20,73 50,55 80,73 65,95 35,95" fill="#88e31a" />
            </svg>
            <div className="absolute -bottom-1 bg-[#88e31a] text-black text-[7px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(136,227,26,0.5)] uppercase">
               BIOMED-CLIP V2.1
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-[0.3em] text-white drop-shadow-[0_0_25px_rgba(136,227,26,0.2)]">
            <span className="inline-block">TRICELL</span> <span className="text-2xl tracking-[0.1em] text-[#afe6e6] opacity-70 font-light inline-block">.MEDICAL</span>
          </h1>
          <p className="text-[#88e31a]/80 text-[10px] font-mono tracking-[0.4em] uppercase mt-1">
             <span className="inline-block">Centro de Diagnóstico por Imágenes de Alta Fidelidad</span>
          </p>
        </div>

        {/* Global Modality Bar */}
        <div className="hidden sm:flex gap-4 mb-10 w-full max-w-5xl justify-center items-center opacity-60">
           {["X-RAY", "MRI", "CT", "PATHOLOGY"].map(m => (
             <div key={m} className="px-4 py-1 border border-white/5 rounded-full text-[8px] font-mono tracking-[0.2em] flex items-center gap-2">
               <div className="w-1 h-1 bg-[#88e31a] rounded-full animate-pulse"></div>
               <span>{m}</span>
             </div>
           ))}
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full max-w-5xl">
          
          {/* Scanning Zone */}
          <div className="space-y-6">
            <div className="bg-[#0f1711]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-7 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group h-full flex flex-col">
              <div className="absolute top-0 w-full h-[1px] left-0 bg-gradient-to-r from-transparent via-[#88e31a]/20 to-transparent"></div>
              
              <div className="mb-4 text-[#afe6e6]/60 font-mono tracking-widest text-[9px] uppercase flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                  <span>TERMINAL_ID: LIMA-HUB-01</span>
                </span>
                <span className="text-[#88e31a] animate-pulse">● PROTOCOLO_ACTIVO</span>
              </div>

              <div className={`flex-1 relative border border-white/5 rounded-[2rem] overflow-hidden bg-black/60 flex items-center justify-center transition-all duration-700 ${previewUrl ? 'shadow-[inset_0_0_40px_black]' : 'border-dashed hover:border-[#88e31a]/20'}`}>
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer p-10 text-center group/label">
                    <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-6 group-hover/label:border-[#88e31a]/40 group-hover/label:scale-105 transition-all duration-700">
                      <svg className="w-10 h-10 text-[#88e31a]/40 group-hover:text-[#88e31a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-[#afe6e6] text-[10px] font-mono tracking-widest uppercase mb-1">Subir Estudio Clínico</p>
                    <p className="text-slate-600 text-[8px] font-mono tracking-tighter">MULTIMODAL: X-RAY, MRI, CT, ULTRA</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center group/img">
                    <img src={previewUrl} alt="Scan" className="w-full h-full object-contain opacity-95 transition-opacity duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10 pointer-events-none"></div>

                    {loading && (
                      <div className="absolute top-0 left-0 w-full h-[6px] bg-gradient-to-b from-[#88e31a] to-transparent shadow-[0_0_25px_#88e31a] animate-scan z-20"></div>
                    )}

                    <DiagnosticOverlay show={showROI} status={result?.status} anatomy={result?.anatomy} />

                    <button 
                      onClick={clearImage}
                      className="absolute top-6 right-6 bg-red-950/20 text-red-500 rounded-full p-3 opacity-0 group-hover/img:opacity-100 transition-all hover:bg-red-600 hover:text-white z-40 backdrop-blur-xl border border-red-500/20"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Result Zone */}
          <div className="space-y-6">
            <div className="bg-[#0f1711]/70 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative group h-full flex flex-col">
              
              <div className="mb-6 border-b border-white/5 pb-6">
                <h2 className="text-[#afe6e6] font-mono tracking-[0.2em] text-[11px] uppercase flex justify-between items-center font-black">
                  <span>&gt; ANÁLISIS DE NÚCLEO</span>
                  <div className="flex items-center gap-2">
                     <span className="text-[#88e31a] text-[9px] animate-pulse uppercase">BiomedCLIP Active</span>
                  </div>
                </h2>
              </div>

              <div className="space-y-8 flex-1">
                {/* Meta data tags */}
                {result ? (
                  <div className="flex flex-wrap gap-3 mb-4 animate-in slide-in-from-right duration-700">
                    <div className="px-4 py-2 bg-black/60 border border-[#88e31a]/10 rounded-2xl">
                      <span className="text-slate-500 text-[7px] font-mono uppercase block mb-1">Modalidad</span>
                      <span className="text-[#88e31a] text-[10px] font-bold font-mono">{result.modality || "IDENTIFICANDO..."}</span>
                    </div>
                    <div className="px-4 py-2 bg-black/60 border border-[#88e31a]/10 rounded-2xl">
                      <span className="text-slate-500 text-[7px] font-mono uppercase block mb-1">Anatomía</span>
                      <span className="text-[#afe6e6] text-[10px] font-bold font-mono">{result.anatomy || "IDENTIFICANDO..."}</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-6 mb-2">
                     <p className="text-slate-500 text-[9px] font-mono uppercase tracking-[0.2em] mb-4">Estado del Sistema</p>
                     <p className="text-slate-400 text-[10px] font-mono leading-relaxed">
                        ESPERANDO INGESTA DE DATOS PARA INICIALIZAR PROTOCOLO DE IDENTIFICACIÓN MULTIMODAL.
                     </p>
                  </div>
                )}

                <button 
                  onClick={handleAnalysis}
                  disabled={!selectedFile || loading}
                  className={`w-full py-5 rounded-2xl font-mono tracking-[0.3em] uppercase font-black text-xs transition-all active:scale-[0.98] border shadow-2xl relative overflow-hidden group
                    ${!selectedFile || loading 
                      ? 'bg-slate-900/40 border-white/5 text-slate-700' 
                      : 'bg-[#0a0f0b] border-[#88e31a]/30 text-[#88e31a] hover:bg-[#1b3f1e]/40 shadow-[0_0_40px_rgba(136,227,26,0.1)]'}`}
                >
                  <div className="absolute inset-0 bg-[#88e31a]/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                  {loading ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-4 h-4 border-2 border-[#88e31a] border-t-transparent rounded-full animate-spin"></div>
                      <span>PROCESANDO EN NÚCLEO CPU...</span>
                    </div>
                  ) : (
                    <span>LANZAR SECUENCIA TRICELL</span>
                  )}
                </button>

                {error && (
                  <div className="p-5 bg-red-950/30 border border-red-500/20 rounded-2xl text-red-500 text-[9px] font-mono tracking-widest uppercase text-center animate-bounce">
                    <span>[ FALLO DE SISTEMA ] // </span> <span>{error}</span>
                  </div>
                )}

                <div className={`transition-all duration-1000 ${result ? 'opacity-100 mt-6' : 'opacity-0 h-0 pointer-events-none'}`}>
                  {result && (
                    <div className={`p-8 border rounded-[2rem] relative shadow-2xl overflow-hidden ${result.status === 'safe' ? 'bg-[#1b3f1e]/40 border-[#88e31a]/20' : 'bg-red-950/40 border-red-500/30'}`}>
                      <div className={`absolute top-0 left-0 w-2 h-full ${result.status === 'safe' ? 'bg-[#88e31a]' : 'bg-red-500'}`}></div>
                      
                      <div className="space-y-6">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className={`font-mono text-[8px] tracking-widest uppercase mb-1 font-bold ${result.status === 'safe' ? 'text-[#afe6e6]/60' : 'text-red-400'}`}>Dictamen Médico V2.1</p>
                              <h3 className={`text-2xl font-black tracking-tight uppercase font-mono ${result.status === 'safe' ? 'text-white' : 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`}>
                                {result.diagnosis}
                              </h3>
                           </div>
                           <div className="text-right">
                              <span className="text-slate-500 text-[7px] font-mono uppercase block mb-1">Score IA</span>
                              <span className={`font-mono font-black text-xl ${result.status === 'safe' ? 'text-[#88e31a]' : 'text-red-500'}`}>
                                {result.confidence}%
                              </span>
                           </div>
                        </div>

                        <p className="text-slate-300 text-[10px] leading-relaxed font-mono opacity-80 border-t border-white/5 pt-5">
                          {result.status === 'safe' 
                            ? `PROTOCOLO COMPLETADO: No se identifican patrones de patología relevante en el estudio de ${result.modality} (${result.anatomy}).`
                            : `ALERTA CRÍTICA: Se han identificado discrepancias patológicas significativas bajo el protocolo BiomedCLIP. Evaluación manual requerida.`
                          }
                        </p>
                        
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 text-[9px] font-mono text-slate-500 opacity-60">
                           {result.raw_analysis}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-auto pt-8 text-center opacity-30 select-none">
                 <p className="text-slate-600 text-[8px] font-mono tracking-[0.5em] uppercase">Tricell Medical Systems • Lima-HQ</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
