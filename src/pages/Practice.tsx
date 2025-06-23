import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PracticeProblems from '@/components/PracticeProblems';
import ProtectedRoute from '@/components/ProtectedRoute';

const Practice: React.FC = () => {
  return (
    <ProtectedRoute message="Please log in to access Practice Problems and track your progress">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Fixed Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center space-x-3 text-gray-900 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Practice Problems</h1>
              <div className="w-24"></div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative h-64 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
              height: '120%'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-blue-900/70" />
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white px-4 sm:px-6 lg:px-8">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-4">
                Practice Problems
              </h1>
              <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Sharpen your skills with a variety of coding challenges
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <PracticeProblems />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Practice;