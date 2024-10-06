import { PayloadAction } from "@reduxjs/toolkit";

const initialState =
{
	distanceFilter:10,
	intervalFilter:2,
    accuracy:"bestForNavigation",
    username:"竹米",
    owner:"zhangshaoju",
    mapProvider:undefined,
	hideHomeFAB : false,
	followUserLocation:true
};

const settings = (state = initialState, action:PayloadAction<typeof initialState>) =>
{
	switch (action.type)
	{
		case 'SET_DISTANCE_FILETER':
		{
			const {distanceFilter} = action.payload;
			return {...state,distanceFilter};
		}
		case 'SET_INTERVAL_FILETER':
		{
			const {intervalFilter} = action.payload;
			return {...state,intervalFilter};
		}
		case 'SET_FOLLOW_USER_LOCATION':
		{
			const {followUserLocation} = action.payload;
			return {...state,followUserLocation};
		}
		case 'SET_ACCURACY':
		{
			const {accuracy} = action.payload;
			return {...state,accuracy};
		}

		case 'SET_USERNAME':
		{

			const {username} = action.payload;
			return {...state,username};
		}

		case 'SET_OWNER':
		{

			const {owner} = action.payload;
			return {...state,owner};
		}
        case 'SET_MAPPROVIDER':
		{

			const {mapProvider} = action.payload;
			return {...state,mapProvider};
		}
		case 'SET_HIDE_HOMEFAB':
		{

			const {hideHomeFAB} = action.payload;
			return {...state,hideHomeFAB};
		}
		default:
			return state;
	}
};

export default settings;