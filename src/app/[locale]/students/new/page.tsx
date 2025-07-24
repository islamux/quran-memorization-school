'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select, Textarea } from '@/components/ui/Input';
import { getTeacherOptions, getGradeOptions, getSurahOptions } from '@/utils/dataUtils';

const NewStudentPage: React.FC = () => {
  const router = useRouter();
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call here
      console.log('New student data:', {
        ...formData,
        id: `student-${Date.now()}`,
        age: parseInt(formData.age),
        enrollmentDate: new Date().toISOString().split('T')[0],
        completedSurahs: ['Al-Fatiha'],
        memorizedVerses: 7,
        status: 'active',
      });

      // Redirect to students list
      router.push('/students');
    } catch (error) {
      console.error('Error creating student:', error);
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
        <h1 className="text-2xl font-bold text-gray-900">Add New Student</h1>
        <p className="text-gray-600">Enter student information to enroll them in the school</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={errors.name}
                  placeholder="Enter student's full name"
                />
                <Input
                  label="Age *"
                  name="age"
                  type="number"
                  min="5"
                  max="25"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={errors.age}
                  placeholder="Enter age"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Grade *"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  error={errors.grade}
                  options={gradeOptions}
                />
                <Input
                  label="Email (Optional)"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  placeholder="student@email.com"
                />
              </div>
            </div>

            {/* Parent Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Parent/Guardian Name *"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  error={errors.parentName}
                  placeholder="Enter parent's full name"
                />
                <Input
                  label="Parent Phone *"
                  name="parentPhone"
                  type="tel"
                  value={formData.parentPhone}
                  onChange={handleInputChange}
                  error={errors.parentPhone}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Starting Surah *"
                  name="currentSurah"
                  value={formData.currentSurah}
                  onChange={handleInputChange}
                  options={surahOptions.slice(0, 10)} // Show first 10 surahs for beginners
                />
                <Select
                  label="Assigned Teacher *"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleInputChange}
                  error={errors.teacherId}
                  options={[{ value: '', label: 'Select a teacher' }, ...teacherOptions]}
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Textarea
                label="Notes (Optional)"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about the student..."
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Adding Student...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewStudentPage;

