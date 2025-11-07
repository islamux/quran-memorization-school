import Dexie, { Table } from 'dexie';
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
  type: 'student' | 'attendance' | 'teacher';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
}

// إنشاء فئة قاعدة البيانات
class QuranSchoolDB extends Dexie {
  students!: Table<Student>;
  teachers!: Table<Teacher>;
  schedule!: Table<ScheduleSlot>;
  attendance!: Table<AttendanceRecord>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('QuranSchoolDB');
    
    // تعريف المخطط (Schema)
    this.version(2).stores({
      students: 'id, name, parentPhone, teacherId, status',
      teachers: 'id, name, email, phone, status',
      schedule: 'id, teacherId, day',
      attendance: '++id, studentId, date, [studentId+date]',
      syncQueue: '++id, type, action, timestamp'
    });
  }
}

// إنشاء مثيل واحد من قاعدة البيانات
export const db = new QuranSchoolDB();

// دوال مساعدة للطلاب
export const studentDB = {
  // الحصول على جميع الطلاب
  async getAll(): Promise<Student[]> {
    return await db.students.toArray();
  },

  // الحصول على طالب واحد
  async getById(id: string): Promise<Student | undefined> {
    return await db.students.get(id);
  },

  // إضافة طالب جديد
  async add(student: Student): Promise<void> {
    await db.students.add(student);
  },

  // تحديث طالب
  async update(id: string, updates: Partial<Student>): Promise<void> {
    await db.students.update(id, updates);
  },

  // حذف طالب
  async delete(id: string): Promise<void> {
    await db.students.delete(id);
  },

  // البحث عن طلاب
  async search(query: string): Promise<Student[]> {
    const lowerQuery = query.toLowerCase();
    return await db.students
      .filter(student => 
        student.name.toLowerCase().includes(lowerQuery) ||
        student.parentName?.toLowerCase().includes(lowerQuery) ||
        student.parentPhone?.includes(query)
      )
      .toArray();
  }
};

// دوال مساعدة للمعلمين
export const teacherDB = {
  // الحصول على جميع المعلمين
  async getAll(): Promise<Teacher[]> {
    return await db.teachers.toArray();
  },

  // الحصول على معلم واحد
  async getById(id: string): Promise<Teacher | undefined> {
    return await db.teachers.get(id);
  },

  // إضافة معلم جديد
  async add(teacher: Teacher): Promise<void> {
    await db.teachers.add(teacher);
  },

  // تحديث معلم
  async update(id: string, updates: Partial<Teacher>): Promise<void> {
    await db.teachers.update(id, updates);
  },

  // حذف معلم
  async delete(id: string): Promise<void> {
    await db.teachers.delete(id);
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

// دوال مساعدة للحضور
export const attendanceDB = {
  // تسجيل الحضور
  async mark(studentId: string, status: 'present' | 'absent' | 'late', note?: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const timestamp = new Date().toISOString();
    
    // حذف أي سجل حضور سابق لنفس الطالب في نفس اليوم
    await db.attendance.where('[studentId+date]').equals([studentId, date]).delete();
    
    // إضافة السجل الجديد
    await db.attendance.add({
      studentId,
      date,
      status,
      note,
      timestamp
    });
  },

  // تسجيل الحضور بتاريخ محدد
  async markForDate(studentId: string, status: 'present' | 'absent' | 'late', date: string, note?: string): Promise<void> {
    const timestamp = new Date().toISOString();
    
    // حذف أي سجل حضور سابق لنفس الطالب في نفس اليوم
    await db.attendance.where('[studentId+date]').equals([studentId, date]).delete();
    
    // إضافة السجل الجديد
    await db.attendance.add({
      studentId,
      date,
      status,
      note,
      timestamp
    });
  },

  // الحصول على حضور يوم معين
  async getByDate(date: string): Promise<AttendanceRecord[]> {
    return await db.attendance.where('date').equals(date).toArray();
  },

  // الحصول على حضور اليوم
  async getTodayAttendance(): Promise<{ [studentId: string]: { status: string; note?: string } }> {
    const today = new Date().toISOString().split('T')[0];
    const records = await db.attendance.where('date').equals(today).toArray();
    
    const attendanceMap: { [studentId: string]: { status: string; note?: string } } = {};
    records.forEach(record => {
      attendanceMap[record.studentId] = {
        status: record.status,
        note: record.note
      };
    });
    
    return attendanceMap;
  },

  // الحصول على حضور طالب معين
  async getByStudent(studentId: string, startDate?: string, endDate?: string): Promise<AttendanceRecord[]> {
    let collection = db.attendance.where('studentId').equals(studentId);
    
    if (startDate && endDate) {
      return await collection
        .filter(record => record.date >= startDate && record.date <= endDate)
        .toArray();
    }
    
    return await collection.toArray();
  }
};

// دالة لترحيل البيانات من localStorage إلى Dexie
export async function migrateFromLocalStorage(): Promise<void> {
  console.log('🔄 بدء عملية ترحيل البيانات من localStorage إلى Dexie...');

  try {
    // ترحيل الطلاب
    const studentsStr = localStorage.getItem('quran_school_students');
    if (studentsStr) {
      const students: Student[] = JSON.parse(studentsStr);
      const count = students.length;
      await db.students.bulkAdd(students);
      console.log(`✅ تم ترحيل ${count} طالب بنجاح`);
    } else {
      console.log('ℹ️ لا توجد بيانات طلاب في localStorage');
    }

    // ترحيل المعلمين
    const teachersStr = localStorage.getItem('quran_school_teachers');
    if (teachersStr) {
      const teachers: Teacher[] = JSON.parse(teachersStr);
      const count = teachers.length;
      await db.teachers.bulkAdd(teachers);
      console.log(`✅ تم ترحيل ${count} معلم بنجاح`);
    } else {
      console.log('ℹ️ لا توجد بيانات معلمين في localStorage');
    }

    // ترحيل الجدول الدراسي
    const scheduleStr = localStorage.getItem('quran_school_schedule');
    if (scheduleStr) {
      const schedule: ScheduleSlot[] = JSON.parse(scheduleStr);
      const count = schedule.length;
      await db.schedule.bulkAdd(schedule);
      console.log(`✅ تم ترحيل ${count} حصة بنجاح`);
    } else {
      console.log('ℹ️ لا توجد بيانات جدول دراسي في localStorage');
    }

    // ترحيل الحضور
    const today = new Date().toISOString().split('T')[0];
    const attendanceKey = `attendance_${today}`;
    const attendanceStr = localStorage.getItem(attendanceKey);
    if (attendanceStr) {
      const attendance = JSON.parse(attendanceStr);
      const studentIds = Object.keys(attendance);
      for (const studentId of studentIds) {
        const { status, note } = attendance[studentId] as any;
        await attendanceDB.mark(studentId, status, note);
      }
      console.log(`✅ تم ترحيل بيانات الحضور لـ ${studentIds.length} طالب`);
    } else {
      console.log('ℹ️ لا توجد بيانات حضور في localStorage');
    }

    console.log('✅ اكتملت عملية الترحيل بنجاح');
  } catch (error) {
    console.error('❌ خطأ في ترحيل البيانات:', error);
    // إعادة رمي الخطأ ليتم التعامل معه في المستوى الأعلى
    throw new Error(`فشل في ترحيل البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
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
