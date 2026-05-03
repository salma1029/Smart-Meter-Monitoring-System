import React from 'react';
import { Svg, Path, G, Mask, Defs, LinearGradient, Stop } from 'react-native-svg';
import colors from '../../utils/colors';

const Icon = ({ name, size = 24, color = colors.text, style }) => {
  const renderPath = () => {
    switch (name) {
      case 'dashboard':
        return (
          <Path d="M17.4967 9.16498H15.4305C15.0663 9.1642 14.712 9.28271 14.4216 9.50239C14.1312 9.72207 13.9207 10.0308 13.8224 10.3814L11.8644 17.3468C11.8518 17.3901 11.8255 17.4281 11.7895 17.4551C11.7534 17.4822 11.7095 17.4968 11.6645 17.4968C11.6194 17.4968 11.5756 17.4822 11.5395 17.4551C11.5034 17.4281 11.4771 17.3901 11.4645 17.3468L6.86536 0.983148C6.85274 0.939882 6.82643 0.901876 6.79037 0.874835C6.75432 0.847793 6.71046 0.833176 6.66539 0.833176C6.62033 0.833191 6.57647 0.847793 6.54042 0.874835C6.50436 0.901876 6.47805 0.939882 6.46543 0.983148L4.50746 7.94854C4.40953 8.29777 4.20033 8.60551 3.91162 8.82506C3.62291 9.0446 3.27045 9.16394 2.90775 9.16498H0.83313" stroke={color} strokeWidth="1.66636" strokeLinecap="round" strokeLinejoin="round"/>
        );
      case 'bolt':
        return (
          <Path d="M3.33841 21.667C3.02308 21.6681 2.71391 21.5797 2.44683 21.4121C2.17975 21.2444 1.96572 21.0044 1.8296 20.72C1.69349 20.4355 1.64088 20.1183 1.67788 19.8051C1.71488 19.492 1.83999 19.1958 2.03865 18.9509L18.5356 1.95399C18.6594 1.81115 18.828 1.71463 19.0138 1.68026C19.1997 1.64589 19.3917 1.67573 19.5583 1.76486C19.725 1.854 19.8564 1.99714 19.9309 2.17079C20.0055 2.34445 20.0188 2.53829 19.9687 2.72051L16.7693 12.752C16.6749 13.0045 16.6433 13.2761 16.677 13.5435C16.7106 13.811 16.8087 14.0662 16.9627 14.2874C17.1168 14.5086 17.3221 14.6892 17.5613 14.8136C17.8004 14.938 18.0661 15.0025 18.3357 15.0016H30.0002C30.3155 15.0005 30.6247 15.0889 30.8918 15.2566C31.1589 15.4242 31.3729 15.6642 31.509 15.9487C31.6451 16.2331 31.6977 16.5503 31.6607 16.8635C31.6237 17.1767 31.4986 17.4729 31.3 17.7178L14.803 34.7146C14.6792 34.8575 14.5106 34.954 14.3248 34.9884C14.1389 35.0227 13.9469 34.9929 13.7803 34.9038C13.6136 34.8146 13.4822 34.6715 13.4077 34.4978C13.3331 34.3242 13.3198 34.1303 13.3699 33.9481L16.5693 23.9166C16.6637 23.6641 16.6953 23.3925 16.6617 23.1251C16.628 22.8577 16.5299 22.6024 16.3759 22.3812C16.2218 22.16 16.0165 21.9795 15.7773 21.8551C15.5382 21.7307 15.2725 21.6662 15.0029 21.667H3.33841Z" fill={color} stroke={color}/>
        );
      case 'user':
        return (
          <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
            <Path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
          </G>
        );
      case 'bell':
        return (
          <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </G>
        );
      case 'home':
        return (
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        );
      case 'trending-up':
        return (
          <Path d="M23 6l-9.5 9.5-5-5L1 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        );
      case 'cpu':
        return (
           <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M16 17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10z" />
            <Path d="M15 1h-6" />
            <Path d="M15 23h-6" />
            <Path d="M1 15v-6" />
            <Path d="M23 15v-6" />
          </G>
        );
      case 'eye':
        return (
          <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <Path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
          </G>
        );
      case 'eye-off':
        return (
          <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <Path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <Path d="M1 1l22 22" />
          </G>
        );
      case 'arrow-left':
        return (
          <G stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <Path d="M19 12H5" />
            <Path d="M12 19l-7-7 7-7" />
          </G>
        );
      default:
        return null;
    }
  };

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
    >
      {renderPath()}
    </Svg>
  );
};

export default Icon;
