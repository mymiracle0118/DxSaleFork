// SPDX-License-Identifier: UNLICENSED
// @Credits Defi Site Network 2021

// Presale contract. Version 1

pragma solidity 0.6.12;

import "./SafeMath.sol";
import "./IBEP20.sol";
import "./TransferHelper.sol";
import "./EnumerableSet.sol";
import "./ReentrancyGuard.sol";

// interface IUniswapV2Factory {
//     function getPair(address tokenA, address tokenB) external view returns (address pair);
//     function createPair(address tokenA, address tokenB) external returns (address pair);
// }

interface IWBNB {
    function deposit() external payable;
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address src, address dst, uint wad) external returns (bool);
    function approve(address spender, uint value) external returns (bool);
    function balanceOf(address owner) external view returns (uint);
    function decimals() external view returns(uint);
}

interface IPresaleSettings {
    function getRaisedFeeAddress () external view returns (address payable);
    function getRasiedFee () external view returns (uint256);
    function getSoleFeeAddress () external view returns (address payable);
    function getSoldFee () external view returns (uint256);
    function getReferralFeeAddress () external view returns (address payable);
    function getRefferralFee () external view returns (uint256);
    function getLockFee() external view returns (uint256);
    function getPresaleCreateFee () external view returns (uint256);
    function getCreateFeeAddress () external view returns (address payable);
}

interface IPresaleLockForwarder {
    function lptokens(address owner) external view returns (address);
    function pancakePairIsInitialised (address _token0, address _token1) external view returns (bool);
    function lockLiquidity (address _saleToken, uint256 _baseAmount, uint256 _saleAmount, uint256 _unlock_date, address payable _withdrawer) payable external;
}

