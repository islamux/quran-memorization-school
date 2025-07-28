'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { getWeeklySchedule, getTeacherById, getStudentById, formatTime, capitalizeFirst } from '@/utils/dataUtils';
import { ScheduleSlot } from '@/types';

const SchedulePage: React.FC = () => {
  const t = useTranslations('schedulePage');
  const locale = useLocale();
  const [selectedTeacher, setSelectedTeacher] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const weeklySchedule = getWeeklySchedule();
  const allTeachers = Array.from(new Set(
    weeklySchedule.flatMap(day => day.slots.map(slot => slot.teacherId))
  )).map(teacherId => {
    const teacher = getTeacherById(teacherId);
    return { value: teacherId, label: teacher?.name || t('unknownTeacher') };
  });

  const filteredSchedule = weeklySchedule.map(day => ({
    ...day,
    slots: day.slots.filter(slot => {
      const teacherMatch = selectedTeacher === 'all' || slot.teacherId === selectedTeacher;
      const dayMatch = selectedDay === 'all' || day.day === selectedDay;
      return teacherMatch && dayMatch;
    })
  })).filter(day => selectedDay === 'all' || day.day === selectedDay);

  const getSlotTypeColor = (type: string) => {
    return type === 'individual' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  const renderSlot = (slot: ScheduleSlot) => {
    const teacher = getTeacherById(slot.teacherId);
    const students = slot.studentIds.map(id => getStudentById(id)).filter(Boolean);

    return (
      <div key={slot.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{t(`subjects.${slot.subject}`, { defaultValue: slot.subject })}</h4>
            <p className="text-sm text-gray-600">{teacher?.name}</p>
          </div>
          <div className="text-right">
            <p className="font-medium text-blue-600">
              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
            </p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getSlotTypeColor(slot.type)}`}>
              {t(`slotType.${slot.type}`)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {slot.room && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="mr-2">📍</span>
              <span>{slot.room}</span>
            </div>
          )}
          
          <div className="flex items-start text-sm text-gray-600">
            <span className="mr-2">👥</span>
            <div>
              <p className="font-medium">{students.length} {students.length !== 1 ? t('students') : t('student')}:</p>
              <div className="mt-1 space-y-1">
                {students.map((student) => (
                  <div key={student?.id} className="flex items-center justify-between">
                    <span>{student?.name}</span>
                    <span className="text-xs text-gray-500">{student?.grade}</span>
                  </div>
                ))}
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
          <Button>
            <span className="mr-2">➕</span>
            {t('addNewClass')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label={t('filterByTeacher')}
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              options={[
                { value: 'all', label: t('allTeachers') },
                ...allTeachers
              ]}
            />
            <Select
              label={t('filterByDay')}
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              options={[
                { value: 'all', label: t('allDays') },
                { value: 'monday', label: t('days.monday') },
                { value: 'tuesday', label: t('days.tuesday') },
                { value: 'wednesday', label: t('days.wednesday') },
                { value: 'thursday', label: t('days.thursday') },
                { value: 'friday', label: t('days.friday') },
                { value: 'saturday', label: t('days.saturday') },
                { value: 'sunday', label: t('days.sunday') },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      {selectedDay === 'all' ? (
        <div className="space-y-6">
          {filteredSchedule.map((day) => (
            <Card key={day.day}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">📅</span>
                  {t(`days.${day.day}`)}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({day.slots.length} {day.slots.length !== 1 ? t('classes') : t('class')})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.slots.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.slots
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(renderSlot)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📅</span>
                    <p className="text-gray-600">{t('noClassesScheduledForDay', { day: t(`days.${day.day}`) })}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredSchedule.map((day) => (
            <Card key={day.day}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <span className="mr-2">📅</span>
                  {t(`days.${day.day}`)}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({day.slots.length} {day.slots.length !== 1 ? t('classes') : t('class')})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {day.slots.length > 0 ? (
                  <div className="space-y-4">
                    {day.slots
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(renderSlot)}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📅</span>
                    <p className="text-gray-600">{t('noClassesScheduled')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>{t('scheduleSummary.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {filteredSchedule.reduce((total, day) => total + day.slots.length, 0)}
              </p>
              <p className="text-sm text-blue-600">{t('scheduleSummary.totalClasses')}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {filteredSchedule.reduce((total, day) => 
                  total + day.slots.filter(slot => slot.type === 'group').length, 0
                )}
              </p>
              <p className="text-sm text-green-600">{t('scheduleSummary.groupClasses')}</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {filteredSchedule.reduce((total, day) => 
                  total + day.slots.filter(slot => slot.type === 'individual').length, 0
                )}
              </p>
              <p className="text-sm text-purple-600">{t('scheduleSummary.individualClasses')}</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {Array.from(new Set(
                  filteredSchedule.flatMap(day => 
                    day.slots.flatMap(slot => slot.studentIds)
                  )
                )).length}
              </p>
              <p className="text-sm text-yellow-600">{t('scheduleSummary.studentsEnrolled')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulePage;

