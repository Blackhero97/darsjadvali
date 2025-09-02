import { createContext, useContext, useReducer, useEffect } from "react";
import { useLocalStorage } from "../hooks";
import {
  createTeacher,
  createSubject,
  createGroup,
  createClassroom,
  createLesson,
} from "../types";
import { transformSampleData } from "../lib/realData";

// Initial state with real data
const getInitialState = () => {
  try {
    // Haqiqiy ma'lumotlarni yuklash
    const realData = transformSampleData();
    console.log("Haqiqiy ma'lumotlar yuklandi:", realData);
    return realData;
  } catch (error) {
    console.warn("Haqiqiy ma'lumotlarni yuklashda muammo:", error);
    // Fallback demo data
    return {
      teachers: [
        createTeacher({
          id: "1",
          fullName: "Aziza Karimova",
          department: "Matematika",
          color: "#3B82F6",
        }),
        createTeacher({
          id: "2",
          fullName: "Bobur Rahimov",
          department: "Fizika",
          color: "#10B981",
        }),
        createTeacher({
          id: "3",
          fullName: "Dildora Tursunova",
          department: "Kimyo",
          color: "#F59E0B",
        }),
      ],
      subjects: [], // fanlar ishlatilmaydi
      groups: [
        createGroup({ id: "1", name: "10-A", level: "10" }),
        createGroup({ id: "2", name: "11-B", level: "11" }),
        createGroup({ id: "3", name: "9-V", level: "9" }),
      ],
      classrooms: [
        createClassroom({ id: "1", name: "101" }),
        createClassroom({ id: "2", name: "102" }),
        createClassroom({ id: "3", name: "201" }),
        createClassroom({ id: "4", name: "Laboratoriya" }),
      ],
      lessons: [
        createLesson({
          id: "1",
          teacherId: "1",
          groupId: "1",
          classroomId: "1",
          dayOfWeek: 1,
          startTime: "08:30",
          endTime: "10:00",
        }),
        createLesson({
          id: "2",
          teacherId: "2",
          groupId: "2",
          classroomId: "4",
          dayOfWeek: 2,
          startTime: "10:00",
          endTime: "11:30",
          note: "Laboratoriya ishlar",
        }),
      ],
      settings: {
        schoolName: "Maktab Dars Jadvali",
        workingHours: { start: "08:00", end: "18:00" },
        lessonDuration: 90,
        workingDays: 6,
        darkMode: false,
      },
    };
  }
};

const initialState = getInitialState();

