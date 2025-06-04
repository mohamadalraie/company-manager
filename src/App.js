// src/App.js

import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar"; // تأكد أن هذا هو ProSidebar
import Dashboard from "./scenes/dashboard/index";
import Engineers from "./scenes/engineers/Index";
import Projects from "./scenes/projects/Index";
import SalesManagers from "./scenes/salesManagers/index";
import AddEngineer from "./scenes/engineers/addEngineer/index";

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{
            display: "flex", // لجعل الشريط الجانبي والمحتوى بجانب بعضهما
            minHeight: "100vh", // تأكد أن الـ app يمتد بطول الشاشة
            width: "100%", // تأكد أن الـ app يأخذ العرض الكامل
            position: "relative", // مهم إذا كان هناك أي عناصر أخرى ذات تموضع مطلق داخله
          }}
        >
          {/* الشريط الجانبي سيتم تثبيته باستخدام position: fixed داخله.
            سنمرر الـ `isCollapsed` state إذا كان الشريط الجانبي يحتاج لمعرفتها
            لتحديد عرض الـ `main` content.
          */}
          <Sidebar /> {/* Sidebar (ProSidebar) should handle its own fixed positioning */}

          {/* المحتوى الرئيسي: يجب أن يحتوي على هامش لليمين ليتجنب التداخل مع الشريط الجانبي.
            هذا الهامش يجب أن يتغير بناءً على حالة الشريط الجانبي (collapsed/expanded).
          */}
          <main
            className="content"
            style={{
              flexGrow: 1, // يأخذ المساحة المتبقية
              overflowY: "auto", // يجعل المحتوى الرئيسي فقط قابلاً للتمرير
              maxHeight: "100vh", // يضمن عدم تجاوز المحتوى لارتفاع الشاشة
              // هنا سنضيف الهامش الأيسر الديناميكي
              // بما أن Sidebar لا يمرر حالته لـ App، سنحتاج لتقدير عرض الشريط الجانبي.
              // الحل الأمثل هو تمرير حالة isCollapsed من Sidebar إلى App، 
              // لكن لعدم تعقيد App.js الآن، سنفترض عرضًا ثابتًا مؤقتًا.
              marginLeft: "270px", // افتراضيًا، عرض الشريط الجانبي غير المتقلص (قد تحتاج لضبط هذا)
              // هذا الهامش يجب أن يصبح ديناميكيًا لاحقًا بناءً على isCollapsed
            }}
          >
            <Topbar /> {/* Topbar يجب أن يكون داخل main */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/engineers" element={<Engineers />} />
              <Route path="/engineers/add" element={<AddEngineer />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/salesManagers" element={<SalesManagers />} />
              <Route path="*" element={<div>404</div>} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;