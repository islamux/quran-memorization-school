// استخدام SQLite بطريقة بسيطة تشبه localStorage
import { studentDB, teacherDB, attendanceDB } from '@/lib/database';
import { Student, Teacher } from '@/types';

// دوال بسيطة تشبه التي كنت تستخدمها مع localStorage
export const storage = {
  // الطلاب
  getStudents: (): Student[] => {
    return studentDB.getAll();
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
  markAttendance: (studentId: string, status: 'present' | 'absent' | 'late') => {
    const today = new Date().toISOString().split('T')[0];
    attendanceDB.mark(studentId, today, status);
  },
  
  getTodayAttendance: () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceDB.getByDate(today);
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
