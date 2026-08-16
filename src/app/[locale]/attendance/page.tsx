'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle } from 'lucide-react';
import PageHeader from '@/components/ui/PageHeader';
import { storage } from '@/utils/dexieStorage';
import { Student } from '@/types';

export default function AttendancePage() {
  const t = useTranslations('attendancePage');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<{ [key: string]: { status: 'present' | 'absent' | 'late'; note?: string } }>({});
  const [saved, setSaved] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Set initial date in useEffect to avoid hydration mismatch
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    const loadStudents = async () => {
      const allStudents = await storage.getStudents();
      setStudents(allStudents.filter(s => s.status === 'active'));
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const loadAttendance = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        const { attendanceDB } = await import('@/lib/dexieDB');
        const records = await attendanceDB.getByDate(selectedDate);
        
        const attendanceMap: { [key: string]: { status: 'present' | 'absent' | 'late'; note?: string } } = {};
        records.forEach(record => {
          attendanceMap[record.studentId] = {
            status: record.status,
            note: record.note
          };
        });
        
        setAttendance(attendanceMap);
      } catch (error) {
        console.error('Error loading attendance:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAttendance();
  }, [selectedDate]);

  const handleAttendance = (
    studentId: string,
    status: 'present' | 'absent' | 'late',
    note?: string
  ) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status, note },
    }));
  };

  const saveAttendance = async () => {
    for (const [studentId, { status, note }] of Object.entries(attendance)) {
      await storage.markAttendanceForDate(studentId, status, selectedDate, note);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
        <PageHeader
          title={t('title')}
          action={
            <a
              href="./attendance/reports"
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
            >
              {t('viewReports')}
            </a>
          }
        />
        
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('date')}</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800 bg-white font-medium"
              />
            </div>
            <div className="flex items-end">
              <p className="text-gray-600">{t('studentCount')} {students.length}</p>
            </div>
            <div className="flex items-end">
              <p className="text-sm text-gray-500">
                {selectedDate && selectedDate.length > 0 ? 
                  new Date(selectedDate).toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
                  ''}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="mt-2 text-gray-600">{t('loadingAttendance')}</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-right text-gray-800 font-bold">{t('studentName')}</th>
                  <th className="p-4 text-center text-gray-800 font-bold">{t('present')}</th>
                  <th className="p-4 text-center text-gray-800 font-bold">{t('absent')}</th>
                  <th className="p-4 text-center text-gray-800 font-bold">{t('late')}</th>
                  <th className="p-4 text-center text-gray-800 font-bold">{t('notes')}</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-semibold text-gray-800">{student.name}</td>
                    <td className="p-4 text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id]?.status === 'present'}
                        onChange={() => handleAttendance(student.id, 'present', attendance[student.id]?.note)}
                        className="w-5 h-5 text-green-600"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id]?.status === 'absent'}
                        onChange={() => handleAttendance(student.id, 'absent', attendance[student.id]?.note)}
                        className="w-5 h-5 text-red-600"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        checked={attendance[student.id]?.status === 'late'}
                        onChange={() => handleAttendance(student.id, 'late', attendance[student.id]?.note)}
                        className="w-5 h-5 text-yellow-600"
                      />
                    </td>
                    <td className="p-4 text-center">
                      <input
                        type="text"
                        placeholder={t('notePlaceholder')}
                        value={attendance[student.id]?.note || ''}
                        onChange={(e) => handleAttendance(student.id, attendance[student.id]?.status, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-gray-700 placeholder-gray-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={saveAttendance}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 font-medium"
          >
            {t('save')}
          </button>
        </div>

        {saved && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            <CheckCircle className="w-5 h-5 inline mr-2" />
            {t('savedSuccess')}
          </div>
        )}
    </div>
  );
}
