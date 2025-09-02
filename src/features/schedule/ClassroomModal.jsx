import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Input } from "../../components";
import { createClassroom } from "../../types";
import { generateId } from "../../lib/utils";
import { useFormValidation } from "../../hooks";

const ClassroomModal = ({ isOpen, onClose, classroom }) => {
  const { actions } = useAppContext();

  const initialData = {
    name: classroom?.name || "",
  };

  const validationRules = {
    name: { required: true, message: "Xona nomi kiritilmagan" },
  };

  const { values, errors, handleChange, validate, reset } = useFormValidation(
    initialData,
    validationRules
  );

  useEffect(() => {
    if (isOpen) {
      if (classroom) {
        handleChange("name", classroom.name);
      } else {
        reset();
      }
    }
  }, [isOpen, classroom]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const classroomData = createClassroom({
      id: classroom?.id || generateId(),
      name: values.name,
    });

    if (classroom) {
      actions.updateClassroom(classroomData);
    } else {
      actions.addClassroom(classroomData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={classroom ? "Xonani tahrirlash" : "Yangi xona qo'shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Xona nomi"
          required
          value={values.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          placeholder="Masalan: 101, Laboratoriya, Aktiv zal"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit">
            <Save size={16} className="mr-2" />
            {classroom ? "Yangilash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClassroomModal;
