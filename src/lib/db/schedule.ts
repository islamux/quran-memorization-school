import { ScheduleSlot } from '@/types';
import { db } from './schema';

// دوال مساعدة للجدول الدراسي
export const scheduleDB = {
  // الحصول على جميع الحصص
  async getAll(): Promise<ScheduleSlot[]> {
    return await db.schedule.toArray();
  },

  // إضافة حصة جديدة
  async add(slot: ScheduleSlot): Promise<void> {
    await db.schedule.add(slot);
  },

  // تحديث حصة
  async update(id: string, updates: Partial<ScheduleSlot>): Promise<void> {
    await db.schedule.update(id, updates);
  },

  // حذف حصة
  async delete(id: string): Promise<void> {
    await db.schedule.delete(id);
  },

  // الحصول على حصص معلم معين
  async getByTeacherId(teacherId: string): Promise<ScheduleSlot[]> {
    return await db.schedule.where('teacherId').equals(teacherId).toArray();
  }
};
