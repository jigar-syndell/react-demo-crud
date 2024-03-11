import React, { useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import routes from '../../routes';

function AppSidebar() {
  const location = useLocation();
  const currentRoute = routes.find(route => route.path === location.pathname);
  console.log(currentRoute)
  console.log("-")
    const [selected, setSelected] = useState(currentRoute.name);
    const navigateTo = useNavigate();
    const { collapsed } = useSelector((state) => state.sidebar)

    console.log(selected)

    const handleNavigation = (path) => {
        navigateTo(path);
    };

    const Item = ({ title, to, selected, setSelected }) => {
      console.log(title)
      console.log(selected)
      return (
        <MenuItem
          active={selected === title}
          className={`!text-sm hover:bg-dark-purple` }
          onClick={() => {
            setSelected(title);
            handleNavigation(to);
          }}
        >
          <Typography  className={`!text-sm `}>{title}</Typography>
        </MenuItem>
      );
    };

    return (
        <div className="mainContainer w-max bg-[#f5f7fb] min-h-screen">
        <div style={{ display: 'flex', height: '100%', minHeight: '400px', background:'#f5f7fb', marginLeft:'30px', paddingTop:'30px' }}>
            <Sidebar collapsed={collapsed} width={"240px"} style={{ minHeight:'50vh', maxHeight:'98%'}} backgroundColor="#fff" className="transition-all duration-100 ease-out shadow-md rounded-md">
            <Menu  
                 menuItemStyles={{
                  button: ({ level, active, disabled }) => {
                      return {
                        color: active ? '#4a81d4' : '#6e768e',
                        '&:hover': {
                          backgroundColor: '#fff',
                        },
                      };
                  },
                }}
                >
                    <Item
                      title="Dashboard"
                      to="/home"
                      selected={selected}
                      setSelected={setSelected}
                    />
                <SubMenu label="Masters" className="!text-sm">
                <Item
                      title="Users"
                      to="/users"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Pick List Type"
                      to="/pickListType"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Pick List Values"
                      to="/pickListValue"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Item Groups"
                      to="/itemGroup"
                      selected={selected}
                      setSelected={setSelected}
                      />
                    <Item
                      title="Items"
                      to="/item"
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
