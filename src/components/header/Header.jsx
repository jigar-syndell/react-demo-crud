import React, { useState, useRef, useEffect } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Divider from "@mui/material/Divider";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Stack from "@mui/material/Stack";
import ListItemIcon from "@mui/material/ListItemIcon";
import PersonIcon from "@mui/icons-material/Person";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../../actions/generalActions";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

function Header() {
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(toggleSidebar());
  };
  const { collapsed } = useSelector((state) => state.sidebar);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <header
      className="bg-[#fff] text-white py-4  flex justify-between items-center m-auto"
      style={{ maxWidth: "95%" }}
    >
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center">
          <img
            src="./Navigator-ERP_1.png"
            alt="Logo"
            className={`mr-4 ${
              !collapsed ? "w-52 h-10" : "w-[70px] h-5"
            } transition-all duration-300 ease-in-out`}
          />
          <button
            className="sb-button"
            onClick={() => {
              handleClick();
            }}
          >
            <MenuIcon sx={{ color: "#323a46", fontSize: 30 }} />
          </button>
        </div>

        <div>
          <Button
            ref={anchorRef}
            id="composition-button"
            aria-controls={open ? "composition-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            startIcon={<AccountCircleIcon />}
            endIcon={<KeyboardArrowDownIcon />}
            onClick={handleToggle}
          >
            Admin
          </Button>
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement="bottom-start"
            transition
            sx={{zIndex:"100"}}
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom-start" ? "left top" : "left bottom",
                }}
              >
                <Paper className="p-3">
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="composition-menu"
                      aria-labelledby="composition-button"
                      onKeyDown={handleListKeyDown}
                    >
                      <p>welcome !</p>
                      <MenuItem
                        component={Link}
                        to="/changepassword"
                        onClick={handleClose}
                      >
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Change Password
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/resetpassword"
                        onClick={handleClose}
                      >
                        <ListItemIcon>
                          <PersonIcon fontSize="small" />
                        </ListItemIcon>
                        Reset Password
                      </MenuItem>
                      <Divider sx={{ my: 0.5 }} />
                      <MenuItem
                       component={Link}
                       to="/"
                      onClick={handleClose}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </div>
    </header>
  );
}

export default Header;
