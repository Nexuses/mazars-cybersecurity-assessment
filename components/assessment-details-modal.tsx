'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Assessment {
  _id: string;
  personalInfo: {
    name: string;
    email: string;
    environmentUniqueName: string;
    role: string;
    marketSector: string;
    country: string;
    date: string;
    environmentType: string;
    environmentSize: string;
    environmentImportance: string;
    environmentMaturity: string;
  };
  selectedCategories: string[];
  selectedAreas: string[];
  score: number;
  totalQuestions: number;
  completedQuestions: number;
  assessmentMetadata: {
    language: string;
    assessmentDate: string;
    assessmentDuration: number;
    userAgent: string;
    screenResolution: string;
  };
  detailedAnswers: Array<{
    questionText: string;
    answerLabel: string;
    category: string;
    area: string;
    topic: string;
  }>;
  createdAt: string;
}

interface AssessmentDetailsModalProps {
  assessment: Assessment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AssessmentDetailsModal({ assessment, isOpen, onClose }: AssessmentDetailsModalProps) {
  if (!assessment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assessment Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{assessment.personalInfo.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{assessment.personalInfo.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="font-medium">{assessment.personalInfo.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(assessment.personalInfo.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Assessment Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Assessment Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className={`font-semibold text-lg ${
                  assessment.score >= 85 ? 'text-green-600' :
                  assessment.score >= 65 ? 'text-yellow-600' :
                  assessment.score >= 35 ? 'text-orange-600' :
                  'text-red-600'
                }`}>
                  {assessment.score}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Questions Completed</p>
                <p className="font-medium">{assessment.completedQuestions}/{assessment.totalQuestions}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories Selected</p>
                <p className="font-medium">{assessment.selectedCategories?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Areas Selected</p>
                <p className="font-medium">{assessment.selectedAreas?.length || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessment Duration</p>
                <p className="font-medium">{Math.round(assessment.assessmentMetadata?.assessmentDuration / 1000 / 60)} minutes</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Language</p>
                <p className="font-medium">{assessment.assessmentMetadata?.language?.toUpperCase() || 'EN'}</p>
              </div>
            </div>
          </div>

          {/* Environment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Environment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Environment Name</p>
                <p className="font-medium">{assessment.personalInfo.environmentUniqueName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Market Sector</p>
                <p className="font-medium">{assessment.personalInfo.marketSector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Country</p>
                <p className="font-medium">{assessment.personalInfo.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment Type</p>
                <p className="font-medium">{assessment.personalInfo.environmentType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment Size</p>
                <p className="font-medium">{assessment.personalInfo.environmentSize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment Importance</p>
                <p className="font-medium">{assessment.personalInfo.environmentImportance}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Environment Maturity</p>
                <p className="font-medium">{assessment.personalInfo.environmentMaturity}</p>
              </div>
            </div>
          </div>

          {/* Assessment Answers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Assessment Answers</h3>
            <div className="space-y-4">
              {assessment.detailedAnswers.map((answer, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium">{answer.questionText}</p>
                        <p className="text-sm text-gray-500 mt-1">{answer.answerLabel}</p>
                      </div>
                      <div className="flex flex-col gap-1 ml-4">
                        <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {answer.category}
                        </span>
                        <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">
                          {answer.area}
                        </span>
                        {answer.topic && (
                          <span className="text-xs font-medium bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {answer.topic}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 