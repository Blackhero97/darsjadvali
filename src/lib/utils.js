import * as XLSX from "xlsx";

// Excel/CSV import utilities
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        resolve({
          headers: jsonData[0] || [],
          rows: jsonData.slice(1) || [],
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("File reading failed"));
    reader.readAsArrayBuffer(file);
  });
};

// Export data to Excel
export const exportToExcel = (data, filename = "dars-jadvali.xlsx") => {
  const workbook = XLSX.utils.book_new();

  // Create sheets for each data type
  Object.keys(data).forEach((sheetName) => {
    if (Array.isArray(data[sheetName]) && data[sheetName].length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(data[sheetName]);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    }
  });

  // Download the file
  XLSX.writeFile(workbook, filename);
};

// Create schedule table for export
export const createScheduleExport = (
  lessons,
  teachers,
  _subjects, // endi ishlatilmaydi
  groups,
  classrooms
) => {
  return lessons.map((lesson) => {
    const teacher = teachers.find((t) => t.id === lesson.teacherId);
    const group = groups.find((g) => g.id === lesson.groupId);
    const classroom = classrooms.find((c) => c.id === lesson.classroomId);

    return {
      "O'qituvchi": teacher?.fullName || "",
      Fan: "", // fan olib tashlangan
      Guruh: group?.name || "",
      Xona: classroom?.name || "",
      Kun: getDayName(lesson.dayOfWeek),
      "Boshlanish vaqti": lesson.startTime,
      "Tugash vaqti": lesson.endTime,
      Izoh: lesson.note || "",
    };
  });
};

// Helper function to get day name
const getDayName = (dayOfWeek) => {
  const days = [
    "",
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba",
  ];
  return days[dayOfWeek] || "";
};

// Validate lesson data
export const validateLessonData = (lesson) => {
  const errors = [];

  if (!lesson.teacherId) errors.push("O'qituvchi tanlanmagan");
  if (!lesson.groupId) errors.push("Guruh tanlanmagan");
  if (!lesson.classroomId) errors.push("Xona tanlanmagan");
  if (!lesson.dayOfWeek || lesson.dayOfWeek < 1 || lesson.dayOfWeek > 7) {
    errors.push("Noto'g'ri hafta kuni");
  }
  if (!lesson.startTime || !lesson.endTime) {
    errors.push("Vaqt kiritilmagan");
  }

  // Check if end time is after start time
  if (lesson.startTime && lesson.endTime) {
    const start = new Date(`2000-01-01T${lesson.startTime}:00`);
    const end = new Date(`2000-01-01T${lesson.endTime}:00`);
    if (end <= start) {
      errors.push("Tugash vaqti boshlanish vaqtidan kechroq bo'lishi kerak");
    }
  }

  return errors;
};

// Time utilities
export const parseTime = (timeStr) => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes; // Convert to minutes
};

export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
};

export const isTimeInRange = (timeStr, startStr, endStr) => {
  const time = parseTime(timeStr);
  const start = parseTime(startStr);
  const end = parseTime(endStr);
  return time >= start && time <= end;
};

// Utility functions
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Color utilities
export const getContrastColor = (hexColor) => {
  // Remove # if present
  const color = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF";
};

// Generate random color
export const generateRandomColor = () => {
  const colors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#EC4899",
    "#6366F1",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
