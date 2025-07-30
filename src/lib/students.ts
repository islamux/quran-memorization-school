import { Student } from '@/types';
import { getStoredStudents } from '@/utils/dexieStorage';

export async function getStudentStats() {
  const students = await getStoredStudents();
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

export async function getActiveStudents(): Promise<Student[]> {
  const students = await getStoredStudents();
  return students
    .filter(s => s.status === 'active')
    .sort((a, b) => {
      // Sort by enrollment date (most recent first)
      return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
    });
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  const students = await getStoredStudents();
  return students.find(s => s.id === id);
}

export async function getStudentsByTeacher(teacherId: string): Promise<Student[]> {
  const students = await getStoredStudents();
  return students.filter(s => s.teacherId === teacherId);
}
