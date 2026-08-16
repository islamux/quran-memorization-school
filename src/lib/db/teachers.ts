import { Teacher } from '@/types';
import { db } from './schema';
import { cachedDB } from './cache';
import { teacherSchema } from './validation';

// دوال مساعدة للمعلمين مع التحقق من الصحة والتحسين
export const teacherDB = {
  // الحصول على جميع المعلمين
  async getAll(useCache: boolean = true): Promise<Teacher[]> {
    return await cachedDB.getTeachers(useCache);
  },

  // الحصول على معلم واحد
  async getById(id: string, useCache: boolean = false): Promise<Teacher | undefined> {
    if (useCache) {
      const all = await cachedDB.getTeachers(true);
      return all.find(t => t.id === id);
    }
    return await db.teachers.get(id);
  },

  // إضافة معلم جديد مع التحقق
  async add(teacher: Teacher): Promise<string> {
    // Validate with Zod
    const validated = teacherSchema.parse(teacher);
    const now = new Date().toISOString();
    const teacherToAdd: Teacher = {
      ...validated,
      experience: validated.experience || 0, // Default to 0 if not provided
      createdAt: now,
      updatedAt: now
    } as Teacher;

    const id = await db.teachers.add(teacherToAdd) as string;

    // Invalidate cache
    cachedDB.invalidateCache('teachers:');
    cachedDB.invalidateCache('teachers:all');

    return id;
  },

  // تحديث معلم مع التحقق
  async update(id: string, updates: Partial<Teacher>): Promise<void> {
    if (Object.keys(updates).length === 0) return;

    // Get current teacher
    const current = await db.teachers.get(id);
    if (!current) throw new Error('المعلم غير موجود');

    // Merge updates
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Validate if we have enough data
    if (updates.name || updates.email) {
      teacherSchema.partial().parse(updates);
    }

    await db.teachers.update(id, updated);

    // Invalidate cache
    cachedDB.invalidateCache('teachers:');
  },

  // حذف معلم
  async delete(id: string): Promise<void> {
    await db.teachers.delete(id);

    // Invalidate cache
    cachedDB.invalidateCache('teachers:');
  },

  // Get active teachers with caching
  async getActive(useCache: boolean = true): Promise<Teacher[]> {
    if (useCache) {
      const all = await cachedDB.getTeachers(true);
      return all.filter(t => t.status === 'active');
    }
    return await db.teachers.where('status').equals('active').toArray();
  }
};
