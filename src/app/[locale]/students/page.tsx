'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Select } from '@/components/ui/Input';
import { getStudents, getTeacherById, searchStudents, formatDate } from '@/utils/dataUtils';
import { Student } from '@/types';

const StudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');

  const allStudents = getStudents();

  const filteredStudents = useMemo(() => {
    let students = searchQuery ? searchStudents(searchQuery) : allStudents;

    if (statusFilter !== 'all') {
      students = students.filter(student => student.status === statusFilter);
    }

    if (gradeFilter !== 'all') {
      students = students.filter(student => student.grade === gradeFilter);
    }

    return students;
  }, [searchQuery, statusFilter, gradeFilter, allStudents]);

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      graduated: 'bg-blue-100 text-blue-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const uniqueGrades = Array.from(new Set(allStudents.map(s => s.grade))).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage and track student progress</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/students/new">
            <Button>
              <span className="mr-2">➕</span>
              Add New Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'graduated', label: 'Graduated' },
              ]}
            />
            <Select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Grades' },
                ...uniqueGrades.map(grade => ({ value: grade, label: grade }))
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {allStudents.length} students
        </p>
      </div>

      {/* Students Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => {
            const teacher = getTeacherById(student.teacherId);
            return (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.grade} • Age {student.age}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(student.status)}`}>
                      {student.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Current Surah:</span>
                      <span className="font-medium">{student.currentSurah}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Verses Memorized:</span>
                      <span className="font-medium text-green-600">{student.memorizedVerses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Teacher:</span>
                      <span className="font-medium">{teacher?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Enrolled:</span>
                      <span className="font-medium">{formatDate(student.enrollmentDate)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/students/${student.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/students/${student.id}/edit`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <span className="text-6xl mb-4 block">👥</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || gradeFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first student'
              }
            </p>
            {!searchQuery && statusFilter === 'all' && gradeFilter === 'all' && (
              <Link href="/students/new">
                <Button>Add First Student</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentsPage;

