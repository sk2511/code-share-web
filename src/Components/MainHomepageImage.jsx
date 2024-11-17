import React from 'react'

export default function MainHomepageImage() {
  return (
    <div className="h-100 w-100 mr-t">
      <div className="video-wrapper img_example">
        <img src={require('../images/example-chrome2.png')} alt='example-chrome2' className="w-100" />
        <video
          src={require('../images/example-code.mp4')}
          className="video-1"
          autoPlay
          loop
          muted
        />
        <div className="video-right-wrapper">
          <video
            src={require('../images/example-user1.mp4')}
            className="video-2 w-100"
            autoPlay
            loop
            muted
          />
          <video
            src={require('../images/example-user2.mp4')}
            className="video-3 w-50 "
            autoPlay
            loop
          />
          <video
            src={require('../images/example-user3.mp4')}
            className="video-4 w-50"
            autoPlay
            loop
          />
        </div>
      </div>

      <div className="row img_edit">
        <div className="col d-flex img_edit">
          <div className="video-wrapper m-2 pd-r ">
            <img
              src={require('../images/example-chrome2.png')}
              style={{
                width: '100%',
              }}
              alt='example-chrome2'
            />
            <video
              src={require('../images/example-code.mp4')}
              className="video-1"
              autoPlay
              loop
              muted
            />
            <div className="video-right-wrapper">
              <video
                src={require('../images/example-user1.mp4')}
                className="video-2 w-100"
                autoPlay
                loop
                muted
              />
              <video
                src={require('../images/example-user2.mp4')}
                className="video-3 w-50 "
                autoPlay
                loop
              />
              <video
                src={require('../images/example-user3.mp4')}
                className="video-4 w-50"
                autoPlay
                loop
              />
            </div>
          </div>
          <div className="video-wrapper m-2">
            <img
              src={require('../images/example-chrome2.png')}
              className="w-100"
              alt=""
            />
            <video
              src={require('../images/example-code.mp4')}
              className="video-1"
              autoPlay
              loop
              muted
            />
            <div className="video-right-wrapper">
              <video
                src={require('../images/example-user1.mp4')}
                className="video-2 w-100"
                autoPlay
                loop
                muted
              />
              <video
                src={require('../images/example-user2.mp4')}
                className="video-3 w-50 "
                autoPlay
                loop
              />
              <video
                src={require('../images/example-user3.mp4')}
                className="video-4 w-50"
                autoPlay
                loop
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
