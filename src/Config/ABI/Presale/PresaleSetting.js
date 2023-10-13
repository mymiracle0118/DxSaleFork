export const PresaleSettingABI = 
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
				"name": "_owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "lockaddr",
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
				"name": "addr",
				"type": "address"
			}
		],
		"name": "setCreateFeeAddrSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "setCreateFeeSuccess",
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
		"name": "setFeeInfoSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "setRaiseFeeAddrSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "setRaisedFeeSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "setReferralFeeAddrSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "setReferralFeeSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "num",
				"type": "uint256"
			}
		],
		"name": "setSoldFeeSuccess",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "addr",
				"type": "address"
			}
		],
		"name": "setSoleFeeAddrSuccess",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getCreateFeeAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLockFee",
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
		"name": "getPresaleCreateFee",
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
		"name": "getRaisedFeeAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "_raise_fee_addr",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRasiedFee",
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
		"name": "getReferralFeeAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getRefferralFee",
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
		"name": "getSoldFee",
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
		"name": "getSoleFeeAddress",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "_sole_fee_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "info",
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
				"internalType": "uint256",
				"name": "presale_create_fee",
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
			},
			{
				"internalType": "address payable",
				"name": "create_fee_address",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_presale_create_fee_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_presale_create_fee",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_raise_fee_addr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_raised_fee",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_sole_fee_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_sold_fee",
				"type": "uint256"
			},
			{
				"internalType": "address payable",
				"name": "_referral_fee_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_referral_fee",
				"type": "uint256"
			}
		],
		"name": "init",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_create_fee_address",
				"type": "address"
			}
		],
		"name": "setCreateFeeAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_create_address",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_raise_address",
				"type": "address"
			},
			{
				"internalType": "address payable",
				"name": "_sold_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_create_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_raise_fee",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_sold_fee",
				"type": "uint256"
			}
		],
		"name": "setFeeInfo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_raised_fee",
				"type": "uint256"
			}
		],
		"name": "setRaisedFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_raised_fee_addr",
				"type": "address"
			}
		],
		"name": "setRaisedFeeAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_referral_fee_address",
				"type": "address"
			}
		],
		"name": "setReferralFeeAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_referral_fee",
				"type": "uint256"
			}
		],
		"name": "setRefferralFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_presale_create_fee",
				"type": "uint256"
			}
		],
		"name": "setSetPresaleCreateFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_sold_fee",
				"type": "uint256"
			}
		],
		"name": "setSoldFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_sole_fee_address",
				"type": "address"
			}
		],
		"name": "setSoleFeeAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]