// Script to reset the database and reinitialize with Arabic data
import { clearAllData } from '@/lib/dexieDB';
import { studentDB, teacherDB, scheduleDB } from '@/lib/dexieDB';
import { students as initialStudents, teachers as initialTeachers, scheduleSlots as initialSchedule } from '@/data/mockData';

async function resetDatabase() {
  console.log('🔄 بدء إعادة تعيين قاعدة البيانات...');
  
  try {
    // مسح جميع البيانات الحالية
    await clearAllData();
    console.log('✅ تم مسح جميع البيانات القديمة');
    
    // إضافة البيانات الأولية الجديدة
    console.log('📝 إضافة البيانات الأولية...');
    
    // إضافة المعلمين
    for (const teacher of initialTeachers) {
      await teacherDB.add(teacher);
    }
    console.log(`✅ تم إضافة ${initialTeachers.length} معلم`);
    
    // إضافة الطلاب
    for (const student of initialStudents) {
      await studentDB.add(student);
    }
    console.log(`✅ تم إضافة ${initialStudents.length} طالب`);
    
    // إضافة الجدول الدراسي
    for (const slot of initialSchedule) {
      await scheduleDB.add(slot);
    }
    console.log(`✅ تم إضافة ${initialSchedule.length} حصة دراسية`);
    
    console.log('✅ تمت إعادة تعيين قاعدة البيانات بنجاح!');
    console.log('🎉 البيانات الجديدة باللغة العربية جاهزة للاستخدام');
    
  } catch (error) {
    console.error('❌ خطأ في إعادة تعيين قاعدة البيانات:', error);
  }
}

// تشغيل السكريبت
resetDatabase();
