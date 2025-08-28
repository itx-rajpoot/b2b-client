import * as React from 'react';

function CameraUploadIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg"       
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <defs>
        <clipPath id="prefix__a">
          <path data-name="Rectangle 32" transform="translate(39 43)" fill="#fff" d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
      <g data-name="Mask Group 17" transform="translate(-39 -43)" clipPath="url(#prefix__a)">
        <g data-name="Group 5289">
          <g data-name="Group 5288" fill="#fff">
            <path
              data-name="Path 5410"
              d="M60.913 49.261h-3.308L55.7 47.174h-7.3V50.3h-3.139v3.13H42.13v10.44a2.093 2.093 0 002.087 2.087h16.7A2.093 2.093 0 0063 63.87V51.348a2.093 2.093 0 00-2.087-2.087zm-8.348 13.565a5.217 5.217 0 115.217-5.217 5.219 5.219 0 01-5.217 5.217z"
            />
            <path data-name="Path 5411" d="M42.13 52.391h2.087v-3.13h3.13v-2.087h-3.13v-3.131H42.13v3.13H39v2.088h3.13z" />
            <path data-name="Path 5412" d="M52.565 54.27a3.336 3.336 0 00-3.339 3.339 3.339 3.339 0 103.339-3.339z" />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default CameraUploadIcon;
