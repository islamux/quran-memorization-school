import { NextRequest, NextResponse } from 'next/server';
import { Student } from '@/types';

// محاكاة قاعدة البيانات في الذاكرة
let students: Student[] = [];

// GET: الحصول على جميع الطلاب
export async function GET(request: NextRequest) {
  try {
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
      id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

    // إضافة الطالب إلى المصفوفة
    students.push(newStudent);
    
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student' },
      { status: 500 }
    );
  }
}

// DELETE: حذف طالب
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    students = students.filter(student => student.id !== id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting student:', error);
    return NextResponse.json(
      { error: 'Failed to delete student' },
      { status: 500 }
    );
  }
}
