'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Student, Teacher } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import deletionService, { DeletionOptions, DeletionResult, DeletionCheck } from '@/services/deletionService';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  allStudents: Student[]; // يتضمن المحذوفين
  allTeachers: Teacher[]; // يتضمن المحذوفين
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string, options?: DeletionOptions) => Promise<DeletionResult>;
  checkStudentDeletion: (id: string) => Promise<DeletionCheck | null>;
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string, options?: DeletionOptions) => Promise<DeletionResult>;
  checkTeacherDeletion: (id: string) => Promise<DeletionCheck | null>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Default teachers data
const defaultTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'الشيخ أحمد محمد',
    email: 'ahmad@quranschool.com',
    phone: '+966501234567',
    specialization: ['Memorization', 'Tajweed'],
    experience: 10,
    students: [],
    schedule: [],
    status: 'active',
    isDeleted: false
  },
  {
    id: 'teacher-2',
    name: 'الأستاذ عبدالله السالم',
    email: 'abdullah@quranschool.com',
    phone: '+966502345678',
    specialization: ['Tajweed', 'Recitation'],
    experience: 8,
    students: [],
    schedule: [],
    status: 'active',
    isDeleted: false
  },
  {
    id: 'teacher-3',
    name: 'الشيخ محمد الأنصاري',
    email: 'mohammed@quranschool.com',
    phone: '+966503456789',
    specialization: ['Memorization'],
    experience: 15,
    students: [],
    schedule: [],
    status: 'active',
    isDeleted: false
  }
];

// Helper function to ensure all teachers have isDeleted property
function ensureTeacherProperties(teachers: any[]): Teacher[] {
  return teachers.map(teacher => ({
    ...teacher,
    isDeleted: teacher.isDeleted ?? false
  }));
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [allStudents, setAllStudents] = useLocalStorage<Student[]>('students', []);
  const [rawTeachers, setRawTeachers] = useLocalStorage<Teacher[]>('teachers', defaultTeachers);
  
  // Ensure all teachers have the required properties
  const allTeachers = ensureTeacherProperties(rawTeachers);
  const setAllTeachers = (value: Teacher[] | ((prev: Teacher[]) => Teacher[])) => {
    if (typeof value === 'function') {
      setRawTeachers((prev) => ensureTeacherProperties(value(ensureTeacherProperties(prev))));
    } else {
      setRawTeachers(ensureTeacherProperties(value));
    }
  };
  
  console.log('DataProvider - allTeachers:', allTeachers);
  
  // تصفية العناصر المحذوفة
  const students = allStudents.filter(s => s.isDeleted !== true);
  const teachers = allTeachers.filter(t => t.isDeleted !== true);
  
  console.log('DataProvider - filtered teachers:', teachers);

  const addStudent = (student: Student) => {
    setAllStudents((prev) => [...prev, student]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setAllStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, ...updates } : student
      )
    );
  };

  const checkStudentDeletion = async (id: string): Promise<DeletionCheck | null> => {
    const student = allStudents.find(s => s.id === id);
    if (!student) return null;
    
    // محاكاة التحقق - في الواقع يجب أن يتم من خلال API
    const check = await deletionService.checkStudentDeletion(student);
    return check;
  };

  const deleteStudent = async (id: string, options?: DeletionOptions): Promise<DeletionResult> => {
    const student = allStudents.find(s => s.id === id);
    if (!student) {
      return {
        success: false,
        message: 'الطالب غير موجود'
      };
    }

    try {
      // استخدام خدمة الحذف المتقدمة
      const result = await deletionService.deleteStudent(student, {
        softDelete: true,
        archiveData: true,
        notifyRelatedUsers: false,
        performerId: 'current-user', // يجب الحصول على معرف المستخدم الحالي
        ...options
      });

      if (result.success) {
        // تحديث الحالة المحلية - soft delete
        setAllStudents((prev) => 
          prev.map((s) => 
            s.id === id 
              ? { ...s, status: 'inactive', isDeleted: true, deletedAt: new Date().toISOString() }
              : s
          )
        );

        // إزالة الطالب من قائمة معلمه
        if (student.teacherId) {
          setAllTeachers((prev) =>
            prev.map((teacher) =>
              teacher.id === student.teacherId
                ? { ...teacher, students: teacher.students.filter(sid => sid !== id) }
                : teacher
            )
          );
        }
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف الطالب: ${error.message}`
      };
    }
  };

  const addTeacher = (teacher: Teacher) => {
    console.log('DataContext addTeacher called with:', teacher);
    setAllTeachers((prev) => {
      const newTeachers = [...prev, teacher];
      console.log('New teachers array:', newTeachers);
      return newTeachers;
    });
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setAllTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updates } : teacher
      )
    );
  };

  const checkTeacherDeletion = async (id: string): Promise<DeletionCheck | null> => {
    const teacher = allTeachers.find(t => t.id === id);
    if (!teacher) return null;
    
    const check = await deletionService.checkTeacherDeletion(teacher);
    return check;
  };

  const deleteTeacher = async (id: string, options?: DeletionOptions): Promise<DeletionResult> => {
    const teacher = allTeachers.find(t => t.id === id);
    if (!teacher) {
      return {
        success: false,
        message: 'المعلم غير موجود'
      };
    }

    try {
      const result = await deletionService.deleteTeacher(teacher, {
        softDelete: true,
        archiveData: true,
        notifyRelatedUsers: true,
        performerId: 'current-user',
        ...options
      });

      if (result.success) {
        // soft delete للمعلم
        setAllTeachers((prev) => 
          prev.map((t) => 
            t.id === id 
              ? { ...t, status: 'inactive', isDeleted: true, deletedAt: new Date().toISOString() }
              : t
          )
        );
      }

      return result;
    } catch (error) {
      return {
        success: false,
        message: `خطأ في حذف المعلم: ${error.message}`
      };
    }
  };

  return (
    <DataContext.Provider
      value={{
        students,
        teachers,
        allStudents,
        allTeachers,
        addStudent,
        updateStudent,
        deleteStudent,
        checkStudentDeletion,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        checkTeacherDeletion,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
