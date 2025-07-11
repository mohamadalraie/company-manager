// src/context/ProjectContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. إنشاء الـ Context
const ProjectContext = createContext();

// 2. إنشاء الـ Provider (المكون الذي سيوفر البيانات)
export const ProjectProvider = ({ children }) => {
  // 3. حالة لتخزين الـ ID. نقرأ القيمة الأولية من localStorage للاحتفاظ بها بعد تحديث الصفحة
  const [selectedProjectId, setSelectedProjectId] = useState(() => {
    return localStorage.getItem('selectedProjectId') || null;
  });

  // دالة لتحديث الـ ID في الحالة و localStorage
  const handleSetProject = (id) => {
    setSelectedProjectId(id);
    console.log("proId"+id);
    if (id) {
      localStorage.setItem('selectedProjectId', id);
    } else {
      localStorage.removeItem('selectedProjectId');
    }
  };

  // 4. القيمة التي سيتم توفيرها لجميع المكونات الفرعية
  const value = {
    selectedProjectId,
    setSelectedProjectId: handleSetProject, // نوفر الدالة أيضًا لتغيير القيمة
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

// 5. إنشاء Hook مخصص لتسهيل استخدام الـ Context
export const useProject = () => {
  return useContext(ProjectContext);
};