'use client';

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, TrendingUp, Calendar, Globe, Eye, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { AssessmentDetailsModal } from './assessment-details-modal';

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

export function AdminDashboard() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAssessments = async () => {
    try {
      const params = new URLSearchParams({
        limit: "10",
        skip: "0",
      });

      const response = await fetch(`/api/get-assessments?${params}`);
      const data = await response.json();
      setAssessments(data.assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleSearch = () => {
    // Implement search functionality
  };

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/admin' });
  };

  // Calculate statistics
  const totalAssessments = assessments.length;
  const uniqueCountries = new Set(assessments.map(a => a.personalInfo.country)).size;
  const currentMonth = new Date().getMonth();
  const thisMonthAssessments = assessments.filter(a => 
    new Date(a.personalInfo.date).getMonth() === currentMonth
  ).length;

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b">
          <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
              <p className="text-gray-500">Cybersecurity Assessment Management</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">Admin</p>
                <p className="text-sm text-gray-500">admin@forvismazars.com</p>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Assessments</p>
                    <h3 className="text-2xl font-bold">{totalAssessments}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Average Score</p>
                    <h3 className="text-2xl font-bold">-</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">This Month</p>
                    <h3 className="text-2xl font-bold">{thisMonthAssessments}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <Globe className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Countries</p>
                    <h3 className="text-2xl font-bold">{uniqueCountries}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Search by name, email, environment name, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>

          {/* Assessment List */}
          <div className="bg-white rounded-lg border">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Assessment Submissions</h2>
              <p className="text-gray-500">View and manage all cybersecurity assessment submissions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-y">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Environment</th>
                    <th className="text-left p-4 font-medium">Role</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-left p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map((assessment) => (
                    <tr key={assessment._id} className="border-b">
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{assessment.personalInfo.name}</div>
                          <div className="text-sm text-gray-500">{assessment.personalInfo.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium">{assessment.personalInfo.environmentUniqueName}</div>
                          <div className="text-sm text-gray-500">{assessment.personalInfo.marketSector}</div>
                        </div>
                      </td>
                      <td className="p-4">{assessment.personalInfo.role}</td>
                      <td className="p-4">{new Date(assessment.personalInfo.date).toLocaleDateString()}</td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(assessment)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <AssessmentDetailsModal
        assessment={selectedAssessment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAssessment(null);
        }}
      />
    </>
  );
} 