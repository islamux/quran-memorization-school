// استخدام SQLite بطريقة بسيطة تشبه localStorage
import { Student, Teacher } from '@/types';

// تجنب استيراد قاعدة البيانات في جانب العميل
let studentDB: any = null;
let teacherDB: any = null;
let attendanceDB: any = null;

if (typeof window === 'undefined') {
  // فقط في جانب الخادم
  const db = require('@/lib/database');
  studentDB = db.studentDB;
  teacherDB = db.teacherDB;
  attendanceDB = db.attendanceDB;
}

// دوال بسيطة تشبه التي كنت تستخدمها مع localStorage
export const storage = {
  // الطلاب
  getStudents: (): Student[] => {
    if (typeof window !== 'undefined') {
      // في جانب العميل، استخدم localStorage
      const studentsStr = localStorage.getItem('quran_school_students');
      return studentsStr ? JSON.parse(studentsStr) : [];
    }
    return studentDB?.getAll() || [];
  },
  
  addStudent: (student: Student): void => {
    studentDB.add(student);
  },
  
  updateStudent: (id: string, updates: Partial<Student>): void => {
    studentDB.update(id, updates);
  },
  
  deleteStudent: (id: string): void => {
    studentDB.delete(id);
  },
  
  searchStudents: (query: string): Student[] => {
    return studentDB.search(query);
  },
  
  // المعلمون
  getTeachers: (): Teacher[] => {
    return teacherDB.getAll();
  },
  
  addTeacher: (teacher: Teacher): void => {
    const { students, schedule, ...teacherData } = teacher;
    teacherDB.add(teacherData);
  },
  
  // الحضور
  markAttendance: (studentId: string, status: 'present' | 'absent' | 'late', note?: string) => {
    const today = new Date().toISOString().split('T')[0];
    if (typeof window !== 'undefined') {
      // في جانب العميل، استخدم localStorage
      const attendanceKey = `attendance_${today}`;
      const todayAttendance = JSON.parse(localStorage.getItem(attendanceKey) || '{}');
      todayAttendance[studentId] = { status, note, timestamp: new Date().toISOString() };
      localStorage.setItem(attendanceKey, JSON.stringify(todayAttendance));
    } else {
      attendanceDB?.mark(studentId, today, status, note);
    }
  },
  
  getTodayAttendance: () => {
    const today = new Date().toISOString().split('T')[0];
    if (typeof window !== 'undefined') {
      const attendanceKey = `attendance_${today}`;
      return JSON.parse(localStorage.getItem(attendanceKey) || '{}');
    }
    return attendanceDB?.getByDate(today) || {};
  }
};

// دالة للترحيل من localStorage إلى SQLite (تشغل مرة واحدة)
export async function migrateFromLocalStorage() {
  if (typeof window === 'undefined') return;
  
  // التحقق من وجود بيانات في localStorage
  const oldStudents = localStorage.getItem('quran_school_students');
  const oldTeachers = localStorage.getItem('quran_school_teachers');
  
  if (oldStudents) {
    try {
      const students = JSON.parse(oldStudents);
      students.forEach((student: Student) => {
        storage.addStudent(student);
      });
      console.log('✅ تم نقل بيانات الطلاب بنجاح');
    } catch (error) {
      console.error('❌ خطأ في نقل بيانات الطلاب:', error);
    }
  }
  
  if (oldTeachers) {
    try {
      const teachers = JSON.parse(oldTeachers);
      teachers.forEach((teacher: Teacher) => {
        storage.addTeacher(teacher);
      });
      console.log('✅ تم نقل بيانات المعلمين بنجاح');
    } catch (error) {
      console.error('❌ خطأ في نقل بيانات المعلمين:', error);
    }
  }
}
