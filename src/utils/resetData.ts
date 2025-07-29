// إعادة تعيين البيانات المحلية لاستخدام البيانات الجديدة من mockData

export function resetLocalStorageData() {
  // مسح البيانات القديمة
  if (typeof window !== 'undefined') {
    localStorage.removeItem('students');
    localStorage.removeItem('teachers');
    localStorage.removeItem('attendance');
    localStorage.removeItem('schedule');
    
    // إعادة تحميل الصفحة لتطبيق البيانات الجديدة
    window.location.reload();
  }
}

// دالة لمسح بيانات محددة
export function clearStudentsData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('students');
  }
}

export function clearTeachersData() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('teachers');
  }
}

export function clearAllData() {
  if (typeof window !== 'undefined') {
    // مسح جميع البيانات المتعلقة بالتطبيق
    const keysToRemove = ['students', 'teachers', 'attendance', 'schedule', 'memorization-records'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
