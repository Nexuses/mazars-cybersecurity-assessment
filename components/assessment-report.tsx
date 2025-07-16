import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question } from '@/lib/questions';

interface AssessmentReportProps {
  personalInfo: {
    name: string;
    date: string;
    role: string;
    environmentType: string;
    environmentSize: string;
    environmentImportance: string;
    environmentMaturity: string;
    environmentUniqueName: string;
    marketSector: string;
    country: string;
    email: string;
  };
  selectedCategories: string[];
  selectedAreas: string[];
  answers: Record<string, string>;
  questions: Question[];
  score: number;
  onClose: () => void;
}

interface ResponseTypeSummary {
  label: string;
  count: number;
  percentage: number;
}

interface CategoryBreakdown {
  category: string;
  categoryCode: string;
  breakdown: Record<string, number>;
}

export function AssessmentReport({
  personalInfo,
  selectedCategories,
  selectedAreas,
  answers,
  questions,
  score,
  onClose
}: AssessmentReportProps) {
  // Calculate response type summary
  const responseTypes = [
    { value: "1", label: "In no case" },
    { value: "2", label: "In a few cases" },
    { value: "3", label: "About half cases" },
    { value: "4", label: "In most cases" },
    { value: "5", label: "In all cases" },
    { value: "6", label: "Don't know" },
    { value: "7", label: "Other" },
    { value: "8", label: "Not applicable" },
    { value: "9", label: "Not answered" },
  ];

  const totalAnswered = Object.keys(answers).length;
  const responseTypeSummary: ResponseTypeSummary[] = responseTypes.map(type => {
    const count = Object.values(answers).filter(answer => answer === type.value).length;
    const percentage = totalAnswered > 0 ? (count / totalAnswered) * 100 : 0;
    return {
      label: type.label,
      count,
      percentage
    };
  });

  // Calculate category breakdown
  const categoryBreakdown: CategoryBreakdown[] = selectedCategories.map(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const breakdown: Record<string, number> = {};
    
    responseTypes.forEach(type => {
      const count = categoryQuestions.filter(q => 
        answers[q.id] === type.value
      ).length;
      breakdown[type.label] = count;
    });

    return {
      category,
      categoryCode: getCategoryCode(category),
      breakdown
    };
  });

  function getCategoryCode(category: string): string {
    const codes: Record<string, string> = {
      "Security Governance": "SG",
      "Information Risk Assessment": "IR",
      "Security Management": "SM",
      "People Management": "PM",
      "Information Management": "IM",
      "Physical Asset Management": "PA",
      "System Development": "SD",
      "Business Application Management": "BA",
      "System Access": "SA",
      "System Management": "SY",
      "Networks and Communications": "NC",
      "Supply Chain Management": "SC",
      "Technical Security Management": "TS",
      "Threat and Incident Management": "TM",
      "Physical and Environmental Management": "PE",
      "Business Continuity": "BC",
      "Security Assurance": "SA"
    };
    return codes[category] || category.substring(0, 2).toUpperCase();
  }

  const maxPercentage = Math.max(...responseTypeSummary.map(r => r.percentage));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#3B3FA1] text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Assessment Report</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Environment Information */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg text-[#3B3FA1]">Environment</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="w-[70%]">
                        <label className="text-sm font-medium text-gray-600">Name:</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-800">
                          {personalInfo.name}
                        </div>
                      </div>
                      <div className="w-[30%]">
                        <label className="text-sm font-medium text-gray-600">Date:</label>
                        <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-800">
                          {personalInfo.date.split('-').reverse().join('-')}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name of environment:</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-800">
                        {personalInfo.environmentUniqueName}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Questions answered:</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-800">
                        {totalAnswered} / 149
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Overall score:</label>
                      <div className="mt-1 p-2 bg-gray-50 rounded border text-gray-800">
                        {score}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Type Summary */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg text-[#3B3FA1]">RESPONSE TYPE SUMMARY</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {responseTypeSummary.map((response, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-32 text-sm text-gray-600">
                        {response.label}
                      </div>
                      <div className="flex-1">
                        <div className="relative h-6 bg-gray-200 rounded">
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-[#3B3FA1] rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${(response.percentage / maxPercentage) * 100}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-sm text-gray-600 text-right">
                        {response.percentage.toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Response Type by Category */}
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg text-[#3B3FA1]">DETAILED RESPONSE TYPE BY CATEGORY</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left p-2 bg-gray-50 font-medium text-gray-700">Category</th>
                        {responseTypes.map((type, index) => (
                          <th key={index} className="p-2 bg-gray-50 font-medium text-gray-700 text-center">
                            {type.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {categoryBreakdown.map((category, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="p-2 bg-[#3B3FA1]/10 font-medium text-gray-800">
                            <div>
                              <span className="font-bold">{category.categoryCode}</span>
                              <span className="ml-2">{category.category}</span>
                            </div>
                          </td>
                          {responseTypes.map((type, typeIndex) => {
                            const count = category.breakdown[type.label] || 0;
                            const totalCategoryQuestions = questions.filter(q => q.category === category.category).length;
                            const percentage = totalCategoryQuestions > 0 ? (count / totalCategoryQuestions) * 100 : 0;
                            const hasData = count > 0;
                            
                            return (
                              <td key={typeIndex} className="p-2 text-center">
                                {hasData ? (
                                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                    percentage > 20 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {percentage.toFixed(0)}%
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-4">
              <Button
                onClick={() => {
                  // Generate and download PDF report
                  const assessmentData = {
                    personalInfo,
                    selectedCategories,
                    selectedAreas,
                    answers,
                    score,
                    language: 'en',
                  };
                  
                  fetch('/api/generate-pdf', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(assessmentData),
                  })
                  .then(response => response.blob())
                  .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `cybersecurity-assessment-${personalInfo.name}-${new Date().toISOString().split('T')[0]}.pdf`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  })
                  .catch(error => {
                    console.error('Error downloading report:', error);
                    alert('There was an issue downloading the report. Please try again.');
                  });
                }}
                className="bg-[#3B3FA1] hover:bg-[#2A2D8A] text-white px-6 py-2 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
