// SPDX-License-Identifier: UNLICENSED
// @Credits Unicrypt Network 2021

/**
    This contract creates the lock on behalf of each presale. This contract will be whitelisted to bypass the flat rate 
    ETH fee. Please do not use the below locking code in your own contracts as the lock will fail without the ETH fee
*/

pragma solidity 0.6.12;

import "./TransferHelper.sol";
import "./IERC20.sol";
import "./SafeMath.sol";

interface IIWETH {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function decimals() external view returns(uint);
}

interface IPresaleManage {
    function getCount () external view returns (uint256);
    function IsRegistered (address presale_addr) external view returns (bool);
}

interface IUniswapV2Factory {
    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function createPair(address tokenA, address tokenB) external returns (address pair);
}

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

interface IILpLocker {
    function lpLock(address token, uint256 amount, uint256 unlockTime, address _withdrawer) payable external;
    function price() external pure returns (uint256);
    event Hold(address indexed holder, address token, uint256 amount, uint256 unlockTime);
}

contract PresaleLockForwarder {
    
    using SafeMath for uint256;

    IILpLocker public lplocker;
    IUniswapV2Factory public uniswapfactory;
    IUniswapV2Router02 public uniswaprouter;

    IPresaleManage manage;
    IIWETH public WETH;

    mapping(address => address) public locked_lp_tokens;
    mapping(address => address) public locked_lp_owner;

    constructor(address _manage, address lplock_addrress, address unifactaddr, address unirouter, address wethaddr) public {
        lplocker = IILpLocker(lplock_addrress);
        uniswapfactory = IUniswapV2Factory(unifactaddr);
        uniswaprouter = IUniswapV2Router02(unirouter);
        WETH = IIWETH(wethaddr);
        manage = IPresaleManage(_manage);
    }

    /**
        Send in _token0 as the PRESALE token, _token1 as the BASE token (usually WETH) for the check to work. As anyone can create a pair,
        and send WETH to it while a presale is running, but no one should have access to the presale token. If they do and they send it to 
        the pair, scewing the initial liquidity, this function will return true
    */
    function uniswapPairIsInitialised (address _token0, address _token1) public view returns (bool) {
        address pairAddress = uniswapfactory.getPair(_token0, _token1);
        if (pairAddress == address(0)) {
            return false;
        }
        uint256 balance = IERC20(_token0).balanceOf(pairAddress);
        if (balance > 0) {
            return true;
        }
        return false;
    }
    
    // function lockLiquidity (IERC20 _saleToken, uint256 _unlock_date, address payable _withdrawer) payable external {
        
    //     require(msg.value >= lplocker.price(), 'Balance is insufficient');
        
    //     address pair = uniswapfactory.getPair(address(WETH), address(_saleToken));
        
    //     uint256 totalLPTokensMinted = IUniswapV2Pair(pair).balanceOf(address(this));
    //     require(totalLPTokensMinted != 0 , "LP creation failed");
    
    //     TransferHelper.safeApprove(pair, address(lplocker), totalLPTokensMinted);
    //     uint256 unlock_date = _unlock_date > 9999999999 ? 9999999999 : _unlock_date;
        
    //     lplocker.lpLock{value:lplocker.price()}(pair, totalLPTokensMinted, unlock_date, _withdrawer );

    //     lptokens[msg.sender] = pair;
    // }

    function lockLiquidity (address _saleToken, uint256 _baseAmount, uint256 _saleAmount, uint256 _unlock_date, address payable _withdrawer) payable external {
        require(manage.IsRegistered(msg.sender), 'PRESALE NOT REGISTERED');
        require(msg.value >= lplocker.price().add(_baseAmount), 'Balance is insufficient');
        
        // if (pair == address(0)) {
        //     uniswapfactory.createPair(address(WETH), address(_saleToken));
        //     pair = uniswapfactory.getPair(address(WETH), address(_saleToken));
        // }
        
        // require(WETH.transferFrom(msg.sender, address(this), _baseAmount), 'WETH transfer failed.');
        // TransferHelper.safeTransferFrom(address(_baseToken), msg.sender, address(pair), _baseAmount);
        TransferHelper.safeTransferFrom(address(_saleToken), msg.sender, address(this), _saleAmount);
        // IUniswapV2Pair(pair).mint(address(this));
        // return;
        // require(WETH.approve(address(uniswaprouter), _baseAmount), 'router approve failed.');
        // _saleToken.approve(address(uniswaprouter), _saleAmount);
        TransferHelper.safeApprove(address(_saleToken), address(uniswaprouter), _saleAmount);
        // construct token path
        // address[] memory path = new address[](2);
        // path[0] = address(WETH);
        // path[1] = address(_saleToken);

        // IUniswapV2Router02(uniswaprouter).swapExactTokensForTokens(
        //     WETH.balanceOf(address(this)).div(2),
        //     0,
        //     path,
        //     address(this),
        //     block.timestamp + 5 minutes
        // );
        
        // // calculate balances and add liquidity
        // uint256 wethBalance = WETH.balanceOf(address(this));
        // uint256 balance = _saleToken.balanceOf(address(this));
        
        // IUniswapV2Router02(uniswaprouter).addLiquidity(
        //     address(_saleToken),
        //     address(WETH),
        //     balance,
        //     wethBalance,
        //     0,
        //     0,
        //     address(this),
        //     block.timestamp + 5 minutes
        // );
        
        IUniswapV2Router02(address(uniswaprouter)).addLiquidityETH{value: _baseAmount}(
                address(_saleToken),
                _saleAmount,
                0,
                0,
                payable(address(this)),
                block.timestamp + 5 minutes
            );
            
        address pair = uniswapfactory.getPair(address(WETH), address(_saleToken));
        
        uint256 totalLPTokensMinted = IUniswapV2Pair(pair).balanceOf(address(this));
        require(totalLPTokensMinted != 0 , "LP creation failed");
    
        TransferHelper.safeApprove(pair, address(lplocker), totalLPTokensMinted);
        uint256 unlock_date = _unlock_date > 9999999999 ? 9999999999 : _unlock_date;
        
        lplocker.lpLock{value:lplocker.price()}(pair, totalLPTokensMinted, unlock_date, _withdrawer );

        locked_lp_tokens[address(_saleToken)] = pair;
        locked_lp_owner[address(_saleToken)] = _withdrawer;

        payable(_withdrawer).transfer(address(this).balance);
    }
    
}