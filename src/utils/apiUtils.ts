import { Student, Teacher } from '@/types';

// API Base URL
const API_BASE = '/api';

// Student API functions
export const fetchStudents = async (): Promise<Student[]> => {
  try {
    const response = await fetch(`${API_BASE}/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

export const createStudent = async (studentData: Partial<Student>): Promise<Student> => {
  const response = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(studentData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create student');
  }
  
  return await response.json();
};

export const updateStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  
  return await response.json();
};

export const deleteStudent = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE}/students/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete student');
  }
};

// Teacher API functions (لاستخدامها لاحقاً)
export const fetchTeachers = async (): Promise<Teacher[]> => {
  try {
    const response = await fetch(`${API_BASE}/teachers`);
    if (!response.ok) {
      throw new Error('Failed to fetch teachers');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching teachers:', error);
    // في الوقت الحالي، نستخدم البيانات الوهمية للمعلمين
    const { teachers } = await import('@/data/mockData');
    return teachers;
  }
};
