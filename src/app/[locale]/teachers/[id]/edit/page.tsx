'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useTeacherById } from '@/utils/clientDataUtils';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft } from 'lucide-react';

const EditTeacherPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const teacherId = params.id as string;
  const t = useTranslations();
  const { updateTeacher } = useData();
  const teacher = useTeacherById(teacherId);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: [] as string[],
    experience: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const [specializationInput, setSpecializationInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        status: teacher.status
      });
    }
  }, [teacher]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('editTeacherPage.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('editTeacherPage.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('editTeacherPage.errors.emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('editTeacherPage.errors.phoneRequired');
    }

    if (formData.specialization.length === 0) {
      newErrors.specialization = t('editTeacherPage.errors.specializationRequired');
    }

    if (formData.experience < 0) {
      newErrors.experience = t('editTeacherPage.errors.experienceInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !teacher) return;

    try {
      updateTeacher(teacher.id, formData);
      alert(t('editTeacherPage.successMessage'));
      router.push(`/${locale}/teachers`);
    } catch (error) {
      console.error('Error updating teacher:', error);
      alert(t('editTeacherPage.errorMessage'));
    }
  };

  const addSpecialization = () => {
    if (specializationInput.trim() && !formData.specialization.includes(specializationInput.trim())) {
      setFormData({
        ...formData,
        specialization: [...formData.specialization, specializationInput.trim()]
      });
      setSpecializationInput('');
      setErrors({ ...errors, specialization: '' });
    }
  };

  const removeSpecialization = (spec: string) => {
    setFormData({
      ...formData,
      specialization: formData.specialization.filter(s => s !== spec)
    });
  };

  if (!teacher) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">{t('editTeacherPage.teacherNotFound')}</p>
            <Button onClick={() => router.push(`/${locale}/teachers`)}>
              {t('editTeacherPage.backToTeachers')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link href={`/${locale}/teachers`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('editTeacherPage.back')}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('editTeacherPage.title')}</h1>
            <p className="text-gray-600">{t('editTeacherPage.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('editTeacherPage.personalInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.name')}
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.email')}
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                error={errors.email}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.phone')}
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t('editTeacherPage.professionalInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.specializations')}
              </label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={specializationInput}
                  onChange={(e) => setSpecializationInput(e.target.value)}
                  placeholder={t('editTeacherPage.addSpecialization')}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSpecialization();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={addSpecialization}
                  disabled={!specializationInput.trim()}
                >
                  {t('editTeacherPage.add')}
                </Button>
              </div>
              {errors.specialization && (
                <p className="text-sm text-red-600 mb-2">{errors.specialization}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                  >
                    {spec}
                    <button
                      type="button"
                      onClick={() => removeSpecialization(spec)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.experience')}
              </label>
              <Input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                error={errors.experience}
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('editTeacherPage.fields.status')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">{t('common.active')}</option>
                <option value="inactive">{t('common.inactive')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            {t('editTeacherPage.saveChanges')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => router.push(`/${locale}/teachers`)}
          >
            {t('editTeacherPage.cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacherPage;
