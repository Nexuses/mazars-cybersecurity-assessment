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
  detailedAnswers: Array<{
    questionText: string;
    answerLabel: string;
    category: string;
  }>;
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
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{answer.questionText}</p>
                      <p className="text-sm text-gray-500">{answer.answerLabel}</p>
                    </div>
                    <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
                      {answer.category}
                    </span>
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