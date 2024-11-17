import React, { useEffect, useContext } from 'react'
import { SocketContext } from './SocketContext'
import {
  BsMicMute,
  BsMic,
  BsCameraVideoOff,
  BsCameraVideo,
} from 'react-icons/bs'
import { MdOutlineCameraswitch } from 'react-icons/md'

const Room = () => {
  const {
    userVideo,
    CallOnline,
    TurnOnSocket,
    toggleCamera,
    toggleMic,
    toggleCameraFun,
    toggleMicFun,
    changeCamera,
    videoInput,
  } = useContext(SocketContext)

  useEffect(() => {
    TurnOnSocket()
  }, [])

  return (
    <>
      {CallOnline && (
        <div style={{ width: 300  }}>
          <>
            <video
              playsInline
              autoPlay
              id="myVideo"
              muted
              ref={userVideo}
              style={{
                pointerEvents: 'none',
              }}
              className="w-100"
            />
            <div
              style={{ background: '#ddd' }}
              className="d-flex w-100 flex-row justify-content-evenly"
            >
              <div
                style={{
                  background: '#121212',
                  borderRadius: '50%',
                  width: 40,
                  textAlign: 'center',
                  padding: 5,
                  cursor: 'pointer',
                }}
                onClick={toggleMicFun}
              >
                {toggleMic ? (
                  <BsMicMute color="#fff" size={24} />
                ) : (
                  <BsMic color="#fff" size={24} />
                )}
              </div>
              <div
                style={{
                  background: '#121212',
                  borderRadius: '50%',
                  width: 40,
                  textAlign: 'center',
                  padding: 5,
                  marginLeft: 15,
                  cursor: 'pointer',
                }}
                onClick={toggleCameraFun}
              >
                {toggleCamera ? (
                  <BsCameraVideoOff color="#fff" size={24} />
                ) : (
                  <BsCameraVideo color="#fff" size={24} />
                )}
              </div>

              {videoInput.length > 1 && (
                <div
                  style={{
                    background: '#121212',
                    borderRadius: '50%',
                    width: 40,
                    textAlign: 'center',
                    padding: 5,
                    marginLeft: 15,
                    cursor: 'pointer',
                  }}
                  onClick={changeCamera}
                >
                  <MdOutlineCameraswitch color="#fff" size={24} />
                </div>
              )}
            </div>
          </>

          <div
            id="videoContainer"
            style={{ width: 300, height: 'fit-content' }}
          ></div>
        </div>
      )}
    </>
  )
}

export default Room
