/**
 * Format key answer code to human readable label and badge styling
 */
export function extractKeyAnswer(p = {}) {
  // Check Candidate Preference
  const candidate = p['g_preguntas/g_preferencia/si_hoy_tarjeta_electoral'];
  if (candidate) {
    if (candidate === '1_ernesto_luna') return { label: 'Ernesto Luna', color: 'bg-blue-100 text-blue-800' };
    if (candidate === '5_indeciso') return { label: 'Indeciso', color: 'bg-amber-100 text-amber-800' };
    if (candidate === '3_otro') return { label: 'Otro', color: 'bg-slate-100 text-slate-800' };
  }

  // Check Gestión evaluation
  const gestion = p['aspectos_politicos_sociales/g_gestion/gestion'];
  if (gestion) {
    let color = 'bg-slate-100 text-slate-800';
    if (gestion === '1_excelente' || gestion === '2_buena') {
      color = 'bg-emerald-100 text-emerald-800';
    } else if (gestion === '3_regular') {
      color = 'bg-amber-100 text-amber-800'; // Amarillo para Regular
    } else if (gestion === '4_malo' || gestion === '5_muy_malo') {
      color = 'bg-rose-100 text-rose-800'; // Rojo para Malo / Muy Malo
    }
    const cleaned = String(gestion).replace(/^[0-9]+_/, '').replace(/_/g, ' ');
    const cap = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    return { label: `Gestión: ${cap}`, color };
  }

  // Check Propensión
  const propension = p['g_preguntas/g_propension/si_elecciones_domingo'];
  if (propension) {
    if (propension === '1_def_si') return { label: 'Votará: Def. Sí', color: 'bg-emerald-100 text-emerald-800' };
    if (propension === '2_prob_si') return { label: 'Votará: Prob. Sí', color: 'bg-blue-100 text-blue-800' };
  }

  return { label: p.categoria || 'Registrado', color: 'bg-slate-100 text-slate-700' };
}

/**
 * Sort features array by field and direction
 */
export function sortFeatures(features = [], sortField = 'id', sortAsc = false) {
  return [...features].sort((a, b) => {
    const pA = a.properties || {};
    const pB = b.properties || {};

    let valA = pA[sortField] || '';
    let valB = pB[sortField] || '';

    if (sortField === 'submission_time') {
      valA = new Date(valA).getTime() || 0;
      valB = new Date(valB).getTime() || 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });
}
