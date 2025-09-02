import { useState, useMemo } from "react";
import { Plus, Search, Filter, Download, Upload } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { DAYS_OF_WEEK, generateTimeSlots } from "../types";
import { Card, Button, Input, Select, Modal } from "../components";
import LessonModal from "../features/schedule/LessonModal";
import ImportModal from "../features/import/ImportModal";
import { exportToExcel, createScheduleExport } from "../lib/utils";

const Schedule = () => {
  const {
    state,
    getTeacherById,
    getGroupById,
    getClassroomById,
    getLessonsByTimeSlot,
  } = useAppContext();

  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterGroup, setFilterGroup] = useState("");
  // fan filtri olib tashlandi
  const [filterClassroom, setFilterClassroom] = useState("");

  // Generate time slots based on settings
  const timeSlots = useMemo(() => {
    const startHour = parseInt(state.settings.workingHours.start.split(":")[0]);
    const endHour = parseInt(state.settings.workingHours.end.split(":")[0]);
    return generateTimeSlots(startHour, endHour, state.settings.lessonDuration);
  }, [state.settings]);

  // Filter lessons
  const filteredLessons = useMemo(() => {
    return state.lessons.filter((lesson) => {
      const teacher = getTeacherById(lesson.teacherId);
      // fan ishlatilmaydi
      const group = getGroupById(lesson.groupId);
      const classroom = getClassroomById(lesson.classroomId);

      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          teacher?.fullName.toLowerCase().includes(searchLower) ||
          // fan nomi yo'q
          group?.name.toLowerCase().includes(searchLower) ||
          classroom?.name.toLowerCase().includes(searchLower) ||
          lesson.note?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      // Specific filters
      if (filterTeacher && lesson.teacherId !== filterTeacher) return false;
      if (filterGroup && lesson.groupId !== filterGroup) return false;
      // fan bo'yicha filtr yo'q
      if (filterClassroom && lesson.classroomId !== filterClassroom)
        return false;

      return true;
    });
  }, [
    state.lessons,
    searchTerm,
    filterTeacher,
    filterGroup,
    filterClassroom,
    getTeacherById,
    getGroupById,
    getClassroomById,
  ]);

  const handleAddLesson = (timeSlot, dayOfWeek) => {
    setSelectedTimeSlot({ ...timeSlot, dayOfWeek });
    setSelectedLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setSelectedTimeSlot(null);
    setIsLessonModalOpen(true);
  };

  const handleExport = () => {
    const scheduleData = createScheduleExport(
      state.lessons,
      state.teachers,
      state.subjects,
      state.groups,
      state.classrooms
    );

    const exportData = {
      "Dars Jadvali": scheduleData,
      "O'qituvchilar": state.teachers,
      Fanlar: state.subjects,
      Guruhlar: state.groups,
      Xonalar: state.classrooms,
    };

    exportToExcel(
      exportData,
      `dars-jadvali-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const LessonCell = ({ timeSlot, dayOfWeek }) => {
    const lessonsInSlot = getLessonsByTimeSlot(
      dayOfWeek,
      timeSlot.startTime,
      timeSlot.endTime
    ).filter((lesson) => filteredLessons.some((fl) => fl.id === lesson.id));

    return (
      <div className="min-h-[90px] border-2 border-white/20 glass relative group rounded-lg overflow-hidden hover-lift transition-all duration-300">
        {lessonsInSlot.length === 0 ? (
          <button
            onClick={() => handleAddLesson(timeSlot, dayOfWeek)}
            className="w-full h-full flex items-center justify-center text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group-hover:scale-110 hover:bg-white/20"
          >
            <Plus size={24} className="drop-shadow-lg" />
          </button>
        ) : (
          <div className="p-3 space-y-2 h-full">
            {lessonsInSlot.map((lesson, index) => {
              const teacher = getTeacherById(lesson.teacherId);
              // fan yo'q
              const group = getGroupById(lesson.groupId);
              const classroom = getClassroomById(lesson.classroomId);

              return (
                <div
                  key={lesson.id}
                  onClick={() => handleEditLesson(lesson)}
                  className="p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-300 text-sm font-medium hover:scale-105 backdrop-blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${
                      teacher?.color || "#6366F1"
                    }, ${teacher?.color || "#6366F1"}dd)`,
                    color: "white",
                    animationDelay: `${index * 0.1}s`,
                  }}
                  title={`${teacher?.fullName}\n${group?.name} - ${
                    classroom?.name
                  }\n${lesson.startTime} - ${lesson.endTime}${
                    lesson.note ? "\n" + lesson.note : ""
                  }`}
                >
                  <div className="font-semibold text-shadow">{group?.name}</div>
                  <div className="opacity-95 text-xs">&nbsp;</div>
                  <div className="opacity-90 text-xs">🏫 {classroom?.name}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const workingDays = DAYS_OF_WEEK.slice(0, state.settings.workingDays);

  return (
    <div className="space-y-8">
      {/* Perfect Light Mode Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          📅 Haftalik Jadval
        </h1>
        <p className="text-xl text-perfect-accent">
          {filteredLessons.length} ta dars rejalashtirilgan
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Button
            variant="primary"
            glow={true}
            onClick={() => setIsImportModalOpen(true)}
          >
            <Upload size={20} className="mr-2" />
            Excel Import
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download size={20} className="mr-2" />
            Excel Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6 glass" gradient={true}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-2 relative">
            <Input
              label="Qidirish"
              placeholder="Dars, o'qituvchi, guruh yoki xona qidiring..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={Search}
            />
          </div>

          <Select
            placeholder="O'qituvchi"
            value={filterTeacher}
            onChange={setFilterTeacher}
            options={[
              { value: "", label: "Barcha o'qituvchilar" },
              ...state.teachers.map((t) => ({
                value: t.id,
                label: t.fullName,
              })),
            ]}
          />

          <Select
            placeholder="Guruh"
            value={filterGroup}
            onChange={setFilterGroup}
            options={[
              { value: "", label: "Barcha guruhlar" },
              ...state.groups.map((g) => ({ value: g.id, label: g.name })),
            ]}
          />

          {/* Fan Select olib tashlandi */}

          <Select
            placeholder="Xona"
            value={filterClassroom}
            onChange={setFilterClassroom}
            options={[
              { value: "", label: "Barcha xonalar" },
              ...state.classrooms.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
        </div>
      </Card>

      {/* Desktop / Tablet schedule grid */}
      <Card className="overflow-hidden glass shadow-2xl hidden md:block">
        <div className="overflow-x-auto scrollbar-thin">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-8 gradient-primary text-white">
              <div className="p-4 lg:p-6 border-r border-white/20 font-bold text-sm lg:text-lg flex items-center justify-center">
                ⏰ Vaqt
              </div>
              {workingDays.map((day, index) => (
                <div
                  key={day.id}
                  className="p-4 lg:p-6 border-r border-white/20 text-center font-semibold text-xs lg:text-base"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>{day.short}</div>
                  <div className="hidden lg:block text-sm opacity-80 mt-1">
                    {day.name}
                  </div>
                </div>
              ))}
            </div>
            {timeSlots.map((timeSlot, slotIndex) => (
              <div
                key={`${timeSlot.startTime}-${timeSlot.endTime}`}
                className="grid grid-cols-8 border-b border-white/10 hover:bg-white/5 transition-colors duration-300"
                style={{ animationDelay: `${slotIndex * 0.04}s` }}
              >
                <div className="p-3 lg:p-4 border-r border-gray-200/60 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-800/40">
                  <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                    {timeSlot.startTime}
                  </div>
                  <div className="text-[10px] lg:text-xs text-gray-500 dark:text-gray-400">
                    {timeSlot.endTime}
                  </div>
                </div>
                {workingDays.map((day) => (
                  <LessonCell
                    key={`${timeSlot.startTime}-${day.id}`}
                    timeSlot={timeSlot}
                    dayOfWeek={day.id}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Mobile (stacked) schedule */}
      <div className="md:hidden space-y-6">
        {workingDays.map((day) => {
          const dayLessons = state.lessons
            .filter((l) => l.dayOfWeek === day.id)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));
          return (
            <Card key={day.id} className="p-4 glass">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  {day.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {dayLessons.length} ta dars
                </span>
              </div>
              {dayLessons.length === 0 ? (
                <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                  Dars yo'q
                </div>
              ) : (
                <ul className="divide-y divide-gray-200/60 dark:divide-gray-700/60">
                  {dayLessons.map((lesson, i) => {
                    const teacher = getTeacherById(lesson.teacherId);
                    const group = getGroupById(lesson.groupId);
                    const classroom = getClassroomById(lesson.classroomId);
                    return (
                      <li
                        key={lesson.id}
                        className="py-3 flex items-center gap-3"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
                          style={{
                            backgroundColor: teacher?.color || "#6366F1",
                          }}
                        >
                          {teacher?.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {lesson.startTime} - {lesson.endTime}
                          </div>
                          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                            {group?.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {teacher?.fullName} • {classroom?.name}
                          </div>
                          {lesson.note && (
                            <div className="text-[11px] text-indigo-600 dark:text-indigo-300 mt-1">
                              {lesson.note}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          );
        })}
      </div>

      {/* Modals */}
      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => {
          setIsLessonModalOpen(false);
          setSelectedLesson(null);
          setSelectedTimeSlot(null);
        }}
        lesson={selectedLesson}
        timeSlot={selectedTimeSlot}
      />

      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};

export default Schedule;
