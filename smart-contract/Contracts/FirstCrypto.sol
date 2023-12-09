// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract FirstCrypto is Ownable {
    using SafeCast for int256;
    using SafeMath for uint256;
    string public name = "FirstCrypto Masterchef";

    //manager: execute trx
    mapping(address => uint256) public managers;
    address public ownerAddress;
    address public usdtAddress;


    // upi mappings
    mapping(address => string) public addressToUpi;
    mapping(string => address) public upiToAddress;




    mapping(address => uint256) public poolTokenBalances; // balance mapping for all tokens
    mapping(address => mapping(address => uint256)) public userTokenBalances; // balance mapping for all tokens

    // Fees 0.005%
    uint256 public fee;
    uint256 public feePercent = 5;

    struct Order {
        uint256 orderId;
        address user;
        address tokenAddress;
        uint256 depositAmount;
        uint256 remainingAmount;
        uint256 fiatOrderAmount;
        uint256 tokenAccumulated;
        uint256 grids;
        uint256 executedGrids;
        bool open;
    }

     uint256 public ordersCount = 0;
    // // mappings
    mapping(uint256 => Order) public orders;
    mapping(address => mapping(address => uint256[])) public userOrders;


    // total positions in the contract
    uint256 public positionsCount = 0;
    // each user will have only 1 actice position 
    // user address -> position id
    mapping(address =>  uint256) public userPosition; // points to current user position
    // position id ==> order ids
    mapping(uint256 => uint256[]) public positionToOrders;




    mapping (address => uint256) public userPositions;   // 0xAD => [1,2,4]
    mapping (uint256 => uint256) public positionStatus;  // 0: open , 1:closed
  
  

  
    // For this example, we will set the swap pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    // events:
    event Invested(
        uint256 orderId,
        address indexed user,
        uint256 amount,
        uint256 grids,
        address tokenAddress
    );

    event OrderCancelled(
        uint256 orderId,
        uint256 executedGrids,
        uint256 remainingAmount
    );

    event Withdraw(
        address indexed user,
        uint256[] orderIds,
        address tokenAddress,
        uint256 fiatAmount,
        uint256 tokenAmount
    );

    // init contract
    constructor(address _usdtAddress) {
        managers[msg.sender] = 1;
        ownerAddress = msg.sender;
        usdtAddress=_usdtAddress;
      }

    //modifiers
    modifier onlyManager() {
        require(managers[msg.sender] == 1);
        _;
    }

    function addManager(address _manager) public onlyOwner {
        managers[_manager] = 1;
    }

    function updateFeePercent(uint256 _newFeePercent) public onlyOwner {
        require(_newFeePercent >= 0, "Invalid _newFeePercent!");

        feePercent = _newFeePercent;
    }



    function updateUpi(string memory _upiAddress) public {

        bytes memory strBytes = bytes(_upiAddress);

        require(strBytes.length != 0, "Invalid UPI string");

        addressToUpi[msg.sender] = _upiAddress;
        upiToAddress[_upiAddress] = msg.sender;
    }


    function startStrategy(
        address _tokenAddress,
        uint256 _singleOrderAmount,
        uint256 _noOfOrders
    ) public {

        require(_singleOrderAmount > 0, "order amount less than min limit!");
         uint256 total_order_amount=_singleOrderAmount.mul(_noOfOrders);

        // Transfer the specified amount of USDT to this manager wallet.
        TransferHelper.safeTransferFrom(
            usdtAddress,
            msg.sender,
             ownerAddress,
            _singleOrderAmount
        );

        // start new position
        uint256 _positionId = ++positionsCount;

        // start new order
        ordersCount++;
       
        Order memory new_order = Order({
            orderId: ordersCount,
            tokenAddress: _tokenAddress,
            user: msg.sender,
            fiatOrderAmount: _singleOrderAmount,
            depositAmount: total_order_amount,
            grids: _noOfOrders,
            remainingAmount: total_order_amount,
            tokenAccumulated: 0,
            executedGrids: 0,
            open: true
        });

        orders[ordersCount] = new_order;

        // add order to current position array
        positionToOrders[_positionId].push(ordersCount);  
        // add current position to user positions
        userPosition[msg.sender] = _positionId; 

        // userOrders[msg.sender][_tokenAddress].push(ordersCount);

        // Updating pool usdt balance when user deposit usdt
        poolTokenBalances[usdtAddress] += total_order_amount;

        emit Invested(
            ordersCount,
            msg.sender,
            total_order_amount,
            _noOfOrders,
            _tokenAddress
        );
    }

    function getUserOrders(address _user,address _tokenAddress) public view returns (Order[] memory) {
        uint256 _userPosition = userPosition[_user];
        uint256[] memory _positionOrderIds = positionToOrders[_userPosition];
        uint256 count = _positionOrderIds.length;

        Order[] memory filteredArray = new Order[](count);

        uint256 index = 0;
        for (uint256 i = 0; i < count; i++) {
 
            filteredArray[index] = orders[_positionOrderIds[i]];
            index++;
        
        }

        return filteredArray; 
    }

    function getPendingOrders(uint256 _blockTime) public view returns(Order[] memory){

        uint256 count = 0;
        for(uint256 i=1; i<= ordersCount; i++){
            if(orders[i].open){
                count++;
            }
        }

        Order[] memory filteredArray = new Order[](count);

           uint256 index = 0;
        for (uint256 i = 1; i <= ordersCount; i++) {
            if (orders[i].open) {
                filteredArray[index] = orders[i];
                index++;
            }
        }

        return filteredArray;  
        
    }
   
    function updateOrderStatus(uint256[] memory _orderIds) public onlyManager {
        for (uint256 i = 0; i < _orderIds.length; i++) {
            require(_orderIds[i] > 0, "Order id must be greater than 0!");
            Order storage selected_order = orders[_orderIds[i]];
            require(selected_order.open, "Order alreaded closed!");
       

            selected_order.executedGrids += 1; // updated executed girds

            //stop the order if all grids executed
            if (selected_order.executedGrids == selected_order.grids) {
                selected_order.open = false;
            }
        }
    }

  
}