contract PresaleV1 is ReentrancyGuard {
  using SafeMath for uint256;
  /// @notice Presale Contract Version, used to choose the correct ABI to decode the contract
//   uint256 public contract_version = 1;
  
  struct PresaleInfo {
    address payable presale_owner;
    address sale_token; // sale token
    // IBEP20 base_token; // base token // usually WBNB (ETH)
    uint256 token_rate; // 1 base token = ? s_tokens, fixed price
    uint256 raise_min; // maximum base token BUY amount per buyer
    uint256 raise_max; // the amount of presale tokens up for presale
    uint256 hardcap; // Maximum riase amount
    uint256 softcap; //Minimum raise amount
    uint256 liqudity_percent; // divided by 1000
    uint256 listing_rate; // fixed rate at which the token will list on uniswap
    uint256 lock_end; // uniswap lock timestamp -> e.g. 2 weeks
    uint256 lock_start;
    uint256 presale_end;// presale period
    uint256 presale_start; // presale start
    // bool iseth; // if this flag is true the presale is raising ETH, otherwise an BEP20 token such as DAI
  }
  
  struct PresaleLink {
      string website_link;
      string github_link;
      string twitter_link;
      string reddit_link;
      string telegram_link;
  }
  
  struct PresaleFeeInfo {
    uint256 raised_fee; // divided by 100
    uint256 sold_fee; // divided by 100
    uint256 referral_fee; // divided by 100
    address payable raise_fee_address;
    address payable sole_fee_address;
    address payable referral_fee_address; // if this is not address(0), there is a valid referral
  }
  
  struct PresaleStatus {
    bool lp_generation_complete; // final flag required to end a presale and enable withdrawls
    bool force_failed; // set this flag to force fail the presale
    uint256 raised_amount; // total base currency raised (usually ETH)
    uint256 sold_amount; // total presale tokens sold
    uint256 token_withdraw; // total tokens withdrawn post successful presale
    uint256 base_withdraw; // total base tokens withdrawn on presale failure
    uint256 num_buyers; // number of unique participants
  }

  struct BuyerInfo {
    uint256 base; // total base token (usually ETH) deposited by user, can be withdrawn on presale failure
    uint256 sale; // num presale tokens a user is owed, can be withdrawn on presale success
  }
  
  struct TokenInfo {
      string name;
      string symbol;
      uint256 totalsupply;
      uint256 decimal;
  }
  
  PresaleInfo public presale_info;
  PresaleStatus public status;
  PresaleLink public link;
  PresaleFeeInfo public presale_fee_info;
  TokenInfo public tokeninfo;

  address manage_addr;
  
  // IUniswapV2Factory public uniswapfactory;
  IWBNB private WBNB;
  IPresaleSettings public presale_setting;
  IPresaleLockForwarder public presale_lock_forwarder;
  
  mapping(address => BuyerInfo) public buyers;
  
  event UserDepsitedSuccess(address, uint256);
  event UserWithdrawSuccess(uint256);
  event UserWithdrawTokensSuccess(uint256);
  event AddLiquidtySuccess(uint256);
  
  constructor(address manage, address WBNBfact, address setting, address lockaddr) public payable{
      
    presale_setting = IPresaleSettings(setting);

    require(msg.value >= presale_setting.getLockFee(), 'Balance is insufficent');

    manage_addr = manage;
    
    // uniswapfactory = IUniswapV2Factory(uniswapfact);
    WBNB = IWBNB(WBNBfact);
    
    presale_lock_forwarder = IPresaleLockForwarder(lockaddr);
  }

  function init_private (
    address payable _presale_owner,
    address _sale_token,
    // address _base_token,
    uint256 _token_rate,
    uint256 _raise_min, 
    uint256 _raise_max, 
    uint256 _softcap, 
    uint256 _hardcap,
    uint256 _liqudity_percent,
    uint256 _listing_rate,
    uint256 _lock_end,
    uint256 _presale_start,
    uint256 _presale_end
    // bool _iseth
    ) external {
      
      require(msg.sender == manage_addr, 'Only manage address is available');
      
      presale_info.presale_owner = _presale_owner;
      presale_info.sale_token = address(_sale_token);
    //   if( !_iseth ) {
        // presale_info.base_token = IBEP20(address(WBNB));
    //   } else {
    //     presale_info.base_token = _base_token;  
    //   }
      presale_info.token_rate = _token_rate;
      presale_info.raise_min = _raise_min;
      presale_info.raise_max = _raise_max;
      presale_info.softcap = _softcap;
      presale_info.hardcap = _hardcap;
      presale_info.liqudity_percent = _liqudity_percent;
      presale_info.listing_rate = _listing_rate;
      presale_info.lock_end = _lock_end;
      presale_info.presale_end = _presale_end;
      presale_info.presale_start =  _presale_start;
      
      //Set token token info
      tokeninfo.name = IBEP20(presale_info.sale_token).name();
      tokeninfo.symbol = IBEP20(presale_info.sale_token).symbol();
      tokeninfo.decimal = IBEP20(presale_info.sale_token).decimals();
      tokeninfo.totalsupply = IBEP20(presale_info.sale_token).totalSupply();
  }

  function init_link (
    string memory _website_link,
    string memory _github_link,
    string memory _twitter_link,
    string memory _reddit_link,
    string memory _telegram_link
  ) external {
      
      require(msg.sender == manage_addr, 'Only manage address is available');
      
      link.website_link = _website_link;
      link.github_link = _github_link;
      link.twitter_link = _twitter_link;
      link.reddit_link = _reddit_link;
      link.telegram_link = _telegram_link;
  }
  
  function init_fee () external {
          
    require(msg.sender == manage_addr, 'Only manage address is available');

    presale_fee_info.raised_fee = presale_setting.getRasiedFee(); // divided by 100
    presale_fee_info.sold_fee = presale_setting.getSoldFee(); // divided by 100
    presale_fee_info.referral_fee = presale_setting.getRefferralFee(); // divided by 100
    presale_fee_info.raise_fee_address = presale_setting.getRaisedFeeAddress();
    presale_fee_info.sole_fee_address = presale_setting.getSoleFeeAddress();
    presale_fee_info.referral_fee_address = presale_setting.getReferralFeeAddress(); // if this is not address(0), there is a valid referral
  }
  
  modifier onlyPresaleOwner() {
    require(presale_info.presale_owner == msg.sender, "NOT PRESALE OWNER");
    _;
  }
  
//   uint256 tempstatus;
  
//   function setTempStatus(uint256 flag) public {
//       tempstatus = flag;
//   }
  
  function presaleStatus () public view returns (uint256) {
    // return tempstatus;
    if (status.force_failed) {
      return 3; // FAILED - force fail
    }
    if ((block.timestamp > presale_info.presale_end) && (status.raised_amount < presale_info.softcap)) {
      return 3;
    }
    if (status.raised_amount >= presale_info.hardcap) {
      return 2; // SUCCESS - hardcap met
    }
    if ((block.timestamp > presale_info.presale_end) && (status.raised_amount >= presale_info.softcap)) {
      return 2; // SUCCESS - preslae end and soft cap reached
    }
    if ((block.timestamp >= presale_info.presale_start) && (block.timestamp <= presale_info.presale_end)) {
      return 1; // ACTIVE - deposits enabled
    }
    return 0; // QUED - awaiting start block
  }
  
  // accepts msg.value for eth or _amount for BEP20 tokens
  function userDeposit () public payable nonReentrant {
    require(presaleStatus() == 1, 'NOT ACTIVE'); // ACTIVE
    require(presale_info.raise_min <= msg.value, "balance is insufficent");
    require(presale_info.raise_max >= msg.value, "balance is too much");

    BuyerInfo storage buyer = buyers[msg.sender];

    uint256 amount_in = msg.value;
    uint256 allowance = presale_info.raise_max.sub(buyer.base);
    uint256 remaining = presale_info.hardcap - status.raised_amount;
    allowance = allowance > remaining ? remaining : allowance;
    if (amount_in > allowance) {
      amount_in = allowance;
    }
    uint256 tokensSold = amount_in.mul(presale_info.token_rate).div(10 ** 18);
    require(tokensSold > 0, 'ZERO TOKENS');
    require(tokensSold <= IBEP20(presale_info.sale_token).balanceOf(address(this)), "Token reamin error");
    if (buyer.base == 0) {
        status.num_buyers++;
    }
    buyers[msg.sender].base = buyers[msg.sender].base.add(amount_in);
    buyers[msg.sender].sale = buyers[msg.sender].sale.add(tokensSold);
    status.raised_amount = status.raised_amount.add(amount_in);
    status.sold_amount = status.sold_amount.add(tokensSold);
    
    // return unused ETH
    if (amount_in < msg.value) {
      msg.sender.transfer(msg.value.sub(amount_in));
    }
    
    emit UserDepsitedSuccess(msg.sender, msg.value);
  }
  
  // withdraw presale tokens
  // pBEPentile withdrawls allows fee on transfer or rebasing tokens to still work
  function userWithdrawTokens () public nonReentrant {
    require(status.lp_generation_complete, 'AWAITING LP GENERATION');
    BuyerInfo storage buyer = buyers[msg.sender];
    uint256 tokensRemainingDenominator = status.sold_amount.sub(status.token_withdraw);
    uint256 tokensOwed = IBEP20(presale_info.sale_token).balanceOf(address(this)).mul(buyer.sale).div(tokensRemainingDenominator);
    require(tokensOwed > 0, 'NOTHING TO WITHDRAW');
    status.token_withdraw = status.token_withdraw.add(buyer.sale);
    buyers[msg.sender].sale = 0;
    buyers[msg.sender].base = 0;
    TransferHelper.safeTransfer(address(presale_info.sale_token), msg.sender, tokensOwed);
    
    emit UserWithdrawTokensSuccess(tokensOwed);
  }
  
  // on presale failure
  // pBEPentile withdrawls allows fee on transfer or rebasing tokens to still work
  function userWithdrawBaseTokens () public nonReentrant {
    require(presaleStatus() == 3, 'NOT FAILED'); // FAILED
    
    if(msg.sender == presale_info.presale_owner) {
        ownerWithdrawTokens();
        // return;
    }
    
    BuyerInfo storage buyer = buyers[msg.sender];
    uint256 baseRemainingDenominator = status.raised_amount.sub(status.base_withdraw);
    uint256 remainingBaseBalance = address(this).balance;
    uint256 tokensOwed = remainingBaseBalance.mul(buyer.base).div(baseRemainingDenominator);
    require(tokensOwed > 0, 'NOTHING TO WITHDRAW');
    status.base_withdraw = status.base_withdraw.add(buyer.base);
    buyer.base = 0;
    buyer.sale = 0;
    
    address payable reciver = payable(msg.sender);
    reciver.transfer(tokensOwed);
    
    emit UserWithdrawSuccess(tokensOwed);
    // TransferHelper.safeTransferBaseToken(address(presale_info.base_token), msg.sender, tokensOwed, false);
  }
  
  // on presale failure
  // allows the owner to withdraw the tokens they sent for presale & initial liquidity
  function ownerWithdrawTokens () private onlyPresaleOwner {
    require(presaleStatus() == 3, "Only failed status"); // FAILED
    TransferHelper.safeTransfer(address(presale_info.sale_token), presale_info.presale_owner, IBEP20(presale_info.sale_token).balanceOf(address(this)));
    
    emit UserWithdrawSuccess(IBEP20(presale_info.sale_token).balanceOf(address(this)));
  }


  // Can be called at any stage before or during the presale to cancel it before it ends.
  // If the pair already exists on uniswap and it contains the presale token as liquidity 
  // the final stage of the presale 'addLiquidity()' will fail. This function 
  // allows anyone to end the presale prematurely to release funds in such a case.
  function forceFailIfPairExists () public {
    require(!status.lp_generation_complete && !status.force_failed);
    if (presale_lock_forwarder.pancakePairIsInitialised(address(presale_info.sale_token), address(WBNB))) {
        status.force_failed = true;
    }
  }
  
  // if something goes wrong in LP generation
  // function forceFail () external {
  //     require(msg.sender == OCTOFI_FEE_ADDRESS);
  //     status.force_failed = true;
  // }
  
  // on presale success, this is the final step to end the presale, lock liquidity and enable withdrawls of the sale token.
  // This function does not use pBEPentile distribution. Rebasing mechanisms, fee on transfers, or any deflationary logic
  // are not taken into account at this stage to ensure stated liquidity is locked and the pool is initialised according to 
  // the presale parameters and fixed prices.
  function addLiquidity() public nonReentrant onlyPresaleOwner {
    require(!status.lp_generation_complete, 'GENERATION COMPLETE');
    require(presaleStatus() == 2, 'NOT SUCCESS'); // SUCCESS
    // Fail the presale if the pair exists and contains presale token liquidity

    if (presale_lock_forwarder.pancakePairIsInitialised(address(presale_info.sale_token), address(WBNB))) {
        status.force_failed = true;
        emit AddLiquidtySuccess(0);
        return;
    }
    
    // require(!presale_lock_forwarder.uniswapPairIsInitialised(address(presale_info.sale_token), address(WBNB)), "Liqudity exist");
    
    uint256 presale_raisedfee = status.raised_amount.mul(presale_setting.getRasiedFee()).div(100);
    
    // base token liquidity
    uint256 baseLiquidity = status.raised_amount.sub(presale_raisedfee).mul(presale_info.liqudity_percent).div(100);

    // WBNB.deposit{value : baseLiquidity}();
    
    // require(WBNB.approve(address(presale_lock_forwarder), baseLiquidity), 'approve failed.');
    
    // TransferHelper.safeApprove(address(presale_info.base_token), address(presale_lock_forwarder), baseLiquidity);
    
    // sale token liquidity
    uint256 tokenLiquidity = baseLiquidity.mul(presale_info.listing_rate).div(10 ** 18);
    require(tokenLiquidity > 0, "ZERO Tokens");
    TransferHelper.safeApprove(address(presale_info.sale_token), address(presale_lock_forwarder), tokenLiquidity);
    
    presale_lock_forwarder.lockLiquidity{value : presale_setting.getLockFee().add(baseLiquidity)}(address(presale_info.sale_token), baseLiquidity, tokenLiquidity, presale_info.lock_end, presale_info.presale_owner);
    
    uint256 presaleSoldFee = status.sold_amount.mul(presale_setting.getSoldFee()).div(100);
    
    address payable reciver = payable(address(presale_fee_info.raise_fee_address));
    reciver.transfer(presale_raisedfee);
    
    // TransferHelper.safeTransferBaseToken(address(presale_info.base_token), presale_fee_info.raise_fee_address, presale_raisedfee, false);
    TransferHelper.safeTransfer(address(presale_info.sale_token), presale_fee_info.sole_fee_address, presaleSoldFee);
    
    // burn unsold tokens
    uint256 remainingSBalance = IBEP20(presale_info.sale_token).balanceOf(address(this));
    if (remainingSBalance > status.sold_amount) {
        uint256 burnAmount = remainingSBalance.sub(status.sold_amount);
        TransferHelper.safeTransfer(address(presale_info.sale_token), 0x000000000000000000000000000000000000dEaD, burnAmount);
    }
    
    // send remaining base tokens to presale owner
    uint256 remainingBaseBalance = address(this).balance;
    
    address payable presale_fee_reciver = payable(address(presale_info.presale_owner));
    presale_fee_reciver.transfer(remainingBaseBalance);
   
    status.lp_generation_complete = true;
    emit AddLiquidtySuccess(1);
  }

  function destroy() public {
    require(status.lp_generation_complete, 'lp generation incomplete');
    selfdestruct(presale_info.presale_owner);
  }
  
//   function getTokenNmae() public view returns (string memory) {
//       return presale_info.sale_token.name();
//   }
  
//   function getTokenSymbol() public view returns (string memory) {
//       return presale_info.sale_token.symbol();
//   }
}