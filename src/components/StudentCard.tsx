'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/dataUtils';
import { useTeacherById } from '@/utils/clientDataUtils';
import { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  locale: string;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, locale }) => {
  const t = useTranslations();
  const teacher = useTeacherById(student.teacherId);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      graduated: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-600">{t(`common.grades.${student.grade}`, { defaultValue: student.grade })} • {t('studentsPage.studentCard.age')} {student.age}</p>
          </div>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(student.status)}`}>
            {t(`common.${student.status}`)}
          </span>
        </div>

        {/* studentCard in studentsPage */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('studentsPage.studentCard.currentSurah')}:</span>
            <span className="font-medium text-gray-500">{student.currentSurah}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('studentsPage.studentCard.versesMemorized')}:</span>
            <span className="font-medium text-green-600">{student.memorizedVerses}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('studentsPage.studentCard.teacher')}:</span>
            <span className="font-medium text-gray-500">{teacher?.name || t('studentsPage.studentCard.notAssigned')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{t('studentsPage.studentCard.enrolled')}:</span>
            <span className="font-medium text-gray-500">{formatDate(student.enrollmentDate)}</span>
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
};

export default StudentCard;
