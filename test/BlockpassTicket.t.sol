// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../contracts/BlockpassTicket.sol";

contract BlockpassTicketTest is Test {
    BlockpassTicket public ticket;
    address organizer = address(0x1);
    address buyer = address(0x2);

    uint256 constant START = 1_700_000_000;
    uint256 constant END = 2_000_000_000;

    uint256 eventId = 1;

    function setUp() public {
        vm.warp(START + 1);
        ticket = new BlockpassTicket(organizer);
        vm.prank(organizer);
        ticket.createEvent(eventId, "Test Event", 100, 0.005 ether, START, END);
    }

    function test_MintTicket_createsTicket() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(eventId, "VIP", "Jakarta", "2026-09-01", "https://example.com/token/1");

        BlockpassTicket.TicketDetails memory d = ticket.getTicketDetails(tokenId);
        assertEq(ticket.ownerOf(tokenId), buyer);
        assertEq(d.eventId, eventId);
        assertEq(d.tierName, "VIP");
        assertEq(uint8(d.status), uint8(BlockpassTicket.TicketStatus.Unused));
    }

    function test_UseTicket_marksUsed() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(eventId, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(organizer);
        ticket.useTicket(tokenId);

        assertEq(uint8(ticket.getTicketDetails(tokenId).status), uint8(BlockpassTicket.TicketStatus.Used));
    }

    function test_UseTicket_OnlyOrganizer() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(eventId, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(buyer);
        vm.expectRevert();
        ticket.useTicket(tokenId);
    }

    function test_UseTicket_AlreadyUsed_reverts() public {
        vm.deal(buyer, 1 ether);
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(eventId, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(organizer);
        ticket.useTicket(tokenId);

        vm.prank(organizer);
        vm.expectRevert("Ticket already used");
        ticket.useTicket(tokenId);
    }

    function test_AddOrganizer_grantsRole() public {
        address scanner = address(0x3);
        vm.prank(organizer);
        ticket.addOrganizer(scanner);
        assertTrue(ticket.hasRole(ticket.ORGANIZER_ROLE(), scanner));
    }
}