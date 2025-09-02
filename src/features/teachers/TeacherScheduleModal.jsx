import { useAppContext } from "../../contexts/AppContext";
import { Modal, Card } from "../../components";
import { DAYS_OF_WEEK } from "../../types";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const TeacherScheduleModal = ({ isOpen, onClose, teacher }) => {
  const { state, getLessonsByTeacher, getGroupById, getClassroomById } =
    useAppContext();

  if (!teacher) return null;

  const teacherLessons = getLessonsByTeacher(teacher.id);

  // Group lessons by day
  const lessonsByDay = DAYS_OF_WEEK.slice(0, state.settings.workingDays).map(
    (day) => ({
      ...day,
      lessons: teacherLessons
        .filter((lesson) => lesson.dayOfWeek === day.id)
        .sort((a, b) => a.startTime.localeCompare(b.startTime)),
    })
  );

  const LessonCard = ({ lesson }) => {
    const group = getGroupById(lesson.groupId);
    const classroom = getClassroomById(lesson.classroomId);

    return (
      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {group?.name}
            </h4>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Users size={14} />
                {group?.name}
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                {classroom?.name}
              </div>
            </div>
            {lesson.note && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic">
                {lesson.note}
              </p>
            )}
          </div>
          <div className="text-right ml-3">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
              <Clock size={14} />
              {lesson.startTime}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {lesson.endTime}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totalLessons = teacherLessons.length;
  const totalHours = teacherLessons.reduce((acc, lesson) => {
    const start = new Date(`2000-01-01T${lesson.startTime}:00`);
    const end = new Date(`2000-01-01T${lesson.endTime}:00`);
    return acc + (end - start) / (1000 * 60 * 60); // Convert to hours
  }, 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${teacher.fullName} ning jadvali`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Teacher Info */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: teacher.color }}
          >
            {teacher.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {teacher.fullName}
            </h3>
            {teacher.department && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {teacher.department}
              </p>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span>{totalLessons} ta dars</span>
              <span>{totalHours.toFixed(1)} soat/hafta</span>
            </div>
          </div>
        </div>

        {/* Schedule */}
        {totalLessons === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              Hali darslar belgilanmagan
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {lessonsByDay.map((day) => (
              <div key={day.id}>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Calendar size={16} />
                  {day.name}
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({day.lessons.length} ta dars)
                  </span>
                </h3>

                {day.lessons.length === 0 ? (
                  <p className="text-gray-400 dark:text-gray-500 text-sm ml-6">
                    Darslar yo'q
                  </p>
                ) : (
                  <div className="space-y-2">
                    {day.lessons.map((lesson) => (
                      <LessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TeacherScheduleModal;
