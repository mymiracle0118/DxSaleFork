// SPDX-License-Identifier: UNLICENSED
// @Credits Unicrypt Network 2021

// This contract generates Presale01 contracts and registers them in the PresaleFactory.
// Ideally you should not interact with this contract directly, and use the Octofi presale app instead so warnings can be shown where necessary.

pragma solidity 0.6.12;
import "./SafeMath.sol";
import "./IBEP20.sol";
import "./TransferHelper.sol";
import "./EnumerableSet.sol";
import "./PresaleSetting.sol";
import "./PresaleLockForwarder.sol";
import "./Presale.sol";

// interface IPresaleSettings {
//     function getRaisedFeeAddress () external view returns (address _raise_fee_addr);
//     function getRasiedFee () external view returns (uint256);
//     function getSoleFeeAddress () external view returns (address _sole_fee_address);
//     function getSoldFee () external view returns (uint256);
//     function getReferralFeeAddress () external view returns (address);
//     function getRefferralFee () external view returns (uint256);
//     function getLockFee() external view returns (uint256);
// }

contract PresaleManage {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct PresaleInfo {
        address payable presale_owner;
        address sale_token; // sale token
        uint256 token_rate; // 1 base token = ? s_tokens, fixed price
        uint256 raise_min; // maximum base token BUY amount per buyer
        uint256 raise_max; // the amount of presale tokens up for presale
        uint256 hardcap; // Maximum riase amount
        uint256 softcap; //Minimum raise amount
        uint256 liqudity_pBEPent; // divided by 1000
        uint256 listing_rate; // fixed rate at which the token will list on pancake
        uint256 lock_end; // pancake lock timestamp -> e.g. 2 weeks
        uint256 lock_start;
        uint256 presale_end;// presale period
        uint256 presale_start; // presale start
    }
    
    struct PresaleLink {
        string website_link;
        string github_link;
        string twitter_link;
        string reddit_link;
        string telegram_link;
    }

    EnumerableSet.AddressSet private presales;

    address public presale_lock_forward_addr;
    address public presale_setting_addr;
    PresaleLockForwarder _lock;

    address private pancake_factory_address;
    address private pancake_pair_address;
    
    address private WBNB_address;

    address payable owner;

    PresaleInfo presale_info;
    PresaleLink presalelink;

    IPresaleSettings public settings;

    event OwnerWithdrawSuccess(uint value);
    event CreatePreslaeSuccess(address, address);

    constructor(address payable _owner, address lock_addr, address pancakefactory_addr, address pancakerouter_Addr, address WBNB_addr) public {
        owner = _owner;

        pancake_factory_address = pancakefactory_addr;
        WBNB_address = WBNB_addr;

        _lock = new PresaleLockForwarder(address(this), lock_addr, pancakefactory_addr, pancakerouter_Addr, WBNB_addr);
        presale_lock_forward_addr = address(_lock);
        
        PresaleSettings _setting;
        
        _setting = new PresaleSettings(address(this), _owner, lock_addr);
        
        _setting.init(owner, 0.01 ether, owner, 10, owner, 10, owner, 10);
        
        presale_setting_addr = address(_setting);

        settings = IPresaleSettings(presale_setting_addr);
    }

    function ownerWithdraw() public {
        require(msg.sender == settings.getCreateFeeAddress(), "Only creater can withdraw");
        address payable reciver = payable(settings.getCreateFeeAddress());
        reciver.transfer(address(this).balance);
        // owner.transfer(address(this).balance);
        emit OwnerWithdrawSuccess(address(this).balance);
    }
    
    /**
     * @notice Creates a new Presale contract and registers it in the PresaleFactory.sol.
     */

    function calculateAmountRequired (uint256 _amount, uint256 _tokenPrice, uint256 _listingRate, uint256 _liquidityPBEPent, uint256 _tokenFee) public pure returns (uint256) {
        uint256 tokenamount = _amount.mul(_tokenPrice).div(10 ** 18);
        uint256 TokenFee = _amount.mul(_tokenFee).div(100).div(10 ** 18).mul(_tokenPrice);
        uint256 liqudityrateamount = _amount.mul(_listingRate).div(10 ** 18);
        uint256 liquiditytoken = liqudityrateamount.mul(_liquidityPBEPent).div(100);
        uint256 tokensRequiredForPresale = tokenamount.add(liquiditytoken).add(TokenFee);
        return tokensRequiredForPresale;
    }

    function createPresale  (
        address payable _presaleOwner,
        address _presaleToken,
        uint256[11] memory uint_params,
        string memory _website_link,
        string memory _github_link,
        string memory _twitter_llink,
        string memory _reddit_link,
        string memory _telegram_link
        ) public payable {

        presale_info.presale_owner = _presaleOwner;
        presale_info.sale_token = _presaleToken;
        presale_info.token_rate = uint_params[0];
        presale_info.raise_min = uint_params[1];
        presale_info.raise_max = uint_params[2];
        presale_info.softcap = uint_params[3];
        presale_info.hardcap = uint_params[4];
        presale_info.liqudity_pBEPent = uint_params[5];
        presale_info.listing_rate = uint_params[6];
        presale_info.presale_start = uint_params[7];
        presale_info.presale_end = uint_params[8];
        presale_info.lock_start = uint_params[9];
        presale_info.lock_end = uint_params[10];

        presalelink.website_link = _website_link;
        presalelink.github_link = _github_link;
        presalelink.twitter_link = _twitter_llink;
        presalelink.reddit_link = _reddit_link;
        presalelink.telegram_link = _telegram_link;
        
        // if ( (presale_info.presale_end - presale_info.presale_start) < 1 weeks) {
        //     presale_info.presale_end = presale_info.presale_start + 1 weeks;
        // }

        // if ( (presale_info.lock_end - presale_info.lock_start) < 4 weeks) {
        //     presale_info.lock_end = presale_info.lock_start + 4 weeks;
        // }
        
        // Charge ETH fee for contract creation
        require(msg.value >= settings.getPresaleCreateFee() + settings.getLockFee(), 'Balance is insufficent');

        require(presale_info.token_rate > 0, 'token rate is invalid'); 
        require(presale_info.raise_min < presale_info.raise_max, "raise min/max in invalid");
        require(presale_info.softcap <= presale_info.hardcap, "softcap/hardcap is invalid");
        require(presale_info.liqudity_pBEPent >= 30 && presale_info.liqudity_pBEPent <= 100, 'Liqudity pBEPent is invalid'); 
        require(presale_info.listing_rate > 0, 'Listing rate is invalid');
        
        require((presale_info.presale_end - presale_info.presale_start) > 0, 'Presale start/end time is invalid'); 
        require((presale_info.lock_end - presale_info.lock_start) >= 4 weeks, 'Lock end is invalid'); 

        // Calculate required token amount
        uint256 tokensRequiredForPresale = calculateAmountRequired(presale_info.hardcap, presale_info.token_rate, presale_info.listing_rate, presale_info.liqudity_pBEPent, settings.getSoldFee());
        
        // Create New presale
        PresaleV1 newPresale = (new PresaleV1){value: settings.getLockFee()}(address(this), WBNB_address, presale_setting_addr, presale_lock_forward_addr);
        
        // newPresale.delegatecall(bytes4(sha3("destroy()")));
        
        if(address(newPresale) == address(0)) {
            // newPresale.destroy();
            require(false,'Create presale Failed'); 
        }

        TransferHelper.safeTransferFrom(address(_presaleToken), address(msg.sender), address(newPresale), tokensRequiredForPresale);
    
        newPresale.init_private(presale_info.presale_owner, presale_info.sale_token, presale_info.token_rate, presale_info.raise_min, presale_info.raise_max, presale_info.softcap, 
        presale_info.hardcap, presale_info.liqudity_pBEPent, presale_info.listing_rate, presale_info.lock_end, presale_info.presale_start, presale_info.presale_end);

        newPresale.init_link(presalelink.website_link, presalelink.github_link, presalelink.twitter_link, presalelink.reddit_link, presalelink.telegram_link);
        
        newPresale.init_fee();

        presales.add(address(newPresale));
        
        emit CreatePreslaeSuccess(address(newPresale), address(msg.sender));
    }

    function getCount () public view returns (uint256) {
        return presales.length();
    }
    
    function getBalance () public view returns (uint256) {
        return address(this).balance;
    }

    function getPresaleAt (uint256 index) public view returns (address) {
        return presales.at(index);
    }
    
    function IsRegistered (address presale_addr) public view returns (bool) {
        return presales.contains(presale_addr);
    }
}