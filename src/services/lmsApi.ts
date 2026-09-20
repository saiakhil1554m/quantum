/// <reference types="vite/client" />
import { CircuitState } from '../types/quantum';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface CourseModuleData {
  id: string;
  title: string;
  description: string;
  level: string;
  xpReward: number;
  initialCircuit: CircuitState;
  targetStateDescription: string;
}

export async function fetchCourseModules(): Promise<CourseModuleData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lms/modules`);
    if (!response.ok) throw new Error('Failed to fetch modules');
    return await response.json();
  } catch (error) {
    console.error('Fetch LMS Modules error:', error);
    return [];
  }
}
