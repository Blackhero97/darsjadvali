import { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../contexts/AppContext";
import Card from "../components/Card";
import { Users, Clock, X } from "lucide-react";
import { SearchBar } from "../components";
import { DAYS_OF_WEEK } from "../types";

const Dashboard = () => {
  const { state, getTeacherById, getGroupById } = useAppContext();
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [search, setSearch] = useState("");
  const [openMobileDay, setOpenMobileDay] = useState(null);

  // O'qituvchi jadvalini olish
  const getTeacherSchedule = (teacherId) => {
    const lessons = state.lessons.filter(
      (lesson) => lesson.teacherId === teacherId
    );
    const schedule = {};
    DAYS_OF_WEEK.forEach((day) => {
      schedule[day.id] = lessons
        .filter((lesson) => lesson.dayOfWeek === day.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map((lesson) => {
          const group = getGroupById(lesson.groupId);
          return {
            id: lesson.id,
            time: `${lesson.startTime}-${lesson.endTime}`,
            group: group?.name || "Noma'lum guruh",
            note: lesson.note || "",
          };
        });
    });
    return schedule;
  };

  const scheduleMemo = useMemo(() => {
    if (!selectedTeacher) return null;
    return getTeacherSchedule(selectedTeacher.id);
  }, [selectedTeacher, state.lessons]);

  // Mobile accordion open default (current weekday or first with lessons)
  useEffect(() => {
    if (!selectedTeacher || !scheduleMemo) return;
    const today = new Date();
    const jsDay = today.getDay(); // 0-6
    const mapping = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 0: 7 };
    const current = mapping[jsDay] || 1;
    if (scheduleMemo[current] && scheduleMemo[current].length) {
      setOpenMobileDay(current);
    } else {
      // First day with lessons
      const firstWithLessons = Object.keys(scheduleMemo).find(
        (day) => scheduleMemo[day].length > 0
      );
      setOpenMobileDay(firstWithLessons ? parseInt(firstWithLessons) : 1);
    }
  }, [selectedTeacher, scheduleMemo]);

  const closeModal = () => {
    setSelectedTeacher(null);
    setOpenMobileDay(null);
  };

  // O'qituvchilarni filterlash
  const filteredTeachers = state.teachers.filter((teacher) => {
    if (!search) return true;
    return teacher.fullName.toLowerCase().includes(search.toLowerCase());
  });

  // Statistika
  const stats = {
    totalTeachers: state.teachers.length,
    totalLessons: state.lessons.length,
    totalGroups: state.groups.length,
  };

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Perfect Light Mode Header */}
      <div className="glass-ultra p-6 rounded-3xl hover-glow">
        <div className="flex items-center space-x-4 mb-5">
          <div className="w-14 h-14 rounded-3xl gradient-cyber flex items-center justify-center pulse-neon">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-base text-perfect-dim font-medium">
              O'qituvchilar va dars jadvallari
            </p>
          </div>
        </div>

        {/* Beautiful Gradient Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 rounded-2xl opacity-75 group-hover:opacity-90 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>
            <div className="relative glass-ultra p-6 rounded-2xl border border-blue-200/50 dark:border-blue-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats.totalTeachers}
              </div>
              <div className="text-sm font-medium text-blue-600/80 dark:text-blue-400/80">
                O'qituvchilar
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 rounded-2xl opacity-75 group-hover:opacity-90 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>
            <div className="relative glass-ultra p-6 rounded-2xl border border-emerald-200/50 dark:border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {stats.totalLessons}
              </div>
              <div className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80">
                Darslar
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-90 transition-opacity duration-300 blur-sm group-hover:blur-0"></div>
            <div className="relative glass-ultra p-6 rounded-2xl border border-violet-200/50 dark:border-violet-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
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
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0l-5-5m-5 5l5-5"
                    />
                  </svg>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                {stats.totalGroups}
              </div>
              <div className="text-sm font-medium text-violet-600/80 dark:text-violet-400/80">
                Guruhlar
              </div>
            </div>
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="O'qituvchi qidirish..."
          className="max-w-md"
        />
      </div>

      {/* Perfect Light Mode Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="neon-card p-5 cursor-pointer hover-glow animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base"
                  style={{
                    background: `linear-gradient(135deg, ${teacher.color} 0%, ${teacher.color}dd 100%)`,
                  }}
                >
                  {teacher.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-perfect truncate">
                    {teacher.fullName}
                  </h3>
                  <p className="text-perfect-dim text-sm">
                    {
                      state.lessons.filter((l) => l.teacherId === teacher.id)
                        .length
                    }{" "}
                    ta dars
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center mt-8 text-perfect-dim text-sm">
          Hech narsa topilmadi.
        </div>
      )}

      {/* Perfect Light Mode Modal - O'qituvchi jadvali */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center p-3 z-50 animate-slide-up">
          <div className="glass-ultra rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            {/* Ultra Modal Header - Compact */}
            <div className="relative overflow-hidden">
              <div
                className="px-6 py-5 text-white relative"
                style={{
                  background: `linear-gradient(135deg, ${selectedTeacher.color} 0%, ${selectedTeacher.color}dd 50%, ${selectedTeacher.color}aa 100%)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-lg backdrop-blur-sm">
                      {selectedTeacher.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-shadow">
                        {selectedTeacher.fullName}
                      </h2>
                      <p className="text-white/90 text-sm font-medium">
                        📅 Haftalik dars jadvali
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Ultra Modal Body - Compact */}
            <div className="p-5 max-h-[calc(90vh-120px)] overflow-y-auto scroll-desktop">
              {/* Ultra Mobile Accordion - Compact */}
              <div className="space-y-3 md:hidden">
                {DAYS_OF_WEEK.filter((d) => d.id <= 6).map((day) => {
                  const dayLessons = scheduleMemo ? scheduleMemo[day.id] : [];
                  const isOpen = openMobileDay === day.id;
                  return (
                    <div
                      key={day.id}
                      className="neon-card overflow-hidden hover-glow"
                    >
                      <button
                        onClick={() => setOpenMobileDay(isOpen ? null : day.id)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-white/60 to-violet-50/80 dark:from-violet-900/40 dark:to-purple-900/40 hover:from-violet-50/90 hover:to-purple-50/90 dark:hover:from-violet-800/50 dark:hover:to-purple-800/50 text-left transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl gradient-cyber flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                            {day.name.charAt(0)}
                          </div>
                          <span className="font-bold text-lg text-perfect group-hover:text-perfect-accent transition-colors duration-300">
                            {day.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-lg bg-violet-100/80 dark:bg-violet-700/70 text-violet-700 dark:text-violet-300 font-bold">
                            {dayLessons?.length || 0}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg bg-violet-200/80 dark:bg-violet-700/80 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                              isOpen
                                ? "rotate-180 bg-violet-300/90 dark:bg-violet-600/90"
                                : ""
                            }`}
                          >
                            <svg
                              className="w-3 h-3 text-violet-600 dark:text-violet-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </div>
                      </button>
                      <div
                        className={`transition-all duration-500 ease-out ${
                          isOpen
                            ? "max-h-[600px] opacity-100"
                            : "max-h-0 opacity-0"
                        } overflow-hidden`}
                      >
                        <div className="p-4 bg-gradient-to-br from-white/80 to-violet-50/60 dark:from-violet-900/30 dark:to-purple-900/30">
                          {dayLessons && dayLessons.length > 0 ? (
                            <div className="space-y-2">
                              {dayLessons.map((lesson, idx) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 py-2 px-3 rounded-lg glass-ultra hover:bg-violet-50/30 dark:hover:bg-white/5 transition-all duration-200"
                                >
                                  <div className="w-6 h-6 rounded-lg gradient-cyber flex items-center justify-center text-white">
                                    <Clock size={10} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                                      {lesson.time}
                                    </div>
                                    <div className="text-xs text-perfect truncate">
                                      📚 {lesson.group}
                                    </div>
                                  </div>
                                  {lesson.note && (
                                    <div
                                      className="w-4 h-4 rounded-full bg-amber-300/80 flex items-center justify-center"
                                      title={lesson.note}
                                    >
                                      <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <Clock className="w-8 h-8 mx-auto mb-2 text-perfect-accent" />
                              <p className="text-perfect-dim font-medium text-sm">
                                Dars yo'q
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ultra Desktop Grid - Compact */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DAYS_OF_WEEK.filter((d) => d.id <= 6).map((day, dayIndex) => {
                  const dayLessons = scheduleMemo ? scheduleMemo[day.id] : [];
                  return (
                    <div
                      key={day.id}
                      className="neon-card p-4 hover-glow animate-slide-up"
                      style={{ animationDelay: `${dayIndex * 120}ms` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl gradient-cyber flex items-center justify-center text-white font-bold text-sm">
                            {day.name.charAt(0)}
                          </div>
                          <h3 className="text-lg font-bold text-perfect-accent">
                            {day.name}
                          </h3>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-violet-100/80 dark:bg-violet-700/70 text-violet-700 dark:text-violet-300 text-xs font-bold">
                          {dayLessons?.length || 0}
                        </div>
                      </div>

                      <div className="overflow-visible">
                        {dayLessons && dayLessons.length > 0 ? (
                          <div className="space-y-2">
                            {dayLessons.map((lesson, idx) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-2 py-2 px-2 rounded-lg glass-ultra hover:bg-violet-50/40 dark:hover:bg-white/5 transition-all duration-200"
                              >
                                <div className="w-5 h-5 rounded-lg gradient-cyber flex items-center justify-center text-white">
                                  <Clock size={8} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-bold bg-gradient-to-r from-violet-700 to-purple-600 bg-clip-text text-transparent">
                                    {lesson.time}
                                  </div>
                                  <div className="text-xs text-perfect truncate">
                                    📚 {lesson.group}
                                  </div>
                                </div>
                                {lesson.note && (
                                  <div
                                    className="w-3 h-3 rounded-full bg-amber-400/70 flex items-center justify-center"
                                    title={lesson.note}
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-perfect-accent" />
                            <p className="text-perfect-dim font-medium text-xs">
                              Dars yo'q
                            </p>
                            <p className="text-xs text-perfect-dim/60 mt-1">
                              Bu kunda dars rejalashtirilmagan
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
