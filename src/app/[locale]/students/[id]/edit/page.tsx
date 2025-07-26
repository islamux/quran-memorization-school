'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select, Textarea } from '@/components/ui/Input';
import { getGradeOptions, getSurahOptions } from '@/utils/dataUtils';
import { useTeacherOptions, useStudentById } from '@/utils/clientDataUtils';
import { useData } from '@/contexts/DataContext';
import { Student } from '@/types';

const EditStudentPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const studentId = params.id as string;
  const t = useTranslations();
  const { updateStudent } = useData();
  const student = useStudentById(studentId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    email: '',
    currentSurah: '',
    teacherId: '',
    notes: '',
    status: 'active',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        age: student.age.toString(),
        grade: student.grade,
        parentName: student.parentName,
        parentPhone: student.parentPhone,
        email: student.email || '',
        currentSurah: student.currentSurah,
        teacherId: student.teacherId,
        notes: student.notes || '',
        status: student.status,
      });
    }
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
    }

    if (!formData.age || parseInt(formData.age) < 5 || parseInt(formData.age) > 25) {
      newErrors.age = 'Age must be between 5 and 25';
    }

    if (!formData.grade) {
      newErrors.grade = 'Grade is required';
    }

    if (!formData.parentName.trim()) {
      newErrors.parentName = 'Parent name is required';
    }

    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = 'Parent phone is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.parentPhone)) {
      newErrors.parentPhone = 'Please enter a valid phone number';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.teacherId) {
      newErrors.teacherId = 'Please assign a teacher';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !student) {
      return;
    }

    setIsSubmitting(true);

    try {
      // تحديث بيانات الطالب
      const updatedStudent: Student = {
        ...student,
        name: formData.name,
        age: parseInt(formData.age),
        grade: formData.grade,
        parentName: formData.parentName,
        parentPhone: formData.parentPhone,
        email: formData.email || null,
        currentSurah: formData.currentSurah,
        teacherId: formData.teacherId,
        status: formData.status as Student['status'],
        notes: formData.notes || null,
      };

      // تحديث الطالب باستخدام Context
      updateStudent(updatedStudent);
      console.log('Student updated successfully:', updatedStudent);

      // إظهار رسالة نجاح
      alert('تم تحديث بيانات الطالب بنجاح!');

      // Redirect to student details
      router.push(`/${locale}/students/${studentId}`);
    } catch (error) {
      console.error('Error updating student:', error);
      alert('فشل في تحديث بيانات الطالب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const teacherOptions = useTeacherOptions();
  const gradeOptions = getGradeOptions();
  const surahOptions = getSurahOptions();

  if (!student) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">{t('editStudentPage.studentNotFound')}</p>
            <Button
              onClick={() => router.push(`/${locale}/students`)}
              className="mt-4"
            >
              {t('editStudentPage.backToStudents')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('editStudentPage.title')}</h1>
        <p className="text-gray-600">{t('editStudentPage.subtitle')}</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('editStudentPage.studentInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('editStudentPage.personalInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('editStudentPage.fields.fullName')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder={t('editStudentPage.placeholders.fullName')}
                />
                <Input
                  label={t('editStudentPage.fields.age')}
                  name="age"
                  type="number"
                  min="5"
                  max="25"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={errors.age}
                  placeholder={t('editStudentPage.placeholders.age')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('editStudentPage.fields.grade')}
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  error={errors.grade}
                  options={gradeOptions}
                />
                <Input
                  label={t('editStudentPage.fields.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder={t('editStudentPage.placeholders.email')}
                />
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('editStudentPage.parentInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('editStudentPage.fields.parentName')}
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  error={errors.parentName}
                  placeholder={t('editStudentPage.placeholders.parentName')}
                />
                <Input
                  label={t('editStudentPage.fields.parentPhone')}
                  name="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  error={errors.parentPhone}
                  placeholder={t('editStudentPage.placeholders.parentPhone')}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('editStudentPage.academicInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('editStudentPage.fields.currentSurah')}
                  name="currentSurah"
                  value={formData.currentSurah}
                  onChange={handleInputChange}
                  options={surahOptions}
                />
                <Select
                  label={t('editStudentPage.fields.assignedTeacher')}
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  error={errors.teacherId}
                  options={[{ value: '', label: t('editStudentPage.placeholders.selectTeacher') }, ...teacherOptions]}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('editStudentPage.fields.status')}
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  options={[
                    { value: 'active', label: t('common.active') },
                    { value: 'inactive', label: t('common.inactive') },
                    { value: 'graduated', label: t('common.graduated') },
                  ]}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label={t('editStudentPage.fields.notes')}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t('editStudentPage.placeholders.notes')}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                {t('editStudentPage.actions.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? t('editStudentPage.actions.updatingStudent') : t('editStudentPage.actions.updateStudent')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditStudentPage;
