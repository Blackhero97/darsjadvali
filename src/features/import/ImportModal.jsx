import { useState } from "react";
import {
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Select } from "../../components";
import { parseExcelFile } from "../../lib/utils";
import {
  createTeacher,
  createGroup,
  createClassroom,
  createLesson,
  DAYS_OF_WEEK,
} from "../../types";
import { generateId } from "../../lib/utils";

const ImportModal = ({ isOpen, onClose }) => {
  const { state, actions } = useAppContext();

  const [step, setStep] = useState(1); // 1: file upload, 2: mapping, 3: preview
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [mapping, setMapping] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [errors, setErrors] = useState([]);

  const requiredFields = [
    { key: "teacher", label: "O'qituvchi", required: true },
    { key: "group", label: "Guruh", required: true },
    { key: "classroom", label: "Xona", required: true },
    { key: "day", label: "Kun", required: true },
    { key: "startTime", label: "Boshlanish vaqti", required: true },
    { key: "endTime", label: "Tugash vaqti", required: true },
    { key: "note", label: "Izoh", required: false },
  ];

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    try {
      setFile(uploadedFile);
      const data = await parseExcelFile(uploadedFile);
      setExcelData(data);
      setStep(2);
    } catch (error) {
      alert("Faylni o'qishda xatolik: " + error.message);
    }
  };

  const handleMapping = () => {
    // Check required mappings
    const missingMappings = requiredFields.filter(
      (field) => field.required && !mapping[field.key]
    );

    if (missingMappings.length > 0) {
      alert(
        "Majburiy maydonlar tanlanmagan: " +
          missingMappings.map((f) => f.label).join(", ")
      );
      return;
    }

    // Process data
    const processedData = processImportData();
    setPreviewData(processedData);
    setStep(3);
  };

  const processImportData = () => {
    const newTeachers = new Map();
    const newGroups = new Map();
    const newClassrooms = new Map();
    const newLessons = [];
    const processingErrors = [];

    excelData.rows.forEach((row, index) => {
      try {
        const teacherName = row[mapping.teacher]?.toString()?.trim();
        // fan yo'q
        const groupName = row[mapping.group]?.toString()?.trim();
        const classroomName = row[mapping.classroom]?.toString()?.trim();
        const dayValue = row[mapping.day]?.toString()?.trim();
        const startTime = row[mapping.startTime]?.toString()?.trim();
        const endTime = row[mapping.endTime]?.toString()?.trim();
        const note = mapping.note ? row[mapping.note]?.toString()?.trim() : "";

        if (
          !teacherName ||
          !groupName ||
          !classroomName ||
          !dayValue ||
          !startTime ||
          !endTime
        ) {
          processingErrors.push(
            `Satr ${index + 1}: Majburiy maydonlar to'ldirilmagan`
          );
          return;
        }

        // Process teacher
        let teacherId = [
          ...state.teachers,
          ...Array.from(newTeachers.values()),
        ].find(
          (t) => t.fullName.toLowerCase() === teacherName.toLowerCase()
        )?.id;

        if (!teacherId) {
          teacherId = generateId();
          newTeachers.set(
            teacherId,
            createTeacher({
              id: teacherId,
              fullName: teacherName,
            })
          );
        }

        // subjectId = null
        const subjectId = null;

        // Process group
        let groupId = [...state.groups, ...Array.from(newGroups.values())].find(
          (g) => g.name.toLowerCase() === groupName.toLowerCase()
        )?.id;

        if (!groupId) {
          groupId = generateId();
          newGroups.set(
            groupId,
            createGroup({
              id: groupId,
              name: groupName,
            })
          );
        }

        // Process classroom
        let classroomId = [
          ...state.classrooms,
          ...Array.from(newClassrooms.values()),
        ].find((c) => c.name.toLowerCase() === classroomName.toLowerCase())?.id;

        if (!classroomId) {
          classroomId = generateId();
          newClassrooms.set(
            classroomId,
            createClassroom({
              id: classroomId,
              name: classroomName,
            })
          );
        }

        // Process day
        let dayOfWeek;
        if (!isNaN(dayValue)) {
          dayOfWeek = parseInt(dayValue);
        } else {
          const day = DAYS_OF_WEEK.find(
            (d) =>
              d.name.toLowerCase().includes(dayValue.toLowerCase()) ||
              d.short.toLowerCase().includes(dayValue.toLowerCase())
          );
          dayOfWeek = day?.id;
        }

        if (!dayOfWeek || dayOfWeek < 1 || dayOfWeek > 7) {
          processingErrors.push(
            `Satr ${index + 1}: Noto'g'ri hafta kuni "${dayValue}"`
          );
          return;
        }

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
          processingErrors.push(`Satr ${index + 1}: Noto'g'ri vaqt formati`);
          return;
        }

        // Create lesson
        const lesson = createLesson({
          id: generateId(),
          teacherId,
          subjectId,
          groupId,
          classroomId,
          dayOfWeek,
          startTime,
          endTime,
          note,
        });

        newLessons.push(lesson);
      } catch (error) {
        processingErrors.push(`Satr ${index + 1}: ${error.message}`);
      }
    });

    return {
      teachers: Array.from(newTeachers.values()),
      subjects: [],
      groups: Array.from(newGroups.values()),
      classrooms: Array.from(newClassrooms.values()),
      lessons: newLessons,
      errors: processingErrors,
    };
  };

  const handleImport = () => {
    if (previewData) {
      // Add new entities to state
      previewData.teachers.forEach((teacher) => actions.addTeacher(teacher));
      // subjects yo'q
      previewData.groups.forEach((group) => actions.addGroup(group));
      previewData.classrooms.forEach((classroom) =>
        actions.addClassroom(classroom)
      );
      previewData.lessons.forEach((lesson) => actions.addLesson(lesson));

      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setStep(1);
    setFile(null);
    setExcelData(null);
    setMapping({});
    setPreviewData(null);
    setErrors([]);
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Excel Import" size="lg">
      <div className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 3 && (
                <ArrowRight className="mx-2 h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: File Upload */}
        {step === 1 && (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Excel fayl yuklash
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              .xlsx yoki .xls formatdagi faylni tanlang
            </p>

            <label className="inline-flex items-center px-6 py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors">
              <Upload size={20} className="mr-2" />
              Fayl tanlash
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Step 2: Field Mapping */}
        {step === 2 && excelData && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Maydonlarni moslashtirish
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Excel ustunlarini tizim maydonlari bilan moslang
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiredFields.map((field) => (
                <Select
                  key={field.key}
                  label={field.label}
                  required={field.required}
                  value={mapping[field.key] || ""}
                  onChange={(value) =>
                    setMapping((prev) => ({
                      ...prev,
                      [field.key]: parseInt(value),
                    }))
                  }
                  options={excelData.headers.map((header, index) => ({
                    value: index,
                    label: `${header} (Ustun ${index + 1})`,
                  }))}
                />
              ))}
            </div>

            {/* Preview first few rows */}
            {excelData.rows.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Ma'lumotlar namunasi
                </h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {excelData.headers.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-r border-gray-200 dark:border-gray-700"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {excelData.rows.slice(0, 3).map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 text-sm text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700"
                            >
                              {cell?.toString() || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Orqaga
              </Button>
              <Button onClick={handleMapping}>Keyingisi</Button>
            </div>
          </div>
        )}

        {/* Step 3: Preview & Import */}
        {step === 3 && previewData && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Import tahlili
            </h3>

            {/* Errors */}
            {previewData.errors.length > 0 && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      Xatoliklar ({previewData.errors.length})
                    </h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1 max-h-32 overflow-y-auto">
                      {previewData.errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Success Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {previewData.teachers.length}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Yangi o'qituvchilar
                </div>
              </div>
              {/* Fanlar statistikasi olib tashlandi */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {previewData.groups.length}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Yangi guruhlar
                </div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {previewData.lessons.length}
                </div>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  Yangi darslar
                </div>
              </div>
            </div>

            {/* Preview Lessons */}
            {previewData.lessons.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Darslar namunasi (birinchi 5 ta)
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {previewData.lessons.slice(0, 5).map((lesson, index) => {
                    const teacher = [
                      ...state.teachers,
                      ...previewData.teachers,
                    ].find((t) => t.id === lesson.teacherId);
                    // fan yo'q
                    const group = [...state.groups, ...previewData.groups].find(
                      (g) => g.id === lesson.groupId
                    );
                    const classroom = [
                      ...state.classrooms,
                      ...previewData.classrooms,
                    ].find((c) => c.id === lesson.classroomId);
                    const day = DAYS_OF_WEEK.find(
                      (d) => d.id === lesson.dayOfWeek
                    );

                    return (
                      <div
                        key={index}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {group?.name}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {day?.name} {lesson.startTime}-{lesson.endTime}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {teacher?.fullName} • {classroom?.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
                Orqaga
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClose}>
                  Bekor qilish
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={previewData.lessons.length === 0}
                >
                  <CheckCircle size={16} className="mr-2" />
                  Import qilish
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportModal;
