'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { storage } from '@/utils/simpleStorage';
import { Student } from '@/types';
import { useTranslations } from 'next-intl';

export default function AttendancePage() {
  const t = useTranslations();
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // جلب الطلاب النشطين فقط
    const allStudents = storage.getStudents();
    setStudents(allStudents.filter(s => s.status === 'active'));
  }, []);

  const handleAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const saveAttendance = () => {
    Object.entries(attendance).forEach(([studentId, status]) => {
      storage.markAttendance(studentId, status);
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">تسجيل الحضور اليومي</h1>
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <p className="text-gray-600">التاريخ: {new Date().toLocaleDateString('ar')}</p>
          <p className="text-gray-600">عدد الطلاب: {students.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-right">اسم الطالب</th>
                <th className="p-4 text-center">حاضر</th>
                <th className="p-4 text-center">غائب</th>
                <th className="p-4 text-center">متأخر</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4 text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      checked={attendance[student.id] === 'present'}
                      onChange={() => handleAttendance(student.id, 'present')}
                      className="w-5 h-5 text-green-600"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      checked={attendance[student.id] === 'absent'}
                      onChange={() => handleAttendance(student.id, 'absent')}
                      className="w-5 h-5 text-red-600"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="radio"
                      name={`attendance-${student.id}`}
                      checked={attendance[student.id] === 'late'}
                      onChange={() => handleAttendance(student.id, 'late')}
                      className="w-5 h-5 text-yellow-600"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={saveAttendance}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            حفظ الحضور
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            ✅ تم حفظ الحضور بنجاح
          </div>
        )}
      </div>
    </Layout>
  );
}
