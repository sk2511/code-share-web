import React, { useRef, useState, createContext } from 'react'
import io from 'socket.io-client'
import { Device } from 'mediasoup-client'
import { useToast } from './Toast/ToastContex'

const { REACT_APP_API_URL } = process.env

const SocketContext = createContext()

const ContextProvider = ({ children }) => {
  const [CallOnline, setCallOnline] = useState(false)
  const [toggleCamera, setToggleCamera] = useState(true)
  const [toggleMic, setToggleMic] = useState(true)
  const [videoInput, setVideoInput] = useState([])
  const [fontSizeProvider, setFontSizeProvider] = useState(14)
  const [userDetails, setUserDetails] = useState({})
  const socketRef = useRef()
  const userVideo = useRef()
  const streamRef = useRef()
  const producerTransport = useRef()
  const device = useRef()
  const videoProducer = useRef()
  const audioProducer = useRef()

  const rtpCapabilities = useRef()
  const consumerTransports = useRef([])
  const audioTrack = useRef()
  const videoTrack = useRef()
  const audioParmasRef = useRef({})
  const videoParamsRef = useRef({})

  const { toastMessage } = useToast();

  let index = 0

  const TurnOnSocket = () => {
    socketRef.current = io.connect(`${REACT_APP_API_URL}/mediasoup`)
    joinRoom()
    getProducers()
    socketRef.current.on('producer-closed', ({ remoteProducerId }) => {

      const producerToClose = consumerTransports.current.find(
        (transportData) => transportData.producerId === remoteProducerId
      )
      producerToClose.consumerTransport.close()
      producerToClose.consumer.close()

      consumerTransports.current = consumerTransports.current.filter(
        (transportData) => transportData.producerId !== remoteProducerId
      )

      const videoContainer = document.getElementById('videoContainer')
      videoContainer.removeChild(
        document.getElementById(`td-${remoteProducerId}`)
      )
    })

    socketRef.current.on('some-one-joined', () => {
      getProducers()
    })

    socketRef.current.on('new-producer', ({ producerId }) =>
      signalNewConsumerTransport(producerId)
    )
  }

  const VideoCallStart = async () => {
    setCallOnline(true)
    // const isMobile = navigator.userAgentData.mobile;
    // if (isMobile) {
    //   videoConstraints.facingMode = "user";
    // }
    const devices = await navigator.mediaDevices.enumerateDevices()
    const deviceArr = []
    devices.forEach(
      (track) => track.kind === 'videoinput' && deviceArr.push(track.deviceId)
    )
    setVideoInput([...deviceArr])
    await getStream(deviceArr[index])
    createSendTransport()
  }

  const getStream = async (deviceId) => {
    const videoConstraints = {
      width: {
        min: 640,
        max: 1920,
      },
      height: {
        min: 400,
        max: 1080,
      },
      deviceId,
    }
    await navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        const tracks = streamRef.current?.getTracks()
        tracks?.forEach((track) => track.stop())
        streamRef.current = stream
        userVideo.current.srcObject = stream
        videoParamsRef.current.track = stream.getVideoTracks()[0]
        audioParmasRef.current.track = stream.getAudioTracks()[0]
      })
      .catch((e) => {
        setCallOnline(false)
        toastMessage(e.message, 'error', 'Stream Error');
      })
  }

  const createSendTransport = () => {
    socketRef.current.emit(
      'createWebRtcTransport',
      { consumer: false },
      ({ params }) => {
        if (params.error) {
          return
        }

        // creates a new WebRTC Transport to send media
        // based on the server's producer transport params
        // https://mediasoup.org/documentation/v3/mediasoup-client/api/#TransportOptions
        producerTransport.current = device.current.createSendTransport(params)
        // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
        // this event is raised when a first call to transport.produce() is made
        // see connectSendTransport() below

        producerTransport.current.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socketRef.current.on('transport-connect', ...)
              await socketRef.current.emit('transport-connect', {
                dtlsParameters,
              })
              // Tell the transport that parameters were transmitted.
              callback()
            } catch (error) {
              errback(error)
            }
          }
        )

        producerTransport.current.on(
          'produce',
          async (parameters, callback, errback) => {
            try {
              // tell the server to create a Producer
              // with the following parameters and produce
              // and expect back a server side producer id
              // see server's socketRef.current.on('transport-produce', ...)
              await socketRef.current.emit(
                'transport-produce',
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                  appData: parameters.appData,
                },
                ({ id, producersExist }) => {
                  // Tell the transport that parameters were transmitted and provide it with the
                  // server side producer's id.
                  callback({ id })

                  // if producers exist, then join room
                  if (producersExist) {
                    getProducers()
                  }
                }
              )
            } catch (error) {
              errback(error)
            }
          }
        )

        connectSendTransport()
      }
    )
  }

  const connectSendTransport = async () => {
    // we now call produce() to instruct the producer transport
    // to send media to the Router
    // https://mediasoup.org/documentation/v3/mediasoup-client/api/#transport-produce
    // this action will trigger the 'connect' and 'produce' events above
    console.log('called')
    videoProducer.current = await producerTransport.current.produce(
      videoParamsRef.current
    )
    audioProducer.current = await producerTransport.current.produce(
      audioParmasRef.current
    )
  }

  const signalNewConsumerTransport = async (remoteProducerId) => {
    await socketRef.current.emit(
      'createWebRtcTransport',
      { consumer: true },
      ({ params }) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        if (params.error) {
          return
        }

        let consumerTransport
        try {
          consumerTransport = device.current.createRecvTransport(params)
        } catch (error) {
          // exceptions:
          // {InvalidStateError} if not loaded
          // {TypeError} if wrong arguments.

          return
        }

        consumerTransport.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              // Signal local DTLS parameters to the server side transport
              // see server's socketRef.current.on('transport-recv-connect', ...)
              await socketRef.current.emit('transport-recv-connect', {
                dtlsParameters,
                serverConsumerTransportId: params.id,
              })

              // Tell the transport that parameters were transmitted.
              callback()
            } catch (error) {
              // Tell the transport that something was wrong
              errback(error)
            }
          }
        )
        connectRecvTransport(consumerTransport, remoteProducerId, params.id)
      }
    )
  }

  const connectRecvTransport = async (
    consumerTransport,
    remoteProducerId,
    serverConsumerTransportId
  ) => {
    // for consumer, we need to tell the server first
    // to create a consumer based on the rtpCapabilities and consume
    // if the router can consume, it will send back a set of params as below

    await socketRef.current.emit(
      'consume',
      {
        rtpCapabilities: device.current.rtpCapabilities,
        remoteProducerId,
        serverConsumerTransportId,
      },
      async ({ params }) => {
        if (params.error) {
          return
        }

        // then consume with the local consumer transport
        // which creates a consumer
        const consumer = await consumerTransport.consume({
          id: params.id,
          producerId: params.producerId,
          kind: params.kind,
          rtpParameters: params.rtpParameters,
        })

        consumerTransports.current = [
          ...consumerTransports.current,
          {
            consumerTransport,
            serverConsumerTransportId: params.id,
            producerId: remoteProducerId,
            consumer,
          },
        ]

        // create a new div element for the new consumer media
        // and append to the video container

        const divVal = document.getElementById(`td-${remoteProducerId}`)

        if (!divVal) {
          if (consumer.kind === 'audio') {
            audioTrack.current = consumer.track
          } else {
            videoTrack.current = consumer.track
          }
          if (audioTrack.current && videoTrack.current) {
            const newElem = document.createElement('div')
            newElem.setAttribute('id', `td-${remoteProducerId}`)
            newElem.innerHTML =
              '<video class="remoteVideo" id="' +
              remoteProducerId +
              '" autoPlay muted ></video>'
            const videoContainer = document.getElementById('videoContainer')
            videoContainer.appendChild(newElem)

            // destructure and retrieve the video track from the producer
            const remoteVideoLocal = document.getElementById(remoteProducerId)
            remoteVideoLocal.srcObject = new MediaStream([
              audioTrack.current,
              videoTrack.current,
            ])
            document.onclick = () => {
              const video = document.getElementsByTagName('video')
              for (let i = 0; i < video.length; i++) {
                const element = video[i]
                if (element.id !== 'myVideo') {
                  element.muted = false
                  element.play()
                }
              }
            }
            remoteVideoLocal.play()
            audioTrack.current = ''
            videoTrack.current = ''
          }
          // the server consumer started with media paused
          // so we need to inform the server to resume
          socketRef.current.emit('consumer-resume', {
            serverConsumerId: params.serverConsumerId,
          })
        }
        //   setremoteTrack(old=>[...old,{remoteProducerId,track}])
      }
    )
  }

  const getProducers = () => {
    socketRef.current.emit('getProducers', (producerIds) => {
      // for each of the producer create a consumer
      // producerIds.forEach(id => signalNewConsumerTransport(id))
      producerIds.forEach(signalNewConsumerTransport)
    })
  }

  const joinRoom = () => {
    const roomName = window.location.pathname.split('/')[2]
    socketRef.current.emit('joinRoom', { roomName }, (data) => {
      // we assign to local variable and will be used when
      // loading the client Device (see createDevice above)
      rtpCapabilities.current = data.rtpCapabilities
      // once we have rtpCapabilities from the Router, create Device
      createDevice()
    })
  }

  const createDevice = async () => {
    try {
      device.current = new Device()
      // https://mediasoup.org/documentation/v3/mediasoup-client/api/#device-load
      // Loads the device with RTP capabilities of the Router (server side)
      await device.current.load({
        // see getRtpCapabilities() below
        routerRtpCapabilities: rtpCapabilities.current,
      })
      // once the device loads, create transport
    } catch (error) {
      if (error.name === 'UnsupportedError')
        console.warn('browser not supported')
    }
  }

  const VideoCallEnd = () => {
    window.location.reload(true)
  }

  const toggleCameraFun = () => {
    const videoTrack = streamRef.current
      .getTracks()
      .find((track) => track.kind === 'video')
    videoTrack.enabled = !videoTrack.enabled
    setToggleCamera(!toggleCamera)
  }

  const toggleMicFun = () => {
    const audioTrack = streamRef.current
      .getTracks()
      .find((track) => track.kind === 'audio')
    audioTrack.enabled = !audioTrack.enabled
    setToggleMic(!toggleMic)
  }

  const changeCamera = async () => {
    if (videoInput.length === 1) {
      return
    }
    index += 1
    if (videoInput.length === index) {
      index = 0
    }
    await getStream(videoInput[index])
    await UpdateSendTransport()
  }

  const UpdateSendTransport = async () => {
    await videoProducer.current.replaceTrack(videoParamsRef.current)
    await audioProducer.current.replaceTrack(audioParmasRef.current)
  }

  return (
    <SocketContext.Provider
      value={{
        userVideo,
        TurnOnSocket,
        VideoCallStart,
        VideoCallEnd,
        CallOnline,
        toggleCamera,
        toggleCameraFun,
        changeCamera,
        toggleMicFun,
        toggleMic,
        socketRef,
        videoInput,
        fontSizeProvider,
        setFontSizeProvider,
        setUserDetails,
        userDetails,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export { ContextProvider, SocketContext }
