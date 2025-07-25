import { NextRequest, NextResponse } from 'next/server';
import { studentDB, initializeDatabase } from '@/lib/database';
import { Student } from '@/types';

// التأكد من تهيئة قاعدة البيانات
initializeDatabase();

// GET: الحصول على جميع الطلاب
export async function GET(request: NextRequest) {
  try {
    const students = studentDB.getAll();
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json(
      { error: 'Failed to fetch students' },
      { status: 500 }
    );
  }
}

// POST: إضافة طالب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // إنشاء كائن الطالب الجديد
    const newStudent: Student = {
      id: `student-${Date.now()}`,
      name: body.name,
      age: parseInt(body.age),
      grade: body.grade,
      parentName: body.parentName,
      parentPhone: body.parentPhone,
      email: body.email || null,
      enrollmentDate: new Date().toISOString().split('T')[0],
      currentSurah: body.currentSurah || 'Al-Fatiha',
      completedSurahs: body.completedSurahs || ['Al-Fatiha'],
      memorizedVerses: body.memorizedVerses || 7,
      teacherId: body.teacherId,
      status: 'active',
      notes: body.notes || null,
    };

    // حفظ الطالب في قاعدة البيانات
    studentDB.add(newStudent);
    
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}
