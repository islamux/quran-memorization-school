import { Student, Teacher, ScheduleSlot, Surah } from '@/types';
import { students, teachers, scheduleSlots, surahs } from '@/data/seedData';

// Student utilities
export const getStudents = (): Student[] => {
  return students;
};

export const getStudentById = (id: string): Student | undefined => {
  return students.find(student => student.id === id);
};

export const getStudentsByTeacher = (teacherId: string): Student[] => {
  return students.filter(student => student.teacherId === teacherId);
};

export const searchStudents = (query: string): Student[] => {
  const lowercaseQuery = query.toLowerCase();
  return students.filter(student => 
    student.name.toLowerCase().includes(lowercaseQuery) ||
    student.parentName.toLowerCase().includes(lowercaseQuery) ||
    student.grade.toLowerCase().includes(lowercaseQuery) ||
    student.currentSurah.toLowerCase().includes(lowercaseQuery)
  );
};

export const getActiveStudents = (): Student[] => {
  return students.filter(student => student.status === 'active');
};

export const getStudentStats = () => {
  const total = students.length;
  const active = students.filter(s => s.status === 'active').length;
  const inactive = students.filter(s => s.status === 'inactive').length;
  const graduated = students.filter(s => s.status === 'graduated').length;
  
  return { total, active, inactive, graduated };
};

// Teacher utilities
export const getTeachers = (): Teacher[] => {
  return teachers;
};

export const getTeacherById = (id: string): Teacher | undefined => {
  return teachers.find(teacher => teacher.id === id);
};

export const getActiveTeachers = (): Teacher[] => {
  return teachers.filter(teacher => teacher.status === 'active');
};

export const getTeacherOptions = () => {
  return teachers.map(teacher => ({
    value: teacher.id,
    label: teacher.name
  }));
};

// Schedule utilities
export const getScheduleSlots = (): ScheduleSlot[] => {
  return scheduleSlots;
};

export const getScheduleByDay = (day: string): ScheduleSlot[] => {
  return scheduleSlots.filter(slot => slot.day === day);
};

export const getScheduleByTeacher = (teacherId: string): ScheduleSlot[] => {
  return scheduleSlots.filter(slot => slot.teacherId === teacherId);
};

export const getScheduleByStudent = (studentId: string): ScheduleSlot[] => {
  return scheduleSlots.filter(slot => slot.studentIds.includes(studentId));
};

export const getWeeklySchedule = () => {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days.map(day => ({
    day,
    slots: getScheduleByDay(day)
  }));
};

// Surah utilities
export const getSurahs = (): Surah[] => {
  return surahs;
};

export const getSurahById = (id: number): Surah | undefined => {
  return surahs.find(surah => surah.id === id);
};

export const getSurahByName = (name: string): Surah | undefined => {
  return surahs.find(surah => surah.name === name);
};

export const getSurahsByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): Surah[] => {
  return surahs.filter(surah => surah.difficulty === difficulty);
};

export const getSurahOptions = () => {
  return surahs.map(surah => ({
    value: surah.name,
    label: `${surah.name} (${surah.arabicName}) - ${surah.verses} verses`
  }));
};

// General utilities
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getGradeOptions = () => {
  return [
    { value: '', label: 'Select Grade' },
    { value: '1st Grade', label: '1st Grade' },
    { value: '2nd Grade', label: '2nd Grade' },
    { value: '3rd Grade', label: '3rd Grade' },
    { value: '4th Grade', label: '4th Grade' },
    { value: '5th Grade', label: '5th Grade' },
    { value: '6th Grade', label: '6th Grade' },
    { value: '7th Grade', label: '7th Grade' },
    { value: '8th Grade', label: '8th Grade' },
    { value: '9th Grade', label: '9th Grade' },
    { value: '10th Grade', label: '10th Grade' },
    { value: '11th Grade', label: '11th Grade' },
    { value: '12th Grade', label: '12th Grade' },
  ];
};

export const getStatusOptions = () => {
  return [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
  ];
};

