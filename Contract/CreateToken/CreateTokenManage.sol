    // SPDX-License-Identifier: UNLICENSED
    // @Credits Unicrypt Network 2021
    
    // This contract generates Presale01 contracts and registers them in the PresaleFactory.
    // Ideally you should not interact with this contract directly, and use the Octofi presale app instead so warnings can be shown where necessary.
    
    pragma solidity 0.8.4;
    
    import "./StandardToken.sol";
    import "./LiquidityToken.sol";

    /**
     * @dev Wrappers over Solidity's arithmetic operations with added overflow
     * checks.
     *
     * Arithmetic operations in Solidity wrap on overflow. This can easily result
     * in bugs, because programmers usually assume that an overflow raises an
     * error, which is the standard behavior in high level programming languages.
     * `SafeMath` restores this intuition by reverting the transaction when an
     * operation overflows.
     *
     * Using this library instead of the unchecked operations eliminates an entire
     * class of bugs, so it's recommended to use it always.
     */
    // library SafeMath {
    //     /**
    //      * @dev Returns the addition of two unsigned integers, reverting on
    //      * overflow.
    //      *
    //      * Counterpart to Solidity's `+` operator.
    //      *
    //      * Requirements:
    //      *
    //      * - Addition cannot overflow.
    //      */
    //     function add(uint256 a, uint256 b) internal pure returns (uint256) {
    //         uint256 c = a + b;
    //         require(c >= a, "SafeMath: addition overflow");
    
    //         return c;
    //     }
    
    //     /**
    //      * @dev Returns the subtraction of two unsigned integers, reverting on
    //      * overflow (when the result is negative).
    //      *
    //      * Counterpart to Solidity's `-` operator.
    //      *
    //      * Requirements:
    //      *
    //      * - Subtraction cannot overflow.
    //      */
    //     function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    //         return sub(a, b, "SafeMath: subtraction overflow");
    //     }
    
    //     /**
    //      * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
    //      * overflow (when the result is negative).
    //      *
    //      * Counterpart to Solidity's `-` operator.
    //      *
    //      * Requirements:
    //      *
    //      * - Subtraction cannot overflow.
    //      */
    //     function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    //         require(b <= a, errorMessage);
    //         uint256 c = a - b;
    
    //         return c;
    //     }
    
    //     /**
    //      * @dev Returns the multiplication of two unsigned integers, reverting on
    //      * overflow.
    //      *
    //      * Counterpart to Solidity's `*` operator.
    //      *
    //      * Requirements:
    //      *
    //      * - Multiplication cannot overflow.
    //      */
    //     function mul(uint256 a, uint256 b) internal pure returns (uint256) {
    //         // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
    //         // benefit is lost if 'b' is also tested.
    //         // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
    //         if (a == 0) {
    //             return 0;
    //         }
    
    //         uint256 c = a * b;
    //         require(c / a == b, "SafeMath: multiplication overflow");
    
    //         return c;
    //     }
    
    //     /**
    //      * @dev Returns the integer division of two unsigned integers. Reverts on
    //      * division by zero. The result is rounded towards zero.
    //      *
    //      * Counterpart to Solidity's `/` operator. Note: this function uses a
    //      * `revert` opcode (which leaves remaining gas untouched) while Solidity
    //      * uses an invalid opcode to revert (consuming all remaining gas).
    //      *
    //      * Requirements:
    //      *
    //      * - The divisor cannot be zero.
    //      */
    //     function div(uint256 a, uint256 b) internal pure returns (uint256) {
    //         return div(a, b, "SafeMath: division by zero");
    //     }
    
    //     /**
    //      * @dev Returns the integer division of two unsigned integers. Reverts with custom message on
    //      * division by zero. The result is rounded towards zero.
    //      *
    //      * Counterpart to Solidity's `/` operator. Note: this function uses a
    //      * `revert` opcode (which leaves remaining gas untouched) while Solidity
    //      * uses an invalid opcode to revert (consuming all remaining gas).
    //      *
    //      * Requirements:
    //      *
    //      * - The divisor cannot be zero.
    //      */
    //     function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    //         require(b > 0, errorMessage);
    //         uint256 c = a / b;
    //         // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    
    //         return c;
    //     }
    
    //     /**
    //      * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
    //      * Reverts when dividing by zero.
    //      *
    //      * Counterpart to Solidity's `%` operator. This function uses a `revert`
    //      * opcode (which leaves remaining gas untouched) while Solidity uses an
    //      * invalid opcode to revert (consuming all remaining gas).
    //      *
    //      * Requirements:
    //      *
    //      * - The divisor cannot be zero.
    //      */
    //     function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    //         return mod(a, b, "SafeMath: modulo by zero");
    //     }
    
    //     /**
    //      * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
    //      * Reverts with custom message when dividing by zero.
    //      *
    //      * Counterpart to Solidity's `%` operator. This function uses a `revert`
    //      * opcode (which leaves remaining gas untouched) while Solidity uses an
    //      * invalid opcode to revert (consuming all remaining gas).
    //      *
    //      * Requirements:
    //      *
    //      * - The divisor cannot be zero.
    //      */
    //     function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
    //         require(b != 0, errorMessage);
    //         return a % b;
    //     }
    // }
    
    contract CreateMange {
        using SafeMath for uint256;
        
        struct feeInfo {
            uint256 normal;
            uint256 mint;
            uint256 burn;
            uint256 pause;
            uint256 blacklist;
            uint256 deflation;
        }

        address public owner;
        
        // address factory_address;
        address router_address;
        
        mapping(address => address[]) tokens;
        
        feeInfo public fee;

        event OwnerWithdrawSuccess(uint value);
        event CreateStandardSuccess(address);
        event setOwnerSucess(address);
        event createLiquditySuccess(address);
        event InitFeeSuccess();
    
        // constructor(address _owner, address factory_addr, address router_Addr) {
        constructor(address _owner, address router_Addr) {
            
            owner = _owner;
    
            // factory_address = factory_addr;
            router_address = router_Addr;
        }
        
        function setOwner (address newowner) public {
            require(msg.sender == owner, "Only manager can do it");
            owner = newowner;
            emit setOwnerSucess(owner);
        }
    
        function ownerWithdraw() public {
            require(msg.sender == owner, "Only manager can withdraw");
            address payable reciever = payable(owner);
            reciever.transfer(address(this).balance);
            // owner.transfer(address(this).balance);
            emit OwnerWithdrawSuccess(address(this).balance);
        }
        
        function initFee(uint256 normal, uint256 mint, uint256 burn, uint256 pause, uint256 blacklist, uint256 deflation) public {
            fee.normal = normal;
            fee.mint = mint;
            fee.burn = burn;
            fee.pause = pause;
            fee.blacklist = blacklist;
            fee.deflation = deflation;
            emit InitFeeSuccess();
        }
        
         /*
         * @notice Creates a new Presale contract and registers it in the PresaleFactory.sol.
         */

        function createStandard  (
            address creator_,string memory name_, string memory symbol_,uint8 decimals_, uint256 tokenSupply_,
                uint256 _canmint, uint256 _canburn, uint256 _canpause, uint256 _canBlacklist
            ) public payable {
            
            uint256 totalfee = fee.normal;
            
            if(_canmint > 0) {
                totalfee = totalfee + fee.mint;
            }
            
            if(_canburn > 0) {
                totalfee = totalfee + fee.burn;
            }
            
            if(_canpause > 0) {
                totalfee = totalfee + fee.pause;
            }
            
            if(_canBlacklist > 0) {
                totalfee = totalfee + fee.blacklist;
            }
            
            require(msg.value >= totalfee, "Balance is insufficent");
            
            standardToken token = new standardToken(creator_, name_, symbol_, decimals_, tokenSupply_, _canmint, _canburn, _canpause, _canBlacklist);
            
            tokens[address(creator_)].push(address(token));
            
            emit CreateStandardSuccess(address(token));
        }
        
        function createLiuidity(address creator_, address reciever, string memory name_, string memory symbol_, uint8 decimal_, uint256 supply, uint256 settingflag, uint256[4] memory fees) public payable{
            require(msg.value >= fee.normal.add(fee.deflation), "Balance is insufficent");
            LiquidityToken token = new LiquidityToken(creator_, router_address, reciever, name_, symbol_, decimal_, supply, settingflag, fees);
            tokens[creator_].push(address(token));
            emit createLiquditySuccess(address(token));
        }
        
        function getBalance() public view returns(uint256) {
            return address(this).balance;
        }
        
        function getCreatedToken(address creater) public view returns(address[] memory) {
            return tokens[address(creater)];
        }
    }