// Action types
const ActionTypes = {
  // Teachers
  ADD_TEACHER: "ADD_TEACHER",
  UPDATE_TEACHER: "UPDATE_TEACHER",
  DELETE_TEACHER: "DELETE_TEACHER",

  // Subjects
  // subjects olib tashlangan

  // Groups
  ADD_GROUP: "ADD_GROUP",
  UPDATE_GROUP: "UPDATE_GROUP",
  DELETE_GROUP: "DELETE_GROUP",

  // Classrooms
  ADD_CLASSROOM: "ADD_CLASSROOM",
  UPDATE_CLASSROOM: "UPDATE_CLASSROOM",
  DELETE_CLASSROOM: "DELETE_CLASSROOM",

  // Lessons
  ADD_LESSON: "ADD_LESSON",
  UPDATE_LESSON: "UPDATE_LESSON",
  DELETE_LESSON: "DELETE_LESSON",

  // Settings
  UPDATE_SETTINGS: "UPDATE_SETTINGS",

  // Import data
  IMPORT_DATA: "IMPORT_DATA",
  // Reset
  RESET_DATA: "RESET_DATA",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TEACHER:
      return {
        ...state,
        teachers: [...state.teachers, action.payload],
      };

    case ActionTypes.UPDATE_TEACHER:
      return {
        ...state,
        teachers: state.teachers.map((teacher) =>
          teacher.id === action.payload.id ? action.payload : teacher
        ),
      };

    case ActionTypes.DELETE_TEACHER:
      return {
        ...state,
        teachers: state.teachers.filter(
          (teacher) => teacher.id !== action.payload
        ),
        lessons: state.lessons.filter(
          (lesson) => lesson.teacherId !== action.payload
        ),
      };

    // subject case lar olib tashlandi

    case ActionTypes.ADD_GROUP:
      return {
        ...state,
        groups: [...state.groups, action.payload],
      };

    case ActionTypes.UPDATE_GROUP:
      return {
        ...state,
        groups: state.groups.map((group) =>
          group.id === action.payload.id ? action.payload : group
        ),
      };

    case ActionTypes.DELETE_GROUP:
      return {
        ...state,
        groups: state.groups.filter((group) => group.id !== action.payload),
        lessons: state.lessons.filter(
          (lesson) => lesson.groupId !== action.payload
        ),
      };

    case ActionTypes.ADD_CLASSROOM:
      return {
        ...state,
        classrooms: [...state.classrooms, action.payload],
      };

    case ActionTypes.UPDATE_CLASSROOM:
      return {
        ...state,
        classrooms: state.classrooms.map((classroom) =>
          classroom.id === action.payload.id ? action.payload : classroom
        ),
      };

    case ActionTypes.DELETE_CLASSROOM:
      return {
        ...state,
        classrooms: state.classrooms.filter(
          (classroom) => classroom.id !== action.payload
        ),
        lessons: state.lessons.filter(
          (lesson) => lesson.classroomId !== action.payload
        ),
      };

    case ActionTypes.ADD_LESSON:
      return {
        ...state,
        lessons: [...state.lessons, action.payload],
      };

    case ActionTypes.UPDATE_LESSON:
      return {
        ...state,
        lessons: state.lessons.map((lesson) =>
          lesson.id === action.payload.id ? action.payload : lesson
        ),
      };

    case ActionTypes.DELETE_LESSON:
      return {
        ...state,
        lessons: state.lessons.filter((lesson) => lesson.id !== action.payload),
      };

    case ActionTypes.UPDATE_SETTINGS:
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case ActionTypes.IMPORT_DATA:
      return {
        ...state,
        ...action.payload,
      };

    case ActionTypes.RESET_DATA: {
      const fresh = transformSampleData();
      return { ...fresh };
    }

    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [storageState, setStorageState] = useLocalStorage(
    "schedule-app-state",
    initialState
  );
  // Har ishga tushganda JSON dan qayta yuklash (storage ni faqat qo'lda o'zgarishlar uchun saqlaymiz)
  const freshData = getInitialState();
  const [state, dispatch] = useReducer(appReducer, {
    ...freshData, // storage bilan birlashtirish emas
  });

  // Update localStorage when state changes
  useEffect(() => {
    setStorageState(state); // baribir saqlaymiz, lekin ishga tushganda yangilanadi
  }, [state]);

  // Helper functions
  const getTeacherById = (id) => state.teachers.find((t) => t.id === id);
  // getSubjectById olib tashlandi
  const getGroupById = (id) => state.groups.find((g) => g.id === id);
  const getClassroomById = (id) => state.classrooms.find((c) => c.id === id);
  const getLessonById = (id) => state.lessons.find((l) => l.id === id);

  const getLessonsByTimeSlot = (dayOfWeek, startTime, endTime) => {
    return state.lessons.filter(
      (lesson) =>
        lesson.dayOfWeek === dayOfWeek &&
        lesson.startTime === startTime &&
        lesson.endTime === endTime
    );
  };

  const getTeacherLessons = (teacherId) => {
    return state.lessons.filter((lesson) => lesson.teacherId === teacherId);
  };

  const isTimeSlotConflict = (newLesson, excludeLessonId = null) => {
    return state.lessons.some((lesson) => {
      if (excludeLessonId && lesson.id === excludeLessonId) return false;

      return (
        lesson.dayOfWeek === newLesson.dayOfWeek &&
        lesson.startTime === newLesson.startTime &&
        lesson.endTime === newLesson.endTime &&
        (lesson.teacherId === newLesson.teacherId ||
          lesson.groupId === newLesson.groupId ||
          lesson.classroomId === newLesson.classroomId)
      );
    });
  };

  // Actions
  const actions = {
    dispatch,
    addTeacher: (teacher) =>
      dispatch({ type: ActionTypes.ADD_TEACHER, payload: teacher }),
    updateTeacher: (teacher) =>
      dispatch({ type: ActionTypes.UPDATE_TEACHER, payload: teacher }),
    deleteTeacher: (id) =>
      dispatch({ type: ActionTypes.DELETE_TEACHER, payload: id }),

    // subject actions yo'q

    addGroup: (group) =>
      dispatch({ type: ActionTypes.ADD_GROUP, payload: group }),
    updateGroup: (group) =>
      dispatch({ type: ActionTypes.UPDATE_GROUP, payload: group }),
    deleteGroup: (id) =>
      dispatch({ type: ActionTypes.DELETE_GROUP, payload: id }),

    addClassroom: (classroom) =>
      dispatch({ type: ActionTypes.ADD_CLASSROOM, payload: classroom }),
    updateClassroom: (classroom) =>
      dispatch({ type: ActionTypes.UPDATE_CLASSROOM, payload: classroom }),
    deleteClassroom: (id) =>
      dispatch({ type: ActionTypes.DELETE_CLASSROOM, payload: id }),

    addLesson: (lesson) =>
      dispatch({ type: ActionTypes.ADD_LESSON, payload: lesson }),
    updateLesson: (lesson) =>
      dispatch({ type: ActionTypes.UPDATE_LESSON, payload: lesson }),
    deleteLesson: (id) =>
      dispatch({ type: ActionTypes.DELETE_LESSON, payload: id }),

    updateSettings: (settings) =>
      dispatch({ type: ActionTypes.UPDATE_SETTINGS, payload: settings }),
    resetData: () => dispatch({ type: ActionTypes.RESET_DATA }),
  };

  const value = {
    state,
    actions,
    dispatch,
    getTeacherById,
    getGroupById,
    getClassroomById,
    getLessonById,
    getLessonsByTimeSlot,
    getTeacherLessons,
    isTimeSlotConflict,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
