'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import { getTeacherById, formatDate } from '@/utils/dataUtils';
import { fetchStudents } from '@/utils/apiUtils';
import { Student } from '@/types';

const StudentsPage: React.FC = () => {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب الطلاب من قاعدة البيانات
  useEffect(() => {
    const loadStudents = async () => {
      setIsLoading(true);
      try {
        const students = await fetchStudents();
        setAllStudents(students);
      } catch (error) {
        console.error('Error loading students:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

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
          {isLoading ? t('studentsPage.loadingStudents') : t('studentsPage.showingStudents', { current: filteredStudents.length, total: allStudents.length })}
        </p>
      </div>

      {/* Students Grid */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-600">{t('studentsPage.loadingStudents')}</p>
          </CardContent>
        </Card>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const teacher = getTeacherById(student.teacherId);
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.grade} • {t('studentsPage.studentCard.age')} {student.age}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(student.status)}`}>
                      {t(`common.${student.status}`)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('studentsPage.studentCard.currentSurah')}:</span>
                      <span className="font-medium">{student.currentSurah}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('studentsPage.studentCard.versesMemorized')}:</span>
                      <span className="font-medium text-green-600">{student.memorizedVerses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('studentsPage.studentCard.teacher')}:</span>
                      <span className="font-medium">{teacher?.name || t('studentsPage.studentCard.notAssigned')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{t('studentsPage.studentCard.enrolled')}:</span>
                      <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/${locale}/students/${student.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        {t('studentsPage.studentCard.viewDetails')}
                      </Button>
                    </Link>
                    <Link href={`/${locale}/students/${student.id}/edit`} className="flex-1">
                      <Button size="sm" className="w-full">
                        {t('studentsPage.studentCard.edit')}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
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

