import React, { useReducer } from 'react';
import trackingHandler from './trackingHandler';

const SET_APP_LOGGED_IN = 'SET_APP_LOGGED_IN';

const reducer = (state, action) => {
  switch (action.type) {
    case SET_APP_LOGGED_IN:
      return {
        ...state,
        appLoggedIn: action.payload,
      };
    default:
      throw new Error();
  }
};

const LiffContext = React.createContext();
const initialState = {
  appLoggedIn: false,
};

const LiffProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const share = (name, season, id) => {
    const imageUrl = window.assetUrl(`/storage/prod/flex_message/1.jpg`);
    const linkUrl = window.liffUrl;
  
    let text = `探索你和他的生命靈數！`;
    let alttext = `探索你和他的生命靈數！`;
  
    trackingHandler.trackingEvent('share', name, season, id);
    const messages = [
      {
        "type": "text",
        "text": text,
      },
      {
        "type": "flex",
        "altText": alttext,
        "contents": {
          "type": "bubble",
          "body": {
            "type": "box",
            "layout": "vertical",
            "contents": [
              {
                "type": "image",
                "url": imageUrl,
                "aspectMode": "cover",
                "size": "full",
                "aspectRatio": '887:1280',
                "action": {
                  "type": "uri",
                  "label": '1',
                  "uri": linkUrl,
                }
              }
            ],
            "paddingAll": "0%"
          }
        }
      }
    ];
  
    liff.shareTargetPicker(
      messages,
      {
        isMultiple: true,
      }
    )
    .then(function (res) {
      if (res) {
        // succeeded in sending a message through TargetPicker
        trackingHandler.trackingEvent('share_success', name, season, id);
        console.info(`[${res.status}] Message sent!`);
      } else {
        const [majorVer, minorVer] = (liff.getLineVersion() || "").split('.');
        if (parseInt(majorVer) == 10 && parseInt(minorVer) < 11) {
          // LINE 10.3.0 - 10.10.0
          // Old LINE will access here regardless of user's action
          console.info('TargetPicker was opened at least. Whether succeeded to send message is unclear')
        } else {
          // LINE 10.11.0 -
          // sending message canceled
          console.info('TargetPicker was closed!')
        }
        liff.closeWindow();
      }
    }).catch(function (error) {
      // something went wrong before sending a message
      console.error('something wrong happen', error)
    });
  }

  const actions = {
    setAppLoggedIn: (flag) => {
      dispatch({ type: SET_APP_LOGGED_IN, payload: flag });
    },
    share: (name, season, id) => {
      share(name, season, id);
    }
  };

  const { children } = props;
  return (
    <LiffContext.Provider
      value={{
        liffState: state,
        liffActions: actions,
      }}
    >
      {children}
    </LiffContext.Provider>
  );
};


export { LiffProvider, LiffContext };
