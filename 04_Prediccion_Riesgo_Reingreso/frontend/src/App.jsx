import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Users, 
  Stethoscope, 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  Info,
  Calendar,
  ClipboardCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

function App() {
  const [stats, setStats] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    age: 65,
    gender: 'Masculino',
    ethnicity: 'Caucásico',
    insurance_type: 'Público',
    admission_type: 'Emergencia',
    primary_diagnosis: 'Cardiopatía',
    severity_index: 3,
    num_lab_procedures: 15,
    num_medications: 8
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Error al cargar datos hospitalarios');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cleanData = {
        ...formData,
        age: parseInt(formData.age),
        severity_index: parseInt(formData.severity_index),
        num_lab_procedures: parseInt(formData.num_lab_procedures),
        num_medications: parseInt(formData.num_medications)
      };
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData)
      });
      if (!res.ok) throw new Error('Error en el análisis predictivo');
      const data = await res.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const COLORS = ['#FF3D00', '#00C853', '#FFAB00', '#0066FF'];

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo">
          <Activity size={32} />
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>SafePath Health</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>Plataforma de Análisis de Riesgo Hospitalario</p>
          </div>
        </div>
        <div className="user-profile">
          <Calendar size={18} style={{ color: 'var(--text-muted)', marginRight: '1.5rem' }} />
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600 }}>Dr. John Smith</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Unidad de Vigilancia Epidemiológica</div>
          </div>
          <div className="user-avatar" style={{ width: 42, height: 42, borderRadius: '12px', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary)', marginLeft: '1rem' }}>
            <Users size={20} />
          </div>
        </div>
      </header>

      <div className="stat-grid">
        <div className="card stat-card">
          <div className="stat-label">Total Ingresos Activos</div>
          <div className="stat-value">{stats ? stats.total_admissions.toLocaleString() : '---'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
            <ArrowUpRight size={14} /> +4.2% vs mes anterior
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Tasa de Reingreso (30d)</div>
          <div className="stat-value">{stats ? (stats.readmission_rate * 100).toFixed(1) + '%' : '---'}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
            <ArrowDownRight size={14} /> -1.5% Mejora en gestión
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Severidad Media</div>
          <div className="stat-value">{stats ? stats.avg_severity.toFixed(1) : '---'} / 5.0</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Nivel de complejidad estable</div>
        </div>
        <div className="card stat-card" style={{ background: 'var(--primary)', color: 'white' }}>
          <div className="stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>Confianza del Modelo</div>
          <div className="stat-value" style={{ color: 'white' }}>92.4%</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Basado en XGBoost v3.2</div>
        </div>
      </div>

      <div className="grid">
        <section className="prediction-form">
          <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
            <h2 className="card-title">
              <Stethoscope size={20} /> Evaluación de Nuevo Ingreso
            </h2>
            <form onSubmit={handlePredict}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Edad del Paciente</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Grupo Étnico</label>
                  <select name="ethnicity" value={formData.ethnicity} onChange={handleChange}>
                    <option value="Hispano">Hispano</option>
                    <option value="Caucásico">Caucásico</option>
                    <option value="Afroamericano">Afroamericano</option>
                    <option value="Asiático">Asiático</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Género</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cobertura Médica</label>
                  <select name="insurance_type" value={formData.insurance_type} onChange={handleChange}>
                    <option value="Privado">Seguro Privado</option>
                    <option value="Público">Seguridad Pública</option>
                    <option value="Sin Seguro">Particular / Sin Seguro</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Tipo de Ingreso</label>
                  <select name="admission_type" value={formData.admission_type} onChange={handleChange}>
                    <option value="Emergencia">Emergencia / Urgencias</option>
                    <option value="Urgente">Urgente (Traslado)</option>
                    <option value="Electiva">Electiva / Programada</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Diagnóstico Principal</label>
                  <select name="primary_diagnosis" value={formData.primary_diagnosis} onChange={handleChange}>
                    <option value="Diabetes">Diabetes Mellitus</option>
                    <option value="Cardiopatía">Insuficiencia Cardíaca</option>
                    <option value="Respiratorio">Enfermedad Respiratoria</option>
                    <option value="Infección">Infección Sistémica</option>
                    <option value="Trauma">Traumatismo / Lesión</option>
                    <option value="Digestivo">Trastorno Digestivo</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label>Severidad</label>
                  <select name="severity_index" value={formData.severity_index} onChange={handleChange}>
                    <option value="1">1 - Mínima</option>
                    <option value="2">2 - Leve</option>
                    <option value="3">3 - Moderada</option>
                    <option value="4">4 - Alta</option>
                    <option value="5">5 - Crítica</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Labs</label>
                  <input type="number" name="num_lab_procedures" value={formData.num_lab_procedures} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Meds</label>
                  <input type="number" name="num_medications" value={formData.num_medications} onChange={handleChange} />
                </div>
              </div>
              
              <button type="submit" className="btn" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Analizando historial...' : 'Generar Informe de Riesgo'}
              </button>
            </form>

            {error && (
              <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center', background: '#FFF0F0', padding: '0.75rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <AlertTriangle size={16} /> Error de conexión: {error}
              </div>
            )}
          </div>
        </section>

        <section className="analytics-display">
          {!prediction ? (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ background: 'var(--bg-color)', padding: '2rem', borderRadius: '50%', marginBottom: '1.5rem' }}>
                <ClipboardCheck size={64} style={{ opacity: 0.2 }} />
              </div>
              <h3>Esperando Datos del Paciente</h3>
              <p style={{ maxWidth: '300px', fontSize: '0.9rem', marginTop: '0.5rem' }}>Complete el formulario para visualizar el análisis predictivo y las recomendaciones.</p>
            </div>
          ) : (
            <div className="card result-card animate-fade-in" style={{ height: '100%', borderTop: `4px solid ${prediction.risk_level === 'Alto' ? 'var(--danger)' : prediction.risk_level === 'Medio' ? 'var(--warning)' : 'var(--success)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                <div>
                  <h2 className="card-title" style={{ marginBottom: '0.25rem' }}>Informe de Riesgo de Reingreso</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ID de Análisis: #HP-{Math.floor(Math.random()*10000)}</p>
                </div>
                <div className={`risk-badge risk-level-${prediction.risk_level.toLowerCase()}`} style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
                  RIESGO {prediction.risk_level}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div className="risk-meter-container" style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-color)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{(prediction.risk_score * 100).toFixed(0)}%</div>
                  <div style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Probabilidad de Reingreso</div>
                </div>
                
                <div className="factors-list">
                  <h3 style={{ fontSize: '0.95rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Info size={16} /> Factores Determinantes:
                  </h3>
                  {prediction.factors.map((f, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 500 }}>{f.factor}</span>
                      <span style={{ 
                        color: f.impact === 'Crítico' ? 'var(--danger)' : f.impact === 'Alto' ? '#D32F2F' : f.impact === 'Medio' ? 'var(--warning)' : 'var(--success)',
                        fontWeight: 700,
                        fontSize: '0.8rem'
                      }}>{f.impact}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--primary-light)', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>Sugerencia de Protocolo:</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontWeight: 500 }}>{prediction.recommendation}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>* Este informe es una ayuda diagnóstica basada en modelos predictivos, no sustituye el criterio clínico médico.</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2 className="card-title"><TrendingUp size={20} /> Análisis Comparativo por Especialidad</h2>
        <div style={{ height: 300, marginTop: '1rem' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Cardiología', riesgo: 62, media: 40 },
              { name: 'Diabetes', riesgo: 45, media: 40 },
              { name: 'Neumología', riesgo: 38, media: 40 },
              { name: 'Infecciosas', riesgo: 55, media: 40 },
              { name: 'Traumatología', riesgo: 15, media: 40 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)' }} />
              <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
              <Bar name="Riesgo Actual" dataKey="riesgo" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar name="Media Nacional" dataKey="media" fill="#CBD5E1" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border-color)', padding: '2rem 0' }}>
        <p>© 2026 SafePath Intelligence v2.1 | Integración con Modelos XGBoost y SQL Server</p>
      </footer>
    </div>
  );
}

export default App;
