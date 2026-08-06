import { Activity, Category, DEFAULT_CATEGORIES } from '../types';
import { INITIAL_ACTIVITIES } from '../data/initialData';

const ACTIVITIES_KEY = 'activity_tracker_activities_v1';
const CATEGORIES_KEY = 'activity_tracker_categories_v1';

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(CATEGORIES_KEY);
    if (!raw) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read categories from localStorage:', e);
    return DEFAULT_CATEGORIES;
  }
}

export function saveCategories(categories: Category[]): void {
  try {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories to localStorage:', e);
  }
}

export function getStoredActivities(): Activity[] {
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read activities from localStorage:', e);
    return INITIAL_ACTIVITIES;
  }
}

export function saveActivities(activities: Activity[]): void {
  try {
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(activities));
  } catch (e) {
    console.error('Failed to save activities to localStorage:', e);
  }
}

export function resetToSampleData(): { activities: Activity[]; categories: Category[] } {
  localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  return { activities: INITIAL_ACTIVITIES, categories: DEFAULT_CATEGORIES };
}

export function exportDataAsJSON(): string {
  const data = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    categories: getStoredCategories(),
    activities: getStoredActivities(),
  };
  return JSON.stringify(data, null, 2);
}

export function importDataFromJSON(jsonString: string): { activities: Activity[]; categories: Category[] } {
  const parsed = JSON.parse(jsonString);
  if (!parsed.activities || !Array.isArray(parsed.activities)) {
    throw new Error('Format file JSON tidak valid: Properti "activities" tidak ditemukan.');
  }
  const activities = parsed.activities;
  const categories = parsed.categories && Array.isArray(parsed.categories) ? parsed.categories : getStoredCategories();
  
  saveActivities(activities);
  saveCategories(categories);
  return { activities, categories };
}

// Helpers untuk kalkulasi statistik
export function formatDateIndo(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const [year, month, day] = dateString.split('-');
    if (!year || !month || !day) return dateString;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

export function getDaysRemaining(dateString?: string): { days: number; status: 'overdue' | 'today' | 'upcoming' } | null {
  if (!dateString) return null;
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = dateString.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { days: Math.abs(diffDays), status: 'overdue' };
    if (diffDays === 0) return { days: 0, status: 'today' };
    return { days: diffDays, status: 'upcoming' };
  } catch (e) {
    return null;
  }
}
