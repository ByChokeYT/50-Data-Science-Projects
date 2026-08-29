/**
 * Hub Central de Ciencia de Datos & Analítica Predictiva
 * Lógica del Cliente y Ejecución Directa de Aplicaciones Web
 */

const SECTOR_COVERS = {
  'Salud': 'hub_assets/images/cover_salud.png',
  'Finanzas': 'hub_assets/images/cover_finanzas.png',
  'E-Commerce': 'https://images.unsplash.com/photo-1556742049-0a6754593466?auto=format&fit=crop&w=600&q=80',
  'Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
  'Deportes': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=600&q=80',
  'Logística': 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
  'Energía': 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=600&q=80',
  'Educación': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
  'Social Media': 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80',
  'Gobierno': 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80'
};

document.addEventListener('DOMContentLoaded', () => {
  // Estado Global del Hub
  const state = {
    searchQuery: '',
    selectedSector: 'all',
    selectedStatus: 'all',
    activeModalProject: null,
    activeTab: 'specs'
  };

  // Referencias DOM
  const elements = {
    searchInput: document.getElementById('search-input'),
    sectorPillsContainer: document.getElementById('sector-pills-container'),
    statusFiltersContainer: document.getElementById('status-filters-container'),
    projectsGrid: document.getElementById('projects-grid'),
    resultsCount: document.getElementById('results-count'),
    // Stats
    statCompleted: document.getElementById('stat-completed'),
    statProgress: document.getElementById('stat-progress'),
    // Modal
    modalOverlay: document.getElementById('project-modal'),
    modalCloseBtn: document.getElementById('modal-close-btn'),
    modalContentBody: document.getElementById('modal-content-body')
  };

  // Inicialización
  function init() {
    renderStats();
    renderSectorPills();
    renderStatusFilters();
    renderProjects();
    attachEventListeners();
  }

  // Renderizar Estadísticas
  function renderStats() {
    const completed = window.PROJECTS.filter(p => p.status === 'completed').length;
    const inProgress = window.PROJECTS.filter(p => p.status === 'in_progress').length;

    if (elements.statCompleted) elements.statCompleted.textContent = completed;
    if (elements.statProgress) elements.statProgress.textContent = inProgress;
  }

  // Renderizar Filtros por Sector
  function renderSectorPills() {
    if (!elements.sectorPillsContainer) return;
    elements.sectorPillsContainer.innerHTML = '';

    window.SECTORS.forEach(sec => {
      const btn = document.createElement('button');
      btn.className = `pill-btn ${state.selectedSector === sec.id ? 'active' : ''}`;
      btn.dataset.sector = sec.id;
      
      const sectorCount = sec.id === 'all' 
        ? window.PROJECTS.length 
        : window.PROJECTS.filter(p => p.sector === sec.id).length;

      btn.innerHTML = `
        <span>${sec.name}</span>
        <span style="opacity: 0.6; font-size: 0.74rem;">(${sectorCount})</span>
      `;

      btn.addEventListener('click', () => {
        state.selectedSector = sec.id;
        document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects();
      });

      elements.sectorPillsContainer.appendChild(btn);
    });
  }

  // Renderizar Filtros por Estado
  function renderStatusFilters() {
    if (!elements.statusFiltersContainer) return;
    const statuses = [
      { id: 'all', label: 'Todos los Estados' },
      { id: 'completed', label: 'Completados' },
      { id: 'in_progress', label: 'En Desarrollo' },
      { id: 'planned', label: 'Planificados' }
    ];

    elements.statusFiltersContainer.innerHTML = '';

    statuses.forEach(st => {
      const btn = document.createElement('button');
      btn.className = `status-pill ${state.selectedStatus === st.id ? 'active' : ''}`;
      btn.textContent = st.label;

      btn.addEventListener('click', () => {
        state.selectedStatus = st.id;
        document.querySelectorAll('.status-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProjects();
      });

      elements.statusFiltersContainer.appendChild(btn);
    });
  }

  // Filtrar Proyectos
  function getFilteredProjects() {
    return window.PROJECTS.filter(project => {
      if (state.selectedSector !== 'all' && project.sector !== state.selectedSector) {
        return false;
      }
      if (state.selectedStatus !== 'all' && project.status !== state.selectedStatus) {
        return false;
      }
      if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        const inTitle = project.title.toLowerCase().includes(query);
        const inDesc = project.description.toLowerCase().includes(query);
        const inFolder = project.folder.toLowerCase().includes(query);
        const inTags = project.tags.some(t => t.toLowerCase().includes(query));
        const inSector = project.sector.toLowerCase().includes(query);

        if (!inTitle && !inDesc && !inFolder && !inTags && !inSector) {
          return false;
        }
      }
      return true;
    });
  }

  // Badge de Estado Sobrio y Profesional
  function getStatusBadgeHTML(status) {
    switch (status) {
      case 'completed':
        return '<span class="status-badge completed"><span>●</span> Completado</span>';
      case 'in_progress':
        return '<span class="status-badge in_progress"><span>▲</span> En Desarrollo</span>';
      case 'planned':
      default:
        return '<span class="status-badge planned"><span>○</span> Planificado</span>';
    }
  }

  // Renderizar Grid de Tarjetas con botón de Ejecución Directa de App
  function renderProjects() {
    if (!elements.projectsGrid) return;
    const filtered = getFilteredProjects();

    if (elements.resultsCount) {
      elements.resultsCount.innerHTML = `Mostrando <strong>${filtered.length}</strong> de ${window.PROJECTS.length} proyectos registrados`;
    }

    if (filtered.length === 0) {
      elements.projectsGrid.innerHTML = `
        <div class="no-results">
          <h3>No se encontraron registros</h3>
          <p>Ajuste los parámetros de búsqueda o seleccione otro sector industrial.</p>
        </div>
      `;
      return;
    }

    elements.projectsGrid.innerHTML = filtered.map(project => {
      const coverUrl = SECTOR_COVERS[project.sector] || SECTOR_COVERS['Salud'];
      const hasApp = !!project.appUrl;

      return `
        <div class="project-card" data-id="${project.id}">
          <div class="card-image-wrap">
            <img src="${coverUrl}" alt="${project.title}" class="card-cover-img" loading="lazy" />
            <div class="card-cover-overlay"></div>
            <span class="project-num-badge">REF #${project.number}</span>
            <div class="card-status-pos">${getStatusBadgeHTML(project.status)}</div>
          </div>
          
          <div class="card-body-content">
            <div class="card-sector-tag">${project.sector}</div>
            <h3 class="card-title">${project.title}</h3>
            <p class="card-desc">${project.description}</p>
            <div class="card-tags">
              ${project.tags.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
          </div>

          <div class="card-footer">
            <span class="folder-path-text" title="${project.folder}">${project.folder}</span>
            <div style="display:flex; gap:0.4rem;">
              ${hasApp ? `<button class="btn-launch" onclick="event.stopPropagation(); launchProjectApp('${project.appUrl}')">Ejecutar App 🚀</button>` : ''}
              <button class="btn-detail" onclick="openProjectModal(${project.id})">Ficha →</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-detail') && !e.target.classList.contains('btn-launch')) {
          const id = parseInt(card.dataset.id, 10);
          openProjectModal(id);
        }
      });
    });
  }

  // Abrir Aplicación Web del Proyecto en nueva pestaña
  window.launchProjectApp = function(url) {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Abrir Modal de Proyecto con Pestañas (Ficha Técnica vs Live Demo)
  window.openProjectModal = function(id) {
    const project = window.PROJECTS.find(p => p.id === id);
    if (!project || !elements.modalOverlay || !elements.modalContentBody) return;

    state.activeModalProject = project;
    state.activeTab = 'specs';
    const coverUrl = SECTOR_COVERS[project.sector] || SECTOR_COVERS['Salud'];
    const hasApp = !!project.appUrl;

    renderModalContent();
  };

  function renderModalContent() {
    const project = state.activeModalProject;
    if (!project) return;

    const coverUrl = SECTOR_COVERS[project.sector] || SECTOR_COVERS['Salud'];
    const hasApp = !!project.appUrl;

    elements.modalContentBody.innerHTML = `
      <div class="modal-banner-wrap">
        <img src="${coverUrl}" alt="${project.title}" class="modal-banner-img" />
        <div class="modal-banner-overlay"></div>
        <div class="modal-banner-title-wrap">
          <div style="display:flex; gap:0.5rem; align-items:center; margin-bottom:0.35rem;">
            <span class="project-num-badge">REGISTRO #${project.number}</span>
            ${getStatusBadgeHTML(project.status)}
          </div>
          <h2 style="font-family:'Outfit',sans-serif; font-size:1.6rem; font-weight:800; color:#ffffff; line-height:1.2;">${project.title}</h2>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.3rem;">
            <div style="font-size:0.78rem; color:#60a5fa; text-transform:uppercase; font-weight:700; letter-spacing:0.06em;">
              Sector Industrial: ${project.sector}
            </div>
            ${hasApp ? `<button class="btn-launch-large" onclick="launchProjectApp('${project.appUrl}')">Abrir Aplicación Completa ↗</button>` : ''}
          </div>
        </div>
      </div>

      <!-- Modal Tabs -->
      <div class="modal-tabs-bar">
        <button class="modal-tab-btn ${state.activeTab === 'specs' ? 'active' : ''}" onclick="switchModalTab('specs')">Ficha Técnica & Arquitectura</button>
        ${hasApp ? `<button class="modal-tab-btn ${state.activeTab === 'demo' ? 'active' : ''}" onclick="switchModalTab('demo')">Vista Previa Interactiva (Live App)</button>` : ''}
      </div>

      <div class="modal-body">
        ${state.activeTab === 'specs' ? `
          <div style="margin-bottom: 1.25rem;">
            <div class="modal-section-title">Resumen Ejecutivo</div>
            <p style="color: var(--text-secondary); font-size: 0.92rem; line-height:1.5;">${project.description}</p>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div class="modal-section-title">Especificación Técnica & Librerías</div>
            <div class="card-tags">
              ${project.tags.map(t => `<span class="tech-tag" style="font-size:0.78rem; padding: 0.25rem 0.6rem;">${t}</span>`).join('')}
            </div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div class="modal-section-title">Entregables & Capacidades Clave</div>
            <ul class="feature-list">
              ${project.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div class="modal-section-title">Arquitectura del Modelo</div>
            <div class="code-block" style="color: #93c5fd;">${project.architecture}</div>
          </div>

          <div style="margin-bottom: 1.25rem;">
            <div class="modal-section-title">Instrucción de Ejecución (CLI)</div>
            <div class="code-block">${project.setup}</div>
          </div>

          <div>
            <div class="modal-section-title">Directorio de Proyecto</div>
            <div class="code-block" style="color: #34d399;">/home/bychoke/Proyectos/50_Proyectos_Ciencia_de_Datos/${project.folder}</div>
          </div>
        ` : `
          <!-- Embedded Live Demo Tab -->
          <div class="iframe-container">
            <iframe src="${project.appUrl}" class="live-app-iframe" title="${project.title}"></iframe>
          </div>
        `}
      </div>
    `;

    elements.modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  window.switchModalTab = function(tabName) {
    state.activeTab = tabName;
    renderModalContent();
  };

  // Cerrar Modal
  function closeModal() {
    if (elements.modalOverlay) {
      elements.modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      state.activeModalProject = null;
    }
  }

  // Event Listeners
  function attachEventListeners() {
    if (elements.searchInput) {
      elements.searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProjects();
      });
    }

    if (elements.modalCloseBtn) {
      elements.modalCloseBtn.addEventListener('click', closeModal);
    }

    if (elements.modalOverlay) {
      elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) {
          closeModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
      if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput?.focus();
      }
    });
  }

  init();
});
