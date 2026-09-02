/**
 * Human-readable mappings for survey question titles and value labels
 */
export const QUESTION_LABELS = {
  // Demographic & System
  'S0/cedula_encuestador': 'Cédula Encuestador',
  'S0/_xm_s0_nombreapellido': 'Nombre Encuestador',
  'S0/nombre_apellido': 'Nombre Encuestador',
  'S1/par': 'Parroquia (Código)',
  'S1/sec': 'Sector (Código)',
  'S2/sexo': 'Sexo',
  'S2/edad': 'Edad',
  'g_filtro/inscrito_registro': 'Inscrito en CNE',

  // Intención de Voto y Clima Electoral
  'g_preguntas/g_propension/si_elecciones_domingo': 'Propensión a Votar',
  'g_preguntas/g_preferencia/si_hoy_tarjeta_electoral': 'Candidato Preferido',
  'g_preguntas/g_identificación/tendencia_politica': 'Tendencia Política',
  'g_preguntas/g_percibido/cual_candidato_cree': 'Candidato Percibido Ganador',
  'g_preguntas/g_motivacion/principal_motivacion': 'Principal Motivación para Votar',
  'g_preguntas/g_clima/propaganda': 'Percepción Clima / Propaganda',
  'g_preguntas/g_transparencia/nivel_confianza': 'Nivel de Confianza Electoral',
  'g_preguntas/g_voto/cambio_voto': 'Firmeza de la Decisión',
  'g_preguntas/g_animo/animo': 'Ánimo de la Población',

  // Aspectos Políticos y Sociales
  'aspectos_politicos_sociales/g_gestion/gestion': 'Evaluación de Gestión',
  'aspectos_politicos_sociales/g_infraestructura/infraestructura': 'Infraestructura',
  'aspectos_politicos_sociales/g_servicios_publicos/servicios_publicos': 'Servicios Públicos',
  'aspectos_politicos_sociales/g_salud/salud': 'Servicio de Salud',
  'aspectos_politicos_sociales/g_desarrollo_economico/desarrollo_economico': 'Desarrollo Económico',
  'aspectos_politicos_sociales/g_seguridad/seguridad': 'Seguridad Ciudadana',
  'aspectos_politicos_sociales/g_programas_sociales/programas_sociales': 'Programas Sociales',
  'aspectos_politicos_sociales/g_transparencia/transparencia': 'Transparencia de Información',
  'aspectos_politicos_sociales/g_participación_ciudadana/participación_ciudadana': 'Participación Ciudadana',
  'aspectos_politicos_sociales/g_aprobacion/aprobacion': 'Aprobación y Confianza'
};

