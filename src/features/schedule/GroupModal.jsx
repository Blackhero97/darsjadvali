import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { useAppContext } from "../../contexts/AppContext";
import { Modal, Button, Input } from "../../components";
import { createGroup } from "../../types";
import { generateId } from "../../lib/utils";
import { useFormValidation } from "../../hooks";

const GroupModal = ({ isOpen, onClose, group }) => {
  const { actions } = useAppContext();

  const initialData = {
    name: group?.name || "",
    level: group?.level || "",
  };

  const validationRules = {
    name: { required: true, message: "Guruh nomi kiritilmagan" },
  };

  const { values, errors, handleChange, validate, reset } = useFormValidation(
    initialData,
    validationRules
  );

  useEffect(() => {
    if (isOpen) {
      if (group) {
        handleChange("name", group.name);
        handleChange("level", group.level || "");
      } else {
        reset();
      }
    }
  }, [isOpen, group]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    const groupData = createGroup({
      id: group?.id || generateId(),
      name: values.name,
      level: values.level || null,
    });

    if (group) {
      actions.updateGroup(groupData);
    } else {
      actions.addGroup(groupData);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={group ? "Guruhni tahrirlash" : "Yangi guruh qo'shish"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Guruh nomi"
          required
          value={values.name}
          onChange={(value) => handleChange("name", value)}
          error={errors.name}
          placeholder="Masalan: 10-A"
        />

        <Input
          label="Sinf darajasi"
          value={values.level}
          onChange={(value) => handleChange("level", value)}
          placeholder="Masalan: 10"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Bekor qilish
          </Button>
          <Button type="submit">
            <Save size={16} className="mr-2" />
            {group ? "Yangilash" : "Qo'shish"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupModal;
