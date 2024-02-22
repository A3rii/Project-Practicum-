import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import AdbIcon from '@mui/icons-material/Adb';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { Link, Outlet } from "react-router-dom"
const drawerWidth = 240;

function AdminCenter(props) {
   const { window } = props;
   const [mobileOpen, setMobileOpen] = React.useState(false);
   const [isClosing, setIsClosing] = React.useState(false);
   const [name, setName] = React.useState("");
   const handleChangeName = (sidebar) => {
      setName(sidebar)
   }
   const handleDrawerClose = () => {
      setIsClosing(true);
      setMobileOpen(false);
   };

   const handleDrawerTransitionEnd = () => {
      setIsClosing(false);
   };

   const handleDrawerToggle = () => {
      if (!isClosing) {
         setMobileOpen(!mobileOpen);
      }
   };

   const drawer = (
      <div className="admin-sidebar">
         <Divider />
         <List sx={{ mt: 1 }}>
            <ul>
               <div className='admin-icon'>
                  <HomeIcon />
                  <Link to="/dashboard">
                     <li onClick={() => handleChangeName("Home")}>Home</li>
                  </Link>
               </div>
               <div className='admin-icon'>
                  <PersonAddAlt1Icon />
                  <Link to="/confirm_match">
                     <li onClick={() => handleChangeName("Confirm Booking")}>Confirm Booking</li>
                  </Link>
               </div>
               <div className='admin-icon'>
                  <CalendarMonthIcon />
                  <Link to="/schedule">
                     <li onClick={() => handleChangeName("Set Schedule")}>Set Schedule</li>
                  </Link>
               </div>

               <div className='admin-icon'>
                  <AccessTimeIcon />
                  <Link to="settime">
                     <li onClick={() => handleChangeName("Set Open Hour")}> Set Open Hour</li>
                  </Link>
               </div>

            </ul>
         </List>
         <Divider sx={{ mt: 2 }} />

         <List>
            <ul>
               <div className='admin-logout'>
                  <LogoutIcon />
                  <li>Log Out</li>
               </div>

            </ul>
         </List>
      </div>
   );

   const container = window !== undefined ? () => window().document.body : undefined;

   return (
      <Box sx={{ display: 'flex' }}>
         <CssBaseline />
         <AppBar

            position="absolute"
            sx={{
               zIndex: -1,
               width: { sm: `calc(100% - ${drawerWidth}px)` },
               ml: { sm: `${drawerWidth}px` },
            }}
         >


            <Toolbar
               style={{ background: '#2E3B55' }}
            >
               <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
               <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}
               >
                  <MenuIcon />
               </IconButton>
               <Typography variant="h6" noWrap component="div">
                  {name}
               </Typography>

               <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', pr: 2 }}>
                  <Tooltip title="Open settings">
                     <IconButton sx={{ p: 0 }}>
                        <Avatar alt="Remy Sharp" src="" />
                     </IconButton>
                  </Tooltip>

               </Box>
            </Toolbar>


         </AppBar>
         <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
         >
            <Drawer
               container={container}
               variant="temporary"
               open={mobileOpen}
               onTransitionEnd={handleDrawerTransitionEnd}
               onClose={handleDrawerClose}
               ModalProps={{
                  keepMounted: true,
               }}
               sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
               }}
            >
               {drawer}
            </Drawer>
            <Drawer
               variant="permanent"
               sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
               }}
               open
            >
               {drawer}
            </Drawer>
         </Box>
         <Box
            component="main"
            sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
         >
            <Toolbar />

            <Outlet />

         </Box>
      </Box>
   );
}

AdminCenter.propTypes = {

   window: PropTypes.func,
};

export default AdminCenter;