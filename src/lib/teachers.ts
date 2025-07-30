import { Teacher } from '@/types';
import { getStoredTeachers } from '@/utils/dexieStorage';

export async function getActiveTeachers(): Promise<Teacher[]> {
  const teachers = await getStoredTeachers();
  return teachers.filter(t => t.status === 'active');
}

export async function getTeacherById(id: string): Promise<Teacher | undefined> {
  const teachers = await getStoredTeachers();
  return teachers.find(t => t.id === id);
}

export async function getAllTeachers(): Promise<Teacher[]> {
  return await getStoredTeachers();
}

export async function getTeacherStats() {
  const teachers = await getStoredTeachers();
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
