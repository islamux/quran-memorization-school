'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { storage } from '@/utils/dexieStorage';
import { attendanceDB } from '@/lib/dexieDB';
import { Student } from '@/types';

interface AttendanceReport {
  studentId: string;
  studentName: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  attendanceRate: number;
}

export default function AttendanceReportsPage() {
  const t = useTranslations('attendancePage.reports');
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<AttendanceReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  useEffect(() => {
    const loadStudents = async () => {
      const allStudents = await storage.getStudents();
      setStudents(allStudents.filter(s => s.status === 'active'));
    };
    loadStudents();
  }, []);

  useEffect(() => {
    const generateReports = async () => {
      if (students.length === 0) return;
      
      try {
        const year = parseInt(selectedMonth.split('-')[0]);
        const month = parseInt(selectedMonth.split('-')[1]);
        
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        
        const reportsData: AttendanceReport[] = await Promise.all(
          students.map(async (student) => {
            const attendanceRecords = await attendanceDB.getByStudent(student.id, startDate, endDate);
            
            const presentCount = attendanceRecords.filter(r => r.status === 'present').length;
            const absentCount = attendanceRecords.filter(r => r.status === 'absent').length;
            const lateCount = attendanceRecords.filter(r => r.status === 'late').length;
            
            const totalDays = presentCount + absentCount + lateCount;
            const attendanceRate = totalDays > 0 ? ((presentCount + lateCount) / totalDays) * 100 : 0;
            
            return {
              studentId: student.id,
              studentName: student.name,
              presentCount,
              absentCount,
              lateCount,
              attendanceRate
            };
          })
        );
        
        setReports(reportsData);
      } catch (error) {
        console.error('Error generating reports:', error);
      }
    };

    generateReports();
  }, [selectedMonth, students]);

  const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-700';
    if (rate >= 75) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{t('title')}</h1>
          <a
            href="../attendance"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← {t('backToAttendance')}
          </a>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-gray-800 font-medium ml-2">{t('selectMonth')}</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 text-gray-800 bg-white"
              />
            </div>
            <div className="text-gray-700 font-medium">
              {t('enrolledStudents')}: {students.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-right text-gray-800 font-bold">{t('studentName')}</th>
                <th className="p-4 text-center text-gray-800 font-bold">{t('presentDays')}</th>
                <th className="p-4 text-center text-gray-800 font-bold">{t('absentDays')}</th>
                <th className="p-4 text-center text-gray-800 font-bold">{t('lateDays')}</th>
                <th className="p-4 text-center text-gray-800 font-bold">{t('attendanceRate')}</th>
                <th className="p-4 text-center text-gray-800 font-bold">{t('status')}</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.studentId} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-semibold text-gray-800">{report.studentName}</td>
                  <td className="p-4 text-center text-green-700 font-medium">{report.presentCount}</td>
                  <td className="p-4 text-center text-red-700 font-medium">{report.absentCount}</td>
                  <td className="p-4 text-center text-yellow-700 font-medium">{report.lateCount}</td>
                  <td className={`p-4 text-center font-bold ${getAttendanceColor(report.attendanceRate)}`}>
                    {report.attendanceRate.toFixed(1)}%
                  </td>
                  <td className="p-4 text-center">
                    {report.attendanceRate >= 90 && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">{t('excellent')}</span>
                    )}
                    {report.attendanceRate >= 75 && report.attendanceRate < 90 && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">{t('good')}</span>
                    )}
                    {report.attendanceRate < 75 && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">{t('needsFollowUp')}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 bg-emerald-50 p-4 rounded-lg">
          <h3 className="font-bold text-emerald-900 mb-2">{t('statsSummary')}</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-gray-700 font-medium">{t('avgAttendance')}</p>
              <p className="text-2xl font-bold text-emerald-900">
                {reports.length > 0
                  ? (reports.reduce((sum, r) => sum + r.attendanceRate, 0) / reports.length).toFixed(1)
                  : 0}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">{t('excellentStudents')}</p>
              <p className="text-2xl font-bold text-green-700">
                {reports.filter(r => r.attendanceRate >= 90).length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-medium">{t('needsFollowUpStudents')}</p>
              <p className="text-2xl font-bold text-red-700">
                {reports.filter(r => r.attendanceRate < 75).length}
              </p>
            </div>
          </div>
        </div>
    </div>
  );
}
