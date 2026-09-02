import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle
} from 'chart.js';
import {
  BarChart3,
  Users,
  MapPin,
  TrendingUp,
  Vote,
  Activity,
  Building2,
  PieChart as PieIcon,
  ShieldCheck,
  Zap,
  HeartPulse,
  Flame,
  Smile,
  Radio,
  FileText,
  UserCheck,
  Trophy,
  CheckCircle2,
  Megaphone,
  HardHat,
  TrendingDown,
  Gift,
  Info,
  Handshake,
  Award
} from 'lucide-react';
import { formatParroquiaName } from '../utils/formattersAndFilters.js';
import { computeDistribution, computeAgeDistribution } from '../utils/dashboardAnalytics.js';
import DonutChartCard from './DashboardView/DonutChartCard.jsx';
import BarChartCard from './DashboardView/BarChartCard.jsx';
import MetricCard from './DashboardView/MetricCard.jsx';
import DistributionBarList from './DashboardView/DistributionBarList.jsx';

// Register Chart.js Modules
ChartJS.register(
  ArcElement,
  ChartTooltip,
  ChartLegend,
  CategoryScale,
  LinearScale,
  BarElement,
  ChartTitle
);

export default function DashboardView({ features = [], activeAssetUid = '' }) {
  const totalSubmissions = features.length;

  const surveyTitle = useMemo(() => {
    if (activeAssetUid === 'ajgQTzZcCG3ccEuB8dvNZc') {
      return 'Aspectos Políticos y Sociales';
    }
    return 'Intención de Voto y Clima Electoral';
  }, [activeAssetUid]);

  // Demographics
  const sexDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['S2/sexo'];
      if (val === '1_masculino') return 'Masculino';
      if (val === '2_femenino') return 'Femenino';
      return null;
    });
  }, [features]);

  const ageDistribution = useMemo(() => {
    return computeAgeDistribution(features);
  }, [features]);

  // 1. Candidate preference distribution (Donut)
  const candidateDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_preferencia/si_hoy_tarjeta_electoral'];
      if (val === '1_ernesto_luna') return 'Ernesto Luna';
      if (val === '2_unidad') return 'Candidato Oposición';
      if (val === '3_otro_independiente') return 'Otro Independiente';
      if (val === '4_voto_nulo') return 'Voto Nulo / Blanco';
      if (val === '5_indeciso') return 'Indeciso / No Sabe';
      return null;
    });
  }, [features]);

  // 2. Perceived Winner (Donut)
  const perceivedWinnerDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_percibido/cual_candidato_cree'];
      if (val === '1_ernesto_luna') return 'Ernesto Luna (Percepción)';
      if (val === '2_oposicion') return 'Candidato Oposición (Percepción)';
      if (val === '3_otro_ns') return 'Otro / Indeciso';
      return null;
    });
  }, [features]);

  // 3. Vote Firmness
  const voteFirmnessDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_voto/cambio_voto'];
      if (val === '1_ult_hora') return 'Puede Cambiar a Última Hora';
      if (val === '2_decidido') return 'Voto Totalmente Decidido';
      return null;
    });
  }, [features]);

  // 4. Propaganda Perception
  const propagandaDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_clima/propaganda'];
      if (val === '1_muchisima') return 'Muchísima';
      if (val === '2_poca') return 'Poca';
      if (val === '3_ninguna') return 'Ninguna';
      return null;
    });
  }, [features]);

  // 5. Voting Propensity distribution (Donut)
  const propensityDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_propension/si_elecciones_domingo'];
      if (val === '1_def_si') return 'Definitivamente Sí';
      if (val === '2_prob_si') return 'Probablemente Sí';
      if (val === '3_dudas') return 'Tiene Dudas';
      if (val === '4_prob_no') return 'Probablemente No';
      if (val === '5_def_no') return 'Definitivamente No';
      return null;
    });
  }, [features]);

  // 6. Political Tendency distribution (Bar)
  const tendencyDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_identificación/tendencia_politica'];
      if (val === '1_psuv') return 'PSUV / Oficialismo';
      if (val === '2_oposicion_democratica') return 'Oposición Democrática';
      if (val === '3_independiente') return 'Independiente / Ni-Ni';
      if (val === '4_no_responde') return 'No Responde';
      if (val === '5_oposicion_radical') return 'Oposición Radical';
      return null;
    });
  }, [features]);

  // 7. Parroquia distribution (Bar)
  const parroquiaDistribution = useMemo(() => {
    return computeDistribution(features, p => formatParroquiaName(p['S1/par']));
  }, [features]);

  // 8. Gestión evaluation distribution (Bar)
  const gestionDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_gestion/gestion'];
      if (val === '1_excelente') return 'Excelente';
      if (val === '2_buena') return 'Buena';
      if (val === '3_regular') return 'Regular';
      if (val === '4_malo') return 'Malo';
      if (val === '5_muy_malo') return 'Muy Malo';
      return null;
    });
  }, [features]);

  // 9. Principal Motivation distribution (Bar)
  const motivationDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_motivacion/principal_motivacion'];
      if (val === '1_ratificar') return 'Ratificar Gestión';
      if (val === '2_castigar') return 'Buscar Cambio / Castigar';
      if (val === '3_problemas') return 'Resolver Problemas';
      if (val === '4_lealtad') return 'Lealtad al Partido';
      if (val === '5_otro') return 'Otra Motivación';
      return null;
    });
  }, [features]);

  // 10. Electoral Confidence level distribution (Bar)
  const confidenceDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_transparencia/nivel_confianza'];
      if (val === '1_alta') return 'Alta Confianza';
      if (val === '2_mediana') return 'Mediana Confianza';
      if (val === '3_baja') return 'Baja Confianza';
      if (val === '4_ninguna') return 'Ninguna Confianza';
      return null;
    });
  }, [features]);

  // 11. Population Mood distribution (Bar)
  const moodDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['g_preguntas/g_animo/animo'];
      if (val === '1_esperanza') return 'Esperanza';
      if (val === '2_escepticismo') return 'Escepticismo';
      if (val === '3_frustracion') return 'Frustración';
      if (val === '4_incertidumbre') return 'Incertidumbre';
      return null;
    });
  }, [features]);

  // 12. Public Services evaluation distribution (Bar)
  const publicServicesDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_servicios_publicos/servicios_publicos'];
      if (val === '1_mejorado_notablemente') return 'Mejorado Notablemente';
      if (val === '2_mejorado_poco') return 'Mejorado Poco';
      if (val === '3_sigue_igual') return 'Sigue Igual';
      if (val === '4_empeorado') return 'Empeorado';
      if (val === '5_empeorado_draticamente') return 'Empeorado Drásticamente';
      return null;
    });
  }, [features]);

  // 13. Health Services distribution (Bar)
  const healthDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_salud/salud'];
      if (val === '1_muy_buena') return 'Muy Buena';
      if (val === '2_buena') return 'Buena';
      if (val === '3_regular') return 'Regular';
      if (val === '4_mala') return 'Mala';
      if (val === '5_muy_mala') return 'Muy Mala';
      return null;
    });
  }, [features]);

  // 14. Security distribution (Bar)
  const securityDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_seguridad/seguridad'];
      if (val === '1_muy_seguros') return 'Muy Seguros';
      if (val === '2_seguros') return 'Seguros';
      if (val === '3_niseguros_ni_inseguros') return 'Ni Seguros ni Inseguros';
      if (val === '4_inseguros') return 'Inseguros';
      if (val === '5_muy_inseguros') return 'Muy Inseguros';
      return null;
    });
  }, [features]);

  // 15. Infrastructure
  const infrastructureDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_infraestructura/infraestructura'];
      if (val === '1_muy_favorable') return 'Muy Favorable';
      if (val === '2_favorable') return 'Favorable';
      if (val === '3_indiferente') return 'Indiferente';
      if (val === '4_desfavorable') return 'Desfavorable';
      if (val === '5_muy_desfavorable') return 'Muy Desfavorable';
      return null;
    });
  }, [features]);

  // 16. Economic Development
  const economicDevelopmentDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_desarrollo_economico/desarrollo_economico'];
      if (val === '1_totalmente_deacuerdo') return 'Totalmente de Acuerdo';
      if (val === '2_deacuerdo') return 'De Acuerdo';
      if (val === '3_nideacuerdo_nidesacuerdo') return 'Ni de Acuerdo ni en Desacuerdo';
      if (val === '4_endesacuerdo') return 'En Desacuerdo';
      if (val === '5_totalmente_en_desacuerdo') return 'Totalmente en Desacuerdo';
      return null;
    });
  }, [features]);

  // 17. Social Programs
  const socialProgramsDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_programas_sociales/programas_sociales'];
      if (val === '1_siempre') return 'Siempre';
      if (val === '2_casi_siempre') return 'Casi Siempre';
      if (val === '3_algunas_veces') return 'Algunas Veces';
      if (val === '4_casi_nunca') return 'Casi Nunca';
      if (val === '5_nunca') return 'Nunca';
      return null;
    });
  }, [features]);

  // 18. Transparency & Information
  const transparencyDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_transparencia/transparencia'];
      if (val === '1_muy_informados') return 'Muy Informados';
      if (val === '2_informado') return 'Informado';
      if (val === '3_poco_informado') return 'Poco Informado';
      if (val === '4_nada_informado') return 'Nada Informado';
      if (val === '5_no_sabe') return 'No Sabe / No Responde';
      return null;
    });
  }, [features]);

  // 19. Citizen Participation
  const citizenParticipationDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_participación_ciudadana/participación_ciudadana'];
      if (val === '1_muy_efectivos') return 'Muy Efectivos';
      if (val === '2_medianamente_efectivos') return 'Medianamente Efectivos';
      if (val === '3_poco_efectivos') return 'Poco Efectivos';
      if (val === '4_no_efectivos') return 'No Efectivos';
      if (val === '5_desconozco') return 'Desconozco Mecanismos';
      return null;
    });
  }, [features]);

  // 20. Approval & Trust
  const approvalDistribution = useMemo(() => {
    return computeDistribution(features, p => {
      const val = p['aspectos_politicos_sociales/g_aprobacion/aprobacion'];
      if (val === '1_alta_confianza') return 'Alta Confianza';
      if (val === '2_confianza_media') return 'Confianza Media';
      if (val === '3_confianza_baja') return 'Confianza Baja';
      if (val === '4_sin_confianza') return 'Sin Confianza';
      if (val === '5_no_contesta') return 'No Contesta';
      return null;
    });
  }, [features]);

  // Surveyor ranking
  const surveyorDistribution = useMemo(() => {
    return computeDistribution(features, p => p.submitted_by || 'Desconocido');
  }, [features]);

  // Color Mappings per Option
  const sexColors = {
    'Masculino': '#3b82f6',
    'Femenino': '#ec4899'
  };

  const candidateColors = {
    'Ernesto Luna': '#3b82f6',
    'Candidato Oposición': '#ef4444',
    'Otro Independiente': '#f59e0b',
    'Voto Nulo / Blanco': '#64748b',
    'Indeciso / No Sabe': '#8b5cf6'
  };

  const perceivedWinnerColors = {
    'Ernesto Luna (Percepción)': '#3b82f6',
    'Candidato Oposición (Percepción)': '#ef4444',
    'Otro / Indeciso': '#8b5cf6'
  };

  const voteFirmnessColors = {
    'Voto Totalmente Decidido': '#10b981',
    'Puede Cambiar a Última Hora': '#f59e0b'
  };

  const propagandaColors = {
    'Muchísima': '#3b82f6',
    'Poca': '#f59e0b',
    'Ninguna': '#64748b'
  };

  const propensityColors = {
    'Definitivamente Sí': '#10b981',
    'Probablemente Sí': '#3b82f6',
    'Tiene Dudas': '#f59e0b',
    'Probablemente No': '#f97316',
    'Definitivamente No': '#ef4444'
  };

  const tendencyColors = {
    'PSUV / Oficialismo': '#ef4444', // Rojo para PSUV / Oficialismo
    'Oposición Democrática': '#3b82f6', // Azul para Oposición Democrática
    'Independiente / Ni-Ni': '#8b5cf6', // Púrpura
    'No Responde': '#64748b', // Slate
    'Oposición Radical': '#f97316' // Naranja
  };

  const motivationColors = {
    'Ratificar Gestión': '#3b82f6',
    'Buscar Cambio / Castigar': '#ef4444',
    'Resolver Problemas': '#10b981',
    'Lealtad al Partido': '#8b5cf6',
    'Otra Motivación': '#f59e0b'
  };

  const confidenceColors = {
    'Alta Confianza': '#10b981',
    'Mediana Confianza': '#3b82f6',
    'Baja Confianza': '#f59e0b',
    'Ninguna Confianza': '#ef4444'
  };

  const moodColors = {
    'Esperanza': '#10b981',
    'Escepticismo': '#3b82f6',
    'Frustración': '#ef4444',
    'Incertidumbre': '#f59e0b'
  };

  const evaluationColors = {
    'Excelente': '#10b981',
    'Buena': '#3b82f6',
    'Regular': '#f59e0b',
    'Malo': '#f97316',
    'Muy Malo': '#ef4444'
  };

  const healthColors = {
    'Muy Buena': '#10b981',
    'Buena': '#3b82f6',
    'Regular': '#f59e0b',
    'Mala': '#f97316',
    'Muy Mala': '#ef4444'
  };

  const servicesColors = {
    'Mejorado Notablemente': '#10b981',
    'Mejorado Poco': '#3b82f6',
    'Sigue Igual': '#f59e0b',
    'Empeorado': '#f97316',
    'Empeorado Drásticamente': '#ef4444'
  };

  const securityColors = {
    'Muy Seguros': '#10b981',
    'Seguros': '#3b82f6',
    'Ni Seguros ni Inseguros': '#f59e0b',
    'Inseguros': '#f97316',
    'Muy Inseguros': '#ef4444'
  };

  const scaleColors = {
    'Muy Favorable': '#10b981',
    'Favorable': '#3b82f6',
    'Indiferente': '#f59e0b',
    'Desfavorable': '#f97316',
    'Muy Desfavorable': '#ef4444',

    'Totalmente de Acuerdo': '#10b981',
    'De Acuerdo': '#3b82f6',
    'Ni de Acuerdo ni en Desacuerdo': '#f59e0b',
    'En Desacuerdo': '#f97316',
    'Totalmente en Desacuerdo': '#ef4444',

    'Siempre': '#10b981',
    'Casi Siempre': '#3b82f6',
    'Algunas Veces': '#f59e0b',
    'Casi Nunca': '#f97316',
    'Nunca': '#ef4444',

    'Muy Informados': '#10b981',
    'Informado': '#3b82f6',
    'Poco Informado': '#f59e0b',
    'Nada Informado': '#f97316',
    'No Sabe / No Responde': '#64748b',

    'Muy Efectivos': '#10b981',
    'Medianamente Efectivos': '#3b82f6',
    'Poco Efectivos': '#f59e0b',
    'No Efectivos': '#f97316',
    'Desconozco Mecanismos': '#64748b',

    'Alta Confianza': '#10b981',
    'Confianza Media': '#3b82f6',
    'Confianza Baja': '#f59e0b',
    'Sin Confianza': '#ef4444',
    'No Contesta': '#64748b'
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 space-y-6 bg-slate-950 text-slate-100 font-sans">
      {/* Header Banner with Active Survey Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-xl shadow-inner">
            <FileText size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Resultados y Análisis de Encuesta</span>
            <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">{surveyTitle}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
          <BarChart3 size={14} className="text-blue-400" />
          <span>{totalSubmissions} Registros Procesados</span>
        </div>
      </div>

      {/* Top Metric Cards (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Registros"
          value={totalSubmissions}
          subtext="Envíos procesados"
          icon={BarChart3}
          colorClass="text-blue-400"
          bgClass="bg-blue-500/10"
        />
        <MetricCard
          title="Encuestadores"
          value={surveyorDistribution.length}
          subtext="Personal activo en campo"
          icon={Users}
          colorClass="text-purple-400"
          bgClass="bg-purple-500/10"
        />
        <MetricCard
          title="Parroquias Cubiertas"
          value={parroquiaDistribution.length}
          subtext="Sectores monitoreados"
          icon={Building2}
          colorClass="text-amber-400"
          bgClass="bg-amber-500/10"
        />
      </div>

      {/* Demographics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sexDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="text-blue-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Distribución por Sexo</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Demografía</span>
            </div>
            <DonutChartCard data={sexDistribution} customColors={sexColors} centerLabel="Encuestados" />
          </div>
        )}

        {ageDistribution.length > 0 && (
          <BarChartCard
            title="Distribución por Rangos de Edad"
            subtitle="Grupos etarios de la muestra"
            data={ageDistribution}
            datasetLabel="Encuestados"
            color="#8b5cf6"
          />
        )}
      </div>

      {/* Main Analytical Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate Preference Chart Card */}
        {candidateDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Vote className="text-blue-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Intención de Voto por Candidato</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Encuesta Electoral</span>
            </div>
            <DonutChartCard
              data={candidateDistribution}
              customColors={candidateColors}
              centerLabel="Respuestas"
            />
          </div>
        )}

        {/* Perceived Winner Chart Card */}
        {perceivedWinnerDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Trophy className="text-amber-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Candidato Percibido Ganador</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Percepción de Victoria</span>
            </div>
            <DonutChartCard
              data={perceivedWinnerDistribution}
              customColors={perceivedWinnerColors}
              centerLabel="Percepción"
            />
          </div>
        )}

        {/* Voting Propensity Chart Card */}
        {propensityDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Propensión a Votar</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Disposición Electoral</span>
            </div>
            <DonutChartCard
              data={propensityDistribution}
              customColors={propensityColors}
              centerLabel="Votantes"
            />
          </div>
        )}

        {/* Vote Firmness */}
        {voteFirmnessDistribution.length > 0 && (
          <BarChartCard
            title="Firmeza del Voto (Decisión)"
            subtitle="Grado de firmeza de los electores"
            data={voteFirmnessDistribution}
            datasetLabel="Electores"
            customColors={voteFirmnessColors}
          />
        )}

        {/* Propaganda Perception */}
        {propagandaDistribution.length > 0 && (
          <BarChartCard
            title="Percepción de Propaganda en la Comunidad"
            subtitle="Nivel de presencia de propaganda"
            data={propagandaDistribution}
            datasetLabel="Respuestas"
            customColors={propagandaColors}
          />
        )}

        {/* Parroquia Coverage Bar Chart Card */}
        {parroquiaDistribution.length > 0 && (
          <BarChartCard
            title="Cobertura Territorial por Parroquia"
            subtitle="Distribución de encuestas por zonas"
            data={parroquiaDistribution}
            datasetLabel="Envíos"
            color="#06b6d4"
            horizontal={true}
          />
        )}

        {/* Political Tendency Bar Chart Card */}
        {tendencyDistribution.length > 0 && (
          <BarChartCard
            title="Tendencia Política Identificada"
            subtitle="Preferencia ideológica de los encuestados"
            data={tendencyDistribution}
            datasetLabel="Votos"
            customColors={tendencyColors}
          />
        )}

        {/* Principal Motivation Bar Chart Card */}
        {motivationDistribution.length > 0 && (
          <BarChartCard
            title="Principal Motivación para Votar"
            subtitle="Factores impulsores del voto"
            data={motivationDistribution}
            datasetLabel="Respuestas"
            customColors={motivationColors}
          />
        )}

        {/* Electoral Confidence Level Bar Chart Card */}
        {confidenceDistribution.length > 0 && (
          <BarChartCard
            title="Nivel de Confianza Electoral"
            subtitle="Percepción del proceso de votación"
            data={confidenceDistribution}
            datasetLabel="Respuestas"
            customColors={confidenceColors}
          />
        )}

        {/* Population Mood Bar Chart Card */}
        {moodDistribution.length > 0 && (
          <BarChartCard
            title="Ánimo de la Población"
            subtitle="Estado emocional colectivo"
            data={moodDistribution}
            datasetLabel="Respuestas"
            customColors={moodColors}
          />
        )}

        {/* Gestión Evaluation Card */}
        {gestionDistribution.length > 0 && (
          <BarChartCard
            title="Evaluación de Gestión Gubernamental"
            subtitle="Aspectos Políticos y Sociales"
            data={gestionDistribution}
            datasetLabel="Respuestas"
            customColors={evaluationColors}
          />
        )}

        {/* Infrastructure */}
        {infrastructureDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HardHat className="text-amber-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Estado de la Infraestructura</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Comunidad</span>
            </div>
            <DistributionBarList data={infrastructureDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Economic Development */}
        {economicDevelopmentDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-emerald-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Desarrollo Económico</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Percepción Económica</span>
            </div>
            <DistributionBarList data={economicDevelopmentDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Social Programs */}
        {socialProgramsDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Gift className="text-purple-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Alcance de Programas Sociales</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Frecuencia de Recepción</span>
            </div>
            <DistributionBarList data={socialProgramsDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Transparency */}
        {transparencyDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Info className="text-cyan-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Transparencia e Información</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Acceso a Información</span>
            </div>
            <DistributionBarList data={transparencyDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Citizen Participation */}
        {citizenParticipationDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Handshake className="text-indigo-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Participación Ciudadana</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Efectividad Mecanismos</span>
            </div>
            <DistributionBarList data={citizenParticipationDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Approval & Trust */}
        {approvalDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="text-yellow-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Aprobación de la Gestión</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Nivel de Confianza</span>
            </div>
            <DistributionBarList data={approvalDistribution} customColors={scaleColors} />
          </div>
        )}

        {/* Public Services Evaluation */}
        {publicServicesDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="text-amber-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Servicios Públicos</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Calidad de Servicio</span>
            </div>
            <DistributionBarList data={publicServicesDistribution} customColors={servicesColors} />
          </div>
        )}

        {/* Health Evaluation */}
        {healthDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <HeartPulse className="text-rose-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Servicio de Salud</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Atención Médica</span>
            </div>
            <DistributionBarList data={healthDistribution} customColors={healthColors} />
          </div>
        )}

        {/* Security Evaluation */}
        {securityDistribution.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={18} />
                <h3 className="font-bold text-slate-100 text-sm">Seguridad Ciudadana</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Percepción</span>
            </div>
            <DistributionBarList data={securityDistribution} customColors={securityColors} />
          </div>
        )}
      </div>
    </div>
  );
}
