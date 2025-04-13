'use client';
import React from 'react';
import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';

/***************************  IMAGE - ELDERS LIMITED  ***************************/

interface ImageSizeProps {
  width?: any;
  height?: any;
}

interface WesfarmersProps {
  imageSize?: ImageSizeProps;
}

export default function Wesfarmers({ imageSize }: WesfarmersProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        lineHeight: 0,
        '& svg': { width: imageSize?.width || { xs: 89, sm: 105, md: 132 }, height: imageSize?.height || { xs: 16, sm: 18, md: 26 } }
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="299px" height="136px" viewBox="0 0 300.377 125.572">
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path
            fill={theme.palette.primary.main}
            d="M150.786 62.0969l27.252 0c0,0 5.26375,0.817608 8.60408,-4.3885 4.31344,-6.71787 17.8702,-26.3677 17.8702,-26.3677 0,0 4.25881,-4.43173 0.0978592,-10.9827 -3.50153,-5.51108 -13.4532,-19.6468 -13.4532,-19.6468 0,0 2.39002,4.51228 -1.06258,9.55708 -4.86618,7.11243 -32.3025,48.5198 -32.3025,48.5198 0,0 -2.15935,3.14461 -4.86618,1.36229 -1.4196,-0.935899 -1.16614,-2.13967 0,-4.28193 1.16883,-2.14226 13.7149,-20.0211 13.7149,-20.0211 0,0 2.21172,-2.74436 2.24893,-5.86854 0.0288201,-2.54283 0.227657,-2.71543 -1.55768,-5.6469 -2.02741,-3.3228 -17.1304,-24.3319 -17.1304,-24.3319 0,0 -15.1288,21.0091 -17.1531,24.3319 -1.78835,2.93147 -1.58661,3.10407 -1.55779,5.6469 0.0346271,3.12418 2.24893,5.86854 2.24893,5.86854 0,0 12.5461,17.8789 13.7123,20.0211 1.16883,2.14226 1.42218,3.34603 0,4.28193 -2.70414,1.78233 -4.86661,-1.36229 -4.86661,-1.36229 0,0 -27.4359,-41.4073 -32.3025,-48.5198 -3.44959,-5.0448 -1.06258,-9.55708 -1.06258,-9.55708 0,0 -9.95163,14.1357 -13.4532,19.6468 -4.15794,6.55097 0.10087,10.9827 0.10087,10.9827 0,0 13.5567,19.6498 17.8675,26.3677 3.34044,5.20611 8.60677,4.3885 8.60677,4.3885l28.4439 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M150.786 62.0969l27.252 0c0,0 5.26375,0.817608 8.60408,-4.3885 4.31344,-6.71787 17.8702,-26.3677 17.8702,-26.3677 0,0 4.25881,-4.43173 0.0978592,-10.9827 -3.50153,-5.51108 -13.4532,-19.6468 -13.4532,-19.6468 0,0 2.39002,4.51228 -1.06258,9.55708 -4.86618,7.11243 -32.3025,48.5198 -32.3025,48.5198 0,0 -2.15935,3.14461 -4.86618,1.36229 -1.4196,-0.935899 -1.16614,-2.13967 0,-4.28193 1.16883,-2.14226 13.7149,-20.0211 13.7149,-20.0211 0,0 2.21172,-2.74436 2.24893,-5.86854 0.0288201,-2.54283 0.227657,-2.71543 -1.55768,-5.6469 -2.02741,-3.3228 -17.1304,-24.3319 -17.1304,-24.3319 0,0 -15.1288,21.0091 -17.1531,24.3319 -1.78835,2.93147 -1.58661,3.10407 -1.55779,5.6469 0.0346271,3.12418 2.24893,5.86854 2.24893,5.86854 0,0 12.5461,17.8789 13.7123,20.0211 1.16883,2.14226 1.42218,3.34603 0,4.28193 -2.70414,1.78233 -4.86661,-1.36229 -4.86661,-1.36229 0,0 -27.4359,-41.4073 -32.3025,-48.5198 -3.44959,-5.0448 -1.06258,-9.55708 -1.06258,-9.55708 0,0 -9.95163,14.1357 -13.4532,19.6468 -4.15794,6.55097 0.10087,10.9827 0.10087,10.9827 0,0 13.5567,19.6498 17.8675,26.3677 3.34044,5.20611 8.60677,4.3885 8.60677,4.3885l28.4439 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M79.9951 116.218c-2.95148,1.53456 -6.60861,3.00879 -9.91141,3.00879 -5.24934,0 -8.67011,-3.65671 -8.67011,-8.73044l18.2878 0c-0.17862,-9.0851 -4.66197,-14.4524 -13.9831,-14.4524 -8.20081,0 -14.4521,5.95758 -14.4521,14.216 0,4.42614 1.5922,8.84884 5.36731,11.5644 3.3028,2.41572 7.78615,2.88803 11.7973,2.88803 3.12751,0 6.42989,-0.590274 9.26339,-1.82846l2.30087 -6.66593zm-18.5815 -10.735c0.293685,-2.36109 1.70759,-4.30763 4.30473,-4.30763 2.83351,0 3.95383,2.00687 3.95383,4.30763l-8.25856 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M79.9951 116.218c-2.95148,1.53456 -6.60861,3.00879 -9.91141,3.00879 -5.24934,0 -8.67011,-3.65671 -8.67011,-8.73044l18.2878 0c-0.17862,-9.0851 -4.66197,-14.4524 -13.9831,-14.4524 -8.20081,0 -14.4521,5.95758 -14.4521,14.216 0,4.42614 1.5922,8.84884 5.36731,11.5644 3.3028,2.41572 7.78615,2.88803 11.7973,2.88803 3.12751,0 6.42989,-0.590274 9.26339,-1.82846l2.30087 -6.66593zm-18.5815 -10.735c0.293685,-2.36109 1.70759,-4.30763 4.30473,-4.30763 2.83351,0 3.95383,2.00687 3.95383,4.30763l-8.25856 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M82.2178 123.357c3.24516,0.708242 6.60861,1.35616 9.91141,1.35616 6.25127,0 15.0427,-1.76781 15.0427,-9.67236 0,-3.00912 -2.00719,-5.30967 -4.48367,-6.90219 -1.8889,-1.23829 -4.30774,-1.8889 -6.42999,-2.53681 -1.41648,-0.414665 -3.36302,-0.883959 -3.36302,-2.71522 0,-1.59252 2.30077,-1.88621 3.48142,-1.88621 2.65478,0 5.30967,0.826319 7.54978,2.30087l0 -6.13631c-3.00912,-0.705554 -6.07555,-1.12022 -9.14241,-1.12022 -3.06944,0 -6.25428,0.296696 -8.9667,1.8889 -2.71253,1.53187 -4.36538,3.95071 -4.36538,7.13555 0,7.96477 14.0981,8.20081 14.0981,12.1545 0,2.18247 -2.53681,2.59456 -4.18676,2.59456 -3.71736,0 -7.31686,-1.35626 -10.4439,-3.24559l1.29852 6.78433z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M82.2178 123.357c3.24516,0.708242 6.60861,1.35616 9.91141,1.35616 6.25127,0 15.0427,-1.76781 15.0427,-9.67236 0,-3.00912 -2.00719,-5.30967 -4.48367,-6.90219 -1.8889,-1.23829 -4.30774,-1.8889 -6.42999,-2.53681 -1.41648,-0.414665 -3.36302,-0.883959 -3.36302,-2.71522 0,-1.59252 2.30077,-1.88621 3.48142,-1.88621 2.65478,0 5.30967,0.826319 7.54978,2.30087l0 -6.13631c-3.00912,-0.705554 -6.07555,-1.12022 -9.14241,-1.12022 -3.06944,0 -6.25428,0.296696 -8.9667,1.8889 -2.71253,1.53187 -4.36538,3.95071 -4.36538,7.13555 0,7.96477 14.0981,8.20081 14.0981,12.1545 0,2.18247 -2.53681,2.59456 -4.18676,2.59456 -3.71736,0 -7.31686,-1.35626 -10.4439,-3.24559l1.29852 6.78433z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M119.135 102.299l1.64984 0c2.1829,0 3.42378,-0.239056 4.83768,1.17797l0.178297 0 0 -6.84197 -6.66582 0 0 -1.24088c0,-2.47659 -0.296696,-5.36731 3.12407,-5.36731 1.00494,0 1.65296,0.414665 2.41884,1.00193l3.95383 -6.01533c-2.06451,-0.708242 -4.36538,-0.826641 -7.13867,-0.826641 -3.36302,0 -6.42989,0.472305 -9.20263,2.77318 -2.94889,2.41884 -3.36044,5.24934 -3.36044,8.90648l0 0.768571 -3.95383 5.664 3.95383 0 0 15.1004c-0.0603286,2.83039 0.175609,4.54099 -2.00687,6.37225l0 0.175609 14.2764 0 0 -0.175609c-2.12483,-1.83126 -2.00687,-3.54186 -2.06451,-6.37225l0 -15.1004z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M119.135 102.299l1.64984 0c2.1829,0 3.42378,-0.239056 4.83768,1.17797l0.178297 0 0 -6.84197 -6.66582 0 0 -1.24088c0,-2.47659 -0.296696,-5.36731 3.12407,-5.36731 1.00494,0 1.65296,0.414665 2.41884,1.00193l3.95383 -6.01533c-2.06451,-0.708242 -4.36538,-0.826641 -7.13867,-0.826641 -3.36302,0 -6.42989,0.472305 -9.20263,2.77318 -2.94889,2.41884 -3.36044,5.24934 -3.36044,8.90648l0 0.768571 -3.95383 5.664 3.95383 0 0 15.1004c-0.0603286,2.83039 0.175609,4.54099 -2.00687,6.37225l0 0.175609 14.2764 0 0 -0.175609c-2.12483,-1.83126 -2.00687,-3.54186 -2.06451,-6.37225l0 -15.1004z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M166.566 95.9252l-0.178727 0c-1.12022,0.650602 -2.41884,0.88697 -3.77511,0.88697l-8.25845 0 0 0.175609c2.1829,1.82825 2.00418,3.59907 2.00418,6.31202l0 14.1584c0,2.77275 0.178727,4.48335 -2.00418,6.31192l0 0.175609 14.2165 0 0 -0.175609c-2.1829,-1.82857 -2.00418,-3.5995 -2.00418,-6.31192l0 -8.90648c0,-1.47724 -0.178727,-2.47917 0.8232,-3.59939 1.23829,-1.35626 2.89115,-2.00687 4.66208,-2.00687 1.00225,0 2.06451,0.235937 3.06676,0.472305l0 -7.19588 -2.1828 -0.175716c-3.00922,0 -5.48538,1.47423 -6.36923,4.18676l0 -4.30774z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M166.566 95.9252l-0.178727 0c-1.12022,0.650602 -2.41884,0.88697 -3.77511,0.88697l-8.25845 0 0 0.175609c2.1829,1.82825 2.00418,3.59907 2.00418,6.31202l0 14.1584c0,2.77275 0.178727,4.48335 -2.00418,6.31192l0 0.175609 14.2165 0 0 -0.175609c-2.1829,-1.82857 -2.00418,-3.5995 -2.00418,-6.31192l0 -8.90648c0,-1.47724 -0.178727,-2.47917 0.8232,-3.59939 1.23829,-1.35626 2.89115,-2.00687 4.66208,-2.00687 1.00225,0 2.06451,0.235937 3.06676,0.472305l0 -7.19588 -2.1828 -0.175716c-3.00922,0 -5.48538,1.47423 -6.36923,4.18676l0 -4.30774z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M188.867 95.9252l-0.17862 0c-1.18065,0.590274 -2.53692,0.88697 -3.83285,0.88697l-8.20071 0 0 0.175609c2.1828,1.82825 2.00719,3.54186 2.00719,6.31202l0 14.1584c0,2.77275 0.175609,4.42302 -2.00719,6.31192l0 0.175609 14.2767 0 0 -0.175609c-2.24313,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -8.84884c0,-2.41884 -0.532956,-6.42989 3.12407,-6.42989 3.5995,0 3.18752,3.9534 3.18752,6.42989l0 8.84884c0,2.77275 0.176039,4.42302 -2.00687,6.31192l0 0.175609 14.2768 0 0 -0.175609c-2.24323,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -9.73269c0,-2.24323 -0.178727,-5.54603 3.24505,-5.54603 3.36044,0 3.06643,3.18483 3.06643,5.54603l0 9.73269c0,2.77275 0.176039,4.42302 -2.00687,6.31192l0 0.175609 14.2768 0 0 -0.175609c-2.24323,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -11.858c0,-3.06643 -0.472305,-5.30698 -3.00912,-7.31384 -2.00428,-1.59263 -4.65906,-2.24022 -7.19631,-2.24022 -3.30237,0 -6.37225,0.941599 -8.61236,3.42077 -1.82857,-2.24313 -4.24741,-3.42077 -7.08092,-3.42077 -3.0061,0 -5.42505,1.1199 -7.13522,3.42077l0 -3.54175z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M188.867 95.9252l-0.17862 0c-1.18065,0.590274 -2.53692,0.88697 -3.83285,0.88697l-8.20071 0 0 0.175609c2.1828,1.82825 2.00719,3.54186 2.00719,6.31202l0 14.1584c0,2.77275 0.175609,4.42302 -2.00719,6.31192l0 0.175609 14.2767 0 0 -0.175609c-2.24313,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -8.84884c0,-2.41884 -0.532956,-6.42989 3.12407,-6.42989 3.5995,0 3.18752,3.9534 3.18752,6.42989l0 8.84884c0,2.77275 0.176039,4.42302 -2.00687,6.31192l0 0.175609 14.2768 0 0 -0.175609c-2.24323,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -9.73269c0,-2.24323 -0.178727,-5.54603 3.24505,-5.54603 3.36044,0 3.06643,3.18483 3.06643,5.54603l0 9.73269c0,2.77275 0.176039,4.42302 -2.00687,6.31192l0 0.175609 14.2768 0 0 -0.175609c-2.24323,-1.8889 -2.06451,-3.5995 -2.06451,-6.31192l0 -11.858c0,-3.06643 -0.472305,-5.30698 -3.00912,-7.31384 -2.00428,-1.59263 -4.65906,-2.24022 -7.19631,-2.24022 -3.30237,0 -6.37225,0.941599 -8.61236,3.42077 -1.82857,-2.24313 -4.24741,-3.42077 -7.08092,-3.42077 -3.0061,0 -5.42505,1.1199 -7.13522,3.42077l0 -3.54175z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M252.809 116.218c-2.95158,1.53456 -6.60861,3.00879 -9.91141,3.00879 -5.24934,0 -8.67312,-3.65671 -8.67312,-8.73044l18.2878 0c-0.175716,-9.0851 -4.65906,-14.4524 -13.9801,-14.4524 -8.20081,0 -14.4525,5.95758 -14.4525,14.216 0,4.42571 1.59263,8.84884 5.36774,11.5644 3.3028,2.41572 7.78615,2.88803 11.7972,2.88803 3.12719,0 6.42999,-0.590274 9.2635,-1.82846l2.30087 -6.66593zm-18.5845 -10.735c0.296696,-2.36109 1.71017,-4.30763 4.30774,-4.30763 2.83039,0 3.95071,2.00687 3.95071,4.30763l-8.25845 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M252.809 116.218c-2.95158,1.53456 -6.60861,3.00879 -9.91141,3.00879 -5.24934,0 -8.67312,-3.65671 -8.67312,-8.73044l18.2878 0c-0.175716,-9.0851 -4.65906,-14.4524 -13.9801,-14.4524 -8.20081,0 -14.4525,5.95758 -14.4525,14.216 0,4.42571 1.59263,8.84884 5.36774,11.5644 3.3028,2.41572 7.78615,2.88803 11.7972,2.88803 3.12719,0 6.42999,-0.590274 9.2635,-1.82846l2.30087 -6.66593zm-18.5845 -10.735c0.296696,-2.36109 1.71017,-4.30763 4.30774,-4.30763 2.83039,0 3.95071,2.00687 3.95071,4.30763l-8.25845 0z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M264.882 95.9252l-0.176039 0c-1.1199,0.650602 -2.41884,0.88697 -3.77478,0.88697l-8.25878 0 0 0.175609c2.1828,1.82825 2.00418,3.59907 2.00418,6.31202l0 14.1584c0,2.77275 0.17862,4.48335 -2.00418,6.31192l0 0.175609 14.2165 0 0 -0.175609c-2.1829,-1.82857 -2.00687,-3.5995 -2.00687,-6.31192l0 -8.90648c0,-1.47724 -0.176039,-2.47917 0.826211,-3.59939 1.23786,-1.35626 2.89115,-2.00687 4.66165,-2.00687 1.00236,0 2.06193,0.235937 3.06686,0.472305l0 -7.19588 -2.18247 -0.175716c-3.00922,0 -5.48571,1.47423 -6.37225,4.18676l0 -4.30774z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M264.882 95.9252l-0.176039 0c-1.1199,0.650602 -2.41884,0.88697 -3.77478,0.88697l-8.25878 0 0 0.175609c2.1828,1.82825 2.00418,3.59907 2.00418,6.31202l0 14.1584c0,2.77275 0.17862,4.48335 -2.00418,6.31192l0 0.175609 14.2165 0 0 -0.175609c-2.1829,-1.82857 -2.00687,-3.5995 -2.00687,-6.31192l0 -8.90648c0,-1.47724 -0.176039,-2.47917 0.826211,-3.59939 1.23786,-1.35626 2.89115,-2.00687 4.66165,-2.00687 1.00236,0 2.06193,0.235937 3.06686,0.472305l0 -7.19588 -2.18247 -0.175716c-3.00922,0 -5.48571,1.47423 -6.37225,4.18676l0 -4.30774z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M275.423 123.357c3.24516,0.708242 6.60818,1.35616 9.91098,1.35616 6.25159,0 15.0428,-1.76813 15.0428,-9.67236 0,-3.00912 -2.00687,-5.30999 -4.48346,-6.90219 -1.8889,-1.23829 -4.30774,-1.8889 -6.42989,-2.53681 -1.41691,-0.414665 -3.36345,-0.883959 -3.36345,-2.71554 0,-1.5922 2.30087,-1.88589 3.48142,-1.88589 2.65489,0 5.30999,0.826319 7.55021,2.30055l0 -6.13631c-3.00912,-0.705231 -6.07598,-1.1199 -9.14241,-1.1199 -3.06987,0 -6.2546,0.296696 -8.9668,1.8889 -2.71543,1.53187 -4.36538,3.95071 -4.36538,7.13555 0,7.96445 14.0982,8.20081 14.0982,12.1542 0,2.1828 -2.53724,2.59445 -4.18708,2.59445 -3.71747,0 -7.31653,-1.35626 -10.444,-3.24516l1.29895 6.78433z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M275.423 123.357c3.24516,0.708242 6.60818,1.35616 9.91098,1.35616 6.25159,0 15.0428,-1.76813 15.0428,-9.67236 0,-3.00912 -2.00687,-5.30999 -4.48346,-6.90219 -1.8889,-1.23829 -4.30774,-1.8889 -6.42989,-2.53681 -1.41691,-0.414665 -3.36345,-0.883959 -3.36345,-2.71554 0,-1.5922 2.30087,-1.88589 3.48142,-1.88589 2.65489,0 5.30999,0.826319 7.55021,2.30055l0 -6.13631c-3.00912,-0.705231 -6.07598,-1.1199 -9.14241,-1.1199 -3.06987,0 -6.2546,0.296696 -8.9668,1.8889 -2.71543,1.53187 -4.36538,3.95071 -4.36538,7.13555 0,7.96445 14.0982,8.20081 14.0982,12.1542 0,2.1828 -2.53724,2.59445 -4.18708,2.59445 -3.71747,0 -7.31653,-1.35626 -10.444,-3.24516l1.29895 6.78433z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M28.3172 101.177c0,0 8.36803,24.2742 8.4917,24.3949 0,0 6.38977,0 6.51344,0l12.4858 -40.2643 0 -0.175609 -9.97174 0 0 0.175609c1.12301,1.18065 2.00687,2.65521 2.00687,4.42571 0,1.47466 -0.590274,3.30323 -1.00193,4.71713l-4.95565 17.5792 -0.178727 0 -5.66088 -19.3474c-0.651032,-2.12526 -1.35927,-4.12912 -1.35927,-6.37225 0,-0.354336 0.117969,-0.76599 0.235937,-1.00236l0 -0.175609 -12.3875 0 0 0.175609c1.41648,1.12033 2.65478,4.30774 2.65478,6.07598 0,1.18065 -0.590274,3.30581 -0.883959,4.48335l-4.12901 16.1627 -0.178727 0 -7.19577 -26.84 0 -0.0576401 -12.8026 0 0 0.175609c2.12516,1.7106 3.06977,3.77511 3.83576,6.42999l6.42989 22.0628c1.18065,4.01115 3.80661,11.4031 3.93071,11.6508 0.0546291,0.109258 5.92306,-0.236368 7.98757,0l6.1333 -24.2742z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M28.3172 101.177c0,0 8.36803,24.2742 8.4917,24.3949 0,0 6.38977,0 6.51344,0l12.4858 -40.2643 0 -0.175609 -9.97174 0 0 0.175609c1.12301,1.18065 2.00687,2.65521 2.00687,4.42571 0,1.47466 -0.590274,3.30323 -1.00193,4.71713l-4.95565 17.5792 -0.178727 0 -5.66088 -19.3474c-0.651032,-2.12526 -1.35927,-4.12912 -1.35927,-6.37225 0,-0.354336 0.117969,-0.76599 0.235937,-1.00236l0 -0.175609 -12.3875 0 0 0.175609c1.41648,1.12033 2.65478,4.30774 2.65478,6.07598 0,1.18065 -0.590274,3.30581 -0.883959,4.48335l-4.12901 16.1627 -0.178727 0 -7.19577 -26.84 0 -0.0576401 -12.8026 0 0 0.175609c2.12516,1.7106 3.06977,3.77511 3.83576,6.42999l6.42989 22.0628c1.18065,4.01115 3.80661,11.4031 3.93071,11.6508 0.0546291,0.109258 5.92306,-0.236368 7.98757,0l6.1333 -24.2742z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M144.581 123.933c1.50875,0.564465 3.13321,0.780293 4.84919,0.780293l2.36109 -0.175609 2.41895 -5.13137c-5.07373,-0.12098 -4.89812,-3.36345 -4.89812,-7.31417l0 -4.72197c0,-3.4212 -0.293578,-6.84197 -3.24247,-9.0852 -2.30044,-1.70748 -5.42753,-2.24011 -8.20081,-2.24011 -2.53681,0 -5.01329,0.17862 -7.43181,0.826211l-2.77318 6.724c2.1829,-1.12033 5.0134,-1.94697 7.43224,-1.94697 1.47423,0 3.77511,0.651032 3.77511,2.4796 0,4.95565 -16.2206,1.35616 -16.2206,12.2695 0,2.71253 1.53187,5.48528 3.89039,6.90219 1.71318,1.05968 4.30774,1.4139 6.31461,1.4139l11.7255 -0.780293zm-4.728 -3.88738c-1.10022,-0.0345196 -3.26828,-0.193137 -3.59079,-0.247767 -1.47423,-0.247767 -2.64037,-2.0444 -2.64037,-4.1089 0,-1.94654 1.8889,-2.83093 3.36313,-3.53874l1.88621 -0.8874 0 1.94955c0,2.62037 -0.135497,4.80628 0.981818,6.83326z"
          />
          <path
            fill={theme.palette.primary.main}
            d="M144.581 123.933c1.50875,0.564465 3.13321,0.780293 4.84919,0.780293l2.36109 -0.175609 2.41895 -5.13137c-5.07373,-0.12098 -4.89812,-3.36345 -4.89812,-7.31417l0 -4.72197c0,-3.4212 -0.293578,-6.84197 -3.24247,-9.0852 -2.30044,-1.70748 -5.42753,-2.24011 -8.20081,-2.24011 -2.53681,0 -5.01329,0.17862 -7.43181,0.826211l-2.77318 6.724c2.1829,-1.12033 5.0134,-1.94697 7.43224,-1.94697 1.47423,0 3.77511,0.651032 3.77511,2.4796 0,4.95565 -16.2206,1.35616 -16.2206,12.2695 0,2.71253 1.53187,5.48528 3.89039,6.90219 1.71318,1.05968 4.30774,1.4139 6.31461,1.4139l11.7255 -0.780293zm-4.728 -3.88738c-1.10022,-0.0345196 -3.26828,-0.193137 -3.59079,-0.247767 -1.47423,-0.247767 -2.64037,-2.0444 -2.64037,-4.1089 0,-1.94654 1.8889,-2.83093 3.36313,-3.53874l1.88621 -0.8874 0 1.94955c0,2.62037 -0.135497,4.80628 0.981818,6.83326z"
          />
        </g>
      </svg>
    </Box>
  );
}

