import { Student, Teacher, ScheduleSlot, Surah } from '@/types';
import { students as initialStudents, teachers as initialTeachers, scheduleSlots as initialSchedule, surahs } from '@/data/seedData';

const STORAGE_KEYS = {
  STUDENTS: 'quran_school_students',
  TEACHERS: 'quran_school_teachers',
  SCHEDULE: 'quran_school_schedule',
};

// Initialize data from localStorage or use mock data
const initializeData = () => {
  if (typeof window === 'undefined') return;

  // Check if data exists in localStorage
  const storedStudents = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  const storedTeachers = localStorage.getItem(STORAGE_KEYS.TEACHERS);
  const storedSchedule = localStorage.getItem(STORAGE_KEYS.SCHEDULE);

  // If no stored data, initialize with mock data
  if (!storedStudents) {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
  }
  if (!storedTeachers) {
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(initialTeachers));
  }
  if (!storedSchedule) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(initialSchedule));
  }
};

// Student operations
export const getStoredStudents = (): Student[] => {
  if (typeof window === 'undefined') return initialStudents;
  
  initializeData();
  const stored = localStorage.getItem(STORAGE_KEYS.STUDENTS);
  return stored ? JSON.parse(stored) : initialStudents;
};

export const addStudent = (student: Student): void => {
  if (typeof window === 'undefined') return;
  
  const students = getStoredStudents();
  students.push(student);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
};

export const updateStudent = (id: string, updatedStudent: Partial<Student>): void => {
  if (typeof window === 'undefined') return;
  
  const students = getStoredStudents();
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) {
    students[index] = { ...students[index], ...updatedStudent };
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }
};

export const deleteStudent = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  const students = getStoredStudents();
  const filtered = students.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
};

// Teacher operations
export const getStoredTeachers = (): Teacher[] => {
  if (typeof window === 'undefined') return initialTeachers;
  
  initializeData();
  const stored = localStorage.getItem(STORAGE_KEYS.TEACHERS);
  return stored ? JSON.parse(stored) : initialTeachers;
};

export const addTeacher = (teacher: Teacher): void => {
  if (typeof window === 'undefined') return;
  
  const teachers = getStoredTeachers();
  teachers.push(teacher);
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
};

export const updateTeacher = (id: string, updatedTeacher: Partial<Teacher>): void => {
  if (typeof window === 'undefined') return;
  
  const teachers = getStoredTeachers();
  const index = teachers.findIndex(t => t.id === id);
  if (index !== -1) {
    teachers[index] = { ...teachers[index], ...updatedTeacher };
    localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  }
};

// Schedule operations
export const getStoredSchedule = (): ScheduleSlot[] => {
  if (typeof window === 'undefined') return initialSchedule;
  
  initializeData();
  const stored = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
  return stored ? JSON.parse(stored) : initialSchedule;
};

export const addScheduleSlot = (slot: ScheduleSlot): void => {
  if (typeof window === 'undefined') return;
  
  const schedule = getStoredSchedule();
  schedule.push(slot);
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
};

export const updateScheduleSlot = (id: string, updatedSlot: Partial<ScheduleSlot>): void => {
  if (typeof window === 'undefined') return;
  
  const schedule = getStoredSchedule();
  const index = schedule.findIndex(s => s.id === id);
  if (index !== -1) {
    schedule[index] = { ...schedule[index], ...updatedSlot };
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
  }
};

export const deleteScheduleSlot = (id: string): void => {
  if (typeof window === 'undefined') return;
  
  const schedule = getStoredSchedule();
  const filtered = schedule.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(filtered));
};

// Clear all data (useful for reset)
export const clearAllData = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.TEACHERS);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
};

// Export data (for backup)
export const exportData = () => {
  if (typeof window === 'undefined') return null;
  
  return {
    students: getStoredStudents(),
    teachers: getStoredTeachers(),
    schedule: getStoredSchedule(),
    exportDate: new Date().toISOString(),
  };
};

// Import data (restore from backup)
export const importData = (data: { students: Student[], teachers: Teacher[], schedule: ScheduleSlot[] }): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
  localStorage.setItem(STORAGE_KEYS.TEACHERS, JSON.stringify(data.teachers));
  localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(data.schedule));
};
