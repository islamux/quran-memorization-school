'use client';

import { useData } from '@/contexts/DataContext';

// Hook to get teacher options for select dropdowns
export const useTeacherOptions = () => {
  const { teachers } = useData();
  return teachers.map(teacher => ({
    value: teacher.id,
    label: teacher.name
  }));
};

// Hook to get teacher by id
export const useTeacherById = (id: string) => {
  const { allTeachers } = useData();
  return allTeachers.find(teacher => teacher.id === id);
};

// Hook to get student by id
export const useStudentById = (id: string) => {
  const { allStudents } = useData();
  return allStudents.find(student => student.id === id);
};
