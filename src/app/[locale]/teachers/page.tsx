'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useData } from '@/contexts/DexieDataContext';
import { Teacher } from '@/types';

const TeachersPage: React.FC = () => {
  const t = useTranslations('teachersPage');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const { teachers: allTeachers } = useData();
  console.log('Teachers page - allTeachers:', allTeachers);
  const filteredTeachers = searchQuery
    ? allTeachers.filter(teacher =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.some(spec => 
        spec.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    : allTeachers;

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const { students: allStudents } = useData();

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
    const students = allStudents.filter(student => student.teacherId === teacher.id);
    const schedule: any[] = []; // Temporarily empty until we implement schedule in DataContext

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-gray-500">{teacher.email}</p>
              <p className="text-sm text-gray-500">{teacher.phone}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(teacher.status)}`}>
              {tCommon(teacher.status)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">{t('teacherCard.specializations')}:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            {/* teacherCard */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('teacherCard.experience')}:</p>
                <p className="font-medium text-gray-400">{teacher.experience} {teacher.experience === 1 ? t('teacherCard.year') : t('teacherCard.years')}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('teacherCard.students')}:</p>
                <p className="font-medium text-gray-400">{students.length} {t('teacherCard.assigned')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>

                <p className="text-gray-600">{t('teacherCard.classes')}:</p>
                <p className="font-medium text-gray-400">{schedule.length} {t('teacherCard.perWeek')}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('teacherCard.load')}:</p>
                <p className="font-medium text-gray-400">
                  {students.length < 5 ? t('teacherCard.light') : students.length < 10 ? t('teacherCard.moderate') : t('teacherCard.heavy')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedTeacher(teacher)}
            >
              {t('teacherCard.viewDetails')}
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => router.push(`/${locale}/teachers/${teacher.id}/edit`)}
            >
              {t('teacherCard.editProfile')}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeacherDetailModal = ({ teacher }: { teacher: Teacher }) => {
    const students = allStudents.filter(student => student.teacherId === teacher.id);
    const schedule: any[] = []; // Temporarily empty until we implement schedule in DataContext

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                <p className="text-gray-500">{teacher.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTeacher(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('teacherDetail.contactInformation')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{t('teacherDetail.email')}:</p>
                    <p className="font-medium">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('teacherDetail.phone')}:</p>
                    <p className="font-medium">{teacher.phone}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('teacherDetail.professionalInformation')}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">{t('teacherDetail.specializations')}:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">{t('teacherDetail.experience')}:</p>
                      <p className="font-medium">{teacher.experience} {teacher.experience === 1 ? t('teacherCard.year') : t('teacherCard.years')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('teacherDetail.status')}:</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(teacher.status)}`}>
                        {tCommon(teacher.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Students */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('teacherDetail.assignedStudents')} ({students.length})
                </h3>
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{tCommon(`grades.${student.grade}`, { defaultValue: student.grade })} • {student.currentSurah}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{student.memorizedVerses} {student.memorizedVerses === 1 ? t('teacherDetail.verse') : t('teacherDetail.verses')}</p>
                          <p className="text-xs text-gray-500">{tCommon(student.status)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">{t('teacherDetail.noStudentsAssigned')}</p>
                )}
              </div>

              {/* Weekly Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {t('teacherDetail.weeklySchedule')} ({schedule.length} {schedule.length === 1 ? t('teacherDetail.class') : t('teacherDetail.classes')})
                </h3>
                {schedule.length > 0 ? (
                  <div className="space-y-2">
                    {schedule.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{slot.subject}</p>
                          <p className="text-sm text-gray-600">
                            {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)} • {slot.room}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className="text-xs text-gray-500">
                            {slot.studentIds.length} {slot.studentIds.length === 1 ? t('teacherDetail.student') : t('teacherDetail.students')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">{t('teacherDetail.noClassesScheduled')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href={`/${locale}/teachers/add-teacher`}>
            <Button>
              <span className="mr-2">➕</span>
              {t('addNewTeacher')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {t('showingTeachers', { current: filteredTeachers.length, total: allTeachers.length })}
        </p>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <span className="text-6xl mb-4 block">👨‍🏫</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noTeachersFound')}</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? t('adjustSearchCriteria')
                : t('getStartedMessage')
              }
            </p>
            {!searchQuery && (
              <Link href={`/${locale}/teachers/add-teacher`}>
                <Button>{t('addFirstTeacher')}</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teacher Detail Modal */}
      {selectedTeacher && <TeacherDetailModal teacher={selectedTeacher} />}
    </div>
  );
};

export default TeachersPage;

