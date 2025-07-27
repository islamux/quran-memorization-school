'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Student, Teacher } from '@/types';
import { 
  getStoredStudents, 
  getStoredTeachers, 
  addStudent as addStudentToDB,
  updateStudent as updateStudentInDB,
  deleteStudent as deleteStudentFromDB,
  addTeacher as addTeacherToDB,
  updateTeacher as updateTeacherInDB,
  deleteTeacher as deleteTeacherFromDB
} from '@/utils/dexieStorage';
import deletionService, { DeletionOptions, DeletionResult, DeletionCheck } from '@/services/deletionService';

interface DataContextType {
  students: Student[];
  teachers: Teacher[];
  allStudents: Student[]; // يتضمن المحذوفين
  allTeachers: Teacher[]; // يتضمن المحذوفين
  addStudent: (student: Student) => Promise<void>;
  updateStudent: (id: string, updates: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string, options?: DeletionOptions) => Promise<DeletionResult>;
  checkStudentDeletion: (id: string) => Promise<DeletionCheck | null>;
  addTeacher: (teacher: Teacher) => Promise<void>;
  updateTeacher: (id: string, updates: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string, options?: DeletionOptions) => Promise<DeletionResult>;
  checkTeacherDeletion: (id: string) => Promise<DeletionCheck | null>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل البيانات من قاعدة البيانات
  const loadData = async () => {
    try {
      const [studentsData, teachersData] = await Promise.all([
        getStoredStudents(),
        getStoredTeachers()
      ]);
      setAllStudents(studentsData);
      setAllTeachers(teachersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // تصفية العناصر المحذوفة
  const students = allStudents.filter(s => s.isDeleted !== true);
  const teachers = allTeachers.filter(t => t.isDeleted !== true);

  const addStudent = async (student: Student) => {
    await addStudentToDB(student);
    await loadData(); // إعادة تحميل البيانات
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    await updateStudentInDB(id, updates);
    await loadData();
  };

  const checkStudentDeletion = async (id: string): Promise<DeletionCheck | null> => {
    const student = allStudents.find(s => s.id === id);
    if (!student) return null;
    
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
      const result = await deletionService.deleteStudent(student, {
        softDelete: true,
        archiveData: true,
        notifyRelatedUsers: false,
        performerId: 'current-user',
        ...options
      });

      if (result.success) {
        // soft delete
        await updateStudentInDB(id, { 
          status: 'inactive', 
          isDeleted: true, 
          deletedAt: new Date().toISOString() 
        });
        
        // إزالة الطالب من قائمة معلمه
        if (student.teacherId) {
          const teacher = allTeachers.find(t => t.id === student.teacherId);
          if (teacher) {
            await updateTeacherInDB(teacher.id, {
              students: teacher.students.filter(sid => sid !== id)
            });
          }
        }
        
        await loadData();
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: `خطأ في حذف الطالب: ${error.message}`
      };
    }
  };

  const addTeacher = async (teacher: Teacher) => {
    await addTeacherToDB(teacher);
    await loadData();
  };

  const updateTeacher = async (id: string, updates: Partial<Teacher>) => {
    await updateTeacherInDB(id, updates);
    await loadData();
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
        await updateTeacherInDB(id, { 
          status: 'inactive', 
          isDeleted: true, 
          deletedAt: new Date().toISOString() 
        });
        
        await loadData();
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        message: `خطأ في حذف المعلم: ${error.message}`
      };
    }
  };

  if (isLoading) {
    return <div>جاري تحميل البيانات...</div>;
  }

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
        refreshData: loadData
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
