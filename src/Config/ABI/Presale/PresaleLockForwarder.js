export const LockForwarderABI =
[
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_manage",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lplock_addrress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "unifactaddr",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "unirouter",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "wethaddr",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "WETH",
		"outputs": [
			{
				"internalType": "contract IIWETH",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_saleToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_baseAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_saleAmount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_unlock_date",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_withdrawer",
				"type": "address"
			}
		],
		"name": "lockLiquidity",
		"outputs": [],
		"stateMutability": "payable",
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
		"name": "locked_lp_owner",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "locked_lp_tokens",
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
		"name": "lplocker",
		"outputs": [
			{
				"internalType": "contract IILpLocker",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_token0",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_token1",
				"type": "address"
			}
		],
		"name": "uniswapPairIsInitialised",
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
		"inputs": [],
		"name": "uniswapfactory",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Factory",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "uniswaprouter",
		"outputs": [
			{
				"internalType": "contract IUniswapV2Router02",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]