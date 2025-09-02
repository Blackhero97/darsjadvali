import { useState, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import { useDataImport } from "../hooks/useDataImport";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { DAYS_OF_WEEK } from "../types";

const Dashboard = ({ onPageChange }) => {
  const { state, actions, getTeacherById, getGroupById, getClassroomById } =
    useAppContext();
  const { isImporting, importError, importSuccess, importSampleData } =
    useDataImport();

  // Haqiqiy statistikalar
  const stats = {
    totalTeachers: state.teachers.length,
    totalGroups: state.groups.length,
    totalLessons: state.lessons.length,
    weeklyLessons: state.lessons.length,
    activeTeachers: state.teachers.filter((t) => t.isActive).length,
  };

  // Bugungi darslar (Dushanba = 1, Juma = 5)
  const today = new Date();
  const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();
  const todayLessons = state.lessons
    .filter((lesson) => lesson.dayOfWeek === dayOfWeek)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 6);

  // Haqiqiy ma'lumotlarni yuklash
  const handleImportData = () => {
    importSampleData(actions.dispatch);
  };

  // StatCard component
  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <Card
      className={`glass hover-lift float p-6 border-l-4 border-l-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p
            className={`text-3xl font-bold bg-gradient-to-r from-${color}-600 to-${color}-400 bg-clip-text text-transparent`}
          >
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div
          className={`p-3 rounded-full bg-gradient-to-r from-${color}-100 to-${color}-50 dark:from-${color}-900/30 dark:to-${color}-800/20`}
        >
          <Icon
            className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`}
          />
        </div>
      </div>
    </Card>
  );

  // LessonCard component
  const LessonCard = ({ lesson }) => {
    const teacher = getTeacherById(lesson.teacherId);
    const group = getGroupById(lesson.groupId);
    const classroom = getClassroomById(lesson.classroomId);
    if (!teacher || !group || !classroom) return null;

    return (
      <Card
        className="glass hover-lift p-4 border-l-4"
        style={{ borderLeftColor: teacher.color }}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {lesson.startTime} - {lesson.endTime}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-1">
              {group.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {teacher.fullName} • {classroom.name}
            </p>
            {lesson.note && (
              <p className="text-xs text-gray-500 mt-1 italic">{lesson.note}</p>
            )}
          </div>
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: teacher.color }}
          />
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            O'qituvchilar dars jadvali boshqaruv tizimi
          </p>
        </div>

        {/* Haqiqiy ma'lumotlarni yuklash tugmasi */}
        <div className="flex gap-3">
          {importSuccess && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800 dark:text-green-400">
                Ma'lumotlar muvaffaqiyatli yuklandi!
              </span>
            </div>
          )}

          {importError && (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800 dark:text-red-400">
                Xatolik: {importError}
              </span>
            </div>
          )}

          <Button
            onClick={handleImportData}
            disabled={isImporting}
            variant="primary"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isImporting ? "Yuklanmoqda..." : "Haqiqiy ma'lumotlarni yuklash"}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatCard
          title="Bugungi darslar"
          value={todayLessons.length}
          icon={Calendar}
          color="indigo"
          description="Bugun rejalashtirilgan"
        />
        <StatCard
          title="Jami darslar"
          value={stats.totalLessons}
          icon={BookOpen}
          color="blue"
          description="Haftalik jami"
        />
        <StatCard
          title="O'qituvchilar"
          value={stats.totalTeachers}
          icon={Users}
          color="green"
          description="Faol o'qituvchilar"
        />
        <StatCard
          title="Guruhlar"
          value={stats.totalGroups}
          icon={TrendingUp}
          color="purple"
          description="Faol guruhlar"
        />
        <StatCard
          title="Xonalar"
          value={state.classrooms.length}
          icon={Clock}
          color="orange"
          description="Mavjud xonalar"
        />
      </div>

      {/* Today's Lessons */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            📅 Bugungi darslar
          </h2>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl font-medium shadow-lg">
            {DAYS_OF_WEEK.find((d) => d.id === dayOfWeek)?.name || "Bugun"}
          </div>
        </div>

        {todayLessons.length === 0 ? (
          <Card className="p-12 text-center glass">
            <div className="max-w-md mx-auto">
              <Calendar className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-600 mb-6 float" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bugun dars yo'q
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Bugun uchun rejalashtirilgan darslar mavjud emas
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {todayLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="animate-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LessonCard lesson={lesson} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Tezkor amallar
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer glass hover-lift"
            onClick={() => onPageChange && onPageChange("schedule")}
          >
            <Calendar className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              Jadvalga o'tish
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Haftalik dars jadvalini ko'rish
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer glass hover-lift"
            onClick={() => onPageChange && onPageChange("teachers")}
          >
            <Users className="h-8 w-8 text-green-600 dark:text-green-400 mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              O'qituvchilar
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              O'qituvchilar ro'yxati va jadvallari
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-md transition-shadow cursor-pointer glass hover-lift"
            onClick={() => onPageChange && onPageChange("management")}
          >
            <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400 mb-3" />
            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
              Boshqaruv
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fanlar, guruhlar va xonalarni boshqarish
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
