'use client';
import React from 'react';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

/***************************  IMAGE - ELDERS LIMITED  ***************************/

interface EldersLimitedProps {
  imageSize?: {
    width?: any;
    height?: any;
  };
}

export default function EldersLimited({ imageSize }: EldersLimitedProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        lineHeight: 0,
        '& svg': { width: imageSize?.width || { xs: 89, sm: 105, md: 132 }, height: imageSize?.height || { xs: 32, sm: 36, md: 52 } }
      }}
    >
<svg xmlns="http://www.w3.org/2000/svg"  version="1.1" id="layer" x="0px" y="0px" viewBox="0 0 652 652"  >

<g>
	<g>
		<g>
			<g>
				<g>
					<path   fill={theme.palette.primary.main} d="M606.4,380.2H44.8c-10.6,0-19.2-8.6-19.2-19.2V146.9c0-10.6,8.6-19.2,19.2-19.2h561.6       c10.5,0,19.2,8.6,19.2,19.2V361C625.6,371.6,617,380.2,606.4,380.2"/>
					<path   fill="white" d="M584.3,240.7c-8.3-2.5-13.8-2.7-20.1-2.6c-7.4,0.2-13.6,1.7-18.7,4.4c-6.4-3.9-13.6-5.1-18.8-4.4       c-5.6,0.7-11.6,3-17.1,7.1c-3.6-4-4.8-5.3-8.5-6.5c-7.5-2.4-15.9,2-20.9,7.6L450.7,277c-1.1,1.2-2.3,2.2-3.4,3.3l-0.2,0.2       c-12.8,12.2-24.4,20.5-41.1,22.6c-21.6,2.7-29.4-13.1-3.9-36.1c12.7-11.4,21.6-12.4,25.4-10.3c5.9,3.2,4.3,12.2-23.1,24.6       c-2.9,1.3-6.8,3-5.3,10c0.5,2.4,2.8,3.6,5.6,3.1c1.5-0.2,2.5-0.6,3.3-0.8c25-8.9,34.2-22.6,37-27.6c3.7-6.5,4.5-15.3-1.5-21.7       c-6.4-6.8-27.4-11.5-52.7,6.5c-16.2,11.5-30.1,27-33.3,47.3c-19.5,7-24.8,3-24.8,3C327,295.4,335,286,335,286       c17.7-18.9,74.2-79.1,81.2-86.5c6.8-8.3-3.4-8.9-3.4-8.9c-10.7-0.7-18.5,0.7-27.9,9.5l-51.8,53.2c-3.1-12.9-21.7-22.2-49.5-6.9       c-27.2,14.9-39,32.8-44.1,45.5c0,0-21.3,11.1-24.1-0.7c0,0-2.1-4.3,7-13.1c17.5-18.6,59.4-62.5,71.4-75.2       c8.2-9.4-0.4-10.5-0.4-10.5c-11.2-1-19.5,0.2-29.2,9.4l-57,58.2c-4.8,4.6-8.7,8.4-12.2,11.6l0-0.2c-34.2,30.5-68,28-76.7,18.6       c-8.8-9.6,0.2-26.9,22.8-35.4c11.6-4.3,22.8-5.4,40.9-4.1c3.1,0.2,7.1,0.7,9.9-2c1.5-1.3,7.4-7.2,7.4-7.2       c3.1-3,2.6-8.8-2.7-9.1c-10.8-0.5-26.9,0.1-29.4-10.5c-2.1-9,9.8-19.1,31.8-21.9c8.4-1.1,25.7-0.3,37.9,2.1       c0,0,3.2,0.8,6.1-1.8c7.8-7.1,11.5-12.6,11.5-12.6c2.4-2.8,0.6-7.3-4.1-8.1c-19.8-3.5-32.2-3.3-44.7-3.2       c-23.8,0.3-48.7,8.9-61.2,19.3c-12.6,10.5-17.7,27.9-7.8,39.3c-61.9,15.5-73.7,44.7-65.7,69.4c5.2,16,23.4,25.4,55,22       c19-2,37.1-11.1,49-18.7c1.9,8,12.6,38.6,60.7,1c-0.1,11.4,14,32.9,63.5,3.8c11.1,31.8,58.5,2.6,60.2,1.5       c5.2,13.1,25.9,21,57.1,2.2c0.1,0.2,0.4,3.4,2.7,6.3c3.8,5.5,13.1,8.3,27.8-6.1c0.1,0,40.8-43.1,40.8-43.1       c13.2-14.4,17.8-15.3,23.4-16.7c8.4-2,14.3-0.2,18.3,2.6c-4.2,10.4,5.7,20.1,7.2,25.1c2.7,9.3-4.3,14.9-9.6,15.7       c-6.8,1-15-1.4-23-9.3c-4.6-4.5-11.5-2.1-23.4,12.2c0,0-4.5,5.4,0.6,10.3c6.2,6,15.5,13.7,39.1,13.7c24.3,0,40.7-15.3,42.4-31       c2-18.8-10.6-23.7-10.9-32.3c-0.2-6.1,6-11.4,12.2-12c2.6-0.2,5.3-0.3,12.8,1.4c0,0,1.9,0.5,3.6-1c4.6-4.2,6.1-6.7,6.1-6.7       C588.1,243.8,587,241.5,584.3,240.7 M315.8,271c-35.2,39-43.7,27.7-43.7,27.7c-9.3-8.7,11-27,11-27c30.9-25.9,37.5-13,37.5-13       C323.7,264,315.8,271,315.8,271"/>
				</g>
			</g>
		</g>
		<g>
			<g>
				<path   fill={theme.palette.primary.main} d="M482.1,513.4c0,6.1,5,11,11,11c6.2,0,11.2-5,11.2-11c0-6.1-5-11-11.2-11      C487.1,502.4,482.1,507.4,482.1,513.4 M457.4,446.1h-14.5v8.4c0,5.3-2.9,9.5-9.2,9.5h-3v14.3h10.8V506      c0,11.5,7.3,18.4,18.9,18.4c4.7,0,7.6-0.8,9.1-1.5v-13.3c-0.8,0.2-3,0.5-5,0.5c-4.6,0-7-1.7-7-6.9v-25h12V464h-12V446.1z       M403.4,444.4c0,5.3,4.5,9.8,9.9,9.8c5.6,0,9.9-4.5,9.9-9.8c0-5.6-4.4-10.1-9.9-10.1C407.8,434.4,403.4,438.8,403.4,444.4       M421.4,464h-16.1v59.7h16.1V464z M348.3,502.5c-1.9,5.3-6.1,9.1-13.6,9.1c-8,0-14.7-5.7-15-13.6h42.7c0-0.2,0.2-2.7,0.2-5      c0-19.2-11-30.9-29.5-30.9c-15.3,0-29.3,12.4-29.3,31.4c0,20.1,14.4,31.9,30.8,31.9c14.7,0,24.1-8.6,27.2-18.9L348.3,502.5z       M320,487c0.4-5.5,5-11.8,13.3-11.8c9.2,0,13.1,5.8,13.3,11.8H320z M300.9,464h-17l-14.2,40L255,464h-17.7l24.4,59.7h16.1      L300.9,464z M210.3,444.4c0,5.3,4.5,9.8,9.9,9.8c5.6,0,9.9-4.5,9.9-9.8c0-5.6-4.4-10.1-9.9-10.1      C214.8,434.4,210.3,438.8,210.3,444.4 M228.3,464h-16.1v59.7h16.1V464z M202,523.6v-16h-38.3v-70H147v86H202z"/>
			</g>
		</g>
	</g>
</g>
</svg>
    </Box>
  );
}

// PropTypes are kept for backward compatibility
EldersLimited.propTypes = { 
  imageSize: PropTypes.object 
};