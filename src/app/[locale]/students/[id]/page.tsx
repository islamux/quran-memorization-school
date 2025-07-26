'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { formatDate } from '@/utils/dataUtils';
import { useTeacherById, useStudentById } from '@/utils/clientDataUtils';
import { useData } from '@/contexts/DataContext';
import { ArrowLeft, Edit, Trash2, User, Phone, Mail, Calendar, Book, GraduationCap, AlertTriangle, XCircle, Info } from 'lucide-react';

const StudentDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const studentId = params.id as string;
  const t = useTranslations();
  const { deleteStudent, checkStudentDeletion } = useData();
  const student = useStudentById(studentId);
  const teacher = useTeacherById(student?.teacherId || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCheck, setDeleteCheck] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    if (student) {
      // التحقق من إمكانية الحذف أولاً
      const check = await checkStudentDeletion(student.id);
      setDeleteCheck(check);
      setShowDeleteConfirm(true);
    }
  };

  const handleDelete = async () => {
    if (student) {
      setIsDeleting(true);
      try {
        const result = await deleteStudent(student.id, {
          softDelete: true,
          archiveData: true,
          notifyRelatedUsers: false
        });
        
        if (result.success) {
          alert(result.message);
          router.push(`/${locale}/students`);
        } else {
          alert(result.message);
          setShowDeleteConfirm(false);
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('فشل في حذف الطالب. الرجاء المحاولة مرة أخرى.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200',
      graduated: 'bg-blue-100 text-blue-800 border-blue-200',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600 mb-4">{t('studentDetailPage.studentNotFound')}</p>
            <Button
              onClick={() => router.push(`/${locale}/students`)}
            >
              {t('studentDetailPage.backToStudents')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('studentDetailPage.back')}
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
            <p className="text-gray-600">{t('studentDetailPage.studentProfile')}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <Link href={`/${locale}/students/${student.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              {t('studentDetailPage.edit')}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteClick}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            {t('studentDetailPage.delete')}
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center gap-4">
        {student.isDeleted && (
          <span className="px-3 py-1 text-sm font-medium rounded-full border bg-red-100 text-red-800 border-red-200">
            {t('common.deleted')} - {formatDate(student.deletedAt || '')}
          </span>
        )}
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(student.status)}`}>
          {t(`common.${student.status}`)}
        </span>
        <span className="text-sm text-gray-500">
          {t('studentDetailPage.enrolledOn')} {formatDate(student.enrollmentDate)}
        </span>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            {t('studentDetailPage.personalInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.fullName')}</label>
              <p className="text-gray-900 font-medium">{student.name}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.age')}</label>
              <p className="text-gray-900 font-medium">{student.age} {t('studentDetailPage.years')}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.grade')}</label>
              <p className="text-gray-900 font-medium">{student.grade}</p>
            </div>
            {student.email && (
              <div>
                <label className="text-sm text-gray-500">{t('studentDetailPage.fields.email')}</label>
                <p className="text-gray-900 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                    {student.email}
                  </a>
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Parent Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            {t('studentDetailPage.parentInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.parentName')}</label>
              <p className="text-gray-900 font-medium">{student.parentName}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.parentPhone')}</label>
              <p className="text-gray-900 font-medium">
                <a href={`tel:${student.parentPhone}`} className="text-blue-600 hover:underline flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {student.parentPhone}
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            {t('studentDetailPage.academicInformation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.currentSurah')}</label>
              <p className="text-gray-900 font-medium">{student.currentSurah}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.versesMemorized')}</label>
              <p className="text-gray-900 font-medium text-green-600">{student.memorizedVerses} {t('studentDetailPage.verses')}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.teacher')}</label>
              <p className="text-gray-900 font-medium">
                {teacher ? (
                  <Link href={`/${locale}/teachers/${teacher.id}`} className="text-blue-600 hover:underline flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    {teacher.name}
                  </Link>
                ) : (
                  t('studentDetailPage.notAssigned')
                )}
              </p>
            </div>
            <div>
              <label className="text-sm text-gray-500">{t('studentDetailPage.fields.completedSurahs')}</label>
              <p className="text-gray-900 font-medium">
                {student.completedSurahs.length > 0 
                  ? student.completedSurahs.join(', ')
                  : t('studentDetailPage.noCompletedSurahs')
                }
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <label className="text-sm text-gray-500">{t('studentDetailPage.overallProgress')}</label>
            <div className="mt-2 bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 rounded-full h-3 transition-all duration-300"
                style={{ width: `${Math.min((student.memorizedVerses / 6236) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {t('studentDetailPage.progressText', { 
                memorized: student.memorizedVerses, 
                total: 6236,
                percentage: ((student.memorizedVerses / 6236) * 100).toFixed(1)
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {student.notes && (
        <Card>
          <CardHeader>
            <CardTitle>{t('studentDetailPage.notes')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{student.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-lg mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                {t('studentDetailPage.deleteConfirmation.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {t('studentDetailPage.deleteConfirmation.message', { name: student.name })}
              </p>
              
              {/* عرض نتائج فحص الحذف */}
              {deleteCheck && (
                <div className="space-y-3 mb-6">
                  {/* القيود المانعة */}
                  {deleteCheck.blockers && deleteCheck.blockers.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-800 mb-1">لا يمكن الحذف:</p>
                          <ul className="text-sm text-red-700 space-y-1">
                            {deleteCheck.blockers.map((blocker: string, index: number) => (
                              <li key={index}>• {blocker}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* التحذيرات */}
                  {deleteCheck.warnings && deleteCheck.warnings.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-800 mb-1">تحذيرات:</p>
                          <ul className="text-sm text-yellow-700 space-y-1">
                            {deleteCheck.warnings.map((warning: string, index: number) => (
                              <li key={index}>• {warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* معلومات إضافية */}
                  {deleteCheck.canDelete && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-700">
                            سيتم حذف الطالب بشكل آمن (Soft Delete) مع إمكانية الاسترجاع لاحقاً.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex space-x-4 rtl:space-x-reverse">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1"
                  disabled={isDeleting}
                >
                  {t('studentDetailPage.deleteConfirmation.cancel')}
                </Button>
                <Button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                  disabled={!deleteCheck?.canDelete || isDeleting}
                >
                  {isDeleting ? 'جاري الحذف...' : t('studentDetailPage.deleteConfirmation.confirm')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentDetailPage;
