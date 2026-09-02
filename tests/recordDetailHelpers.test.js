import { describe, it, expect } from 'vitest';
import {
  QUESTION_LABELS,
  formatValueLabel,
  extractSurveyFields
} from '../src/utils/recordDetailHelpers.js';

describe('RecordDetail Helpers', () => {
  describe('formatValueLabel', () => {
    it('returns "No especificado" for null, undefined, or empty values', () => {
      expect(formatValueLabel(null)).toBe('No especificado');
      expect(formatValueLabel(undefined)).toBe('No especificado');
      expect(formatValueLabel('')).toBe('No especificado');
    });

    it('formats known demographic values correctly', () => {
      expect(formatValueLabel('1_masculino')).toBe('Masculino');
      expect(formatValueLabel('2_femenino')).toBe('Femenino');
      expect(formatValueLabel('1')).toBe('Sí (Inscrito en CNE)');
      expect(formatValueLabel('2')).toBe('No (No Inscrito)');
    });

    it('formats known voting propensity values correctly', () => {
      expect(formatValueLabel('1_def_si')).toBe('Definitivamente Sí');
      expect(formatValueLabel('1_ernesto_luna')).toBe('Ernesto Luna');
      expect(formatValueLabel('5_indeciso')).toBe('Indeciso / No Sabe');
    });

    it('fallback strips leading numbers/underscores and capitalizes', () => {
      expect(formatValueLabel('99_unknown_option')).toBe('Unknown option');
    });
  });

  describe('extractSurveyFields', () => {
    it('filters out ignored system fields and empty values', () => {
      const properties = {
        _id: 100,
        'meta/instanceID': 'uuid:1234',
        'S0/cedula_encuestador': '12345678',
        'g_preguntas/g_propension/si_elecciones_domingo': '1_def_si',
        emptyField: null,
        blankField: ''
      };

      const fields = extractSurveyFields(properties);
      expect(fields).toEqual([
        ['S0/cedula_encuestador', '12345678'],
        ['g_preguntas/g_propension/si_elecciones_domingo', '1_def_si']
      ]);
    });
  });

  describe('QUESTION_LABELS', () => {
    it('contains expected question title mappings', () => {
      expect(QUESTION_LABELS['S2/sexo']).toBe('Sexo');
      expect(QUESTION_LABELS['S2/edad']).toBe('Edad');
      expect(QUESTION_LABELS['g_preguntas/g_propension/si_elecciones_domingo']).toBe('Propensión a Votar');
    });
  });
});
