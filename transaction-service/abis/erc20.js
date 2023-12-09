const ERC20_ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    stateMutability: "view",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "address",
      },
    ],
    name: "allowance",
    stateMutability: "view",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
  {
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

module.exports = { ERC20_ABI };
