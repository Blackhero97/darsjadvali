import { useState, useEffect } from "react";
import { Save, Trash2, AlertCircle } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Input, Select } from "../../components";
import { createLesson, DAYS_OF_WEEK } from "../../types";
import { generateId } from "../../lib/utils";
import { useFormValidation } from "../../hooks";

const LessonModal = ({ isOpen, onClose, lesson, timeSlot }) => {
  const {
    state,
    actions,
    getTeacherById,
    getGroupById,
    getClassroomById,
    checkConflict,
  } = useAppContext();

  const initialData = lesson
    ? {
        teacherId: lesson.teacherId,
        // subjectId yo'q
        groupId: lesson.groupId,
        classroomId: lesson.classroomId,
        dayOfWeek: lesson.dayOfWeek,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        note: lesson.note || "",
      }
    : {
        teacherId: "",
        // subjectId olib tashlandi
        groupId: "",
        classroomId: "",
        dayOfWeek: timeSlot?.dayOfWeek || 1,
        startTime: timeSlot?.startTime || "",
        endTime: timeSlot?.endTime || "",
        note: "",
      };

  const validationRules = {
    teacherId: { required: true, message: "O'qituvchi tanlanmagan" },
    groupId: { required: true, message: "Guruh tanlanmagan" },
    classroomId: { required: true, message: "Xona tanlanmagan" },
    startTime: { required: true, message: "Boshlanish vaqti kiritilmagan" },
    endTime: {
      required: true,
      message: "Tugash vaqti kiritilmagan",
      custom: (value, allValues) => {
        if (value && allValues.startTime) {
          const start = new Date(`2000-01-01T${allValues.startTime}:00`);
          const end = new Date(`2000-01-01T${value}:00`);
          if (end <= start) {
            return "Tugash vaqti boshlanish vaqtidan kechroq bo'lishi kerak";
          }
        }
        return "";
      },
    },
  };

  const { values, errors, handleChange, validate, reset } = useFormValidation(
    initialData,
    validationRules
  );
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (lesson) {
        Object.keys(initialData).forEach((key) => {
          handleChange(key, lesson[key] || "");
        });
      } else {
        reset();
        if (timeSlot) {
          handleChange("dayOfWeek", timeSlot.dayOfWeek);
          handleChange("startTime", timeSlot.startTime);
          handleChange("endTime", timeSlot.endTime);
        }
      }
    }
  }, [isOpen, lesson, timeSlot]);

  // Check for conflicts whenever relevant fields change
  useEffect(() => {
    if (
      values.teacherId &&
      values.classroomId &&
      values.dayOfWeek &&
      values.startTime
    ) {
      const tempLesson = createLesson({
        id: lesson?.id || "temp",
        ...values,
      });

      const hasConflict = checkConflict(tempLesson);
      if (hasConflict) {
        const conflictingLessons = state.lessons.filter(
          (existing) =>
            existing.id !== lesson?.id &&
            existing.dayOfWeek === tempLesson.dayOfWeek &&
            existing.startTime === tempLesson.startTime &&
            (existing.teacherId === tempLesson.teacherId ||
              existing.classroomId === tempLesson.classroomId)
        );

        setConflicts(
          conflictingLessons.map((cl) => {
            const conflictTeacher = getTeacherById(cl.teacherId);
            const conflictGroup = getGroupById(cl.groupId);
            const conflictClassroom = getClassroomById(cl.classroomId);

            return {
              type:
                cl.teacherId === tempLesson.teacherId ? "O'qituvchi" : "Xona",
              lesson: `${conflictTeacher?.fullName} (${conflictGroup?.name}, ${conflictClassroom?.name})`,
            };
          })
        );
      } else {
        setConflicts([]);
      }
    }
  }, [
    values.teacherId,
    values.classroomId,
    values.dayOfWeek,
    values.startTime,
    lesson?.id,
    state.lessons,
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (conflicts.length > 0) {
      if (!window.confirm("Konflikt mavjud. Baribir saqlashni xohlaysizmi?")) {
        return;
      }
    }

    const lessonData = createLesson({
      id: lesson?.id || generateId(),
      ...values,
    });

    if (lesson) {
      actions.updateLesson(lessonData);
    } else {
      actions.addLesson(lessonData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (lesson && window.confirm("Darsni o'chirishni xohlaysizmi?")) {
      actions.deleteLesson(lesson.id);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lesson ? "Darsni tahrirlash" : "Yangi dars qo'shish"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conflicts Warning */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                  Konflikt aniqlandi
                </h3>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {conflicts.map((conflict, index) => (
                    <li key={index}>
                      {conflict.type} band: {conflict.lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <Select
              label="O'qituvchi"
              required
              value={values.teacherId}
              onChange={(value) => handleChange("teacherId", value)}
              error={errors.teacherId}
              options={state.teachers.map((teacher) => ({
                value: teacher.id,
                label: teacher.fullName,
              }))}
            />

            {/* Fan select olib tashlandi */}

            <Select
              label="Guruh"
              required
              value={values.groupId}
              onChange={(value) => handleChange("groupId", value)}
              error={errors.groupId}
              options={state.groups.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
            />
          </div>

          {/* Time & Location */}
          <div className="space-y-4">
            <Select
              label="Xona"
              required
              value={values.classroomId}
              onChange={(value) => handleChange("classroomId", value)}
              error={errors.classroomId}
              options={state.classrooms.map((classroom) => ({
                value: classroom.id,
                label: classroom.name,
              }))}
            />

            <Select
              label="Hafta kuni"
              required
              value={values.dayOfWeek}
              onChange={(value) => handleChange("dayOfWeek", parseInt(value))}
              error={errors.dayOfWeek}
              options={DAYS_OF_WEEK.slice(0, state.settings.workingDays).map(
                (day) => ({
                  value: day.id,
                  label: day.name,
                })
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Boshlanish vaqti"
                type="time"
                required
                value={values.startTime}
                onChange={(value) => handleChange("startTime", value)}
                error={errors.startTime}
              />
              <Input
                label="Tugash vaqti"
                type="time"
                required
                value={values.endTime}
                onChange={(value) => handleChange("endTime", value)}
                error={errors.endTime}
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <Input
          label="Izoh (ixtiyoriy)"
          value={values.note}
          onChange={(value) => handleChange("note", value)}
          placeholder="Qo'shimcha ma'lumot..."
        />

        {/* Actions */}
        <div className="flex justify-between">
          <div>
            {lesson && (
              <Button type="button" variant="danger" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" />
                O'chirish
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Bekor qilish
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" />
              {lesson ? "Yangilash" : "Qo'shish"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LessonModal;
