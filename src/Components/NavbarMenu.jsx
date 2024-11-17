import { Menu } from '@headlessui/react'
import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

const StyledMenuButton = styled(Menu.Button)`
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #5a6268;
  }
`

const MenuItems = styled(Menu.Items)`
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border: 1px solid gray;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  min-width: 200px;
  max-height: 200px;
  overflow-y: auto;
`

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  color: black;
  text-decoration: none;

  &:hover {
    background-color: #f8f9fa;
  }

  &.active {
    background-color: #e2e6ea;
  }
`

function NavbarMenu({ userInfo }) {
  const location = useLocation()
  const currentPath = location.pathname

  const ProfileMenu = [
    {
      name: 'Your Codeshares',
      route: '/codes',
    },
    {
      name: 'Account Settings',
      route: '/settings',
    },
    {
      name: 'Logout',
      route: '',
      onClick: () => {
        localStorage.removeItem('accessToken')
        window.open('/login', '_self')
      },
    },
  ]

  return (
    <Menu as="div" style={{ position: 'relative' }}>
      <StyledMenuButton>{userInfo}</StyledMenuButton>
      <MenuItems>
        {ProfileMenu.map((link, idx) => {
          if (link.route === '/codes' && currentPath === '/codes') {
            return null
          } else if (
            link.route === '/settings' &&
            currentPath === '/settings'
          ) {
            return null
          }
          return (
            <Menu.Item key={idx} as={Fragment}>
              {({ active }) => (
                <MenuItem
                  to={link.route}
                  className={active ? 'active' : ''}
                  onClick={link.onClick}
                >
                  {link.name}
                </MenuItem>
              )}
            </Menu.Item>
          )
        })}
      </MenuItems>
    </Menu>
  )
}

export default NavbarMenu
