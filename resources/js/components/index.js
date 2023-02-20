import React, { useState, useEffect, useContext } from 'react';
import { Switch, Route, Link, useLocation } from 'react-router-dom';
import liff from '@line/liff';
import queryString from 'query-string';
import { LiffProvider, LiffContext } from "./hooks/liff-context";
import trackingHandler from './hooks/trackingHandler';
import FirstPage from './pages/FirstPage'

let parsedQueryString = {};

let prevPage = null; // For tracking.
let prevSeason = null; // For tracking.

function LiffRoot(props) {
  const { classes } = props;
  const { liffActions, liffState } = useContext(LiffContext);
  const [openPopup, setOpenPopup] = useState(false)
  const [load, setLoad] = useState(false)
  const location = useLocation();

  const sendMessageAndGoToOA = () => {
    window.location.href = window.oaUrl;
  }

  const afterLogin = () => {
    if(false) { // do not go oa this time
    //if (parsedQueryString.oa == 1) {
      sendMessageAndGoToOA();
    } else {
      // Default behavior.
      // let imageId = parsedQueryString.share;
      // if (!imageId) {
      //   imageId = 1; // Default id.
      // }
      // share(imageId);
    }
  }

  const appLogin = async (userId, displayName, pictureUrl, accessToken) => {
    // Check if the login is performed.
    if (liffState.appLoggedIn) {
      return;
    }

    console.info('appLogin()')

    // Detect the url is including the friendship_status_changed.
    // var friendStatusChanged = false;
    // if (parsedQueryString.friendship_status_changed == 'true') {
    //   friendStatusChanged = true;
    // }

    const data = {
      line_id: userId,
      name: displayName,
      avatar_url: pictureUrl,
      access_token: accessToken,
      //friendship_status_changed: friendStatusChanged,
      //image_id: parsedQueryString.share,
    }

    try {
      const res = await axios.post('/login', data);
      const u = res.data.data;
      liffActions.setAppLoggedIn(true);

      // Server will return the utm_source, the start the GA tracking.
      startGaTracking(u.utm_source);
    } catch(e) {
      // setErrorMsg('請重新開啟頁面');
      console.error(e);
    }
  }

  const lineLogin = () => {
    console.info('lineLogin()');
    liff.init({ liffId: window.liffId })
      .then(() => {
        console.info('liff init');
        if (!liff.isLoggedIn()) {
          liff.login({
            redirectUri: window.location.href
          });
        } else {
          const accessToken = liff.getAccessToken();
          // const idToken = liff.getIDToken();
          liff.getProfile()
            .then(profile => {
              // Send the token and userId to server, then verify it.
              window.displayName = profile.displayName;
              appLogin(profile.userId, profile.displayName, profile.pictureUrl, accessToken)
                .finally(afterLogin); // What ever success or failed, do it.

              // friendship no use - this time
              /*liff.getFriendship()
                .then((res) => {
                  if (res.friendFlag === true) {
                    console.info('getFriendship=true');
                  } else {
                    console.error('getFriendship=false');
                  }
                });
                */
            })
            .catch((err) => {
              console.error('get profile failed:', err);
            });
        }
      })
      .catch((err) => {
        if (err.message?.indexOf('access_denied') === 0) {
          return;
        }
        console.error(err);
      });
  }

  useEffect(() => {
    console.info('Entry point()');
    parsedQueryString = queryString.parse(location.search).r;

    if (window.liffId) {
      lineLogin();
    }
  }, []);

  const startGaTracking = (utmSource) => {
    console.log('startGaTracking()')
    // After gtag init, the history changed will trigger page_view.
    // gtag('config', window.gaTrackingId);

    if (utmSource) {
      const params = {
        utm_source: utmSource,
        utm_medium: 'cpc',
        utm_campaign: 'test',
      }
      const query = queryString.stringify(params);
      page = `${location.pathname}?${query}`;

      // Replace the url to let the GA send page_view with utm.
      props.history.replace(page);
    } else {
      trackingHandler.sendPageView(location, liffState);
    }
  }

  const trackingPageView = () => {
    if (location.pathname != prevPage) { // Prevent duplicated request.
      if (liffState.appLoggedIn) {
        trackingHandler.sendPageView(location, liffState);
      }
      prevPage = location.pathname;
    }

    return null;
  }

  return (
    <>
        <Switch>
            <Route path='/' exact component={FirstPage} />
        </Switch>
        <Route path="/" render={trackingPageView} />
    </>
  )
}

function LiffRootWrap() {
  return (
      <LiffProvider>
        <LiffRoot />
      </LiffProvider>
  );
}

export default LiffRootWrap;
