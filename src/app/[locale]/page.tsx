'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getStudentStats, getActiveStudents } from '@/lib/students';
import { getActiveTeachers } from '@/lib/teachers';
import { getWeeklySchedule } from '@/lib/schedule';

const HomePage: React.FC = () => {
  const t = useTranslations('homepage');
  const tCommon = useTranslations('common');
  const tSchedule = useTranslations('schedulePage');
  const locale = useLocale();
  const studentStats = getStudentStats();
  const activeTeachers = getActiveTeachers();
  const recentStudents = getActiveStudents().slice(0, 5);
  
  // Use state to handle the current day to avoid hydration mismatch
  const [currentDay, setCurrentDay] = useState<string>('sunday');
  
  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    setCurrentDay(days[new Date().getDay()]);
  }, []);

  const todaySlots = getWeeklySchedule().find(day => day.day === currentDay)?.slots || [];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          {t('welcome.title')}
        </h1>
        <p className="text-green-100 text-lg">
          {t('welcome.subtitle')}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('stats.totalStudents')}</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('stats.activeStudents')}</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('stats.activeTeachers')}</p>
                <p className="text-2xl font-bold text-gray-900">{activeTeachers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🎓</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{t('stats.graduated')}</p>
                <p className="text-2xl font-bold text-gray-900">{studentStats.graduated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.recentStudents')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.grade} • {tCommon(`surahs.${student.currentSurah}`, { defaultValue: student.currentSurah })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{student.memorizedVerses} {student.memorizedVerses === 1 ? t('studentCard.verse') : t('studentCard.verses')}</p>
                    <p className="text-xs text-gray-500">{tCommon(student.status)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href={`/${locale}/students`}>
                <Button variant="outline" className="w-full">
                  {t('actions.viewAllStudents')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>{t('sections.todaySchedule')}</CardTitle>
          </CardHeader>
          <CardContent>
            {todaySlots.length > 0 ? (
              <div className="space-y-3">
                {todaySlots.slice(0, 5).map((slot) => (
                  <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{tSchedule(`subjects.${slot.subject}`, { defaultValue: slot.subject })}</p>
                      <p className="text-sm text-gray-600">{tSchedule(`rooms.${slot.room}`, { defaultValue: slot.room })} • {tSchedule(`slotType.${slot.type}`)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-xs text-gray-500">
                        {slot.studentIds.length} {slot.studentIds.length === 1 ? t('scheduleCard.student') : t('scheduleCard.students')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">📅</span>
                <p className="text-gray-600">{t('scheduleCard.noClasses')}</p>
              </div>
            )}
            <div className="mt-4">
              <Link href={`/${locale}/schedule`}>
                <Button variant="outline" className="w-full">
                  {t('actions.viewFullSchedule')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('sections.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href={`/${locale}/students/add-student`}>
              <Button className="w-full h-16 text-lg">
                <span className="mr-2">➕</span>
                {t('actions.addNewStudent')}
              </Button>
            </Link>
            <Link href={`/${locale}/students`}>
              <Button variant="outline" className="w-full h-16 text-lg">
                <span className="mr-2">👥</span>
                {t('actions.manageStudents')}
              </Button>
            </Link>
            <Link href={`/${locale}/schedule`}>
              <Button variant="outline" className="w-full h-16 text-lg">
                <span className="mr-2">📅</span>
                {t('actions.viewSchedule')}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;

