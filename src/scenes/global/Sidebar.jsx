// src/scenes/global/Sidebar.jsx (ProSidebar)

import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"; // تأكد من استيراد Sidebar من react-pro-sidebar
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import RealEstateAgentSharpIcon from "@mui/icons-material/RealEstateAgentSharp";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { tokens } from "../../theme";

import userImage from "../../assets/user.jpg";
import { GridAddIcon } from "@mui/x-data-grid";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        setSelected(title);
        console.log(selected, to);
      }}
      icon={icon}
      component={<Link to={to} style={{ textDecoration: "none" }} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const ProSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Engineer");

  return (
    <Sidebar
      style={{
        border: "none",
        position: "fixed", // <--- هذا هو المفتاح! اجعل الشريط الجانبي ثابتًا
        height: "100vh", // <--- يمتد بطول الشاشة بالكامل
        top: 0,          // <--- يبدأ من أعلى الشاشة
        left: 0,         // <--- يبدأ من يسار الشاشة
        zIndex: 100,     // <--- يظهر فوق المحتوى الآخر (القيمة الافتراضية لـ Topbar عادة تكون أقل)
      }}
      scrollbarWidth="none"
      collapsed={isCollapsed}
      backgroundColor={colors.primary[800]}
    >
      <Box justifyContent="space-between" alignItems="center">
        <Menu
          iconShape="square"
          menuItemStyles={{
            button: ({ level, active, disabled }) => {
              if (level === 0) {
                return {
                  color: disabled ? colors.grey[900] : colors.grey[100],
                  backgroundColor: active ? colors.primary[700] : undefined,
                  "&:hover": {
                    backgroundColor: `${colors.primary[900]} !important`,
                    color: `${colors.primary[100]} !important`,
                    borderRadius: "10px !important",
                    fontWeight: "bold !important",
                  },
                };
              }
            },
          }}
        >
          {/* logo */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                  Orient
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={userImage}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>

              <Box textAlign="center">
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Mohamad Alraie
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[200]}>
                  IT Admin
                </Typography>
              </Box>
            </Box>
          )}

          {/* Sidebar MENU ITEMS */}
          <Box>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {!isCollapsed && (
              <Typography
                variant="h6"
                color={colors.grey[500]}
                sx={{ m: "15px 0 5px 30px" }}
              >
                Managment
              </Typography>
            )}

            <Item
              title="Engineers"
              to="/engineers"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Sales Managers"
              to="/salesManagers"
              icon={<RealEstateAgentSharpIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Projects"
              to="/projects"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default ProSidebar;