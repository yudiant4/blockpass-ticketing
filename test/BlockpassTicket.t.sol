// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import "../contracts/BlockpassTicket.sol";

contract BlockpassTicketTest is Test {
    BlockpassTicket public ticket;
    address organizer = address(0x1);
    address buyer = address(0x2);

    function setUp() public {
        ticket = new BlockpassTicket(organizer);
    }

    function test_MintTicket_createsTicket() public {
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket(1, "VIP", "Jakarta", "2026-09-01", "https://example.com/token/1");

        BlockpassTicket.TicketDetails memory d = ticket.getTicketDetails(tokenId);
        assertEq(ticket.ownerOf(tokenId), buyer);
        assertEq(d.eventId, 1);
        assertEq(d.tierName, "VIP");
        assertEq(uint8(d.status), uint8(BlockpassTicket.TicketStatus.Unused));
    }

    function test_UseTicket_marksUsed() public {
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket(1, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(organizer);
        ticket.useTicket(tokenId);

        assertEq(uint8(ticket.getTicketDetails(tokenId).status), uint8(BlockpassTicket.TicketStatus.Used));
    }

    function test_UseTicket_OnlyOrganizer() public {
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket(1, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(buyer);
        vm.expectRevert();
        ticket.useTicket(tokenId);
    }

    function test_UseTicket_AlreadyUsed_reverts() public {
        vm.prank(buyer);
        uint256 tokenId = ticket.mintTicket(1, "VIP", "Jakarta", "2026-09-01", "ipfs://token/1");

        vm.prank(organizer);
        ticket.useTicket(tokenId);

        vm.prank(organizer);
        vm.expectRevert("Tiket sudah digunakan");
        ticket.useTicket(tokenId);
    }

    function test_AddOrganizer_grantsRole() public {
        address scanner = address(0x3);
        vm.prank(organizer);
        ticket.addOrganizer(scanner);
        assertTrue(ticket.hasRole(ticket.ORGANIZER_ROLE(), scanner));
    }
}