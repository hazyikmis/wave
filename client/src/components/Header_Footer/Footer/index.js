import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import faCompass from "@fortawesome/fontawesome-free-solid/faCompass";
import faPhone from "@fortawesome/fontawesome-free-solid/faPhone";
import faClock from "@fortawesome/fontawesome-free-solid/faClock";
import faEnvelope from "@fortawesome/fontawesome-free-solid/faEnvelope";

export const Footer = () => {
  return (
    <div>
      <footer className="bck_b_dark">
        <div className="container">
          <div className="logo">Waves</div>
          <div className="wrapper">
            <div className="left">
              <h2>Contact Information</h2>
              <div className="business_nfo">
                <div className="tag">
                  <FontAwesomeIcon icon={faCompass} className="icon" />
                  <div className="nfo">
                    <div>Address</div>
                    <div>Hoegaardsestraat 35 Leuven</div>
                  </div>
                </div>
                <div className="tag">
                  <FontAwesomeIcon icon={faPhone} className="icon" />
                  <div className="nfo">
                    <div>Phone</div>
                    <div>245-78884722</div>
                  </div>
                </div>
                <div className="tag">
                  <FontAwesomeIcon icon={faClock} className="icon" />
                  <div className="nfo">
                    <div>Working hours</div>
                    <div>Mon-Fri / 9am - 6pm</div>
                  </div>
                </div>
                <div className="tag">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  <div className="nfo">
                    <div>Email</div>
                    <div>nfo@waves.com</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right">
              <h2>Be the first to know</h2>
              <div>
                <div>
                  Get all the latest information on events, sales and offers.
                  You can miss out...
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
