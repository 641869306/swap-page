import React, { useState, useMemo, useEffect } from 'react';
import assetsData from '../utils/assets.json';
import { debounce } from '../utils/tools';
import searchIcon from '../assets/icons/search.svg';
// Icons
import btcIcon from '../assets/icons/tokens/btc.svg';
import ethIcon from '../assets/icons/tokens/eth.svg';
import usdtIcon from '../assets/icons/tokens/usdt.svg';
import usdcIcon from '../assets/icons/tokens/usdc.svg';
import dogeIcon from '../assets/icons/tokens/doge.svg';

// Currencies
import usdIcon from '../assets/icons/currencies/usd.png';
import jpyIcon from '../assets/icons/currencies/jpy.png';
import hkdIcon from '../assets/icons/currencies/hkd.png';
import gbpIcon from '../assets/icons/currencies/gbp.png';
import cnyIcon from '../assets/icons/currencies/rmb.png';
import eurIcon from '../assets/icons/currencies/eur.png';


/**
 * Map symbols to icons
 */
const iconMap: Record<string, string> = {
    WBTC: btcIcon,
    ETH: ethIcon,
    USDT: usdtIcon,
    USDC: usdcIcon,
    DOGE: dogeIcon,
    USD: usdIcon,
    JPY: jpyIcon,
    HKD: hkdIcon,
    GBP: gbpIcon,
    CNY: cnyIcon,
    EUR: eurIcon
};

interface SelectPopProps {
    /** Function to close the popup */
    onClose: () => void;
    /** Function called when an asset is selected */
    onSelect: (asset: typeof assetsData[0]) => void;
    /** ID of the asset to exclude from the list */
    excludeId?: string;
}

/**
 * SelectPop component
 */
function SelectPop({ onClose, onSelect, excludeId }: SelectPopProps) {
    const [inputValue, setInputValue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    // Debounce the search keyword update
    const handleSearchDebounced = useMemo(
        () => debounce((value: string) => {
            setSearchKeyword(value);
        }, 300),
        []
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);
        handleSearchDebounced(val);
    };

    const filteredAssets = useMemo(() => {
        let data = assetsData;
        
        // Filter out excluded asset
        if (excludeId) {
            data = data.filter(a => a.id !== excludeId);
        }

        if (!searchKeyword) return data;
        const lower = searchKeyword.toLowerCase();
        return data.filter(a => 
            a.symbol.toLowerCase().includes(lower) || 
            a.name.toLowerCase().includes(lower)
        );
    }, [searchKeyword, excludeId]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end font-sans">
            {/* Mask - Click to close */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" 
                onClick={onClose}
            />
            
            {/* Content Container - 60% height */}
            <div className="relative z-10 bg-[#131415] rounded-t-2xl h-[60%] flex flex-col overflow-hidden text-primary border-t border-[#333] shadow-2xl animate-slide-up">
                
                {/* Handle bar for visual cue */}
                <div className="flex justify-center pt-3 pb-1">
                    <div className="w-12 tablet:w-24 h-1 tablet:h-2 bg-[#e1e3e3] rounded-full" onClick={onClose}></div>
                </div>

                {/* Header & Search */}
                <div className="px-4 tablet:px-6 pb-2">
                    <h2 className="text-center font-bold text-lg tablet:text-3xl mb-4 tablet:mb-6 mt-2 tablet:mt-3">Select Token</h2>
                    
                    <div className="bg-[#1e1f20] rounded-xl p-3 tablet:p-4 flex items-center border border-[#333] focus-within:border-[#c4ff48] transition-colors ">
                        <span className='w-6 h-6 tablet:w-8 tablet:h-8 flex items-center justify-center'>
                            <img src={searchIcon} alt="search" className="w-4 h-4 tablet:w-6 tablet:h-6" />
                        </span>
                        
                        <input 
                            type="text" 
                            placeholder="Search"
                            className="bg-transparent w-full outline-none text-primary placeholder-subtext text-sm tablet:text-xl"
                            value={inputValue}
                            onChange={handleInputChange}
                            maxLength={20}
                        />
                    </div>
                </div>

                {/* Token List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-2  tablet:px-6 overscroll-contain scroll-touch">
                    {filteredAssets.map(asset => (
                        <div 
                            key={asset.id} 
                            onClick={() => onSelect(asset)}
                            className="flex justify-between items-center  p-3 tablet:p-4 hover:bg-[#1e1f20] rounded-xl cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center gap-3 tablet:gap-6">
                                <img 
                                    src={iconMap[asset.symbol]} 
                                    alt={asset.symbol} 
                                    className="w-7 h-7 tablet:w-12 tablet:h-12 rounded-full"
                                />
                                <div className="flex flex-col gap-1 tablet:gap-2">
                                    <span className="font-bold text-lg tablet:text-2xl">{asset.name}</span>
                                    <span className="text-sm tablet:text-lg font-bold text-subtext uppercase">{asset.symbol}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end gap-1 tablet:gap-2">
                                <span className="font-bold text-sm tablet:text-2xl">{parseFloat(asset.balance) > 0 ? asset.balance : '0'}</span>
                                <span className="text-sm tablet:text-lg font-bold text-subtext">≈ ${asset.usdValue}</span>
                            </div>
                        </div>
                    ))}
                    
                    {filteredAssets.length === 0 && (
                        <div className="text-center text-subtext py-8">
                            No tokens found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SelectPop;
