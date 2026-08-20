// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../contracts/BlockpassTicket.sol";

contract BlockpassTicket1155Test is Test {
    BlockpassTicket public ticket;
    address admin = makeAddr("admin");
    address buyer = makeAddr("buyer");

    function setUp() public {
        vm.prank(admin);
        ticket = new BlockpassTicket("ipfs://QmBase/{id}.json");

        vm.prank(admin);
        ticket.configureTier(1, 100, 0.001 ether); // REGULAR
        vm.prank(admin);
        ticket.configureTier(2, 50, 0.003 ether);  // VIP
        vm.prank(admin);
        ticket.configureTier(3, 20, 0.01 ether);   // VVIP
    }

    function test_MintRegular() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 total = ticket.mintTicket{value: 0.001 ether}(1, 1);

        assertEq(ticket.balanceOf(buyer, 1), 1);
        assertEq(ticket.purchasedCount(buyer, 1), 1);
        (, uint256 currentSupply,,) = ticket.tiers(1);
        assertEq(currentSupply, 1);
        assertEq(total, 0.001 ether);
    }

    function test_MintMultiple() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 total = ticket.mintTicket{value: 0.006 ether}(2, 2);

        assertEq(ticket.balanceOf(buyer, 2), 2);
        (, uint256 currentSupply,,) = ticket.tiers(2);
        assertEq(currentSupply, 2);
        assertEq(total, 0.006 ether);
    }

    function test_Revert_InsufficientPayment() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        vm.expectRevert("Insufficient payment");
        ticket.mintTicket{value: 0.0005 ether}(1, 1);
    }

    function test_Revert_Oversupply() public {
        vm.deal(buyer, 10 ether);
        vm.prank(buyer);
        ticket.mintTicket{value: 0.01 ether}(3, 1); // 1 of 20

        (uint256 maxSupply, uint256 currentSupply,,) = ticket.tiers(3);
        assertEq(currentSupply, 1);
        assertEq(maxSupply, 20);

        // Try to mint 20 more than remaining 19
        vm.prank(buyer);
        vm.expectRevert("Insufficient supply");
        ticket.mintTicket{value: 0.2 ether}(3, 20);
    }

    function test_URI_WithIdPlaceholder() public view {
        assertEq(ticket.uri(1), "ipfs://QmBase/1.json");
        assertEq(ticket.uri(2), "ipfs://QmBase/2.json");
        assertEq(ticket.uri(3), "ipfs://QmBase/3.json");
    }

    function test_OnlyAdmin_ConfigureTier() public {
        vm.prank(buyer);
        vm.expectRevert();
        ticket.configureTier(1, 10, 0.1 ether);
    }

    function test_Withdraw() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        ticket.mintTicket{value: 0.001 ether}(1, 1);

        uint256 balanceBefore = admin.balance;
        vm.prank(admin);
        ticket.withdraw();

        assertGt(admin.balance, balanceBefore);
    }

    receive() external payable {}
}