const VALUE_LABEL_MAP = {
  // Demográficos
  '1_masculino': 'Masculino',
  '2_femenino': 'Femenino',
  '1': 'Sí (Inscrito en CNE)',
  '2': 'No (No Inscrito)',

  // Propensión & Candidato Preferido
  '1_def_si': 'Definitivamente Sí',
  '2_prob_si': 'Probablemente Sí',
  '3_dudas': 'Tiene Dudas / Lo Está Pensando',
  '4_prob_no': 'Probablemente No',
  '5_def_no': 'Definitivamente No',

  '1_ernesto_luna': 'Ernesto Luna',
  '2_unidad': 'Candidato Oposición / Unidad',
  '3_otro_independiente': 'Otro Candidato Independiente',
  '4_voto_nulo': 'Voto Nulo / Blanco',
  '5_indeciso': 'Indeciso / No Sabe',

  // Tendencia Política & Candidato Percibido
  '1_psuv': 'PSUV / Oficialismo',
  '2_oposicion_democratica': 'Oposición Democrática',
  '3_independiente': 'Independiente / Ni-Ni',
  '4_no_responde': 'No Responde / Reservado',
  '5_oposicion_radical': 'Oposición Radical',
  '3_otro_ns': 'Otro / No Sabe',

  // Motivación, Clima, Confianza & Ánimo
  '1_ratificar': 'Ratificar la Gestión Actual',
  '2_castigar': 'Buscar Cambio / Castigar Gestión',
  '3_problemas': 'Resolver Problemas de la Comunidad',
  '4_lealtad': 'Lealtad al Partido / Ideología',
  '5_otro': 'Otra Motivación',

  '1_muchisima': 'Muchísima Propaganda',
  '2_poca': 'Poca Propaganda',
  '3_ninguna': 'Ninguna Propaganda',

  '1_alta': 'Alta Confianza',
  '2_mediana': 'Mediana Confianza',
  '3_baja': 'Baja Confianza',
  '4_ninguna': 'Ninguna Confianza',

  '1_ult_hora': 'Puede Cambiar a Última Hora',
  '2_decidido': 'Voto Totalmente Decidido',

  '1_esperanza': 'Esperanza',
  '2_escepticismo': 'Escepticismo',
  '3_frustracion': 'Frustración',
  '4_incertidumbre': 'Incertidumbre',

  // Encuesta Aspectos Políticos y Sociales
  '1_excelente': 'Excelente',
  '2_buena': 'Buena',
  '3_regular': 'Regular',
  '4_malo': 'Malo',
  '5_muy_malo': 'Muy Malo',

  '1_muy_favorable': 'Muy Favorable',
  '2_favorable': 'Favorable',
  '3_indiferente': 'Indiferente / Regular',
  '4_desfavorable': 'Desfavorable',
  '5_muy_desfavorable': 'Muy Desfavorable',

  '1_mejorado_notablemente': 'Mejorado Notablemente',
  '2_mejorado_poco': 'Mejorado Poco',
  '3_sigue_igual': 'Sigue Igual',
  '4_empeorado': 'Empeorado',
  '5_empeorado_draticamente': 'Empeorado Drásticamente',

  '1_muy_buena': 'Muy Buena',
  '4_mala': 'Mala',
  '5_muy_mala': 'Muy Mala',

  '1_totalmente_deacuerdo': 'Totalmente de Acuerdo',
  '2_deacuerdo': 'De Acuerdo',
  '3_nideacuerdo_nidesacuerdo': 'Ni de Acuerdo ni en Desacuerdo',
  '4_en_desacuerdo': 'En Desacuerdo',
  '5_totalmente_en_desacuerdo': 'Totalmente en Desacuerdo',

  '1_muy_seguros': 'Muy Seguros',
  '2_seguros': 'Seguros',
  '3_niseguros_ni_inseguros': 'Ni Seguros ni Inseguros',
  '4_inseguros': 'Inseguros',
  '5_muy_inseguros': 'Muy Inseguros',

  '1_siempre': 'Siempre Recibe',
  '2_casi_siempre': 'Casi Siempre Recibe',
  '3_a_veces': 'A Veces Recibe',
  '4_casi_nunca': 'Casi Nunca Recibe',
  '5_nunca': 'Nunca Recibe',

  '1_muy_informados': 'Muy Informados',
  '2_informado': 'Informados',
  '3_poco_informado': 'Poco Informados',
  '4_nada_informado': 'Nada Informados',
  '5_no_sabe': 'No Sabe',

  '1_muy_efectivos': 'Muy Efectivos',
  '2_medianamente_efectivos': 'Medianamente Efectivos',
  '3_poco_efectivos': 'Poco Efectivos',
  '4_no_efectivos': 'No Efectivos',
  '5_desconozco_mecanismos': 'Desconoce Mecanismos',

  '1_alta_confianza': 'Alta Confianza',
  '2_confianza_media': 'Confianza Media',
  '3_confianza_baja': 'Confianza Baja',
  '4_ninguna_confianza': 'Ninguna Confianza',
  '5_no_contesta': 'No Contesta'
};

/**
 * Clean & Format value labels (e.g. "1_ernesto_luna" -> "Ernesto Luna")
 */
export function formatValueLabel(val) {
  if (val === undefined || val === null || val === '') return 'No especificado';
  const str = String(val).trim();

  if (VALUE_LABEL_MAP[str]) return VALUE_LABEL_MAP[str];

  // Fallback: strip leading numbers/underscores (e.g. "4_malo" -> "Malo")
  const cleaned = str.replace(/^[0-9]+_/, '').replace(/_/g, ' ');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

const IGNORED_PREFIXES = ['_', 'meta/', 'formhub/', 'deviceid', 'today', 'start', 'end', 'id', 'uuid', 'status', 'latitude', 'longitude', 'altitude', 'precision', 'categoria', 'estado_atencion', 'observaciones', '__version__'];

/**
 * Extract all survey response key-value pairs (excluding system fields)
 */
export function extractSurveyFields(properties = {}) {
  return Object.entries(properties).filter(([key, val]) => {
    if (!val && val !== 0) return false;
    return !IGNORED_PREFIXES.some(pref => key.startsWith(pref) || key === pref);
  });
}
