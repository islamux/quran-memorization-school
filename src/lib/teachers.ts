import { teachers } from '@/data/mockData';
import { Teacher } from '@/types';

export function getActiveTeachers(): Teacher[] {
  return teachers.filter(t => t.status === 'active');
}

export function getTeacherById(id: string): Teacher | undefined {
  return teachers.find(t => t.id === id);
}

export function getAllTeachers(): Teacher[] {
  return teachers;
}

export function getTeacherStats() {
  const total = teachers.length;
  const active = teachers.filter(t => t.status === 'active').length;
  const inactive = teachers.filter(t => t.status === 'inactive').length;
  
  const totalStudents = teachers.reduce((acc, teacher) => acc + teacher.students.length, 0);
  const averageStudentsPerTeacher = total > 0 ? Math.round(totalStudents / total) : 0;

  return {
    total,
    active,
    inactive,
    totalStudents,
    averageStudentsPerTeacher
  };
}
