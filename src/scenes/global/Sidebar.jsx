import { useState } from "react"; // Keep useState for internal selected menu item
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
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
import { havePermission } from "../../shared/Permissions";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      onClick={() => {
        setSelected(title);
        // console.log(selected, to); // Consider removing console.logs from production code
      }}
      icon={icon}
      component={<Link to={to} style={{ textDecoration: "none" }} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

// Receive isCollapsed and setIsCollapsed as props
const ProSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [isCollapsed, setIsCollapsed] = useState(false); // Remove this local state, it's now managed by App.js
  const [selected, setSelected] = useState("Dashboard"); // Set a default selected value

  // Define sidebar widths (must match App.js for consistent behavior)
  const collapsedSidebarWidth = "80px";
  const expandedSidebarWidth = "270px";

  return (
    <Sidebar
      style={{
        border: "none",
        position: "fixed", // Keep fixed positioning
        height: "100vh", // Full viewport height
        top: 0,
        left: 0,
        zIndex: 100, // Ensures it's above other content
        width: isCollapsed ? collapsedSidebarWidth : expandedSidebarWidth, // Dynamic width based on state
        transition: "width 0.3s ease-in-out", // Smooth transition for width change
      }}
      scrollbarWidth="none"
      collapsed={isCollapsed} // Use the prop
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
          {/* logo / Collapse toggle */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)} // Use the prop setter
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
                  {" "}
                  {/* Use the prop setter */}
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

            {havePermission("view engineers") && (
              <Item
                title="Engineers"
                to="/engineers"
                icon={<PeopleOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}

            {havePermission("view project managers") && (
              <Item
                title="Project Managers"
                to="/projectManagers"
                icon={<PeopleOutlinedIcon />} // Consider a different icon for distinction
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {havePermission("view consulting company") && (
              <Item
                title="Consulting Companies"
                to="/consultingCompanies"
                icon={<PeopleOutlinedIcon />} // Consider a different icon for distinction
                selected={selected}
                setSelected={setSelected}
              />
            )}
            {/* <Item
              title="Sales Managers"
              to="/salesManagers"
              icon={<RealEstateAgentSharpIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {havePermission("view projects")&&
            <Item
              title="Projects"
              to="/projects"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            }

            {havePermission("view owners") && (
              <Item
                title="Owners"
                to="/owners"
                icon={<BarChartOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
            )}
          </Box>

          {!isCollapsed && (
            <Box p="16px" textAlign="center">
              <Typography variant="caption" color={colors.grey[500]}>
                v2.0.0
              </Typography>
            </Box>
          )}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default ProSidebar;
