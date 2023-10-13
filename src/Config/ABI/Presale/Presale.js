export const PresaleABI =
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "manage",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "WBNBfact",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "setting",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lockaddr",
				"type": "address"
			}
		],
		"stateMutability": "payable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "AddLiquidtySuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "UserDepsitedSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "UserWithdrawSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "UserWithdrawTokensSuccess",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "addLiquidity",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "buyers",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "base",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sale",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "destroy",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "forceFailIfPairExists",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "init_fee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_website_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_github_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_twitter_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_reddit_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_telegram_link",
				"type": "string"
			}
		],
		"name": "init_link",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_presale_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_sale_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_token_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_raise_min",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_raise_max",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_softcap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_hardcap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_liqudity_percent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_listing_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_lock_end",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_presale_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_presale_end",
				"type": "uint256"
			}
		],
		"name": "init_private",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "link",
		"outputs": [
			{
				"internalType": "string",
				"name": "website_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "github_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "twitter_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "reddit_link",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "telegram_link",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presaleStatus",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_fee_info",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "raised_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sold_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "referral_fee",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "raise_fee_address",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "sole_fee_address",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "referral_fee_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_info",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "presale_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "sale_token",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "token_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "raise_min",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "raise_max",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "hardcap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "softcap",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "liqudity_percent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "listing_rate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lock_end",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lock_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "presale_end",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "presale_start",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_lock_forwarder",
		"outputs": [
			{
				"internalType": "contract IPresaleLockForwarder",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_setting",
		"outputs": [
			{
				"internalType": "contract IPresaleSettings",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "status",
		"outputs": [
			{
				"internalType": "bool",
				"name": "lp_generation_complete",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "force_failed",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "raised_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sold_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "token_withdraw",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "base_withdraw",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "num_buyers",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokeninfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "totalsupply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "decimal",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userDeposit",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userWithdrawBaseTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "userWithdrawTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]