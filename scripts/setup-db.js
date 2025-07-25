// إعداد قاعدة البيانات وإضافة بيانات تجريبية
const Database = require('better-sqlite3');
const path = require('path');

// إنشاء قاعدة البيانات
const db = new Database(path.join(process.cwd(), 'school.db'));

console.log('🔧 إعداد قاعدة البيانات...');

// إنشاء الجداول
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
    completedSurahs TEXT,
    memorizedVerses INTEGER DEFAULT 0,
    teacherId TEXT,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS teachers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialization TEXT,
    experience INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    studentId TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (studentId) REFERENCES students(id),
    UNIQUE(studentId, date)
  )
`);

console.log('✅ تم إنشاء الجداول بنجاح');

// إضافة بيانات تجريبية للمعلمين
const teachers = [
  {
    id: 't1',
    name: 'الشيخ أحمد محمد',
    email: 'ahmad@school.com',
    phone: '0501234567',
    specialization: JSON.stringify(['حفظ', 'تجويد']),
    experience: 10,
    status: 'active'
  },
  {
    id: 't2',
    name: 'الشيخ عبدالله السالم',
    email: 'abdullah@school.com',
    phone: '0507654321',
    specialization: JSON.stringify(['حفظ', 'تفسير']),
    experience: 8,
    status: 'active'
  }
];

const insertTeacher = db.prepare(`
  INSERT OR IGNORE INTO teachers (id, name, email, phone, specialization, experience, status)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

teachers.forEach(teacher => {
  insertTeacher.run(
    teacher.id,
    teacher.name,
    teacher.email,
    teacher.phone,
    teacher.specialization,
    teacher.experience,
    teacher.status
  );
});

console.log('✅ تم إضافة المعلمين');

// إضافة بيانات تجريبية للطلاب
const students = [
  {
    id: 's1',
    name: 'محمد أحمد علي',
    age: 12,
    grade: 'السادس',
    parentName: 'أحمد علي',
    parentPhone: '0551234567',
    enrollmentDate: '2024-01-15',
    currentSurah: 'البقرة',
    completedSurahs: JSON.stringify(['الفاتحة', 'الناس', 'الفلق']),
    memorizedVerses: 150,
    teacherId: 't1',
    status: 'active'
  },
  {
    id: 's2',
    name: 'عبدالله محمد',
    age: 11,
    grade: 'الخامس',
    parentName: 'محمد سالم',
    parentPhone: '0557654321',
    enrollmentDate: '2024-02-01',
    currentSurah: 'آل عمران',
    completedSurahs: JSON.stringify(['الفاتحة', 'البقرة']),
    memorizedVerses: 300,
    teacherId: 't1',
    status: 'active'
  },
  {
    id: 's3',
    name: 'يوسف خالد',
    age: 13,
    grade: 'السابع',
    parentName: 'خالد أحمد',
    parentPhone: '0559876543',
    enrollmentDate: '2023-09-01',
    currentSurah: 'النساء',
    completedSurahs: JSON.stringify(['الفاتحة', 'البقرة', 'آل عمران']),
    memorizedVerses: 450,
    teacherId: 't2',
    status: 'active'
  }
];

const insertStudent = db.prepare(`
  INSERT OR IGNORE INTO students 
  (id, name, age, grade, parentName, parentPhone, enrollmentDate, 
   currentSurah, completedSurahs, memorizedVerses, teacherId, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

students.forEach(student => {
  insertStudent.run(
    student.id,
    student.name,
    student.age,
    student.grade,
    student.parentName,
    student.parentPhone,
    student.enrollmentDate,
    student.currentSurah,
    student.completedSurahs,
    student.memorizedVerses,
    student.teacherId,
    student.status
  );
});

console.log('✅ تم إضافة الطلاب التجريبيين');

// عرض الإحصائيات
const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get();
const teacherCount = db.prepare('SELECT COUNT(*) as count FROM teachers').get();

console.log('\n📊 الإحصائيات:');
console.log(`   - عدد الطلاب: ${studentCount.count}`);
console.log(`   - عدد المعلمين: ${teacherCount.count}`);

console.log('\n✨ تم إعداد قاعدة البيانات بنجاح!');
console.log('🚀 يمكنك الآن تشغيل التطبيق باستخدام: npm run dev');

db.close();
