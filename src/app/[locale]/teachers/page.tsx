'use client';

import React, { useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { getTeachers, getStudentsByTeacher, getScheduleByTeacher } from '@/utils/dataUtils';
import { Teacher } from '@/types';

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const allTeachers = getTeachers();
  const filteredTeachers = searchQuery
    ? allTeachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        teacher.specialization.some(spec => 
          spec.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : allTeachers;

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const TeacherCard = ({ teacher }: { teacher: Teacher }) => {
    const students = getStudentsByTeacher(teacher.id);
    const schedule = getScheduleByTeacher(teacher.id);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
              <p className="text-sm text-gray-600">{teacher.email}</p>
              <p className="text-sm text-gray-600">{teacher.phone}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(teacher.status)}`}>
              {teacher.status}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Specializations:</p>
              <div className="flex flex-wrap gap-1">
                {teacher.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Experience:</p>
                <p className="font-medium">{teacher.experience} years</p>
              </div>
              <div>
                <p className="text-gray-600">Students:</p>
                <p className="font-medium">{students.length} assigned</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Classes:</p>
                <p className="font-medium">{schedule.length} per week</p>
              </div>
              <div>
                <p className="text-gray-600">Load:</p>
                <p className="font-medium">
                  {students.length < 5 ? 'Light' : students.length < 10 ? 'Moderate' : 'Heavy'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedTeacher(teacher)}
            >
              View Details
            </Button>
            <Button size="sm" className="flex-1">
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const TeacherDetailModal = ({ teacher }: { teacher: Teacher }) => {
    const students = getStudentsByTeacher(teacher.id);
    const schedule = getScheduleByTeacher(teacher.id);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
                <p className="text-gray-600">{teacher.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTeacher(null)}
              >
                ✕
              </Button>
            </div>

            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Email:</p>
                    <p className="font-medium">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Phone:</p>
                    <p className="font-medium">{teacher.phone}</p>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Specializations:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {teacher.specialization.map((spec, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Experience:</p>
                      <p className="font-medium">{teacher.experience} years</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status:</p>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(teacher.status)}`}>
                        {teacher.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Students */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Assigned Students ({students.length})
                </h3>
                {students.length > 0 ? (
                  <div className="space-y-2">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.grade} • {student.currentSurah}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{student.memorizedVerses} verses</p>
                          <p className="text-xs text-gray-500">{student.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No students assigned</p>
                )}
              </div>

              {/* Weekly Schedule */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Weekly Schedule ({schedule.length} classes)
                </h3>
                {schedule.length > 0 ? (
                  <div className="space-y-2">
                    {schedule.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{slot.subject}</p>
                          <p className="text-sm text-gray-600">
                            {slot.day.charAt(0).toUpperCase() + slot.day.slice(1)} • {slot.room}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            {slot.startTime} - {slot.endTime}
                          </p>
                          <p className="text-xs text-gray-500">
                            {slot.studentIds.length} student{slot.studentIds.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No classes scheduled</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">Manage teaching staff and their assignments</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>
            <span className="mr-2">➕</span>
            Add New Teacher
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <Input
            placeholder="Search teachers by name or specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredTeachers.length} of {allTeachers.length} teachers
        </p>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <span className="text-6xl mb-4 block">👨‍🏫</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teachers found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? 'Try adjusting your search criteria'
                : 'Get started by adding your first teacher'
              }
            </p>
            {!searchQuery && (
              <Button>Add First Teacher</Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Teacher Detail Modal */}
      {selectedTeacher && <TeacherDetailModal teacher={selectedTeacher} />}
    </div>
  );
};

export default TeachersPage;

