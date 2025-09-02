import { useState } from "react";
import { BookOpen, Users, MapPin, Plus, Edit2, Trash2 } from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Card, Button } from "../components";
import GroupModal from "../features/schedule/GroupModal";
import ClassroomModal from "../features/schedule/ClassroomModal";

const Management = () => {
  const { state, actions } = useAppContext();

  const [activeTab, setActiveTab] = useState("groups");
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tabs = [
    { id: "groups", name: "Guruhlar", icon: Users, count: state.groups.length },
    {
      id: "classrooms",
      name: "Xonalar",
      icon: MapPin,
      count: state.classrooms.length,
    },
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item, type) => {
    const confirmMessage = `${
      item.name || item.fullName
    }ni o'chirishni xohlaysizmi?`;
    if (window.confirm(confirmMessage)) {
      switch (type) {
        case "subjects":
          actions.deleteSubject(item.id);
          break;
        case "groups":
          actions.deleteGroup(item.id);
          break;
        case "classrooms":
          actions.deleteClassroom(item.id);
          break;
      }
    }
  };

  const renderModal = () => {
    switch (activeTab) {
      case "groups":
        return (
          <GroupModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
            group={selectedItem}
          />
        );
      case "classrooms":
        return (
          <ClassroomModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedItem(null);
            }}
            classroom={selectedItem}
          />
        );
      default:
        return null;
    }
  };

  const ItemCard = ({ item, type }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-medium text-perfect">{item.name}</h3>
          {item.shortName && (
            <p className="text-sm text-perfect-dim mt-1">
              Qisqa: {item.shortName}
            </p>
          )}
          {item.level && (
            <p className="text-sm text-perfect-dim mt-1">Sinf: {item.level}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(item)}
            title="Tahrirlash"
          >
            <Edit2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(item, type)}
            title="O'chirish"
            className="text-red-600 hover:text-red-700 dark:text-red-400"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );

  const EmptyState = ({ type }) => {
    const messages = {
      groups: { title: "Guruhlar yo'q", desc: "Hali guruhlar qo'shilmagan" },
      classrooms: { title: "Xonalar yo'q", desc: "Hali xonalar qo'shilmagan" },
    };

    const icons = { groups: Users, classrooms: MapPin };

    const Icon = icons[type];
    const message = messages[type];

    return (
      <Card className="p-8 text-center">
        <Icon className="mx-auto h-12 w-12 text-perfect-dim mb-4" />
        <p className="text-perfect-dim mb-4">{message.desc}</p>
        <Button onClick={handleAdd}>
          <Plus size={16} className="mr-2" />
          {type === "groups" && "Birinchi guruh qo'shish"}
          {type === "classrooms" && "Birinchi xona qo'shish"}
        </Button>
      </Card>
    );
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case "groups":
        return state.groups;
      case "classrooms":
        return state.classrooms;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-perfect">Boshqaruv</h1>
          <p className="text-perfect-dim mt-1">
            Fanlar, guruhlar va xonalarni boshqarish
          </p>
        </div>

        <Button onClick={handleAdd}>
          <Plus size={16} className="mr-2" />
          {activeTab === "groups" && "Guruh qo'shish"}
          {activeTab === "classrooms" && "Xona qo'shish"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? "border-violet-400 text-perfect-accent"
                    : "border-transparent text-perfect-dim hover:text-perfect"
                }`}
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.name}
                <span className="ml-2 bg-violet-100/80 dark:bg-violet-700/70 text-violet-700 dark:text-violet-300 py-0.5 px-2 rounded-full text-xs font-bold">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {currentData.length === 0 ? (
        <EmptyState type={activeTab} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentData.map((item) => (
            <ItemCard key={item.id} item={item} type={activeTab} />
          ))}
        </div>
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default Management;
