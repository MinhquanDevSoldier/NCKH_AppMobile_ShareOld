// @ts-nocheck
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import AppColors from './AppColors';
import { 
	faUsers,
	faKey,
	faMobile,
	faEnvelope,
	faMapMarkedAlt,
	faAngleDown, 
	faStar, 
	faMapMarkerAlt,
	faUpload,
	faBars,
	faTimes,
	faArrowDown,
	faChevronDown,
	faPencilAlt,
	faCheck,
	faClock,
	faPhotoVideo
} from '@fortawesome/free-solid-svg-icons'

const SVGs = {
	faUsers,
	faKey,
	faMobile,
	faEnvelope,
	faMapMarkedAlt,
	faUpload,
	faAngleDown,
	faStar,
	faMapMarkerAlt,
	faBars,
	faTimes,
	faArrowDown,
	faChevronDown,
	faPencilAlt,
	faCheck,
	faClock,
	faPhotoVideo,
}
export default {
	Icons: ({color = AppColors.darkText, size = 22, name = 'faUsers', width, height, style}: any) => {
		if (name in SVGs) {
			const asName = SVGs[name]
			return <FontAwesomeIcon 
                icon={asName} color={color} size={size} width={width || size} height={height || size}
				style={style}/>
		}
		return null;
	}
};
