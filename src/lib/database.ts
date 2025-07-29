// إعداد قاعدة البيانات SQLite بطريقة بسيطة
// import Database from 'better-sqlite3';
import path from 'path';
import { Student, Teacher, ScheduleSlot } from '@/types';

// مسار قاعدة البيانات
const DB_PATH = path.join(process.cwd(), 'school.db');

// إنشاء أو فتح قاعدة البيانات
let db: any = null;

// تعطيل SQLite مؤقتاً
/*
try {
  const Database = require('better-sqlite3');
  db = new Database(DB_PATH);
  console.log('Database connected successfully at:', DB_PATH);
} catch (error) {
  console.error('Failed to connect to database:', error);
  // استخدام قاعدة بيانات في الذاكرة كحل احتياطي
  try {
    const Database = require('better-sqlite3');
    db = new Database(':memory:');
    console.log('Using in-memory database as fallback');
  } catch (e) {
    console.error('SQLite is disabled, using localStorage only');
  }
}
*/

// إنشاء الجداول إذا لم تكن موجودة
export function initializeDatabase() {
  if (!db) return;
  // جدول الطلاب
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER,
      grade TEXT,
      parentName TEXT,
      parentPhone TEXT,
      email TEXT,
      enrollmentDate TEXT,
      currentSurah TEXT,
      completedSurahs TEXT, -- سيتم حفظها كـ JSON
      memorizedVerses INTEGER DEFAULT 0,
      teacherId TEXT,
      status TEXT DEFAULT 'active',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول المعلمين
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      specialization TEXT, -- سيتم حفظها كـ JSON
      experience INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // جدول الجدول الدراسي
  db.exec(`
    CREATE TABLE IF NOT EXISTS schedule (
      id TEXT PRIMARY KEY,
      teacherId TEXT,
      studentIds TEXT, -- سيتم حفظها كـ JSON
      day TEXT,
      startTime TEXT,
      endTime TEXT,
      subject TEXT,
      room TEXT,
      type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacherId) REFERENCES teachers(id)
    )
  `);

  // جدول الحضور (ميزة إضافية بسيطة)
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT NOT NULL, -- present, absent, late
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (studentId) REFERENCES students(id),
      UNIQUE(studentId, date)
    )
  `);
}

// دوال الطلاب
export const studentDB = {
  // الحصول على جميع الطلاب
  getAll: (): Student[] => {
    if (!db) return [];
    const stmt = db.prepare('SELECT * FROM students ORDER BY name');
    const rows = stmt.all();
    return rows.map((row: any) => ({
      ...row,
      completedSurahs: JSON.parse(row.completedSurahs || '[]')
    }));
  },

  // الحصول على طالب واحد
  getById: (id: string): Student | null => {
    if (!db) return null;
    const stmt = db.prepare('SELECT * FROM students WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return null;
    return {
      ...row,
      completedSurahs: JSON.parse(row.completedSurahs || '[]')
    };
  },

  // إضافة طالب جديد
  add: (student: Student): void => {
    if (!db) return;
    const stmt = db.prepare(`
      INSERT INTO students (
        id, name, age, grade, parentName, parentPhone, 
        email, enrollmentDate, currentSurah, completedSurahs, 
        memorizedVerses, teacherId, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      student.id,
      student.name,
      student.age,
      student.grade,
      student.parentName,
      student.parentPhone,
      student.email || null,
      student.enrollmentDate,
      student.currentSurah,
      JSON.stringify(student.completedSurahs || []),
      student.memorizedVerses,
      student.teacherId,
      student.status,
      student.notes || null
    );
  },

  // تحديث طالب
  update: (id: string, updates: Partial<Student>): void => {
    if (!db) return;
    const currentStudent = studentDB.getById(id);
    if (!currentStudent) return;

    const updatedStudent = { ...currentStudent, ...updates };
    const stmt = db.prepare(`
      UPDATE students 
      SET name = ?, age = ?, grade = ?, parentName = ?, 
          parentPhone = ?, email = ?, currentSurah = ?, 
          completedSurahs = ?, memorizedVerses = ?, 
          teacherId = ?, status = ?, notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      updatedStudent.name,
      updatedStudent.age,
      updatedStudent.grade,
      updatedStudent.parentName,
      updatedStudent.parentPhone,
      updatedStudent.email || null,
      updatedStudent.currentSurah,
      JSON.stringify(updatedStudent.completedSurahs || []),
      updatedStudent.memorizedVerses,
      updatedStudent.teacherId,
      updatedStudent.status,
      updatedStudent.notes || null,
      id
    );
  },

  // حذف طالب
  delete: (id: string): void => {
    if (!db) return;
    const stmt = db.prepare('DELETE FROM students WHERE id = ?');
    stmt.run(id);
  },

  // البحث عن طلاب
  search: (query: string): Student[] => {
    if (!db) return [];
    const stmt = db.prepare(`
      SELECT * FROM students 
      WHERE name LIKE ? OR parentName LIKE ? OR parentPhone LIKE ?
      ORDER BY name
    `);
    const searchTerm = `%${query}%`;
    const rows = stmt.all(searchTerm, searchTerm, searchTerm);
    return rows.map((row: any) => ({
      ...row,
      completedSurahs: JSON.parse(row.completedSurahs || '[]')
    }));
  }
};

// دوال المعلمين
export const teacherDB = {
  getAll: (): Teacher[] => {
    const stmt = db.prepare('SELECT * FROM teachers ORDER BY name');
    const rows = stmt.all();
    return rows.map((row: any) => ({
      ...row,
      specialization: JSON.parse(row.specialization || '[]'),
      students: [], // سيتم ملؤها من جدول الطلاب
      schedule: []  // سيتم ملؤها من جدول الجدول
    }));
  },

  add: (teacher: Omit<Teacher, 'students' | 'schedule'>): void => {
    const stmt = db.prepare(`
      INSERT INTO teachers (id, name, email, phone, specialization, experience, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      teacher.id,
      teacher.name,
      teacher.email,
      teacher.phone,
      JSON.stringify(teacher.specialization || []),
      teacher.experience,
      teacher.status
    );
  },

  update: (id: string, updates: Partial<Teacher>): void => {
    const stmt = db.prepare(`
      UPDATE teachers 
      SET name = ?, email = ?, phone = ?, specialization = ?, 
          experience = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      updates.name,
      updates.email,
      updates.phone,
      JSON.stringify(updates.specialization || []),
      updates.experience,
      updates.status,
      id
    );
  }
};

// دوال الحضور
export const attendanceDB = {
  // تسجيل الحضور
  mark: (studentId: string, date: string, status: 'present' | 'absent' | 'late', notes?: string): void => {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO attendance (studentId, date, status, notes)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(studentId, date, status, notes || null);
  },

  // الحصول على حضور يوم معين
  getByDate: (date: string) => {
    const stmt = db.prepare('SELECT * FROM attendance WHERE date = ?');
    return stmt.all(date);
  },

  // الحصول على حضور طالب معين
  getByStudent: (studentId: string, startDate?: string, endDate?: string) => {
    let query = 'SELECT * FROM attendance WHERE studentId = ?';
    const params: any[] = [studentId];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY date DESC';
    const stmt = db.prepare(query);
    return stmt.all(...params);
  }
};

// تصدير البيانات
export function exportData() {
  const students = studentDB.getAll();
  const teachers = teacherDB.getAll();
  
  return {
    students,
    teachers,
    exportDate: new Date().toISOString()
  };
}

// استيراد البيانات
export function importData(data: { students: Student[], teachers: Teacher[] }) {
  // استيراد المعلمين أولاً
  data.teachers.forEach(teacher => {
    try {
      teacherDB.add(teacher);
    } catch (error) {
      console.error('Error importing teacher:', teacher.name, error);
    }
  });

  // ثم استيراد الطلاب
  data.students.forEach(student => {
    try {
      studentDB.add(student);
    } catch (error) {
      console.error('Error importing student:', student.name, error);
    }
  });
}

// تهيئة قاعدة البيانات عند بدء التطبيق
if (db) {
  initializeDatabase();
}

export default db;
