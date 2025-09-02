import { useState, useEffect } from "react";
import { transformSampleData } from "../lib/realData";

export const useDataImport = () => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const importSampleData = async (dispatch) => {
    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      // Haqiqiy ma'lumotlarni o'tkazish
      const data = transformSampleData();

      // Global state'ni yangilash
      dispatch({
        type: "IMPORT_DATA",
        payload: data,
      });

      setImportSuccess(true);

      // Success holatini 3 soniyadan keyin yashirish
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      setImportError(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const clearMessages = () => {
    setImportError(null);
    setImportSuccess(false);
  };

  return {
    isImporting,
    importError,
    importSuccess,
    importSampleData,
    clearMessages,
  };
};
