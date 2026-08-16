import { z } from 'zod';
import { Student, Teacher, ScheduleSlot } from '@/types';

// تعريف نوع الحضور
export interface AttendanceRecord {
  id?: number;
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  note?: string;
  timestamp: string;
}

// Sync queue interface
export interface SyncQueueItem {
  id?: string;
  type: 'student' | 'attendance' | 'teacher' | 'schedule';
  action: 'create' | 'update' | 'delete';
  data: Student | Teacher | ScheduleSlot | AttendanceRecord;
  timestamp: number;
  retryCount?: number;
  lastAttempt?: number;
  maxRetries?: number;
}

// ========================================
// Zod Validation Schemas
// ========================================

// Student validation schema
const optionalStringOrNull = () =>
  z.union([z.string(), z.null(), z.undefined()])
    .optional()
    .transform(v => (!v || v.trim() === '' ? null : v));

export const studentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'الاسم مطلوب'),
  age: z.number().optional(),
  grade: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().min(1, 'رقم هاتف ولي الأمر مطلوب'),
  email: optionalStringOrNull(),
  enrollmentDate: z.string().optional(),
  currentSurah: z.string().optional(),
  completedSurahs: z.array(z.string()).default([]),
  memorizedVerses: z.number().default(0),
  teacherId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'graduated']).default('active'),
  notes: z.string().nullable().optional(),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
  deletedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Teacher validation schema
const teacherEmailTransform = () =>
  z.union([z.string(), z.null(), z.undefined()])
    .optional()
    .transform(v => {
      if (!v || v.trim() === '') return null;
      try {
        z.string().email().parse(v);
        return v;
      } catch {
        return null;
      }
    });

export const teacherSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'الاسم مطلوب'),
  email: teacherEmailTransform(),
  phone: z.string().optional(),
  specialization: z.array(z.string()).default([]),
  experience: z.number().default(0),
  students: z.array(z.string()).default([]),
  schedule: z.array(z.any()).default([]),
  status: z.enum(['active', 'inactive']).default('active'),
  isDeleted: z.boolean().optional(),
  deletedAt: z.string().optional(),
  deletedBy: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

// Attendance validation schema
export const attendanceSchema = z.object({
  id: z.number().optional(),
  studentId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'تنسيق التاريخ غير صحيح'),
  status: z.enum(['present', 'absent', 'late']),
  note: z.string().optional(),
  timestamp: z.string()
});

// Schedule validation schema
export const scheduleSchema = z.object({
  id: z.string(),
  teacherId: z.string(),
  day: z.union([
    z.literal('monday'),
    z.literal('tuesday'),
    z.literal('wednesday'),
    z.literal('thursday'),
    z.literal('friday'),
    z.literal('saturday'),
    z.literal('sunday')
  ]),
  startTime: z.string(),
  endTime: z.string(),
  studentIds: z.array(z.string()).default([]),
  subject: z.string().optional(),
  room: z.string().optional(),
  type: z.enum(['individual', 'group']).default('group')
});
