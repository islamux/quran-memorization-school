import { ScheduleSlot } from '@/types';

// Sample Weekly Schedule Data
const weeklyScheduleSlots: ScheduleSlot[] = [
  {
    id: 'slot-1',
    teacherId: 'teacher-1',
    studentIds: ['student-1', 'student-2'],
    day: 'monday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Tajweed',
    room: 'Room A',
    type: 'group',
  },
  {
    id: 'slot-2',
    teacherId: 'teacher-1',
    studentIds: ['student-3'],
    day: 'monday',
    startTime: '11:00',
    endTime: '12:00',
    subject: 'Hifz',
    room: 'Room B',
    type: 'individual',
  },
  {
    id: 'slot-3',
    teacherId: 'teacher-2',
    studentIds: ['student-5', 'student-6'],
    day: 'tuesday',
    startTime: '09:00',
    endTime: '10:00',
    subject: 'Arabic Language',
    room: 'Room C',
    type: 'group',
  },
  {
    id: 'slot-4',
    teacherId: 'teacher-3',
    studentIds: ['student-9'],
    day: 'wednesday',
    startTime: '14:00',
    endTime: '15:00',
    subject: 'Qira\'at',
    room: 'Room A',
    type: 'individual',
  },
  // Add more schedule slots as needed
];

interface DaySchedule {
  day: string;
  slots: ScheduleSlot[];
}

export function getWeeklySchedule(): DaySchedule[] {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  return days.map(day => ({
    day,
    slots: weeklyScheduleSlots.filter(slot => slot.day === day)
  }));
}

export function getScheduleForDay(day: string): ScheduleSlot[] {
  return weeklyScheduleSlots.filter(slot => slot.day === day);
}

export function getScheduleForTeacher(teacherId: string): ScheduleSlot[] {
  return weeklyScheduleSlots.filter(slot => slot.teacherId === teacherId);
}

