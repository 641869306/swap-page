/**
 * top back component
 */
import arrowIcon from '../assets/icons/arrow.svg';
function TopBar() {
    
  return (
    <div className="flex items-center gap-2 flex-shrink-0 p-4">
      <img src={arrowIcon} alt="arrow" className="w-3 h-3 tablet:w-6 tablet:h-6" />
      <span className="text-subtext text-sm tablet:text-xl">Back</span>
    </div>
  );
}

export default TopBar;