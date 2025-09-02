// JSON fayldagi ma'lumotlardan foydalanish (faqat ism va darslar)
// VITE / React muhitida bevosita JSON import qilinadi.
import rawTeachers from "./oqituvchilar_by_name.json";

// JSON ni massivga aylantirish
export const sampleTeachersData = Object.entries(rawTeachers || {}).map(
  ([name, lessons]) => ({
    teacher: name,
    lessons: lessons.map((l) => ({
      day: l.day,
      time: `${l.start}-${l.end}`,
      group: l.group,
    })),
  })
);

// Kun mapping
export const dayMapping = { Du: 1, Se: 2, Ch: 3, Pa: 4, Ju: 5 };

// Ma'lumotlarni app state formatiga o'tkazish
export const transformSampleData = () => {
  // Ranglar – o'qituvchilar uchun aylanadi
  const colors = [
    "#6366F1",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#3B82F6",
  ];

  const teachers = [];
  // Fanlar bekor qilindi (kerak emas) – bo'sh massiv
  const subjects = [];
  const groups = [];
  const classrooms = [];
  const lessons = [];

  const groupSet = new Set();
  const classroomSet = new Set();

  let teacherId = 1,
    groupId = 1,
    classroomId = 1,
    lessonId = 1;

  sampleTeachersData.forEach((t, idx) => {
    const teacher = {
      id: `teacher-${teacherId++}`,
      fullName: t.teacher,
      email: `${t.teacher.toLowerCase().replace(/[^a-z]/g, "")}@school.uz`,
      phone: `+998 90 ${String(9000000 + idx).slice(1)}`,
      department: null,
      color: colors[idx % colors.length],
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    teachers.push(teacher);

    t.lessons.forEach((l) => {
      // Guruhlar
      if (!groupSet.has(l.group)) {
        groupSet.add(l.group);
        groups.push({
          id: `group-${groupId++}`,
          name: l.group,
          level: l.group.includes("t") ? "Texnikum" : "Maktab",
          studentCount: 20,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }

      // Xonalar ("kelajak soati" = Aula)
      const classroomName =
        l.group === "kelajak soati"
          ? "Aula"
          : `${l.group.includes("t") ? "T" : "A"}-${
              100 + ((groupId + idx) % 20)
            }`;
      if (!classroomSet.has(classroomName)) {
        classroomSet.add(classroomName);
        classrooms.push({
          id: `classroom-${classroomId++}`,
          name: classroomName,
          capacity: classroomName === "Aula" ? 200 : 25,
          type: l.group.includes("t") ? "Texnikum" : "Maktab",
          hasProjector: true,
          hasComputers: false,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }

      const group = groups.find((g) => g.name === l.group);
      const classroom = classrooms.find((c) => c.name === classroomName);
      const [startTime, endTime] = l.time.split("-");
      if (group && classroom) {
        lessons.push({
          id: `lesson-${lessonId++}`,
          teacherId: teacher.id,
          subjectId: null, // fan yo'q
          groupId: group.id,
          classroomId: classroom.id,
          dayOfWeek: dayMapping[l.day],
          startTime,
          endTime,
          note: l.group === "kelajak soati" ? "Kelajak soati" : "",
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      }
    });
  });

  const settings = {
    schoolName: "Dars Jadvali",
    workingHours: { start: "08:00", end: "18:00" },
    lessonDuration: 45,
    workingDays: 5,
    darkMode: false,
  };

  const dataVersion = `json-v1-${teachers.length}-${lessons.length}`;

  return {
    teachers,
    subjects,
    groups,
    classrooms,
    lessons,
    settings,
    dataVersion,
  };
};
