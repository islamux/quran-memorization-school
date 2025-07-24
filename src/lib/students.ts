import { students } from '@/data/mockData';
import { Student } from '@/types';

export function getStudentStats() {
  const total = students.length;
  const active = students.filter(s => s.status === 'active').length;
  const inactive = students.filter(s => s.status === 'inactive').length;
  const graduated = students.filter(s => s.status === 'graduated').length;

  return {
    total,
    active,
    inactive,
    graduated
  };
}

export function getActiveStudents(): Student[] {
  return students
    .filter(s => s.status === 'active')
    .sort((a, b) => {
      // Sort by enrollment date (most recent first)
      return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
    });
}

export function getStudentById(id: string): Student | undefined {
  return students.find(s => s.id === id);
}

export function getStudentsByTeacher(teacherId: string): Student[] {
  return students.filter(s => s.teacherId === teacherId);
}
