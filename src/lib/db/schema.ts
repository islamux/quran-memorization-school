import Dexie, { Table } from 'dexie';
import { Student, Teacher, ScheduleSlot } from '@/types';
import { AttendanceRecord, SyncQueueItem } from './validation';

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
