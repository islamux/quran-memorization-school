'use client';

import { Student, Teacher, ScheduleSlot } from '@/types';
import { studentDB, teacherDB, scheduleDB, attendanceDB, migrateFromLocalStorage } from '@/lib/dexieDB';
import { students as initialStudents, teachers as initialTeachers, scheduleSlots as initialSchedule } from '@/data/mockData';

// متغير لتتبع حالة التهيئة
let isInitialized = false;

// دالة التهيئة
async function initializeDatabase() {
  if (isInitialized) return;
  
  try {
    // التحقق من وجود بيانات
    const existingStudents = await studentDB.getAll();
    
    if (existingStudents.length === 0) {
      // التحقق من وجود بيانات في localStorage
      const hasLocalStorageData = localStorage.getItem('quran_school_students') || 
                                  localStorage.getItem('quran_school_teachers') ||
                                  localStorage.getItem('quran_school_schedule');
      
      if (hasLocalStorageData) {
        // ترحيل البيانات من localStorage
        await migrateFromLocalStorage();
      } else {
        // استخدام البيانات الأولية
        await Promise.all(initialStudents.map(student => studentDB.add(student)));
        await Promise.all(initialTeachers.map(teacher => teacherDB.add(teacher)));
        await Promise.all(initialSchedule.map(slot => scheduleDB.add(slot)));
      }
    }
    
    isInitialized = true;
  } catch (error) {
    console.error('خطأ في تهيئة قاعدة البيانات:', error);
  }
}

// Student operations
export const getStoredStudents = async (): Promise<Student[]> => {
  await initializeDatabase();
  return await studentDB.getAll();
};

export const addStudent = async (student: Student): Promise<void> => {
  await initializeDatabase();
  await studentDB.add(student);
};

export const updateStudent = async (id: string, updatedStudent: Partial<Student>): Promise<void> => {
  await initializeDatabase();
  await studentDB.update(id, updatedStudent);
};

export const deleteStudent = async (id: string): Promise<void> => {
  await initializeDatabase();
  await studentDB.delete(id);
};

// Teacher operations
export const getStoredTeachers = async (): Promise<Teacher[]> => {
  await initializeDatabase();
  return await teacherDB.getAll();
};

export const addTeacher = async (teacher: Teacher): Promise<void> => {
  await initializeDatabase();
  await teacherDB.add(teacher);
};

export const updateTeacher = async (id: string, updatedTeacher: Partial<Teacher>): Promise<void> => {
  await initializeDatabase();
  await teacherDB.update(id, updatedTeacher);
};

export const deleteTeacher = async (id: string): Promise<void> => {
  await initializeDatabase();
  await teacherDB.delete(id);
};

// Schedule operations
export const getStoredSchedule = async (): Promise<ScheduleSlot[]> => {
  await initializeDatabase();
  return await scheduleDB.getAll();
};

export const addScheduleSlot = async (slot: ScheduleSlot): Promise<void> => {
  await initializeDatabase();
  await scheduleDB.add(slot);
};

export const updateScheduleSlot = async (id: string, updatedSlot: Partial<ScheduleSlot>): Promise<void> => {
  await initializeDatabase();
  await scheduleDB.update(id, updatedSlot);
};

export const deleteScheduleSlot = async (id: string): Promise<void> => {
  await initializeDatabase();
  await scheduleDB.delete(id);
};

// Attendance operations
export const markAttendance = async (studentId: string, status: 'present' | 'absent' | 'late', note?: string): Promise<void> => {
  await initializeDatabase();
  await attendanceDB.mark(studentId, status, note);
};

export const markAttendanceForDate = async (studentId: string, status: 'present' | 'absent' | 'late', date: string, note?: string): Promise<void> => {
  await initializeDatabase();
  await attendanceDB.markForDate(studentId, status, date, note);
};

export const getTodayAttendance = async () => {
  await initializeDatabase();
  return await attendanceDB.getTodayAttendance();
};

// Export/Import operations
export { exportData, importData, clearAllData } from '@/lib/dexieDB';

// واجهة موحدة للتوافق مع الكود القديم
export const storage = {
  // الطلاب
  getStudents: async (): Promise<Student[]> => {
    return await getStoredStudents();
  },
  
  addStudent: async (student: Student): Promise<void> => {
    await addStudent(student);
  },
  
  updateStudent: async (id: string, updates: Partial<Student>): Promise<void> => {
    await updateStudent(id, updates);
  },
  
  deleteStudent: async (id: string): Promise<void> => {
    await deleteStudent(id);
  },
  
  searchStudents: async (query: string): Promise<Student[]> => {
    await initializeDatabase();
    return await studentDB.search(query);
  },
  
  // المعلمون
  getTeachers: async (): Promise<Teacher[]> => {
    return await getStoredTeachers();
  },
  
  addTeacher: async (teacher: Teacher): Promise<void> => {
    await addTeacher(teacher);
  },
  
  // الحضور
  markAttendance: async (studentId: string, status: 'present' | 'absent' | 'late', note?: string) => {
    await markAttendance(studentId, status, note);
  },
  
  markAttendanceForDate: async (studentId: string, status: 'present' | 'absent' | 'late', date: string, note?: string) => {
    await markAttendanceForDate(studentId, status, date, note);
  },
  
  getTodayAttendance: async () => {
    return await getTodayAttendance();
  }
};
