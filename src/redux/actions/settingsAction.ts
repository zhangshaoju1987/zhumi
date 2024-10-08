export const setDistanceFilter = (distanceFilter:string) =>
    ({
        type: 'SET_DISTANCE_FILETER',
        payload: { distanceFilter }
    });

   export const setIntervalFilter = (intervalFilter:string) =>
        ({
            type: 'SET_INTERVAL_FILETER',
            payload: { intervalFilter }
        });
export const setAccuracy = (accuracy:string) =>
    ({
        type: 'SET_ACCURACY',
        payload: { accuracy }
    });

export const setUsername = (username:string) =>
    ({
        type: 'SET_USERNAME',
        payload: { username }
    });

export const setOwner = (owner:string) =>
    ({
        type: 'SET_OWNER',
        payload: { owner }
    });

export const setMapProvider = (mapProvider:string) =>
    ({
        type: 'SET_MAPPROVIDER',
        payload: { mapProvider }
    });
export const setHideHomeFAB = (hideHomeFAB:boolean) =>
    ({
        type: 'SET_HIDE_HOMEFAB',
        payload: { hideHomeFAB }
    });
export const setFollowUserLocation = (followUserLocation:boolean) =>
    ({
        type: 'SET_FOLLOW_USER_LOCATION',
        payload: { followUserLocation }
    });