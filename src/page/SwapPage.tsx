import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import SwapCoin from '../components/SwapCoin';

/**
 * Swap page component with fixed top bar and bottom bar, 
 * with adaptive content area in between
 */
function SwapPage() {
  return (
    <>
      <div className='mobile:w-screen tablet:w-screen flex flex-col h-screen bg-[#0d0e0f] text-primary'>
      {/* TopBar */}
      <TopBar />
      
      {/* content area - 占据 TopBar 和 BottomBar 之间的所有剩余空间 */}
      <div className='flex-1 min-h-0 overflow-y-auto'>
        <h2 className='mobile:text-2xl tablet:text-6xl font-bold text-center mobile:mt-2 tablet:mt-6 mobile:mb-6 tablet:mb-12'>Swap</h2>
        <section className='mx-4 tablet:mx-20'>
          <SwapCoin />
        </section>
        
      </div>
      
      {/* BottomBar */}
      <BottomBar />
    </div>
    </>
    
  );
}

export default SwapPage;