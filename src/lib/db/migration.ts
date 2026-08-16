import { Student, Teacher, ScheduleSlot } from '@/types';
import { db } from './schema';
import { attendanceDB } from './attendance';
import { AttendanceRecord } from './validation';

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
