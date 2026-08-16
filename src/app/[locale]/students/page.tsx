'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Plus, Users } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import PageHeader from '@/components/ui/PageHeader';
import EmptyState from '@/components/ui/EmptyState';
import { useData } from '@/contexts/DexieDataContext';
import dynamic from 'next/dynamic';
import { VirtualizedList } from '@/components/ui/VirtualizedList';
import { StudentCardSkeleton } from '@/components/ui/LoadingSkeleton';

// Lazy load heavy components
const StudentCard = dynamic(() => import('@/components/StudentCard'), {
  loading: () => <StudentCardSkeleton />,
  ssr: false
});

const StudentsPage: React.FC = () => {
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const { students: allStudents, loading } = useData();

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

  const uniqueGrades = Array.from(new Set(allStudents.map(s => s.grade))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={t('studentsPage.title')}
        subtitle={t('studentsPage.subtitle')}
        action={
          <Link href={`/${locale}/students/add-student`}>
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              {t('studentsPage.addNewStudent')}
            </Button>
          </Link>
        }
      />

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

      {/* Students Grid or Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <StudentCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredStudents.length > 0 ? (
        // Use virtualized list for large datasets (200+ students)
        filteredStudents.length > 200 ? (
          <div className="h-[800px]">
            <VirtualizedList
              items={filteredStudents}
              itemHeight={280}
              overscan={3}
              renderItem={(student) => (
                <div className="p-3">
                  <StudentCard student={student} locale={locale} />
                </div>
              )}
            />
          </div>
        ) : (
          // Use regular grid for smaller datasets
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard key={student.id} student={student} locale={locale} />
            ))}
          </div>
        )
      ) : (
        <EmptyState
          icon={Users}
          title={t('studentsPage.noStudentsFound')}
          description={
            searchQuery || statusFilter !== 'all' || gradeFilter !== 'all'
              ? t('studentsPage.adjustSearchCriteria')
              : t('studentsPage.getStartedMessage')
          }
          action={
            !searchQuery && statusFilter === 'all' && gradeFilter === 'all' ? (
              <Link href={`/${locale}/students/add-student`}>
                <Button>{t('studentsPage.addFirstStudent')}</Button>
              </Link>
            ) : undefined
          }
        />
      )}
    </div>
  );
};

export default StudentsPage;

