import { useState, useEffect } from "react";
import { Save, Palette } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Input } from "../../components";
import { createTeacher } from "../../types";
import { generateId, generateRandomColor } from "../../lib/utils";
import { useFormValidation } from "../../hooks";

const TeacherModal = ({ isOpen, onClose, teacher }) => {
  const { actions } = useAppContext();

  const initialData = {
    fullName: teacher?.fullName || "",
    department: teacher?.department || "",
    color: teacher?.color || generateRandomColor(),
  };

  const validationRules = {
    fullName: { required: true, message: "To'liq ism kiritilmagan" },
  };

  const { values, errors, handleChange, validate, reset } = useFormValidation(
    initialData,
    validationRules
  );

  useEffect(() => {
    if (isOpen) {
      if (teacher) {
        handleChange("fullName", teacher.fullName);
        handleChange("department", teacher.department || "");
        handleChange("color", teacher.color || generateRandomColor());
      } else {
        reset();
        handleChange("color", generateRandomColor());
      }
    }
  }, [isOpen, teacher]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const teacherData = createTeacher({
      id: teacher?.id || generateId(),
      fullName: values.fullName,
      department: values.department || null,
      color: values.color,
    });

    if (teacher) {
      actions.updateTeacher(teacherData);
    } else {
      actions.addTeacher(teacherData);
    }

    onClose();
  };

  const predefinedColors = [
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={teacher ? "O'qituvchini tahrirlash" : "Yangi o'qituvchi qo'shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="To'liq ism-sharif"
          required
          value={values.fullName}
          onChange={(value) => handleChange("fullName", value)}
          error={errors.fullName}
          placeholder="Masalan: Aziza Karimova"
        />

        <Input
          label="Bo'lim (ixtiyoriy)"
          value={values.department}
          onChange={(value) => handleChange("department", value)}
          placeholder="Masalan: Matematika"
        />

        {/* Color Picker */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Rang
          </label>

          {/* Current color preview */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border-2 border-gray-200 dark:border-gray-700"
              style={{ backgroundColor: values.color }}
            />
            <Input
              type="color"
              value={values.color}
              onChange={(value) => handleChange("color", value)}
              className="w-20 h-10 rounded-xl cursor-pointer"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleChange("color", generateRandomColor())}
            >
              <Palette size={16} className="mr-1" />
              Tasodifiy
            </Button>
          </div>

          {/* Predefined colors */}
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleChange("color", color)}
                className={`w-8 h-8 rounded-lg border-2 transition-all ${
                  values.color === color
                    ? "border-gray-400 dark:border-gray-500 scale-110"
                    : "border-gray-200 dark:border-gray-700 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit">
            <Save size={16} className="mr-2" />
            {teacher ? "Yangilash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherModal;
