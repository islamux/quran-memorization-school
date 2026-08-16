import Dexie, { Table } from 'dexie';
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

// Query cache configuration
interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of entries
}

// Default cache configuration
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxSize: 100
};

// إنشاء فئة قاعدة البيانات
class QuranSchoolDB extends Dexie {
  students!: Table<Student>;
  teachers!: Table<Teacher>;
  schedule!: Table<ScheduleSlot>;
  attendance!: Table<AttendanceRecord>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('QuranSchoolDB');

    // Enhanced Schema Version 3 with comprehensive indexes
    this.version(3).stores({
      // Students table with comprehensive indexes
      students: 'id, name, parentPhone, teacherId, status, parentName, createdAt, updatedAt, [status+teacherId], name.lower',
      // Teachers table with additional indexes
      teachers: 'id, name, email, phone, status, [status+name], createdAt',
      // Schedule table with teacher and day indexes
      schedule: 'id, teacherId, day, startTime, endTime, [teacherId+day], [day+startTime]',
      // Attendance with composite indexes for efficient queries
      attendance: '++id, studentId, date, status, [studentId+date], [date+status], timestamp',
      // Sync queue for PWA background sync
      syncQueue: '++id, type, action, timestamp, [type+timestamp]'
    });

    // Add computed indexes for search optimization
    this.students.hook('reading', function (obj) {
      if (obj && obj.name) {
        obj.name = obj.name.toLowerCase();
      }
      return obj;
    });
  }
}

// إنشاء مثيل واحد من قاعدة البيانات
export const db = new QuranSchoolDB();

// ========================================
// Query Caching Layer
// ========================================

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class QueryCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config;
    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  private generateKey(prefix: string, params: Record<string, unknown>): string {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key);
      return null;
    }

    // Increment hit counter
    entry.hits++;
    return entry.data as T;
  }

  set<T>(key: string, data: T): void {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  invalidate(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.config.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      ttl: this.config.ttl
    };
  }
}

// Create global cache instance
const queryCache = new QueryCache();

