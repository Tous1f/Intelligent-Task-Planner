# 🧠 Intelligent Task Planner for Students

[![CI](https://github.com/YOUR-USERNAME/intelligent-task-planner/workflows/CI/badge.svg)](https://github.com/YOUR-USERNAME/intelligent-task-planner/actions)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

## 📋 Overview

The Intelligent Task Planner is an AI-powered task management application designed specifically for university students. The system optimizes academic workload through intelligent scheduling algorithms, seamless Google Calendar integration, and evidence-based study methodologies including Pomodoro Technique and Spaced Repetition System.

## 🛠️ Technology Stack

**Frontend Framework:** Next.js 14 with App Router, TypeScript, Tailwind CSS, shadcn/ui components  
**State Management:** Zustand with TanStack Query v5  
**Backend Platform:** Supabase (PostgreSQL, Authentication, Real-time, Storage)  
**Database ORM:** Prisma for type-safe database access  
**AI Integration:** OpenAI GPT-4 API for decision-making and planning  
**External APIs:** Google Calendar API v3, Google Identity Services OAuth 2.0  
**Deployment:** Vercel with GitHub Actions CI/CD  
**Testing:** Jest, React Testing Library, Playwright

## ⚡ Core Functionality

### 📝 Task Management System
- Natural language task parsing and creation
- Bulk import capabilities from CSV and PDF syllabi
- Task dependency management and priority assignment
- Automated deadline tracking with urgency classification

### 🤖 AI-Powered Scheduling Engine
- Hybrid constraint-solving approach combining rule-based and AI optimization
- User behavior pattern analysis and adaptation
- Predictive workload analytics and deadline risk assessment
- What-if scenario modeling and recovery planning

### 📅 Calendar Integration
- Bidirectional Google Calendar synchronization
- Academic calendar import and conflict detection
- Real-time update propagation across devices

### 📚 Study Enhancement Tools
- Adaptive Pomodoro Timer with performance analytics
- Spaced Repetition System with Leitner algorithm implementation
- Productivity insights and completion trend analysis


## 🚀 Installation and Setup

### 📋 Prerequisites
- Node.js 18.17 or higher
- npm package manager
- Git version control system

### 💻 Development Environment Setup

1. **🔄 Repository Initialization**
git clone https://github.com/YOUR-USERNAME/intelligent-task-planner.git
cd intelligent-task-planner


2. **📦 Dependency Installation**
npm install

3. **⚙️ Environment Configuration**
cp .env.example .env.local

4. **🗄️ Database Setup**
npx prisma generate
npx prisma db push

5. **🏃‍♂️ Development Server Launch**
npm run dev


## 📊 Performance Targets

- ✅ Test coverage: 95% minimum
- ⚡ API response time: Sub-200ms (95th percentile)
- 🚀 Lighthouse performance score: 90+
- 🔒 Security vulnerabilities: Zero critical issues
- 👥 Concurrent user capacity: 100+ simultaneous users

## 🎓 Academic Context

**📘 Course:** CSE-327 Software Engineering  
**👥 Team Composition:** 3 members  
**📋 Deliverables:** SRS documentation, system diagrams, implementation report, demonstration video

## 🔧 Development Standards

- 💪 TypeScript strict mode enforcement
- 🎨 ESLint and Prettier code formatting
- 📝 Conventional commit messaging
- 🔍 Pull request review process
- 🧪 Automated testing pipeline

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact Information

**🔗 Repository:** https://github.com/Tous1f/intelligent-task-planner  
**📖 Documentation:** Project Wiki  
**🐛 Issue Tracking:** GitHub Issues

**🎯 Developed for CSE-327 Software Engineering Course**
