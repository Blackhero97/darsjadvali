import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Input } from "../../components";
import { createSubject } from "../../types";
import { generateId } from "../../lib/utils";
import { useFormValidation } from "../../hooks";

const SubjectModal = ({ isOpen, onClose, subject }) => {
  const { actions } = useAppContext();

  const initialData = {
    name: subject?.name || "",
    shortName: subject?.shortName || "",
  };

  const validationRules = {
    name: { required: true, message: "Fan nomi kiritilmagan" },
  };

  const { values, errors, handleChange, validate, reset } = useFormValidation(
    initialData,
    validationRules
  );

  useEffect(() => {
    if (isOpen) {
      if (subject) {
        handleChange("name", subject.name);
        handleChange("shortName", subject.shortName || "");
      } else {
        reset();
      }
    }
  }, [isOpen, subject]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const subjectData = createSubject({
      id: subject?.id || generateId(),
      name: values.name,
      shortName: values.shortName || values.name.substring(0, 3).toUpperCase(),
    });

    if (subject) {
      actions.updateSubject(subjectData);
    } else {
      actions.addSubject(subjectData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subject ? "Fanni tahrirlash" : "Yangi fan qo'shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Fan nomi"
          required
          value={values.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          placeholder="Masalan: Matematika"
        />

        <Input
          label="Qisqa nomi"
          value={values.shortName}
          onChange={(value) => handleChange("shortName", value)}
          placeholder="Masalan: Mat (bo'sh qoldirilsa avtomatik yaratiladi)"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit">
            <Save size={16} className="mr-2" />
            {subject ? "Yangilash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SubjectModal;
