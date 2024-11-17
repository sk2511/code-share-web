import React, { useState } from 'react'
import Logo from '../images/logo.svg'
import styled from 'styled-components'
import { IoIosPeople } from 'react-icons/io'
import { useContext } from 'react'
import { SocketContext } from './SocketContext'
import PopupModal from './ShareLink.jsx'
import NavbarMenu from './NavbarMenu.jsx'

const SecondaryButton = styled.button`
  border-radius: 5px;
  background: transparent;
  border: 1px solid #fff;
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-transform: capitalize;
  outline: none;
  margin: 0 2px;
  padding: 2px 10px;
  &:hover,
  &:focus {
    background-color: #fff;
    border-color: #fff;
    color: #4d76ba;
    text-decoration: none;
  }
`

export default function NotepadNavbar({ title, showShareButton }) {
  const [isSharePopupShow, setIsSharePopupShow] = useState(false)
  const { userDetails } = useContext(SocketContext)

  return (
    <div
      className="d-flex notepadnav justify-content-between align-items-center"
      style={{ height: 60 }}
    >
      <h3 className="text-light pt-2 ps-3">{title ? title : 'Codeshare'}</h3>
      <img src={Logo} height={18} className="ps-3" alt='logo'/>
      <div className="navlink d-flex align-items-center gap-3">
        {showShareButton && (
          <SecondaryButton onClick={() => setIsSharePopupShow(true)}>
            <IoIosPeople size={20} /> Share
          </SecondaryButton>
        )}

        <NavbarMenu
          userInfo={userDetails?.firstName + ' ' + userDetails?.lastName}
        />
      </div>
      <PopupModal
        show={isSharePopupShow}
        onClose={() => setIsSharePopupShow(false)}
        className=""
      />
    </div>
  )
}
