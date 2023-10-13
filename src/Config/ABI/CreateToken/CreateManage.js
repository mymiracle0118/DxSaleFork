export const manageCreateTokenABI = 
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "router_Addr",
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
			}
		],
		"name": "CreateStandardSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [],
		"name": "InitFeeSuccess",
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
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "createLiquditySuccess",
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
			}
		],
		"name": "setOwnerSucess",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "creator_",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "reciever",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "decimal_",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "supply",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "settingflag",
				"type": "uint256"
			},
			{
				"internalType": "uint256[4]",
				"name": "fees",
				"type": "uint256[4]"
			},
			{
				"internalType": "uint256",
				"name": "_canmint",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canburn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canpause",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canBlacklist",
				"type": "uint256"
			}
		],
		"name": "createLiuidity",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "creator_",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "name_",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "symbol_",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "decimals_",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "tokenSupply_",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canmint",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canburn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canpause",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_canBlacklist",
				"type": "uint256"
			}
		],
		"name": "createStandard",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "fee",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "normal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mint",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "burn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pause",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "blacklist",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deflation",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "creater",
				"type": "address"
			}
		],
		"name": "getCreatedToken",
		"outputs": [
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "normal",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "mint",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "burn",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pause",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "blacklist",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "deflation",
				"type": "uint256"
			}
		],
		"name": "initFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "newowner",
				"type": "address"
			}
		],
		"name": "setOwner",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]