import { ScheduleBlock, SessionType, ThemeColors } from './types';

export const COLORS: Record<SessionType, string> = {
  SESSION_1: '#2E7D32', // Green
  SESSION_2: '#E65100', // Orange
  SESSION_3: '#1565C0', // Blue
  SESSION_4: '#6A1B9A', // Purple
  BREAK: '#607D8B',     // Gray
  LUNCH: '#607D8B',     // Gray (same as break)
};

export const SCHEDULE_DATA: ScheduleBlock[] = [
  // SESIÓN 1 (09:00-10:40)
  { id: 's1-1', startTimeLabel: '09:00', durationMinutes: 15, title: 'Bienvenida y encuadre', type: 'SESSION_1' },
  { id: 's1-2', startTimeLabel: '09:15', durationMinutes: 20, title: 'Neurocepción y 3 estados', type: 'SESSION_1' },
  { id: 's1-3', startTimeLabel: '09:35', durationMinutes: 20, title: 'Ventana de Tolerancia', type: 'SESSION_1' },
  { id: 's1-4', startTimeLabel: '09:55', durationMinutes: 25, title: '3 Herramientas de regulación', type: 'SESSION_1' },
  { id: 's1-5', startTimeLabel: '10:20', durationMinutes: 20, title: 'Práctica guiada', type: 'SESSION_1' },
  
  // RECESO 1
  { id: 'b1', startTimeLabel: '10:40', durationMinutes: 20, title: 'RECESO', type: 'BREAK' },

  // SESIÓN 2 (11:00-13:30)
  { id: 's2-1', startTimeLabel: '11:00', durationMinutes: 25, title: 'La Amígdala y supervivencia', type: 'SESSION_2' },
  { id: 's2-2', startTimeLabel: '11:25', durationMinutes: 25, title: 'Eje HPA y bioquímica del estrés', type: 'SESSION_2' },
  { id: 's2-3', startTimeLabel: '11:50', durationMinutes: 25, title: 'Mismatch evolutivo', type: 'SESSION_2' },
  { id: 's2-4', startTimeLabel: '12:15', durationMinutes: 30, title: 'Neuroplasticidad', type: 'SESSION_2' },
  { id: 's2-5', startTimeLabel: '12:45', durationMinutes: 30, title: 'Ejercicio: Mapa de Recursos', type: 'SESSION_2' },
  { id: 's2-6', startTimeLabel: '13:15', durationMinutes: 15, title: 'Integración y cierre mañana', type: 'SESSION_2' },

  // COMIDA
  { id: 'lunch', startTimeLabel: '13:30', durationMinutes: 90, title: 'COMIDA', type: 'LUNCH' },

  // SESIÓN 3 (15:00-16:10)
  { id: 's3-1', startTimeLabel: '15:00', durationMinutes: 15, title: 'Estados vs Rasgos', type: 'SESSION_3' },
  { id: 's3-2', startTimeLabel: '15:15', durationMinutes: 10, title: 'Priming', type: 'SESSION_3' },
  { id: 's3-3', startTimeLabel: '15:25', durationMinutes: 20, title: 'Palanca 1: Fisiología', type: 'SESSION_3' },
  { id: 's3-4', startTimeLabel: '15:45', durationMinutes: 10, title: 'Palanca 2: Enfoque', type: 'SESSION_3' },
  { id: 's3-5', startTimeLabel: '15:55', durationMinutes: 10, title: 'Palanca 3 y 4: Lenguaje e Imaginación', type: 'SESSION_3' },
  { id: 's3-6', startTimeLabel: '16:05', durationMinutes: 5, title: 'Síntesis', type: 'SESSION_3' },

  // RECESO 2
  { id: 'b2', startTimeLabel: '16:10', durationMinutes: 10, title: 'RECESO', type: 'BREAK' },

  // SESIÓN 4 (16:20-18:00)
  { id: 's4-1', startTimeLabel: '16:20', durationMinutes: 15, title: 'Validación del dolor', type: 'SESSION_4' },
  { id: 's4-2', startTimeLabel: '16:35', durationMinutes: 20, title: 'Trauma T vs t', type: 'SESSION_4' },
  { id: 's4-3', startTimeLabel: '16:55', durationMinutes: 20, title: 'Patrones de protección', type: 'SESSION_4' },
  { id: 's4-4', startTimeLabel: '17:15', durationMinutes: 20, title: 'Ejercicio: Mi patrón', type: 'SESSION_4' },
  { id: 's4-5', startTimeLabel: '17:35', durationMinutes: 15, title: 'De víctima a autor', type: 'SESSION_4' },
  { id: 's4-6', startTimeLabel: '17:50', durationMinutes: 10, title: 'Cierre del Día 1', type: 'SESSION_4' },
];
