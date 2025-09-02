// Teacher model
export const createTeacher = ({
  id,
  fullName,
  department = null,
  color = null,
}) => ({
  id,
  fullName,
  department,
  color: color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
});

// Classroom model
export const createClassroom = ({ id, name }) => ({
  id,
  name,
});

// Subject model
export const createSubject = ({ id, name, shortName = null }) => ({
  id,
  name,
  shortName: shortName || name.substring(0, 3).toUpperCase(),
});

// Group model
export const createGroup = ({ id, name, level = null }) => ({
  id,
  name,
  level,
});

// Lesson model
export const createLesson = ({
  id,
  teacherId,
  subjectId = null, // endi ixtiyoriy
  groupId,
  classroomId,
  dayOfWeek,
  startTime,
  endTime,
  note = null,
}) => ({
  id,
  teacherId,
  subjectId: subjectId || null,
  groupId,
  classroomId,
  dayOfWeek: parseInt(dayOfWeek), // 1-7 (Monday to Sunday)
  startTime, // "HH:mm" format
  endTime, // "HH:mm" format
  note,
});

// Days of week
export const DAYS_OF_WEEK = [
  { id: 1, name: "Dushanba", short: "Du" },
  { id: 2, name: "Seshanba", short: "Se" },
  { id: 3, name: "Chorshanba", short: "Ch" },
  { id: 4, name: "Payshanba", short: "Pa" },
  { id: 5, name: "Juma", short: "Ju" },
  { id: 6, name: "Shanba", short: "Sh" },
  { id: 7, name: "Yakshanba", short: "Ya" },
];

// Time slots helper
export const generateTimeSlots = (
  startHour = 8,
  endHour = 18,
  intervalMinutes = 90
) => {
  const slots = [];
  let currentHour = startHour;
  let currentMinute = 0;

  while (currentHour < endHour) {
    const startTime = `${currentHour
      .toString()
      .padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

    // Calculate end time
    let endMinute = currentMinute + intervalMinutes;
    let endHour = currentHour;

    if (endMinute >= 60) {
      endHour += Math.floor(endMinute / 60);
      endMinute = endMinute % 60;
    }

    const endTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    slots.push({ startTime, endTime });

    // Move to next slot
    currentMinute += intervalMinutes;
    if (currentMinute >= 60) {
      currentHour += Math.floor(currentMinute / 60);
      currentMinute = currentMinute % 60;
    }
  }

  return slots;
};
