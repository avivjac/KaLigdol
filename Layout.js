import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" dir="rtl">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Varela+Round:wght@400&display=swap');
          
          :root {
            --primary-color: #6366f1;
            --secondary-color: #ec4899;
            --accent-color: #10b981;
            --warm-color: #f59e0b;
            --text-primary: #1f2937;
            --text-secondary: #6b7280;
            --background-light: #f8fafc;
          }
          
          body {
            font-family: 'Varela Round', 'Inter', sans-serif;
          }
          
          .child-friendly {
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
          }
          
          .child-friendly:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          }
          
          .bounce-in {
            animation: bounceIn 0.6s ease-out;
          }
          
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .floating {
            animation: floating 3s ease-in-out infinite;
          }
          
          @keyframes floating {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
        `}
      </style>
      
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}