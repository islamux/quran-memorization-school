import { ScheduleSlot } from '@/types';
import { getStoredSchedule } from '@/utils/dexieStorage';

interface DaySchedule {
  day: string;
  slots: ScheduleSlot[];
}

export async function getWeeklySchedule(): Promise<DaySchedule[]> {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const scheduleSlots = await getStoredSchedule();
  
  return days.map(day => ({
    day,
    slots: scheduleSlots.filter(slot => slot.day === day)
  }));
}

export async function getScheduleForDay(day: string): Promise<ScheduleSlot[]> {
  const scheduleSlots = await getStoredSchedule();
  return scheduleSlots.filter(slot => slot.day === day);
}

export async function getScheduleForTeacher(teacherId: string): Promise<ScheduleSlot[]> {
  const scheduleSlots = await getStoredSchedule();
  return scheduleSlots.filter(slot => slot.teacherId === teacherId);
}

