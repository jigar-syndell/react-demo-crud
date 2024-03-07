import React, { useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

function AppSidebar() {
    const [selected, setSelected] = useState("home");
    const navigateTo = useNavigate();
    const { collapsed } = useSelector((state) => state.sidebar)

    console.log(collapsed)

    const handleNavigation = (path) => {
        navigateTo(path);
    };

    const Item = ({ title, to, selected, setSelected }) => {
      return (
        <MenuItem
          active={selected === title}
          onClick={() => {
            setSelected(title);
            handleNavigation(to);
          }}
        >
          <Typography>{title}</Typography>
        </MenuItem>
      );
    };

    return (
        <div className="mainContainer w-max bg-[#f5f7fb] h-screen">
        <div style={{ display: 'flex', height: '100%', minHeight: '400px', background:'#f5f7fb', marginLeft:'30px', marginRight:'30px', paddingTop:'50px' }}>
            <Sidebar collapsed={collapsed} width={"200px"} style={{ height:'90vh'}} backgroundColor="#fff">
                <Menu>
                    <Item
                      title="Dashboard"
                      to="/home"
                      selected={selected}
                      setSelected={setSelected}
                    />
                <SubMenu label="Masters">
                <Item
                      title="Users"
                      to="#"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Pick List Type Master"
                      to="#"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Pick List Value Master"
                      to="#"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Item Group Master"
                      to="#"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Item Master"
                      to="#"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    </SubMenu>
                      </Menu>
            </Sidebar>
        </div>
        </div>
    );
}

export default AppSidebar;
