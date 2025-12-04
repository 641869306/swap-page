/**
 * bottom navigation component
 */
import { useState } from 'react';
import homeIcon from '../assets/icons/menu/home.svg';
import homeHighlightedIcon from '../assets/icons/menu/homeHighlighted.svg';
import promotionsIcon from '../assets/icons/menu/promotions.svg';
import promotionsHighlightedIcon from '../assets/icons/menu/promotionsHighlighted.svg';
import supportIcon from '../assets/icons/menu/support.svg';
import supportHighlightedIcon from '../assets/icons/menu/supportHighlighted.svg';
import assetsIcon from '../assets/icons/menu/assets.svg';
import assetsHighlightedIcon from '../assets/icons/menu/assetsHighlighted.svg';
import profileIcon from '../assets/icons/menu/profile.svg';
import profileHighlightedIcon from '../assets/icons/menu/profileHighlighted.svg';

function BottomBar() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const navItems = [
    {
      
      icon: homeIcon,
      activeIcon: homeHighlightedIcon,
      label: 'Home',
      path: '/',
    },
    {
      icon: promotionsIcon,
      activeIcon: promotionsHighlightedIcon,
      label: 'Promotions',
      path: '/',
    },
    {
      icon: supportIcon,
      activeIcon: supportHighlightedIcon,
      label: 'Support',
      path: '/',
    },
    {
      icon: assetsIcon,
      activeIcon: assetsHighlightedIcon,
      label: 'Assets',
      path: '/',
    },
    {
      icon: profileIcon,
      activeIcon: profileHighlightedIcon,
      label: 'Profile',
      path: '/',
    },
  ];

  /**
   * Handle navigation item click or touch
   * @param index - The index of the clicked navigation item
   */
  const handleItemClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <nav className="w-full bg-black pb-safe-bottom">
      <ul className="flex items-center justify-between tablet:justify-center tablet:gap-16 px-6 tablet:px-12 py-4 tablet:py-6">
        {navItems.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <li
              key={item.label}
              onTouchStart={() => handleItemClick(index)}
              className={`
                flex flex-col items-center justify-center gap-1
                cursor-pointer
                transition-all duration-300 ease-in-out
                ${isActive 
                  ? 'bg-actived w-12 h-12 tablet:w-20 tablet:h-14 rounded-2xl' 
                  : 'bg-transparent'
                }
              `}
            >
              <img
                src={isActive ? item.activeIcon : item.icon}
                alt={item.label}
                className={`
                  transition-all duration-300 ease-in-out
                  ${isActive ? 'w-6 h-6 tablet:w-8 tablet:h-8' : 'w-5 h-5 tablet:w-9 tablet:h-9'}
                `}
              />
              <span
                className={`
                  text-primary text-xs tablet:text-lg font-medium whitespace-nowrap
                  transition-all duration-300 ease-in-out 
                  ${isActive 
                    ? 'opacity-0 max-h-0 w-0 overflow-hidden' 
                    : 'opacity-100 max-h-6 mt-1'
                  }
                `}
              >
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default BottomBar;