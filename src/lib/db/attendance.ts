import { db } from './schema';
import { cachedDB } from './cache';
import { attendanceSchema, AttendanceRecord } from './validation';

// دوال مساعدة للحضور مع التحسين
export const attendanceDB = {
  // تسجيل الحضور مع التحقق
  async mark(studentId: string, status: 'present' | 'absent' | 'late', note?: string): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    return await attendanceDB.markForDate(studentId, status, date, note);
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
    const records = await attendanceDB.getByDate(today, useCache);

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
      records = await attendanceDB.getByStudent(studentId, startDate, endDate, false);
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
