export const PresaleManageABI = 
[
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lock_addr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "pancakefactory_addr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "pancakerouter_Addr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "WBNB_addr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "CreatePreslaeSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "OwnerWithdrawSuccess",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "presale_addr",
				"type": "address"
			}
		],
		"name": "IsRegistered",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_listingRate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_liquidityPBEPent",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_tokenFee",
				"type": "uint256"
			}
		],
		"name": "calculateAmountRequired",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_presaleOwner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_presaleToken",
				"type": "address"
			},
			{
				"internalType": "uint256[11]",
				"name": "uint_params",
				"type": "uint256[11]"
			},
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
				"name": "_twitter_llink",
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
		"name": "createPresale",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
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
		"name": "getCount",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getPresaleAt",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ownerWithdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_lock_forward_addr",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "presale_setting_addr",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "settings",
		"outputs": [
			{
				"internalType": "contract IPresaleSettings",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]