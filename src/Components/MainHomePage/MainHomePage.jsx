import React from 'react'
import MainHomepageImage from '../MainHomepageImage'
import styled from 'styled-components'
import { devices } from '../../Pages/device/devices'
export default function MainHomePage() {

  const Wrapper = styled.section`
    .custom_cent {
      display: flex;
      align-items: center;
      padding-bottom: 112px;
      width: 100%;
    }
    .custom_cent {
      display: flex;
      align-items: center;
      padding-bottom: 112px;
    }
    .img_edit {
      padding-right: 0px !important;
    }
    .text_fild {
      padding-right: 100px;
    }
    .mainHome {
      width: 50%;
    }
    .btn-primary-custom:hover {
      background-color: #00786a;
      border-color: #00786a;
      color: #ffffff;
      transition: 0.3s;
    }
    .container1 {
      width: 100%;
    }
    .text_sharecode {
      width: 100% !important;
    }
    .text_area {
      display: flex;
      align-items: center !important;
      justify-content: center;
    }

    .mb_share p {
      margin-bottom: 9px !important;
    }
    @media ${devices.desktop} {
      .mainHome {
        margin-left: 10% !important;
        padding-right: 10px !important;
        margin-top: 20px !important;
      }
      .video-1 {
        max-width: 436px !important;
      }
      .video-right-wrapper {
        width: 27% !important;
      }
      .text_fild {
        padding-right: 0px;
      }
    }

    @media ${devices.laptop} {
      .custom_cent {
        display: flex;
      }
      .text_fild {
        padding-right: 0px !important;
      }
      .mainHome {
        margin-left: 29px !important;
        padding-right: 10px !important;
        margin: 0px;
      }
      .txt_used p {
        width: 100% !important;
      }
      .btn-primary-custom {
        font-size: 16px !important;
        width: 100% !important;
        padding: 0 25px !important;
      }
      .mb_share p {
        margin-bottom: 1px;
      }
    }

    @media ${devices.tablet} {
      .custom_cent {
        display: flex;
        width: 100% !important;
      }
      .home img {
        margin-top: 75px !important;
      }
      .text_fild {
        margin-bottom: 26px;
        padding-right: 0px !important;
      }
      .mainHome {
        width: 75% !important;
        margin-left: 0px !important;
        padding-right: 10px !important;
        margin-top: 0px !important;
      }
      .txt_used p {
        width: 100% !important;
      }
      .txt_used img {
        width: 100% !important;
      }
      .btn-primary-custom {
        font-size: 16px !important;
        width: 100% !important;
        padding: 0 25px !important;
      }
      .video-1 {
        width: 63%;
      }
      .mb_share p {
        margin-bottom: 1px;
      }
    }

    @media ${devices.mobileL} {
      .custom_cent {
        display: block;
        width: 100% !important;
      }
      .home {
        margin-top: 75px !important;
      }

      .text_fild {
        padding-right: 0px !important;
      }
      .mainHome {
        width: 100% !important;
        margin-left: 0px !important;
        padding-right: 0px !important;
        margin-top: 5% !important;
      }
      .txt_used {
        margin: 0px !important;
      }
      .btn_share button {
        margin-bottom: 0px !important;
      }
      .txt_used p img {
        width: 80%;
      }
      .txt_used p {
        width: 100% !important;
      }
      .btn-primary-custom {
        font-size: 20px !important;
        width: 200px !important;
        padding: 0px !important;
      }
      .container1 {
        display: flex;
        flex-flow: column;
      }
      .mb_share p {
        margin-bottom: 1px;
      }
      .mb_share {
        width: 100%;
      }
    }

    @media ${devices.mobileM} {
      .custom_cent {
        display: block;
      }

      .home {
        margin-top: 75px !important;
      }
      .text_fild {
        padding-right: 0px !important;
      }
      .mainHome {
        margin-left: 0px !important;
        padding-right: 0px !important;
        margin-top: 5% !important;
      }
      .headline > h23 {
        font-size: 17px !important;
        text-align: center;
      }
      .txt_used {
        margin: 0px !important;
      }
      .btn_share button {
        margin-bottom: 0px !important;
      }
      .txt_used p img {
        width: 80%;
      }
      .btn-primary-custom {
        font-size: 20px !important;
        width: 200px !important;
        padding: 0px !important;
      }
      .container1 {
        display: flex;
        flex-flow: column;
      }
      .mb_share p {
        margin-bottom: 1px;
      }
    }

    @media ${devices.mobileS} {
      .custom_cent {
        display: block;
      }
    }
  `

  const H2Title = styled.h2`
    color: black;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 300;
    margin: 10px 0;

    @media ${devices.desktop} {
      text-align: left;
      font-size: 20px;
    }

    @media ${devices.tablet} {
      font-size: 18px;
      text-align: center;
    }

    @media ${devices.mobile} {
      font-size: 15px !important;
    }
  `
  const H1Title = styled.h1`
    font-style: normal;
    font-weight: 500 !important;
    text-transform: capitalize;
    line-height: 1.4;
    margin: 0 0 24px;
    background: linear-gradient(180deg, #006445, #00a695);
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    margin: 0px 0 10px;

    @media ${devices.tablet} {
      font-size: 24px;
      text-align: center;
    }

    @media ${devices.desktop} {
      text-align: left;
      font-size: 40px;
    }

    @media ${devices.mobile} {
      font-size: 23px !important;
    }
  `

  return (
    <>
      <div className="background_bg home">
        <img
          src="https://global-uploads.webflow.com/5d123a0e13543973a9665271/635bfe6880fbbd1e509a7f0f_beigeherostars.svg"
          loading="lazy"
          alt="Beige stars"
          width="100%"
          className="img_back home-hero_stars"
        ></img>
      </div>
      <Wrapper className="mb-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 d-flex justify-content-center align-items-center col-md-12 ">
              <div className="text_fild">
                <div className="headline text-center text_sharecode">
                  <H1Title className="heading-xxlarg">
                    Share Code in <br />
                    Real-time with Developers
                  </H1Title>
                  <H2Title>
                    An online code editor for interviews, troubleshooting,
                    teaching &amp; more…
                  </H2Title>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-column mb_share">
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12">
              <MainHomepageImage />
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}