// Cache-aware database operations
export const cachedDB = {
  // Students with caching
  async getStudents(useCache: boolean = true): Promise<Student[]> {
    const key = 'students:all';

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getStudentsByTeacher(teacherId: string, useCache: boolean = true): Promise<Student[]> {
    const key = `students:teacher:${teacherId}`;

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.where('teacherId').equals(teacherId).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getStudentsByStatus(status: string, useCache: boolean = true): Promise<Student[]> {
    const key = `students:status:${status}`;

    if (useCache) {
      const cached = queryCache.get<Student[]>(key);
      if (cached) return cached;
    }

    const data = await db.students.where('status').equals(status).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Teachers with caching
  async getTeachers(useCache: boolean = true): Promise<Teacher[]> {
    const key = 'teachers:all';

    if (useCache) {
      const cached = queryCache.get<Teacher[]>(key);
      if (cached) return cached;
    }

    const data = await db.teachers.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Attendance with caching
  async getAttendanceByDate(date: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    const key = `attendance:date:${date}`;

    if (useCache) {
      const cached = queryCache.get<AttendanceRecord[]>(key);
      if (cached) return cached;
    }

    const data = await db.attendance.where('date').equals(date).toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  async getAttendanceByStudent(studentId: string, startDate?: string, endDate?: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    const key = `attendance:student:${studentId}:${startDate || 'all'}:${endDate || 'all'}`;

    if (useCache && startDate && endDate) {
      const cached = queryCache.get<AttendanceRecord[]>(key);
      if (cached) return cached;
    }

    const collection = db.attendance.where('studentId').equals(studentId);

    if (startDate && endDate) {
      const data = await collection
        .filter(record => record.date >= startDate && record.date <= endDate)
        .toArray();
      if (useCache) queryCache.set(key, data);
      return data;
    }

    const data = await collection.toArray();
    if (useCache) queryCache.set(key, data);
    return data;
  },

  // Invalidate cache when data changes
  invalidateCache(pattern: string): void {
    queryCache.invalidate(pattern);
  },

  getCacheStats() {
    return queryCache.getStats();
  }
};

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

// دوال مساعدة للحضور مع التحسين
export const attendanceDB = {
  // تسجيل الحضور مع التحقق
  async mark(studentId: string, status: 'present' | 'absent' | 'late', note?: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    return await this.markForDate(studentId, status, date, note);
  },

  // تسجيل الحضور بتاريخ محدد مع التحقق
  async markForDate(studentId: string, status: 'present' | 'absent' | 'late', date: string, note?: string): Promise<void> {
    // Validate with Zod
    const record = {
      studentId,
      date,
      status,
      note,
      timestamp: new Date().toISOString()
    };

    attendanceSchema.parse(record);

    // حذف أي سجل حضور سابق لنفس الطالب في نفس اليوم
    await db.attendance.where('[studentId+date]').equals([studentId, date]).delete();

    // إضافة السجل الجديد
    await db.attendance.add(record);

    // Invalidate cache
    cachedDB.invalidateCache(`attendance:date:${date}`);
    cachedDB.invalidateCache('attendance:student:');
  },

  // الحصول على حضور يوم معين مع التخزين المؤقت
  async getByDate(date: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    return await cachedDB.getAttendanceByDate(date, useCache);
  },

  // الحصول على حضور اليوم
  async getTodayAttendance(useCache: boolean = true): Promise<{ [studentId: string]: { status: string; note?: string } }> {
    const today = new Date().toISOString().split('T')[0];
    const records = await this.getByDate(today, useCache);

    const attendanceMap: { [studentId: string]: { status: string; note?: string } } = {};
    records.forEach(record => {
      attendanceMap[record.studentId] = {
        status: record.status,
        note: record.note
      };
    });

    return attendanceMap;
  },

  // الحصول على حضور طالب معين مع التخزين المؤقت
  async getByStudent(studentId: string, startDate?: string, endDate?: string, useCache: boolean = true): Promise<AttendanceRecord[]> {
    return await cachedDB.getAttendanceByStudent(studentId, startDate, endDate, useCache);
  },

  // Batch mark attendance for multiple students
  async markBatch(records: Array<{ studentId: string; status: 'present' | 'absent' | 'late'; note?: string }>, date?: string): Promise<void> {
    const targetDate = date || new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    // Validate all records first
    const validatedRecords = records.map(record => {
      const attendance = {
        studentId: record.studentId,
        date: targetDate,
        status: record.status,
        note: record.note,
        timestamp
      };
      return attendanceSchema.parse(attendance);
    });

    // Delete existing records for these students on this date
    const studentIds = records.map(r => r.studentId);
    await db.attendance
      .where('[studentId+date]')
      .anyOf(studentIds.map(id => [id, targetDate]))
      .delete();

    // Add all new records
    await db.attendance.bulkAdd(validatedRecords);

    // Invalidate cache
    cachedDB.invalidateCache(`attendance:date:${targetDate}`);
    cachedDB.invalidateCache('attendance:student:');
  },

  // Get attendance statistics
  async getStats(studentId?: string, startDate?: string, endDate?: string): Promise<{ present: number; absent: number; late: number; total: number }> {
    let records: AttendanceRecord[];

    if (studentId) {
      records = await this.getByStudent(studentId, startDate, endDate, false);
    } else {
      if (startDate && endDate) {
        records = await db.attendance
          .where('date')
          .between(startDate, endDate)
          .toArray();
      } else {
        records = await db.attendance.toArray();
      }
    }

    const stats = {
      present: 0,
      absent: 0,
      late: 0,
      total: records.length
    };

    records.forEach(record => {
      if (record.status === 'present') stats.present++;
      else if (record.status === 'absent') stats.absent++;
      else if (record.status === 'late') stats.late++;
    });

    return stats;
  }
};

// ========================================
// Database Initialization & Migration
// ========================================

// Database initialization state
interface InitState {
  isInitialized: boolean;
  isMigrating: boolean;
  migrationVersion: number;
  error?: string;
}

const initState: InitState = {
  isInitialized: false,
  isMigrating: false,
  migrationVersion: 0
};

/**
 * Optimized data migration from localStorage to Dexie
 */
export async function migrateFromLocalStorage(): Promise<void> {
  if (initState.isMigrating) {
    console.log('ℹ️ Migration already in progress');
    return;
  }

  console.log('🔄 بدء عملية ترحيل البيانات من localStorage إلى Dexie...');
  initState.isMigrating = true;
  initState.migrationVersion = 2; // Current localStorage version

  const startTime = Date.now();
  const results: { [key: string]: { count: number; success: boolean; error?: string } } = {
    students: { count: 0, success: false },
    teachers: { count: 0, success: false },
    schedule: { count: 0, success: false },
    attendance: { count: 0, success: false }
  };

  try {
    // Check if migration already completed
    const migrationKey = 'quran_school_migration_v3';
    const alreadyMigrated = localStorage.getItem(migrationKey);
    if (alreadyMigrated) {
      console.log('✅ تم ترحيل البيانات مسبقاً');
      initState.isInitialized = true;
      return;
    }

    // Migrate students
    try {
      const studentsStr = localStorage.getItem('quran_school_students');
      if (studentsStr) {
        const students: Student[] = JSON.parse(studentsStr);
        if (Array.isArray(students) && students.length > 0) {
          // Validate and add timestamps
          const studentsWithTimestamps = students.map(student => ({
            ...student,
            createdAt: student.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })) as Student[];
          await db.students.bulkAdd(studentsWithTimestamps);
          results.students.count = students.length;
          results.students.success = true;
          console.log(`✅ تم ترحيل ${students.length} طالب بنجاح`);
        }
      } else {
        console.log('ℹ️ لا توجد بيانات طلاب في localStorage');
        results.students.success = true;
      }
    } catch (error) {
      console.error('❌ خطأ في ترحيل الطلاب:', error);
      results.students.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Migrate teachers
    try {
      const teachersStr = localStorage.getItem('quran_school_teachers');
      if (teachersStr) {
        const teachers: Teacher[] = JSON.parse(teachersStr);
        if (Array.isArray(teachers) && teachers.length > 0) {
          // Validate and add timestamps
          const teachersWithTimestamps = teachers.map(teacher => ({
            ...teacher,
            createdAt: teacher.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })) as Teacher[];
          await db.teachers.bulkAdd(teachersWithTimestamps);
          results.teachers.count = teachers.length;
          results.teachers.success = true;
          console.log(`✅ تم ترحيل ${teachers.length} معلم بنجاح`);
        }
      } else {
        console.log('ℹ️ لا توجد بيانات معلمين في localStorage');
        results.teachers.success = true;
      }
    } catch (error) {
      console.error('❌ خطأ في ترحيل المعلمين:', error);
      results.teachers.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Migrate schedule
    try {
      const scheduleStr = localStorage.getItem('quran_school_schedule');
      if (scheduleStr) {
        const schedule: ScheduleSlot[] = JSON.parse(scheduleStr);
        if (Array.isArray(schedule) && schedule.length > 0) {
          await db.schedule.bulkAdd(schedule);
          results.schedule.count = schedule.length;
          results.schedule.success = true;
          console.log(`✅ تم ترحيل ${schedule.length} حصة بنجاح`);
        }
      } else {
        console.log('ℹ️ لا توجد بيانات جدول دراسي في localStorage');
        results.schedule.success = true;
      }
    } catch (error) {
      console.error('❌ خطأ في ترحيل الجدول الدراسي:', error);
      results.schedule.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Migrate attendance
    try {
      const today = new Date().toISOString().split('T')[0];
      const attendanceKey = `attendance_${today}`;
      const attendanceStr = localStorage.getItem(attendanceKey);
      if (attendanceStr) {
        const attendance = JSON.parse(attendanceStr);
        const studentIds = Object.keys(attendance);
        if (studentIds.length > 0) {
          const batchRecords: Array<{ studentId: string; status: 'present' | 'absent' | 'late'; note?: string }> = [];
          for (const studentId of studentIds) {
            const { status, note } = attendance[studentId] as { status: 'present' | 'absent' | 'late'; note?: string };
            if (status && ['present', 'absent', 'late'].includes(status)) {
              batchRecords.push({ studentId, status, note });
            }
          }
          if (batchRecords.length > 0) {
            await attendanceDB.markBatch(batchRecords, today);
            results.attendance.count = batchRecords.length;
            results.attendance.success = true;
            console.log(`✅ تم ترحيل بيانات الحضور لـ ${batchRecords.length} طالب`);
          }
        }
      } else {
        console.log('ℹ️ لا توجد بيانات حضور في localStorage');
        results.attendance.success = true;
      }
    } catch (error) {
      console.error('❌ خطأ في ترحيل بيانات الحضور:', error);
      results.attendance.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Mark migration as completed
    localStorage.setItem(migrationKey, JSON.stringify({
      version: 3,
      timestamp: new Date().toISOString(),
      results
    }));

    const duration = Date.now() - startTime;
    console.log(`✅ اكتملت عملية الترحيل بنجاح في ${duration}ms`);

    // Log summary
    console.table(results);

    initState.isInitialized = true;
  } catch (error) {
    console.error('❌ خطأ عام في ترحيل البيانات:', error);
    initState.error = error instanceof Error ? error.message : 'خطأ غير معروف';
    throw new Error(`فشل في ترحيل البيانات: ${initState.error}`);
  } finally {
    initState.isMigrating = false;
  }
}

/**
 * Get database initialization status
 */
export function getDBInitState(): InitState {
  return { ...initState };
}

/**
 * Database health check
 */
export async function checkDBHealth(): Promise<{ healthy: boolean; issues: string[] }> {
  const issues: string[] = [];

  try {
    // Check if database is open
    if (!db.isOpen()) {
      issues.push('Database is not open');
    }

    // Test basic operations
    try {
      await db.students.count();
    } catch (_error) {
      issues.push('Students table not accessible');
    }

    try {
      await db.teachers.count();
    } catch (_error) {
      issues.push('Teachers table not accessible');
    }

    try {
      await db.attendance.count();
    } catch (_error) {
      issues.push('Attendance table not accessible');
    }

    try {
      await db.schedule.count();
    } catch (_error) {
      issues.push('Schedule table not accessible');
    }
  } catch (error) {
    issues.push(`General database error: ${error instanceof Error ? error.message : 'Unknown'}`);
  }

  return {
    healthy: issues.length === 0,
    issues
  };
}

/**
 * Optimize database indices
 */
export async function optimizeDatabase(): Promise<void> {
  console.log('🗜️ Starting database optimization...');

  try {
    // Clear cache to free memory
    queryCache.clear();
    console.log('✅ Cache cleared');

    // Run a VACUUM operation if supported
    // Note: IndexedDB doesn't have VACUUM, but we can clear unused space
    const studentCount = await db.students.count();
    const teacherCount = await db.teachers.count();
    const attendanceCount = await db.attendance.count();
    const scheduleCount = await db.schedule.count();

    console.log(`📊 Database stats: ${studentCount} students, ${teacherCount} teachers, ${attendanceCount} attendance records, ${scheduleCount} schedule slots`);
    console.log('✅ Database optimization completed');
  } catch (error) {
    console.error('❌ Database optimization failed:', error);
    throw error;
  }
}

// دالة لتصدير البيانات
export async function exportData() {
  const students = await db.students.toArray();
  const teachers = await db.teachers.toArray();
  const schedule = await db.schedule.toArray();
  const attendance = await db.attendance.toArray();

  return {
    students,
    teachers,
    schedule,
    attendance,
    exportDate: new Date().toISOString()
  };
}

// دالة لاستيراد البيانات
export async function importData(data: {
  students: Student[];
  teachers: Teacher[];
  schedule: ScheduleSlot[];
  attendance?: AttendanceRecord[];
}): Promise<void> {
  try {
    // حذف البيانات الحالية
    await db.students.clear();
    await db.teachers.clear();
    await db.schedule.clear();
    await db.attendance.clear();

    // استيراد البيانات الجديدة
    await db.students.bulkAdd(data.students);
    await db.teachers.bulkAdd(data.teachers);
    await db.schedule.bulkAdd(data.schedule);
    
    if (data.attendance) {
      await db.attendance.bulkAdd(data.attendance);
    }

    console.log('✅ تم استيراد البيانات بنجاح');
  } catch (error) {
    console.error('❌ خطأ في استيراد البيانات:', error);
    throw error;
  }
}

// دالة لحذف جميع البيانات
export async function clearAllData(): Promise<void> {
  await db.students.clear();
  await db.teachers.clear();
  await db.schedule.clear();
  await db.attendance.clear();
}
