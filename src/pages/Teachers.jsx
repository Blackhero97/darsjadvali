import { useState } from "react";
import { Plus, Search, User, Calendar, Edit2, Trash2 } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Card, Button, Input, Modal } from "../components";
import { SearchBar } from "../components/SearchBar";
import TeacherModal from "../features/teachers/TeacherModal";
import TeacherScheduleModal from "../features/teachers/TeacherScheduleModal";

const Teachers = () => {
  const { state, actions } = useAppContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Filter teachers
  const filteredTeachers = state.teachers.filter(
    (teacher) =>
      teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsTeacherModalOpen(true);
  };

  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setIsTeacherModalOpen(true);
  };

  const handleDeleteTeacher = (teacher) => {
    if (window.confirm(`${teacher.fullName}ni o'chirishni xohlaysizmi?`)) {
      actions.deleteTeacher(teacher.id);
    }
  };

  const handleViewSchedule = (teacher) => {
    setSelectedTeacher(teacher);
    setIsScheduleModalOpen(true);
  };

  const TeacherCard = ({ teacher }) => {
    const teacherLessons = state.lessons.filter(
      (l) => l.teacherId === teacher.id
    );

    return (
      <div className="neon-card p-6 hover-glow group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300"
              style={{
                background: `linear-gradient(135deg, ${teacher.color} 0%, ${teacher.color}dd 100%)`,
                boxShadow: `0 8px 32px ${teacher.color}40`,
              }}
            >
              {teacher.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div className="ml-5">
              <h3 className="font-bold text-xl text-perfect group-hover:text-perfect-accent transition-colors duration-300">
                {teacher.fullName}
              </h3>
              {teacher.department && (
                <p className="text-base text-perfect-dim font-medium mt-1">
                  {teacher.department}
                </p>
              )}
              <div className="flex items-center mt-3 text-sm font-medium text-perfect-accent">
                <Calendar size={16} className="mr-2" />
                {teacherLessons.length} ta dars
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-violet-200/30 dark:border-violet-700/30">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => handleViewSchedule(teacher)}
            className="flex-1 text-perfect-accent hover:text-perfect font-medium hover:bg-violet-50/60 dark:hover:bg-violet-900/30"
            title="Jadvalni ko'rish"
          >
            <Calendar size={16} className="mr-2" />
            Jadval
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditTeacher(teacher)}
            className="px-3 py-2 text-perfect-accent hover:text-perfect hover:bg-violet-50/60 dark:hover:bg-violet-900/30"
            title="Tahrirlash"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteTeacher(teacher)}
            title="O'chirish"
            className="px-3 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50/60 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-900/30"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Ultra Modern Header */}
      <div className="relative">
        <div className="glass-ultra p-8 rounded-3xl border-2 border-violet-300/30 hover-glow">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 rounded-2xl gradient-cyber flex items-center justify-center pulse-neon">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                O'qituvchilar
              </h1>
              <p className="text-lg text-perfect-accent font-medium">
                {filteredTeachers.length} ta o'qituvchi
              </p>
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="O'qituvchi qidirish..."
              className="w-full sm:max-w-md"
            />
            <Button
              onClick={handleAddTeacher}
              className="gradient-cyber text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus size={18} className="mr-2" />
              O'qituvchi qo'shish
            </Button>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Card variant="neon" className="text-center py-16 hover-glow">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto rounded-3xl gradient-cyber flex items-center justify-center pulse-neon">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-perfect mb-4">
                {searchTerm ? "Topilmadi" : "Bo'sh"}
              </h2>
              <p className="text-xl font-medium text-perfect-dim mb-8">
                {searchTerm
                  ? "Hech qanday o'qituvchi topilmadi"
                  : "Hali o'qituvchilar qo'shilmagan"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleAddTeacher}
                  className="gradient-cyber text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus size={20} className="mr-2" />
                  Birinchi o'qituvchi qo'shish
                </Button>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TeacherCard teacher={teacher} />
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <TeacherModal
        isOpen={isTeacherModalOpen}
        onClose={() => {
          setIsTeacherModalOpen(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />

      <TeacherScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default Teachers;
