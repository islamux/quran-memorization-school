import { Student } from '@/types';
import { db } from './schema';
import { cachedDB } from './cache';
import { studentSchema } from './validation';

// دوال مساعدة للطلاب مع التحقق من الصحة والتحسين
export const studentDB = {
  // الحصول على جميع الطلاب
  async getAll(useCache: boolean = true): Promise<Student[]> {
    return await cachedDB.getStudents(useCache);
  },

  // الحصول على طالب واحد
  async getById(id: string, useCache: boolean = false): Promise<Student | undefined> {
    if (useCache) {
      const all = await cachedDB.getStudents(true);
      return all.find(s => s.id === id);
    }
    return await db.students.get(id);
  },

  // إضافة طالب جديد مع التحقق
  async add(student: Student): Promise<string> {
    // Validate with Zod
    const validated = studentSchema.parse(student);
    const now = new Date().toISOString();
    const studentToAdd: Student = {
      ...validated,
      age: validated.age || 0, // Default to 0 if not provided
      createdAt: now,
      updatedAt: now
    } as Student;

    const id = await db.students.add(studentToAdd) as string;

    // Invalidate cache
    cachedDB.invalidateCache('students:');
    cachedDB.invalidateCache('students:all');

    return id;
  },

  // تحديث طالب مع التحقق
  async update(id: string, updates: Partial<Student>): Promise<void> {
    if (Object.keys(updates).length === 0) return;

    // Get current student
    const current = await db.students.get(id);
    if (!current) throw new Error('الطالب غير موجود');

    // Merge updates
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate if we have enough data
    if (updates.name || updates.parentPhone) {
      studentSchema.partial().parse(updates);
    }

    await db.students.update(id, updated);

    // Invalidate cache
    cachedDB.invalidateCache('students:');
  },

  // حذف طالب
  async delete(id: string): Promise<void> {
    await db.students.delete(id);

    // Invalidate cache
    cachedDB.invalidateCache('students:');
  },

  // البحث عن طلاب محسن
  async search(query: string, useCache: boolean = true): Promise<Student[]> {
    const lowerQuery = query.toLowerCase();

    if (useCache) {
      const all = await cachedDB.getStudents(true);
      return all.filter(student =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.parentName?.toLowerCase().includes(lowerQuery) ||
        student.parentPhone?.includes(query)
      );
    }

    return await db.students
      .filter(student =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.parentName?.toLowerCase().includes(lowerQuery) ||
        student.parentPhone?.includes(query)
      )
      .toArray();
  },

  // Get students by teacher with caching
  async getByTeacher(teacherId: string, useCache: boolean = true): Promise<Student[]> {
    return await cachedDB.getStudentsByTeacher(teacherId, useCache);
  },

  // Get students by status with caching
  async getByStatus(status: string, useCache: boolean = true): Promise<Student[]> {
    return await cachedDB.getStudentsByStatus(status, useCache);
  }
};
