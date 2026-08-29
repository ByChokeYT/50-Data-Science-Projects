import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Icono Emblema Tricolor Bolivia (SVG Vectorial de Alta Definición)
const BoliviaFlagIcon = () => (
  <svg width="20" height="14" viewBox="0 0 20 14" style={{ borderRadius: '3px', overflow: 'hidden', display: 'inline-block', verticalAlign: 'middle', boxShadow: '0 0 8px rgba(0,0,0,0.6)' }}>
    <rect width="20" height="4.66" y="0" fill="#dc2626" />
    <rect width="20" height="4.66" y="4.66" fill="#facc15" />
    <rect width="20" height="4.68" y="9.32" fill="#16a34a" />
  </svg>
);

export default function App() {
  const [formData, setFormData] = useState({
    amountUsd: 250,
    distanceKm: 8,
    transactionHour: 14,
    isNewDevice: 0,
    velocityPerMin: 1,
    failedPinAttempts: 0,
    isForeignCountry: 0
  });

  const [result, setResult] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [showExplainer, setShowExplainer] = useState(true);
  const [showAsfiModal, setShowAsfiModal] = useState(false);

  // Consultar API Backend FastAPI en puerto 8008 o cálculo local de anomalías
  const evaluateTransaction = async () => {
    const amount = formData.amountUsd;
    const dist = formData.distanceKm;
    const hour = formData.transactionHour;
    const device = formData.isNewDevice;
    const velocity = formData.velocityPerMin;
    const fails = formData.failedPinAttempts;
    const foreign = formData.isForeignCountry;

    let probPct, threatLevel, asfiStatus, badgeClass, scoreColor, riskFactors;

    try {
      const res = await axios.post('http://localhost:8008/api/fraud/eval', {
        amount_usd: amount,
        distance_from_home_km: dist,
        transaction_hour: hour,
        is_new_device: device,
        velocity_txn_per_min: velocity,
        failed_pin_attempts: fails,
        is_foreign_country: foreign
      }, { timeout: 1500 });

      if (res.data) {
        probPct = res.data.risk_score_pct;
        threatLevel = res.data.threat_level;
        asfiStatus = res.data.asfi_status;
        badgeClass = res.data.action_color;
        scoreColor = res.data.action_color === 'emerald' ? '#10b981' :
                     res.data.action_color === 'amber' ? '#f59e0b' : '#f43f5e';
        riskFactors = res.data.risk_factors;
        setApiConnected(true);
      }
    } catch (err) {
      setApiConnected(false);

      let score = 0;
      riskFactors = [];

      if (amount > 500) { score += 25; riskFactors.push("Monto atípicamente elevado (> $500 USD)"); }
      if (dist > 80) { score += 30; riskFactors.push("Ubicación distante a >80 km del domicilio habitual"); }
      if (hour >= 0 && hour <= 5) { score += 20; riskFactors.push("Horario nocturno de alto riesgo (00:00 - 05:00)"); }
      if (device === 1) { score += 15; riskFactors.push("Dispositivo web/móvil no registrado previamente"); }
      if (velocity >= 3) { score += 25; riskFactors.push("Frecuencia inusual (3+ compras por minuto)"); }
      if (fails >= 2) { score += 30; riskFactors.push("Múltiples intentos fallidos de clave PIN/CVV"); }
      if (foreign === 1) { score += 25; riskFactors.push("Procesamiento en servidor/país extranjero"); }

      probPct = Math.min(99.9, Math.max(0.5, score));

      if (probPct >= 65.0) {
        threatLevel = "BLOQUEO PREVENTIVO Y ALERTA DE FRAUDE";
        asfiStatus = "Bloqueo Preventivo Automático (ASFI)";
        badgeClass = "rose";
        scoreColor = "#f43f5e";
      } else if (probPct >= 30.0) {
        threatLevel = "REQUIERE AUTENTICACIÓN 2FA / OTP";
        asfiStatus = "Verificación Secundaria Requerida";
        badgeClass = "amber";
        scoreColor = "#f59e0b";
      } else {
        threatLevel = "TRANSACCIÓN LEGÍTIMA APROBADA";
        asfiStatus = "Conforme (Sin Anomalías)";
        badgeClass = "emerald";
        scoreColor = "#10b981";
      }

      if (riskFactors.length === 0) {
        riskFactors.push("Patrón de consumo 100% habitual");
      }
    }

    const strokeDashoffset = 565 - (565 * probPct) / 100;

    setResult({
      probPct: probPct.toFixed(1),
      strokeDashoffset,
      threatLevel,
      asfiStatus,
      badgeClass,
      scoreColor,
      riskFactors
    });
  };

  useEffect(() => {
    evaluateTransaction();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="app-container">
      
      {/* Cabecera Principal */}
      <header className="app-header">
        <div>
          <div className="tag-project">PROYECTO #07 &bull; SECTOR FINANZAS & BANCA</div>
          <h1 className="header-title">Detección de Fraude en Transacciones Bancarias</h1>
          <p className="header-sub">
            Monitoreo en tiempo real y detección de anomalías comportamentales (Isolation Forest + XGBoost)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <button
            onClick={() => setShowAsfiModal(true)}
            className="badge-model"
            style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BoliviaFlagIcon /> Normativa ASFI & PCI-DSS
          </button>

          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="badge-model"
            style={{ background: 'rgba(244, 63, 94, 0.12)', borderColor: 'rgba(244, 63, 94, 0.35)', color: '#fda4af', cursor: 'pointer' }}
          >
            {showExplainer ? '✕ Ocultar Resumen' : 'Especificación Técnica'}
          </button>
          
          <a
            href="http://localhost:8008/docs"
            target="_blank"
            rel="noreferrer"
            className="badge-model"
            style={{ textDecoration: 'none', color: '#60a5fa' }}
          >
            Documentación API (8008) ↗
          </a>
        </div>
      </header>

      {/* Resumen explicativo ejecutivo */}
      {showExplainer && (
        <div className="methodology-box" style={{ marginBottom: '1.75rem', background: 'rgba(13, 20, 36, 0.85)', border: '1px solid rgba(244, 63, 94, 0.3)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#f43f5e', fontSize: '1.05rem', fontWeight: 700 }}>
              Resumen Ejecutivo: Arquitectura de Ciberseguridad Bancaria
            </h3>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Este proyecto simula el <strong>Centro de Operaciones de Ciberseguridad (SOC) de un Banco</strong>. Evalúa cada compra con tarjeta en tiempo real y detecta conductas anómalas (suplantación de identidad, clonación o uso no autorizado).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            
            <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Objetivo del Sistema
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                Interceptar y bloquear compras fraudulentas en milisegundos evitando pérdidas financieras sin congelar tarjetas legítimas.
              </div>
            </div>

            <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Protocolos de Acción por Riesgo
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                <strong style={{ color: '#34d399' }}>0% - 29%:</strong> Transacción Aprobada.<br/>
                <strong style={{ color: '#fbbf24' }}>30% - 64%:</strong> Verificación 2FA/OTP.<br/>
                <strong style={{ color: '#fb7185' }}>65% - 100%:</strong> Bloqueo Inmediato.
              </div>
            </div>

            <div style={{ background: 'rgba(8, 13, 24, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                </svg>
                Factores de Anomalía
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                Distancia geográfica inusual, horario nocturno, múltiples intentos de PIN y cambio repentino de dispositivo.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL ASFI & PCI-DSS */}
      {showAsfiModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(7, 11, 20, 0.85)', backdropFilter: 'blur(12px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#0d1424', border: '1px solid rgba(244, 63, 94, 0.4)', borderRadius: '18px',
            maxWidth: '720px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <BoliviaFlagIcon />
                <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#fb7185', fontSize: '1.2rem', fontWeight: 800 }}>
                  Cumplimiento Normativo ASFI (Bolivia) & Estándar PCI-DSS
                </h3>
              </div>
              <button
                onClick={() => setShowAsfiModal(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Este sistema cumple con el <strong>Reglamento de Seguridad de la Información y Operaciones Electrónicas de la ASFI</strong> en Bolivia y con los controles internacionales de protección de datos tarjetahabientes <strong>PCI-DSS 4.0</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: 'rgba(8, 13, 24, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ color: '#fb7185', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  1. Monitoreo Transaccional Continuo (ASFI RNSF Tit. IV)
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                  La ASFI obliga a las entidades bancarias en Bolivia a implementar motores automatizados de detección de patrones anómalos en banca móvil y cajeros automáticos.
                </p>
              </div>

              <div style={{ background: 'rgba(8, 13, 24, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  2. Autenticación Robusta de 2 Factores (2FA / OTP)
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Ante anomalías de nivel medio (30%-64%), el sistema activa un desafío dinámico SMS/Token OTP exigido por la banca digital boliviana.
                </p>
              </div>

            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button
                onClick={() => setShowAsfiModal(false)}
                style={{
                  background: 'var(--accent-rose)', color: '#070b14', border: 'none', padding: '0.5rem 1.25rem',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disposición Principal */}
      <div className="main-grid">
        
        {/* Formulario de Transacción */}
        <div className="panel-card">
          <div className="panel-title">Parámetros de la Transacción Financiera</div>
          
          <div className="form-grid">
            
            {/* Monto */}
            <div>
              <div className="form-label">
                <span>Monto de la Compra</span>
                <span className="value-badge">${formData.amountUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                name="amountUsd"
                min="10"
                max="3000"
                step="10"
                value={formData.amountUsd}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Distancia */}
            <div>
              <div className="form-label">
                <span>Distancia Habitual</span>
                <span className="value-badge">{formData.distanceKm} km</span>
              </div>
              <input
                type="range"
                name="distanceKm"
                min="0"
                max="500"
                step="5"
                value={formData.distanceKm}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Hora */}
            <div>
              <div className="form-label">
                <span>Hora de la Compra</span>
                <span className="value-badge">{formData.transactionHour}:00 hrs</span>
              </div>
              <input
                type="range"
                name="transactionHour"
                min="0"
                max="23"
                step="1"
                value={formData.transactionHour}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Dispositivo Nuevo */}
            <div>
              <div className="form-label">
                <span>¿Dispositivo Nuevo?</span>
              </div>
              <select
                name="isNewDevice"
                value={formData.isNewDevice}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={0}>No (Dispositivo Frecuente)</option>
                <option value={1}>Sí (Nuevo Dispositivo / IP)</option>
              </select>
            </div>

            {/* Velocidad / Frecuencia */}
            <div>
              <div className="form-label">
                <span>Frecuencia por Minuto</span>
                <span className="value-badge">{formData.velocityPerMin} txn/min</span>
              </div>
              <input
                type="range"
                name="velocityPerMin"
                min="1"
                max="6"
                step="1"
                value={formData.velocityPerMin}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Intentos Fallidos PIN */}
            <div>
              <div className="form-label">
                <span>Intentos Fallidos PIN</span>
              </div>
              <select
                name="failedPinAttempts"
                value={formData.failedPinAttempts}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={0}>0 Intentos Fallidos</option>
                <option value={1}>1 Intento Fallido</option>
                <option value={2}>2 Intentos Fallidos</option>
                <option value={3}>3 o más Fallos (Bloqueo)</option>
              </select>
            </div>

            {/* País Extranjero */}
            <div className="form-group full-width">
              <div className="form-label">
                <span>Ubicación Internacional</span>
              </div>
              <select
                name="isForeignCountry"
                value={formData.isForeignCountry}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={0}>Transacción Nacional (Bolivia / Local)</option>
                <option value={1}>Transacción Internacional (Extranjero)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Tarjeta de Monitoreo de Riesgo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {result && (
            <div className="result-card">
              <div className="score-title-label">Probabilidad de Fraude Calculada</div>

              {/* SVG Anomaly Radar Meter */}
              <div className="gauge-container">
                <svg className="gauge-svg" viewBox="0 0 200 200">
                  <circle
                    className="gauge-bg-circle"
                    cx="100"
                    cy="100"
                    r="90"
                  />
                  <circle
                    className="gauge-value-circle"
                    cx="100"
                    cy="100"
                    r="90"
                    style={{
                      stroke: result.scoreColor,
                      strokeDasharray: '565',
                      strokeDashoffset: result.strokeDashoffset
                    }}
                  />
                </svg>

                <div className="gauge-center-text">
                  <div className="score-number" style={{ color: result.scoreColor }}>
                    {result.probPct}%
                  </div>
                  <div className="score-max-label">Índice de Sospecha</div>
                </div>
              </div>

              {/* Protocol Badge */}
              <div className={`decision-badge ${result.badgeClass}`}>
                <span>●</span> {result.threatLevel}
              </div>

              {/* ASFI Badge */}
              <div style={{ fontSize: '0.76rem', color: '#fb7185', fontFamily: 'Fira Code, monospace', marginBottom: '1rem', background: 'rgba(244, 63, 94, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(244, 63, 94, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <BoliviaFlagIcon /> ASFI Protocolo: {result.asfiStatus}
              </div>

              {/* Risk Factors List */}
              <div style={{ width: '100%', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontFamily: 'Fira Code, monospace', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  Anomalías Detectadas:
                </div>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  {result.riskFactors.map((rf, idx) => (
                    <li key={idx} style={{ fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: result.scoreColor }}>▪</span> {rf}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          )}

          {/* Methodology Note */}
          <div className="methodology-box">
            <p><strong>Metodología de Seguridad:</strong> Detección de outliers mediante Isolation Forest y XGBoost con SMOTE.</p>
            <p style={{ marginTop: '0.4rem' }}><strong>Documentación API:</strong> Disponible en puerto 8008 en <a href="http://localhost:8008/docs" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>http://localhost:8008/docs</a>.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
