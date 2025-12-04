import React, { useState, useMemo } from 'react';
import assetsData from '../utils/assets.json';
import { debounce } from '../utils/tools';

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
 * Displays a bottom sheet to select a token from assets list.
 * Supports searching by name or symbol.
 */
function SelectPop({ onClose, onSelect, excludeId }: SelectPopProps) {
    const [inputValue, setInputValue] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

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
                    <div className="w-12 h-1 bg-[#333] rounded-full" onClick={onClose}></div>
                </div>

                {/* Header & Search */}
                <div className="px-4 pb-2">
                    <h2 className="text-center font-bold text-lg mb-4 mt-2">Select Token</h2>
                    
                    <div className="bg-[#1e1f20] rounded-xl p-3 flex items-center border border-[#333] focus-within:border-[#c4ff48] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-subtext mr-2">
                            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <input 
                            type="text" 
                            placeholder="Search"
                            className="bg-transparent w-full outline-none text-primary placeholder-subtext text-sm"
                            value={inputValue}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                {/* Token List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-2 overscroll-contain scroll-touch">
                    {filteredAssets.map(asset => (
                        <div 
                            key={asset.id} 
                            onClick={() => onSelect(asset)}
                            className="flex justify-between items-center p-3 hover:bg-[#1e1f20] rounded-xl cursor-pointer transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <img 
                                    src={iconMap[asset.symbol]} 
                                    alt={asset.symbol} 
                                    className="w-7 h-7 rounded-full"
                                />
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">{asset.name}</span>
                                    <span className="text-sm text-subtext uppercase">{asset.symbol}</span>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-end">
                                <span className="font-medium text-sm">{parseFloat(asset.balance) > 0 ? asset.balance : '0'}</span>
                                <span className="text-xs text-subtext">≈ ${asset.usdValue}</span>
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
