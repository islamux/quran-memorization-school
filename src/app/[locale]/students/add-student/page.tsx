'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select, Textarea } from '@/components/ui/Input';
import { getTeacherOptions, getGradeOptions, getSurahOptions } from '@/utils/dataUtils';

const NewStudentPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    parentName: '',
    parentPhone: '',
    email: '',
    currentSurah: 'Al-Fatiha',
    teacherId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // إرسال البيانات إلى API
      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create student');
      }

      const newStudent = await response.json();
      console.log('Student created successfully:', newStudent);

      // إظهار رسالة نجاح (يمكنك إضافة toast notification هنا)
      alert('Student added successfully!');

      // Redirect to students list
      router.push(`/${locale}/students`);
    } catch (error) {
      console.error('Error creating student:', error);
      alert('Failed to add student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const teacherOptions = getTeacherOptions();
  const gradeOptions = getGradeOptions();
  const surahOptions = getSurahOptions();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('addStudentPage.title')}</h1>
        <p className="text-gray-600">{t('addStudentPage.subtitle')}</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{t('addStudentPage.studentInformation')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('addStudentPage.personalInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('addStudentPage.fields.fullName')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder={t('addStudentPage.placeholders.fullName')}
                />
                <Input
                  label={t('addStudentPage.fields.age')}
                  name="age"
                  type="number"
                  min="5"
                  max="25"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={errors.age}
                  placeholder={t('addStudentPage.placeholders.age')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('addStudentPage.fields.grade')}
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  error={errors.grade}
                  options={gradeOptions}
                />
                <Input
                  label={t('addStudentPage.fields.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder={t('addStudentPage.placeholders.email')}
                />
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('addStudentPage.parentInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={t('addStudentPage.fields.parentName')}
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  error={errors.parentName}
                  placeholder={t('addStudentPage.placeholders.parentName')}
                />
                <Input
                  label={t('addStudentPage.fields.parentPhone')}
                  name="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  error={errors.parentPhone}
                  placeholder={t('addStudentPage.placeholders.parentPhone')}
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">{t('addStudentPage.academicInformation')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label={t('addStudentPage.fields.startingSurah')}
                  name="currentSurah"
                  value={formData.currentSurah}
                  onChange={handleInputChange}
                  options={surahOptions.slice(0, 10)} // Show first 10 surahs for beginners
                />
                <Select
                  label={t('addStudentPage.fields.assignedTeacher')}
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  error={errors.teacherId}
                  options={[{ value: '', label: t('addStudentPage.placeholders.selectTeacher') }, ...teacherOptions]}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label={t('addStudentPage.fields.notes')}
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder={t('addStudentPage.placeholders.notes')}
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
                {t('addStudentPage.actions.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? t('addStudentPage.actions.addingStudent') : t('addStudentPage.actions.addStudent')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStudentPage;
