import React, { useState, useMemo, useEffect } from 'react';
import assetsData from '../utils/assets.json';
import SelectPop from './SelectPop';

// Icons
import switchIcon from '../assets/icons/switch.svg';
import dropdownIcon from '../assets/icons/dropdown.svg';

// Tokens
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
import cnyIcon from '../assets/icons/currencies/rmb.png'; // rmb.png for CNY
import eurIcon from '../assets/icons/currencies/eur.png';

// Map symbols to icons
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

function SwapCoin() {
    const [fromId, setFromId] = useState(''); // WBTC
    const [toId, setToId] = useState('6');   // USD
    const [preSwapAmount, setPreSwapAmount] = useState('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [selectType, setSelectType] = useState<'from' | 'to'>('from');

    // Get full asset objects
    const fromAsset = useMemo(() => assetsData.find(a => a.id === fromId) || assetsData[0], [fromId]);
    const toAsset = useMemo(() => assetsData.find(a => a.id === toId) || assetsData[5], [toId]);

    // Calculate output
    const fromPrice = parseFloat(fromAsset.usdValue);
    const toPrice = parseFloat(toAsset.usdValue);
    const rate = fromPrice / toPrice;
    
    const [swapedAmount, setSwapedAmount] = useState(0.00);
    
    // Format numbers
    const formatBalance = (val: string) => parseFloat(val).toString(); // simple strip zeros
    const formatOutput = (val: number) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });

    const openSelect = (type: 'from' | 'to') => {
        setSelectType(type);
        setIsSelectOpen(true);
    };

    const handleAssetSelect = (asset: typeof assetsData[0]) => {
        if (selectType === 'from') {
            setFromId(asset.id);
        } else {
            setToId(asset.id);
        }
        setPreSwapAmount('');
        setIsSelectOpen(false);
    };

    const handleSwap = () => {
        const newFromBalance = parseFloat(toAsset.balance);
        let nextAmount = swapedAmount;
        if (nextAmount > newFromBalance) {
            nextAmount = newFromBalance;
        }
        setFromId(toId);
        setToId(fromId);
        setPreSwapAmount(nextAmount > 0 ? nextAmount.toString() : '');
    };
    /**
     * Set default from asset
     */
    const setDefaultFromAsset = () => {
        setFromId(assetsData[0].id);
        setPreSwapAmount('');
    };

    /**
     * Set default to asset
     */
    const setDefaultToAsset = () => {
        setToId(assetsData[5].id);
        setPreSwapAmount('');
    };
    useEffect(() => {
        setDefaultFromAsset();
        setDefaultToAsset();
    }, []);

    // Auto-calculate swapedAmount when preSwapAmount or rate changes
    useEffect(() => {
        const parts = preSwapAmount.split('.');
        if (parts.length === 2 && parts[1].length > 5) {
            setSwapedAmount(0);
            return;
        }
        const amount = parseFloat(preSwapAmount);
        if (!isNaN(amount) && amount >= 0 && rate > 0) {
            setSwapedAmount(Number(parseFloat((amount * rate).toFixed(5))));
        } else {
            setSwapedAmount(0);
        }
    }, [preSwapAmount, rate]);

    const isValidInput = useMemo(() => {
        const val = parseFloat(preSwapAmount);
        return !isNaN(val) && val > 0;
    }, [preSwapAmount]);

    return (
        <div className=" mobile:w-full tablet:w-full mx-auto">
            {/* Main Card */}
            <div className="rounded-2xl p-4 border border-[#5c5c5c] border-solid bg-transparent relative overflow-hidden">
                
                {/* From Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-subtext text-sm font-medium items-end">
                        <span className="text-primary text-lg font-bold">From</span>
                        <span className="text-subtext text-xs font-medium">Balance: {formatBalance(fromAsset.balance)}</span>
                    </div>
                    
                    
                    <div className="flex justify-between items-center">
                        {/* Coin Selector */}
                        <button 
                            onTouchStart={() => openSelect('from')}
                            className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer hover:opacity-80"
                        >
                            <img src={iconMap[fromAsset.symbol]} alt={fromAsset.symbol} className="w-5 h-5 rounded-full" />
                            <span className="text-primary text-xs font-bold">{fromAsset.symbol}</span>
                            <img src={dropdownIcon} alt="v" className="w-3 h-4 opacity-60" />
                        </button>

                        {/* Input Area */}
                        <div className="flex flex-col items-end">
                            <input 
                                type="number" 
                                value={preSwapAmount}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Max length check could be added here if needed
                                    const valNum = parseFloat(val);
                                    const balNum = parseFloat(fromAsset.balance);
                                    if (!isNaN(valNum) && !isNaN(balNum) && valNum > balNum) {
                                        setPreSwapAmount(fromAsset.balance);
                                    } else {
                                        setPreSwapAmount(val);
                                    }
                                }}
                                className="bg-transparent text-right text-2xl font-bold text-primary outline-none w-40 placeholder-gray-600 m-0 p-0 border-none no-spinners"
                                placeholder="0"
                            />
                            <button 
                                onTouchStart={() => setPreSwapAmount(fromAsset.balance)}
                                className="text-xs font-bold text-[#c4ff48] border border-[#c4ff48] rounded-lg px-2 mt-1  transition-colors"
                            >
                                MAX
                            </button>
                        </div>
                    </div>
                </div>

                {/* Divider & Switch */}
                <div className="relative h-12 flex items-center justify-center">
                    <div className="absolute w-full h-[1px] bg-[#333]"></div>
                    <button 
                        onTouchStart={handleSwap}
                        className="relative z-10 bg-[#0d0e0f] border border-[#333] rounded-full p-2 cursor-pointer hover:border-[#c4ff48] transition-colors group"
                    >
                        <img src={switchIcon} alt="switch" className="w-4 h-4 group-hover:scale-110 transition-transform rotate-90" />
                    </button>
                </div>

                {/* To Section */}
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-subtext text-sm font-medium items-end">
                        <span className="text-primary text-lg font-bold">To</span>
                        <span className="text-subtext text-xs font-medium">Balance: {formatBalance(toAsset.balance)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                        {/* Coin Selector */}
                        <button 
                            onTouchStart={() => openSelect('to')}
                            className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer hover:opacity-80"
                        >
                            <img src={iconMap[toAsset.symbol]} alt={toAsset.symbol} className="w-5 h-5 rounded-full" />
                            <span className="text-primary text-xs font-bold">{toAsset.symbol}</span>
                            <img src={dropdownIcon} alt="v" className="w-3 h-4 opacity-60" />
                        </button>

                        {/* Output Area */}
                        <div className="flex flex-col items-end">
                            <input 
                                type="number" 
                                value={swapedAmount > 0 ? Number(parseFloat(swapedAmount.toFixed(5))) : ''}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (!val) {
                                        setSwapedAmount(0.00);
                                        setPreSwapAmount('');
                                        return;
                                    }
                                    const parts = val.split('.');
                                    if (parts.length === 2 && parts[1].length > 5) {
                                        setPreSwapAmount('');
                                        return;
                                    }
                                    const num = parseFloat(val);
                                    if (!isNaN(num) && num > 0 && rate > 0) {
                                        const newPre = num / rate;
                                        setPreSwapAmount(parseFloat(newPre.toFixed(5)).toString());
                                    }
                                }}
                                className="bg-transparent text-right text-2xl font-bold text-primary outline-none w-40 placeholder-gray-600 m-0 p-0 border-none no-spinners"
                                placeholder="0.00"
                            />
                            <span className="text-xs text-subtext mt-1">
                                1 {fromAsset.symbol} : {formatOutput(rate)} {toAsset.symbol}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-4 px-2 w-full">
                <div className="flex justify-between items-center text-subtext text-sm mb-6">
                    <span>Fee:</span>
                    <span>Waived</span>
                </div>

                <p className="text-subtext text-sm leading-relaxed mb-6">
                    * Exchange rates may vary with market changes. Final amounts depend on current rates and are not guaranteed. Users accept the risk of rate fluctuations.
                </p>
               
                <div className="w-full px-2">
                    <button 
                        disabled={!isValidInput}
                        className={`w-full font-[600] text-base p-2 rounded-lg transition-all ${
                            isValidInput 
                            ? "bg-actived text-black hover:opacity-90 shadow-[0_0_15px_rgba(196,255,72,0.3)]" 
                            : "bg-[#282828] text-[#000000] cursor-not-allowed"
                        }`}
                    >
                        {isValidInput ? "Preview" : "Incorrect Order"}
                    </button>
                </div>
                
            </div>
            
            {isSelectOpen && (
                <SelectPop 
                    onClose={() => setIsSelectOpen(false)} 
                    onSelect={handleAssetSelect} 
                    excludeId={selectType === 'from' ? toId : fromId}
                />
            )}
        </div>
    );
}

export default SwapCoin;
