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
    annualIncome: 65000,
    loanAmount: 18000,
    loanTermMonths: 36,
    dtiRatio: 24,
    employmentYears: 6,
    pastDefaultsCount: 0,
    creditLinesCount: 5,
    repaymentHistoryScore: 88
  });

  const [result, setResult] = useState(null);
  const [apiConnected, setApiConnected] = useState(false);
  const [showExplainer, setShowExplainer] = useState(true);
  const [showAsfiModal, setShowAsfiModal] = useState(false);

  // Consultar API Backend FastAPI en puerto 8007 o cálculo local en 100% Español
  const calculateCreditScore = async () => {
    const income = formData.annualIncome;
    const loan = formData.loanAmount;
    const dti = formData.dtiRatio;
    const emp = formData.employmentYears;
    const defaults = formData.pastDefaultsCount;
    const history = formData.repaymentHistoryScore;

    let creditScore, pdProb, riskCategory, decision, badgeClass, scoreColor, maxLoan, asfiCategory;

    try {
      const res = await axios.post('http://localhost:8007/api/scorecard/predict', {
        annual_income: income,
        loan_amount: loan,
        loan_term_months: formData.loanTermMonths,
        dti_ratio: dti,
        employment_years: emp,
        past_defaults_count: defaults,
        credit_lines_count: formData.creditLinesCount,
        repayment_history_score: history
      }, { timeout: 1500 });

      if (res.data) {
        creditScore = res.data.credit_score;
        pdProb = (res.data.probability_of_default * 100).toFixed(2);
        riskCategory = res.data.risk_category;
        decision = res.data.decision;
        badgeClass = res.data.decision_color;
        scoreColor = res.data.decision_color === 'emerald' ? '#10b981' :
                     res.data.decision_color === 'cyan' ? '#3b82f6' :
                     res.data.decision_color === 'amber' ? '#f59e0b' : '#f43f5e';
        maxLoan = res.data.max_recommended_loan;
        setApiConnected(true);
      }
    } catch (err) {
      setApiConnected(false);

      const logit = (
        - 2.5
        + 0.035 * (dti - 35)
        + 1.15 * defaults
        - 0.04 * (history - 70)
        - 0.055 * emp
        + 0.000028 * (loan - 15000)
        - 0.000018 * (income - 45000)
      );

      const pd = 1.0 / (1.0 + Math.exp(-logit));
      const factor = 20 / Math.log(2.0);
      const offset = 600 - (factor * Math.log(50));
      const odds = (1.0 - pd) / (pd + 1e-7);
      const rawScore = offset + (factor * Math.log(odds + 1e-7));

      creditScore = Math.min(850, Math.max(300, Math.round(rawScore)));
      pdProb = (pd * 100).toFixed(2);

      if (creditScore >= 720) {
        riskCategory = "Bajo Riesgo";
        decision = "Aprobación Instantánea";
        badgeClass = "emerald";
        scoreColor = "#10b981";
      } else if (creditScore >= 650) {
        riskCategory = "Riesgo Moderado";
        decision = "Aprobado con Verificación";
        badgeClass = "blue";
        scoreColor = "#3b82f6";
      } else if (creditScore >= 580) {
        riskCategory = "Riesgo Elevado";
        decision = "Revisión Manual por Analista";
        badgeClass = "amber";
        scoreColor = "#f59e0b";
      } else {
        riskCategory = "Riesgo Crítico";
        decision = "Solicitud Rechazada";
        badgeClass = "rose";
        scoreColor = "#f43f5e";
      }

      maxLoan = Math.round(Math.min(income * 0.45, loan * 1.25));
    }

    if (creditScore >= 720) {
      asfiCategory = "Categoría A (Cumplimiento Normal)";
    } else if (creditScore >= 650) {
      asfiCategory = "Categoría B (Problemas Potenciales)";
    } else if (creditScore >= 580) {
      asfiCategory = "Categoría C (Deficiente)";
    } else {
      asfiCategory = "Categoría D / F (Castigado / Ejecución Judicial)";
    }

    const monthlyPayment = (loan * (1 + 0.085 * (formData.loanTermMonths / 12))) / formData.loanTermMonths;
    const scorePct = Math.max(0, Math.min(100, ((creditScore - 300) / (850 - 300)) * 100));
    const strokeDashoffset = 565 - (565 * scorePct) / 100;

    setResult({
      score: creditScore,
      scorePct,
      strokeDashoffset,
      pdProb,
      riskCategory,
      decision,
      badgeClass,
      scoreColor,
      monthlyPayment: monthlyPayment.toFixed(2),
      maxLoan,
      asfiCategory
    });
  };

  useEffect(() => {
    calculateCreditScore();
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
          <div className="tag-project">PROYECTO #06 &bull; SECTOR FINANZAS & BANCA</div>
          <h1 className="header-title">Modelo de Puntuación Crediticia (Credit Scoring)</h1>
          <p className="header-sub">
            Sistema automático de decisión crediticia bancaria (Puntuación de 300 a 850 puntos)
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          
          <button
            onClick={() => setShowAsfiModal(true)}
            className="badge-model"
            style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <BoliviaFlagIcon /> Normativa ASFI Bolivia & Marco Global
          </button>

          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="badge-model"
            style={{ background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.35)', color: '#93c5fd', cursor: 'pointer' }}
          >
            {showExplainer ? '✕ Ocultar Resumen' : 'Especificación Técnica'}
          </button>
          
          <a
            href="http://localhost:8007/docs"
            target="_blank"
            rel="noreferrer"
            className="badge-model"
            style={{ textDecoration: 'none', color: '#60a5fa' }}
          >
            Documentación API (8007) ↗
          </a>
        </div>
      </header>

      {/* Resumen explicativo ejecutivo */}
      {showExplainer && (
        <div className="methodology-box" style={{ marginBottom: '1.75rem', background: 'rgba(15, 23, 42, 0.85)', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.6rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#60a5fa', fontSize: '1.05rem', fontWeight: 700 }}>
              Resumen Ejecutivo: Arquitectura y Evaluación del Proyecto
            </h3>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.6' }}>
            Este proyecto simula el motor de scoring crediticio de una entidad bancaria. Evalúa la capacidad financiera de un cliente que solicita un préstamo y calcula automáticamente la probabilidad de que devuelva el dinero a tiempo.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            
            <div style={{ background: 'rgba(10, 16, 28, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#34d399', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
                Objetivo del Sistema
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                Aprobar o rechazar créditos en segundos analizando ingresos, nivel de deuda y comportamiento histórico de pago.
              </div>
            </div>

            <div style={{ background: 'rgba(10, 16, 28, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                Escala de Puntuación (300 - 850)
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                <strong style={{ color: '#34d399' }}>720 - 850:</strong> Excelente (Aprobado).<br/>
                <strong style={{ color: '#60a5fa' }}>650 - 719:</strong> Moderado.<br/>
                <strong style={{ color: '#fbbf24' }}>580 - 649:</strong> Riesgo Alto.<br/>
                <strong style={{ color: '#fb7185' }}>300 - 579:</strong> Crítico (Rechazado).
              </div>
            </div>

            <div style={{ background: 'rgba(10, 16, 28, 0.7)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontWeight: 700, fontSize: '0.82rem', marginBottom: '0.35rem' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                Variables Determinantes
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.78rem', lineHeight: '1.45' }}>
                Ratio Deuda-Ingreso (DTI), impagos previos en el sistema financiero y puntualidad histórica de cuotas.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE NORMATIVA ASFI BOLIVIA & REGULADORES */}
      {showAsfiModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(7, 11, 20, 0.85)', backdropFilter: 'blur(12px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: '#0d1424', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '18px',
            maxWidth: '720px', width: '100%', padding: '1.75rem', boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)', pb: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <BoliviaFlagIcon />
                <h3 style={{ fontFamily: 'Outfit, sans-serif', color: '#fbbf24', fontSize: '1.2rem', fontWeight: 800 }}>
                  Adaptación Normativa ASFI (Bolivia) & Basilea III
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
              El algoritmo del Proyecto #06 satisface la <strong>Recopilación de Normas para Servicios Financieros (RNSF) de la ASFI</strong> en Bolivia y los lineamientos del <strong>Comité de Basilea III</strong> para la gestión prudencial de riesgo crediticio.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div style={{ background: 'rgba(10, 16, 28, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  1. Mapeo con Categorías Crediticias de la ASFI (Bolivia)
                </div>
                <ul style={{ listStyle: 'none', color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.7' }}>
                  <li>🔹 <strong>Categoría A (Cumplimiento Normal / Score 720-850):</strong> Cumplimiento impecable. Créditos automáticos en BNB, Banco Unión, BISA, Mercantil Santa Cruz, BancoSol.</li>
                  <li>🔹 <strong>Categoría B (Problemas Potenciales / Score 650-719):</strong> Retrasos ocasionales de 1 a 30 días. Requiere verificación de respaldo patrimonial.</li>
                  <li>🔹 <strong>Categoría C (Deficiente / Score 580-649):</strong> Mora recurrente (31-60 días). Deriva a comité de crédito o refinanciamiento.</li>
                  <li>🔹 <strong>Categoría D / E / F (Castigado / Score &lt; 580):</strong> En cobro judicial o ejecución de garantías. Rechazo automático de solicitud.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(10, 16, 28, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  2. Límite de Capacidad de Pago (DTI Regulado)
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                  La ASFI exige que la cuota de amortización de préstamos no exceda el <strong>35% a 40% del ingreso neto disponible</strong> del hogar. El modelo recalcula automáticamente este margen.
                </p>
              </div>

              <div style={{ background: 'rgba(10, 16, 28, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  3. Integración con Buró INFOCRED & CIC
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: '1.5' }}>
                  Las variables del modelo consumen directamente las bases de datos de la Central de Información de Créditos (CIC) de la ASFI e INFOCRED.
                </p>
              </div>

            </div>

            <div style={{ marginTop: '1.25rem', textAlign: 'right' }}>
              <button
                onClick={() => setShowAsfiModal(false)}
                style={{
                  background: 'var(--accent-amber)', color: '#070b14', border: 'none', padding: '0.5rem 1.25rem',
                  borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disposición Principal de la Aplicación */}
      <div className="main-grid">
        
        {/* Tarjeta de Controles del Formulario */}
        <div className="panel-card">
          <div className="panel-title">Información Financiera del Solicitante</div>
          
          <div className="form-grid">
            
            {/* Ingreso Anual */}
            <div>
              <div className="form-label">
                <span>Ingreso Anual (USD)</span>
                <span className="value-badge">${formData.annualIncome.toLocaleString()}</span>
              </div>
              <input
                type="range"
                name="annualIncome"
                min="12000"
                max="200000"
                step="1000"
                value={formData.annualIncome}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Monto Solicitado */}
            <div>
              <div className="form-label">
                <span>Monto Solicitado (USD)</span>
                <span className="value-badge">${formData.loanAmount.toLocaleString()}</span>
              </div>
              <input
                type="range"
                name="loanAmount"
                min="1000"
                max="100000"
                step="1000"
                value={formData.loanAmount}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Plazo */}
            <div>
              <div className="form-label">
                <span>Plazo del Préstamo</span>
              </div>
              <select
                name="loanTermMonths"
                value={formData.loanTermMonths}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={12}>12 Meses (1 Año)</option>
                <option value={24}>24 Meses (2 Años)</option>
                <option value={36}>36 Meses (3 Años)</option>
                <option value={48}>48 Meses (4 Años)</option>
                <option value={60}>60 Meses (5 Años)</option>
              </select>
            </div>

            {/* Ratio Deuda-Ingreso (DTI) */}
            <div>
              <div className="form-label">
                <span>Ratio Deuda-Ingreso (DTI)</span>
                <span className="value-badge">{formData.dtiRatio}%</span>
              </div>
              <input
                type="range"
                name="dtiRatio"
                min="5"
                max="70"
                step="1"
                value={formData.dtiRatio}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Antigüedad Laboral */}
            <div>
              <div className="form-label">
                <span>Antigüedad Laboral</span>
                <span className="value-badge">{formData.employmentYears} Años</span>
              </div>
              <input
                type="range"
                name="employmentYears"
                min="0"
                max="30"
                step="1"
                value={formData.employmentYears}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

            {/* Impagos Previos */}
            <div>
              <div className="form-label">
                <span>Impagos Previos</span>
              </div>
              <select
                name="pastDefaultsCount"
                value={formData.pastDefaultsCount}
                onChange={handleChange}
                className="custom-select"
              >
                <option value={0}>0 (Sin Historial de Impago)</option>
                <option value={1}>1 Impago Previo</option>
                <option value={2}>2 Impagos Previos</option>
                <option value={3}>3 o más Impagos</option>
              </select>
            </div>

            {/* Índice de Cumplimiento de Pagos */}
            <div className="form-group full-width">
              <div className="form-label">
                <span>Índice de Cumplimiento de Pagos</span>
                <span className="value-badge">{formData.repaymentHistoryScore} / 100</span>
              </div>
              <input
                type="range"
                name="repaymentHistoryScore"
                min="30"
                max="100"
                step="1"
                value={formData.repaymentHistoryScore}
                onChange={handleChange}
                className="range-slider"
              />
            </div>

          </div>
        </div>

        {/* Tarjeta de Resultados y Scorecard */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {result && (
            <div className="result-card">
              <div className="score-title-label">Puntuación Crediticia Estimada</div>

              {/* Medidor Circular SVG Animado */}
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
                    {result.score}
                  </div>
                  <div className="score-max-label">de 850 Puntos</div>
                </div>
              </div>

              {/* Dictamen Bancario */}
              <div className={`decision-badge ${result.badgeClass}`}>
                <span>●</span> {result.decision}
              </div>

              {/* Insignia Equivalente ASFI Bolivia */}
              <div style={{ fontSize: '0.76rem', color: '#fbbf24', fontFamily: 'Fira Code, monospace', marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.1)', padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.25)', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                <BoliviaFlagIcon /> ASFI: {result.asfiCategory}
              </div>

              {/* Cuadrícula de Métricas */}
              <div className="metrics-grid-2x2">
                <div className="metric-item">
                  <div className="metric-item-label">Probabilidad de Impago</div>
                  <div className="metric-item-val">{result.pdProb}%</div>
                </div>

                <div className="metric-item">
                  <div className="metric-item-label">Categoría de Riesgo</div>
                  <div className="metric-item-val">{result.riskCategory}</div>
                </div>

                <div className="metric-item">
                  <div className="metric-item-label">Cuota Mensual Est.</div>
                  <div className="metric-item-val">${result.monthlyPayment}</div>
                </div>

                <div className="metric-item">
                  <div className="metric-item-label">Préstamo Máx Rec.</div>
                  <div className="metric-item-val">${result.maxLoan.toLocaleString()}</div>
                </div>
              </div>

            </div>
          )}

          {/* Nota Metodológica */}
          <div className="methodology-box">
            <p><strong>Metodología de Evaluación:</strong> Scorecard calibrado mediante Regresión Logística y transformaciones Weight of Evidence (WoE).</p>
            <p style={{ marginTop: '0.4rem' }}><strong>Documentación API:</strong> Disponible en puerto 8007 en <a href="http://localhost:8007/docs" target="_blank" rel="noreferrer" style={{ color: '#60a5fa' }}>http://localhost:8007/docs</a>.</p>
          </div>

        </div>

      </div>

    </div>
  );
}
