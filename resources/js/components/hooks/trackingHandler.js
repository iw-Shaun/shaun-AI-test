import queryString from 'query-string';

const trackingHandler = {
  sendPageView: (location, liffState, id) => {
    console.info('trackingHandler sendPageView');
    // Store in our server after login.
    var from = liffState.from
    if(!from) from = queryString.parse(location.search).r
    if(!id) id = null

    const params = {
      action: 'page_view',
      category: location.pathname,
      season: liffState.season,
      image_id: id,
      from: from,
    }

    // gtag('event', 'custom_page_view', {
    //   'action': 'page_view',
    //   'category': location.pathname,
    //   'season': liffState.season,
    //   'image_id': id,
    //   'from': from,
    // });
    
    // Axios.get('/tracking_event', { params: params });
  },
  trackingEvent: (action, category, liffState, id) => {
    const params = {
      action: action,
      category: category,
      season: liffState.season,
      image_id: id,
      from: liffState.from,
    }

    // GA event
    // gtag('event', action, {
    //   'action': action,
    //   'category': category,
    //   'season': liffState.season,
    //   'image_id': id,
    //   'from': liffState.from,
    // });

    // Backend
    // Axios.get('/tracking_event', { params: params });
  }
}

export default trackingHandler;
