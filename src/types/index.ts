// Core types for the Quran Memorization School app

export interface Student {
  id: string;
  name: string;
  age: number;
  grade: string;
  parentName: string;
  parentPhone: string;
  email?: string;
  enrollmentDate: string;
  currentSurah: string;
  completedSurahs: string[];
  memorizedVerses: number;
  teacherId: string;
  status: 'active' | 'inactive' | 'graduated';
  notes?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  students: string[]; // Array of student IDs
  schedule: ScheduleSlot[];
  status: 'active' | 'inactive';
}

export interface ScheduleSlot {
  id: string;
  teacherId: string;
  studentIds: string[];
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
  subject: string;
  room?: string;
  type: 'individual' | 'group';
}

export interface Surah {
  id: number;
  name: string;
  arabicName: string;
  verses: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Progress {
  studentId: string;
  surahId: number;
  versesMemorized: number;
  totalVerses: number;
  lastUpdated: string;
  status: 'in-progress' | 'completed' | 'review';
}

