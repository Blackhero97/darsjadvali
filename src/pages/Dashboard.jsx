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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Har daqiqada vaqtni yangilash
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 1 daqiqada bir marta

    return () => clearInterval(timer);
  }, []);

  // Dars vaqti rangini aniqlash funksiyasi
  const getLessonTimeColor = (startTime, endTime) => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Dars vaqtlarini minutlarga o'girish
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startTimeInMinutes = startHour * 60 + startMin;
    const endTimeInMinutes = endHour * 60 + endMin;

    // 30 daqiqa oldin sariq, davomida yashil, 15 daqiqa keyin qizil
    const timeDiffStart = startTimeInMinutes - currentTimeInMinutes;
    const timeDiffEnd = endTimeInMinutes - currentTimeInMinutes;

    if (timeDiffStart <= 30 && timeDiffStart > 0) {
      // Dars boshlanishiga 30 daqiqa qolgan - SARIQ
      return "bg-gradient-to-r from-yellow-400 to-amber-400 text-white border-yellow-300 shadow-lg";
    } else if (
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes <= endTimeInMinutes
    ) {
      // Dars davom etmoqda - YASHIL
      return "bg-gradient-to-r from-green-400 to-emerald-400 text-white border-green-300 animate-pulse shadow-lg";
    } else if (timeDiffEnd < 0 && timeDiffEnd >= -15) {
      // Dars tugaganiga 15 daqiqa bo'lgan - QIZIL
      return "bg-gradient-to-r from-red-400 to-rose-400 text-white border-red-300 shadow-lg";
    }

    // Oddiy holat - OQ/KULRANG
    return "bg-white hover:bg-gray-50/40 text-gray-700 border-gray-200";
  };

  // Matn rangini aniqlash funksiyasi
  const getTextColor = (startTime, endTime) => {
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Dars vaqtlarini minutlarga o'girish
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startTimeInMinutes = startHour * 60 + startMin;
    const endTimeInMinutes = endHour * 60 + endMin;

    // 30 daqiqa oldin sariq, davomida yashil, 15 daqiqa keyin qizil
    const timeDiffStart = startTimeInMinutes - currentTimeInMinutes;
    const timeDiffEnd = endTimeInMinutes - currentTimeInMinutes;

    if (timeDiffStart <= 30 && timeDiffStart > 0) {
      return "text-white"; // Sariq fonda oq matn
    } else if (
      currentTimeInMinutes >= startTimeInMinutes &&
      currentTimeInMinutes <= endTimeInMinutes
    ) {
      return "text-white"; // Yashil fonda oq matn
    } else if (timeDiffEnd < 0 && timeDiffEnd >= -15) {
      return "text-white"; // Qizil fonda oq matn
    }

    return "text-gray-700"; // Oq fonda qora matn
  };

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
    <div className="space-y-8 animate-slide-up bg-gradient-to-br from-violet-50/30 via-white to-indigo-50/30 min-h-screen -m-6 p-6">
      {/* Header */}
      <div className="glass-ultra p-6 rounded-3xl hover-glow bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border border-violet-200/60 shadow-xl shadow-violet-500/10">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40 animate-pulse">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-base text-violet-600 font-medium">
                O'qituvchilar va dars jadvallari
              </p>
            </div>
          </div>
        </div>

        {/* Beautiful Gradient Statistics Cards - Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-3 gap-4 mb-6">
          <div className="relative group">
            <div className="relative bg-gradient-to-br from-blue-100 via-cyan-50 to-sky-100 p-6 rounded-2xl border border-blue-300/40 group-hover:shadow-2xl group-hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/50">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-700 bg-clip-text text-transparent">
                {stats.totalTeachers}
              </div>
              <div className="text-sm font-medium text-blue-700/90">
                O'qituvchilar
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 p-6 rounded-2xl border border-emerald-300/40 group-hover:shadow-2xl group-hover:shadow-emerald-500/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/50">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                {stats.totalLessons}
              </div>
              <div className="text-sm font-medium text-emerald-700/90">
                Darslar
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="relative bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6 rounded-2xl border border-violet-300/40 group-hover:shadow-2xl group-hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-xl shadow-violet-500/50">
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
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-fuchsia-700 bg-clip-text text-transparent">
                {stats.totalGroups}
              </div>
              <div className="text-sm font-medium text-violet-700/90">
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

      {/* Teachers Grid */}
      {filteredTeachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTeachers.map((teacher, index) => (
            <div
              key={teacher.id}
              className="bg-gradient-to-br from-white via-gray-50 to-indigo-50/30 p-5 cursor-pointer rounded-2xl border border-indigo-200/40 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-102 hover:border-indigo-300/60 animate-slide-up"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => setSelectedTeacher(teacher)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
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
                  <h3 className="font-bold text-base text-gray-800 truncate">
                    {teacher.fullName}
                  </h3>
                  <p className="text-indigo-600/80 text-sm font-medium">
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
        <div className="text-center mt-8 text-violet-600 text-sm font-medium">
          Hech narsa topilmadi.
        </div>
      )}

      {/* Modal - O'qituvchi jadvali */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/30 via-violet-900/20 to-indigo-900/30 backdrop-blur-sm flex items-center justify-center p-3 z-50 animate-slide-up">
          <div className="bg-gradient-to-br from-white via-violet-50/30 to-indigo-50/20 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-violet-200/60 shadow-2xl shadow-violet-500/20">
            {/* Modal Header */}
            <div className="relative overflow-hidden">
              <div className="px-6 py-5 relative bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border-b border-violet-200/50">
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-xl shadow-violet-500/30"
                      style={{
                        background: `linear-gradient(135deg, ${selectedTeacher.color} 0%, ${selectedTeacher.color}dd 100%)`,
                      }}
                    >
                      {selectedTeacher.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-700 to-indigo-700 bg-clip-text text-transparent">
                        {selectedTeacher.fullName}
                      </h2>
                      <p className="text-violet-600 text-sm font-medium">
                        📅 Haftalik dars jadvali
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-violet-100/80 rounded-xl transition-all duration-300 hover:scale-110 hover:rotate-90 text-violet-600 hover:text-violet-800 shadow-sm hover:shadow-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Body with Dark Mode Support */}
            <div className="p-5 max-h-[calc(90vh-120px)] overflow-y-auto scroll-desktop">
              {/* Mobile Accordion with Dark Mode */}
              <div className="space-y-3 md:hidden">
                {DAYS_OF_WEEK.filter((d) => d.id <= 6).map((day) => {
                  const dayLessons = scheduleMemo ? scheduleMemo[day.id] : [];
                  const isOpen = openMobileDay === day.id;
                  return (
                    <div
                      key={day.id}
                      className="bg-white "
                      style={{ borderColor: "#e1e1e1" }}
                    >
                      <button
                        onClick={() => setOpenMobileDay(isOpen ? null : day.id)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white "
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${selectedTeacher.color} 0%, ${selectedTeacher.color}dd 100%)`,
                            }}
                          >
                            {day.name.charAt(0)}
                          </div>
                          <span className="font-bold text-lg text-gray-900 ">
                            {day.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm px-3 py-1 rounded-lg bg-gray-100/80 ">
                            {dayLessons?.length || 0}
                          </span>
                          <div
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-300 ${
                              isOpen
                                ? "rotate-180 bg-gray-300/90"
                                : "bg-gray-200/80"
                            }`}
                          >
                            <svg
                              className="w-3 h-3 text-gray-600 "
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
                        <div className="p-4 bg-gray-50/30 ">
                          {dayLessons && dayLessons.length > 0 ? (
                            <div className="space-y-2">
                              {dayLessons.map((lesson, idx) => {
                                const [startTime, endTime] =
                                  lesson.time.split("-");
                                const timeColorClass = getLessonTimeColor(
                                  startTime,
                                  endTime
                                );
                                const textColorClass = getTextColor(
                                  startTime,
                                  endTime
                                );
                                return (
                                  <div
                                    key={lesson.id}
                                    className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-300 ${timeColorClass}`}
                                    style={{ borderWidth: "1px" }}
                                  >
                                    <div
                                      className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                                      style={{
                                        background: `linear-gradient(135deg, ${selectedTeacher.color} 0%, ${selectedTeacher.color}dd 100%)`,
                                      }}
                                    >
                                      <Clock size={10} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div
                                        className={`text-sm font-bold ${textColorClass}`}
                                      >
                                        {lesson.time}
                                      </div>
                                      <div
                                        className={`text-xs ${textColorClass} opacity-90`}
                                      >
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
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600 " />
                              <p className="text-gray-600 ">Dars yo'q</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ultra Desktop Grid - Compact with Dark Mode Support */}
              <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {DAYS_OF_WEEK.filter((d) => d.id <= 6).map((day, dayIndex) => {
                  const dayLessons = scheduleMemo ? scheduleMemo[day.id] : [];
                  return (
                    <div
                      key={day.id}
                      className="neon-card p-4 hover-glow animate-slide-up border "
                      style={{
                        animationDelay: `${dayIndex * 120}ms`,
                        borderColor: "#e1e1e1",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl gradient-cyber flex items-center justify-center text-white font-bold text-sm">
                            {day.name.charAt(0)}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 ">
                            {day.name}
                          </h3>
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-gray-100/80 ">
                          {dayLessons?.length || 0}
                        </div>
                      </div>

                      <div className="overflow-visible">
                        {dayLessons && dayLessons.length > 0 ? (
                          <div className="space-y-2">
                            {dayLessons.map((lesson, idx) => {
                              const [startTime, endTime] =
                                lesson.time.split("-");
                              const timeColorClass = getLessonTimeColor(
                                startTime,
                                endTime
                              );
                              const textColorClass = getTextColor(
                                startTime,
                                endTime
                              );
                              return (
                                <div
                                  key={lesson.id}
                                  className={`flex items-center gap-2 py-2 px-2 rounded-lg transition-all duration-300 ${timeColorClass}`}
                                  style={{ borderWidth: "1px" }}
                                >
                                  <div
                                    className="w-5 h-5 rounded-lg flex items-center justify-center text-white"
                                    style={{
                                      background: `linear-gradient(135deg, ${selectedTeacher.color} 0%, ${selectedTeacher.color}dd 100%)`,
                                    }}
                                  >
                                    <Clock size={8} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div
                                      className={`text-xs font-bold ${textColorClass}`}
                                    >
                                      {lesson.time}
                                    </div>
                                    <div
                                      className={`text-xs ${textColorClass} opacity-90`}
                                    >
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
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6">
                            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600 " />
                            <p className="text-gray-600 ">Dars yo'q</p>
                            <p className="text-xs text-gray-500 ">
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
