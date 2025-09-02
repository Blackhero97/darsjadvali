import { useState } from "react";
import {
  Save,
  RotateCcw,
  School,
  Clock,
  Calendar,
  Database,
  Download,
  Info,
  Sparkles,
  RefreshCw,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAppContext } from "../contexts/AppContext";
import { Card, Button, Input, Select } from "../components";
import { useDarkMode } from "../hooks";

const Settings = () => {
  const { state, actions } = useAppContext();
  const [isDark, setIsDark] = useDarkMode();
  const [settings, setSettings] = useState(state.settings);
  const [isSaving, setIsSaving] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      actions.updateSettings(settings);
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (
      window.confirm(
        "Barcha ma'lumotlarni o'chirib, JSON dagi asl ma'lumotlar bilan almashtirishni xohlaysizmi?"
      )
    ) {
      actions.resetData();
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = {
        ...state,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dars-jadvali-export-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleWorkingHoursChange = (type, value) => {
    setSettings((prev) => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [type]: value,
      },
    }));
  };

  // Stats
  const stats = [
    {
      label: "O'qituvchilar",
      value: state.teachers.length,
      icon: School,
      color: "indigo",
    },
    {
      label: "Guruhlar",
      value: state.groups.length,
      icon: Calendar,
      color: "purple",
    },
    {
      label: "Xonalar",
      value: state.classrooms.length,
      icon: Database,
      color: "blue",
    },
    {
      label: "Darslar",
      value: state.lessons.length,
      icon: Clock,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center gap-2">
            <SettingsIcon className="h-7 w-7" /> Sozlamalar
          </h1>
          <p className="text-perfect-dim mt-1 flex items-center gap-2">
            <Info className="h-4 w-4" /> Ilova va jadval parametrlarini
            boshqaring
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-perfect-accent">
          <div className="px-3 py-1 rounded-full glass flex items-center gap-2">
            <Sparkles className="h-3 w-3 text-indigo-500" /> Versiya:{" "}
            {state.dataVersion || "-"}
          </div>
          <div className="px-3 py-1 rounded-full glass flex items-center gap-2">
            <Database className="h-3 w-3 text-green-500" />{" "}
            {state.lessons.length} dars
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card
            key={s.label}
            className="p-4 glass hover-lift border-l-4"
            style={{ borderLeftColor: `var(--color-${s.color}, #6366F1)` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-perfect-dim">
                  {s.label}
                </p>
                <p className="text-2xl font-bold text-perfect">{s.value}</p>
              </div>
              <s.icon
                className={`h-6 w-6 text-${s.color}-500 dark:text-${s.color}-400`}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Grid layout for forms */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="space-y-6 xl:col-span-2">
          {/* School Settings */}
          <Card className="p-6">
            <div className="flex items-center mb-5 gap-2">
              <School className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h2 className="text-xl font-semibold text-perfect">
                Maktab ma'lumotlari
              </h2>
            </div>
            <div className="space-y-4">
              <Input
                label="Maktab nomi"
                value={settings.schoolName}
                onChange={(value) => handleChange("schoolName", value)}
                placeholder="Maktab nomini kiriting"
              />
            </div>
          </Card>

          {/* Time & duration */}
          <Card className="p-6">
            <div className="flex items-center mb-5 gap-2">
              <Clock className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              <h2 className="text-xl font-semibold text-perfect">Ish vaqti</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Boshlanish vaqti"
                type="time"
                value={settings.workingHours.start}
                onChange={(value) => handleWorkingHoursChange("start", value)}
              />
              <Input
                label="Tugash vaqti"
                type="time"
                value={settings.workingHours.end}
                onChange={(value) => handleWorkingHoursChange("end", value)}
              />
              <Select
                label="Dars davomiyligi (daq)"
                value={settings.lessonDuration}
                onChange={(value) =>
                  handleChange("lessonDuration", parseInt(value))
                }
                options={[
                  { value: 45, label: "45 daqiqa" },
                  { value: 60, label: "60 daqiqa" },
                  { value: 90, label: "90 daqiqa" },
                  { value: 120, label: "120 daqiqa" },
                ]}
              />
            </div>
          </Card>

          {/* Working Days */}
          <Card className="p-6">
            <div className="flex items-center mb-5 gap-2">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Ish kunlari
              </h2>
            </div>
            <Select
              label="Haftadagi ish kunlari"
              value={settings.workingDays}
              onChange={(value) => handleChange("workingDays", parseInt(value))}
              options={[
                { value: 5, label: "5 kun (Du-Ju)" },
                { value: 6, label: "6 kun (Du-Sha)" },
                { value: 7, label: "7 kun (Du-Yak)" },
              ]}
            />
          </Card>

          {/* Theme */}
          <Card className="p-6">
            <div className="flex items-center mb-5 gap-2">
              <div className="h-6 w-6 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                {isDark ? "🌙" : "☀️"}
              </div>
              <h2 className="text-xl font-semibold text-[var(--color-text)]">
                Mavzu
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-perfect">Qorong'u rejim</p>
                <p className="text-sm text-[var(--color-text-dim)]">
                  Interfeys rangini o'zgartirish
                </p>
              </div>
              <button
                onClick={() => setIsDark(!isDark)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isDark ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    isDark ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </Card>

          {/* Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
              Amallar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleSave}
                loading={isSaving}
                className="w-full"
                variant="primary"
              >
                <Save size={16} className="mr-2" /> Saqlash
              </Button>
              <Button onClick={handleReset} variant="danger" className="w-full">
                <RotateCcw size={16} className="mr-2" /> Qayta yuklash
              </Button>
              <Button
                onClick={handleExport}
                loading={exporting}
                variant="secondary"
                className="w-full col-span-1 sm:col-span-2"
              >
                <Download size={16} className="mr-2" /> JSON eksport
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 flex items-start gap-2">
              <RefreshCw className="h-4 w-4 mt-0.5 text-indigo-400" /> Qayta
              yuklash tugmasi brauzer xotirasini tozalab, asl JSON dan qayta
              yuklaydi.
            </p>
          </Card>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-indigo-500" /> Ma'lumot
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex gap-2">
                ➡️ JSON dan avtomatik generatsiya qilinadi
              </li>
              <li className="flex gap-2">
                🗂 Darslar, guruhlar va xonalar avtomatik bog'lanadi
              </li>
              <li className="flex gap-2">
                🌗 Mavzu holati localStorage da saqlanadi
              </li>
              <li className="flex gap-2">
                📤 Export orqali hozirgi holatni yuklab olasiz
              </li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" /> Ma'lumotlar
              versiyasi
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ushbu raqam JSON fayldan generatsiya qilingan hozirgi ma'lumotlar
              to'plamini bildiradi.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-mono">
                {state.dataVersion || "--"}
              </span>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw size={14} className="mr-1" /> Yangilash
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
