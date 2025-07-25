// نسخ احتياطي لقاعدة البيانات
const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'school.db');
const backupDir = path.join(process.cwd(), 'backups');

// إنشاء مجلد النسخ الاحتياطي إذا لم يكن موجوداً
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// إنشاء اسم ملف النسخة الاحتياطية بالتاريخ والوقت
const date = new Date();
const backupName = `backup_${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}.db`;
const backupPath = path.join(backupDir, backupName);

try {
  // نسخ ملف قاعدة البيانات
  fs.copyFileSync(dbPath, backupPath);
  console.log('✅ تم إنشاء نسخة احتياطية بنجاح');
  console.log(`📁 مكان النسخة: ${backupPath}`);
  
  // حذف النسخ القديمة (الاحتفاظ بآخر 7 نسخ فقط)
  const files = fs.readdirSync(backupDir)
    .filter(file => file.startsWith('backup_') && file.endsWith('.db'))
    .sort()
    .reverse();
  
  if (files.length > 7) {
    files.slice(7).forEach(file => {
      fs.unlinkSync(path.join(backupDir, file));
      console.log(`🗑️  تم حذف النسخة القديمة: ${file}`);
    });
  }
  
} catch (error) {
  console.error('❌ خطأ في إنشاء النسخة الاحتياطية:', error.message);
  process.exit(1);
}
