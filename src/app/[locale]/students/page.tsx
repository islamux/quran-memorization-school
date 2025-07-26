'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import { useData } from '@/contexts/DataContext';
import StudentCard from '@/components/StudentCard';
import { Student } from '@/types';

const StudentsPage: React.FC = () => {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const { students: allStudents } = useData();

  const filteredStudents = useMemo(() => {
    let students = allStudents;

    // البحث في الطلاب
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      students = students.filter(student => 
        student.name.toLowerCase().includes(lowercaseQuery) ||
        student.parentName.toLowerCase().includes(lowercaseQuery) ||
        student.grade.toLowerCase().includes(lowercaseQuery) ||
        student.currentSurah.toLowerCase().includes(lowercaseQuery)
      );
    }

    if (statusFilter !== 'all') {
      students = students.filter(student => student.status === statusFilter);
    }

    if (gradeFilter !== 'all') {
      students = students.filter(student => student.grade === gradeFilter);
    }

    return students;
  }, [searchQuery, statusFilter, gradeFilter, allStudents]);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      graduated: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const uniqueGrades = Array.from(new Set(allStudents.map(s => s.grade))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('studentsPage.title')}</h1>
          <p className="text-gray-600">{t('studentsPage.subtitle')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href={`/${locale}/students/add-student`}>
            <Button>
              <span className="mr-2">➕</span>
              {t('studentsPage.addNewStudent')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder={t('studentsPage.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: t('studentsPage.allStatus') },
                { value: 'active', label: t('common.active') },
                { value: 'inactive', label: t('common.inactive') },
                { value: 'graduated', label: t('common.graduated') },
              ]}
            />
            <Select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              options={[
                { value: 'all', label: t('studentsPage.allGrades') },
                ...uniqueGrades.map(grade => ({ value: grade, label: grade }))
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('studentsPage.showingStudents', { current: filteredStudents.length, total: allStudents.length })}
        </p>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student.id} student={student} locale={locale} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <span className="text-6xl mb-4 block">👥</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('studentsPage.noStudentsFound')}</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || gradeFilter !== 'all'
                ? t('studentsPage.adjustSearchCriteria')
                : t('studentsPage.getStartedMessage')
              }
            </p>
            {!searchQuery && statusFilter === 'all' && gradeFilter === 'all' && (
              <Link href={`/${locale}/students/add-student`}>
                <Button>{t('studentsPage.addFirstStudent')}</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentsPage;

