// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Audit regression tests: C1-C4 (critical), M1-M3 (medium), L1-L2 (low)
import {Test, console} from "forge-std/Test.sol";
import "../contracts/BlockpassTicket.sol";

contract BlockpassTicketAudit is Test {
    address public admin;
    address public org1;
    address public org2;
    address public buyer1;
    address public buyer2;
    address public buyer3;

    BlockpassTicket public ticket;

    uint256 public event1Id = 1;
    uint256 public event2Id = 2;

    // window besar biar block.timestamp (2026) selalu di dalam
    uint256 constant START = 1_700_000_000; // Nov 2023
    uint256 constant END = 2_000_000_000;   // May 2033

    function setUp() public {
        vm.warp(START + 1); // set block.timestamp into valid window

        admin = address(0xA11CE);
        org1 = address(0xB0B1);
        org2 = address(0xB0B2);
        buyer1 = address(0xC0C1);
        buyer2 = address(0xC0C2);
        buyer3 = address(0xC0C3);

        ticket = new BlockpassTicket(admin);

        vm.prank(admin);
        ticket.createEvent(event1Id, "Ethereum Trail Run", 100, 0.005 ether, START, END);
        vm.prank(admin);
        ticket.createEvent(event2Id, "Base Conference", 50, 0.0025 ether, START, END);

        // org1 -> organizer event1, org2 -> organizer event2
        vm.prank(admin);
        ticket.addEventOrganizer(event1Id, org1);
        vm.prank(admin);
        ticket.addEventOrganizer(event2Id, org2);
    }

    // ===========================
    // C1: payment validation
    // ===========================

    function testC1_ZeroPayment_Reverts() public {
        vm.prank(buyer1);
        vm.expectRevert("Insufficient payment");
        ticket.mintTicket(event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1");
    }

    function testC1_ExactPayment_Succeeds() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        assertEq(ticket.ownerOf(tokenId), buyer1);
        assertEq(ticket.getTicketDetails(tokenId).pricePaid, 0.005 ether);
    }

    function testC1_WrongPayment_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert("Insufficient payment");
        ticket.mintTicket{value: 0.001 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );
    }

    // ===========================
    // C2: supply cap
    // ===========================

    function testC2_MintToCap_Succeeds() public {
        vm.deal(buyer1, 100 ether);
        for (uint256 i = 0; i < 100; i++) {
            vm.prank(buyer1);
            ticket.mintTicket{value: 0.005 ether}(
                event1Id, "General", "Jakarta", "2026-08-15", "https://example.com/1"
            );
        }
        assertEq(ticket.getEventDetails(event1Id).currentSupply, 100);
    }

    function testC2_MintPastCap_Reverts() public {
        vm.deal(buyer1, 100 ether);
        for (uint256 i = 0; i < 100; i++) {
            vm.prank(buyer1);
            ticket.mintTicket{value: 0.005 ether}(
                event1Id, "General", "Jakarta", "2026-08-15", "https://example.com/1"
            );
        }
        vm.deal(buyer2, 1 ether);
        vm.prank(buyer2);
        vm.expectRevert("Event sold out");
        ticket.mintTicket{value: 0.005 ether}(
            event1Id, "General", "Jakarta", "2026-08-15", "https://example.com/1"
        );
    }

    // ===========================
    // C3: event registry
    // ===========================

    function testC3_UnknownEvent_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert("Event not found");
        ticket.mintTicket{value: 0.005 ether}(999, "VIP", "Jakarta", "2026-08-15", "https://example.com/1");
    }

    function testC3_DuplicateEvent_Reverts() public {
        vm.prank(admin);
        vm.expectRevert("Event already exists");
        ticket.createEvent(event1Id, "Duplicate", 10, 0.005 ether, START, END);
    }

    function testC3_CreateEvent_OnlyAdmin() public {
        vm.prank(buyer1);
        vm.expectRevert();
        ticket.createEvent(42, "Hack", 10, 0.005 ether, START, END);
    }

    // ===========================
    // C4: per-event organizer scoping
    // ===========================

    function testC4_Organizer_CanUseOwnEvent() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org1);
        ticket.useTicket(tokenId);
        assertEq(uint8(ticket.getTicketDetails(tokenId).status), 1); // Used
    }

    function testC4_Organizer_CannotUseOtherEvent() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org2); // org2 hanya organizer event2
        vm.expectRevert("Not organizer for this event");
        ticket.useTicket(tokenId);
    }

    function testC4_NonOrganizer_CannotUse() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(buyer1);
        vm.expectRevert("Not organizer for this event");
        ticket.useTicket(tokenId);
    }

    function testC4_AddOrganizer_OnlyAdmin() public {
        vm.prank(org1);
        vm.expectRevert();
        ticket.addEventOrganizer(event1Id, buyer1);

        vm.prank(admin);
        ticket.addEventOrganizer(event1Id, buyer1);
        assertTrue(ticket.isEventOrganizer(event1Id, buyer1));
    }

    // ===========================
    // M1: pausable
    // ===========================

    function testM1_Paused_BlocksMint() public {
        vm.prank(admin);
        ticket.pause();
        assertTrue(ticket.paused());

        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert();  // EnforcedPause() (OZ v5 custom error)
        ticket.mintTicket{value: 0.005 ether}(event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1");

        vm.prank(admin);
        ticket.unpause();

        vm.prank(buyer1);
        ticket.mintTicket{value: 0.005 ether}(event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1");
        assertFalse(ticket.paused());
    }

    function testM1_Pause_OnlyAdmin() public {
        vm.prank(buyer1);
        vm.expectRevert();
        ticket.pause();
    }

    // ===========================
    // M2: cancel + refund availability
    // ===========================

    function testM2_Cancel_ByOrganizer() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org1);
        ticket.cancelTicket(tokenId);

        // burned: owner tidak bisa dipanggil via ownerOf (revert ERC721NonexistentToken)
        // validasi via supply + event min
        assertEq(ticket.getEventDetails(event1Id).currentSupply, 0);
        assertEq(ticket.getTicketDetails(tokenId).status == BlockpassTicket.TicketStatus.Unused, true);
    }

    function testM2_Cancel_Unauthorized_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(buyer1); // pembeli bukan organizer
        vm.expectRevert("Not authorized");
        ticket.cancelTicket(tokenId);
    }

    function testM2_Cancel_UsedTicket_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org1);
        ticket.useTicket(tokenId);

        vm.prank(org1);
        vm.expectRevert("Ticket already used");
        ticket.cancelTicket(tokenId);
    }

    // ===========================
    // M3: tokenURI + input validation
    // ===========================

    function testM3_EmptyURI_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert("Token URI required");
        ticket.mintTicket{value: 0.005 ether}(event1Id, "VIP", "Jakarta", "2026-08-15", "");
    }

    function testM3_EmptyTier_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert("Tier name required");
        ticket.mintTicket{value: 0.005 ether}(event1Id, "", "Jakarta", "2026-08-15", "https://example.com/1");
    }

    function testM3_LongURI_Reverts() public {
        bytes memory long = new bytes(2049);
        for (uint256 i = 0; i < 2049; i++) long[i] = "a";

        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        vm.expectRevert("Token URI too long");
        ticket.mintTicket{value: 0.005 ether}(event1Id, "VIP", "Jakarta", "2026-08-15", string(long));
    }

    // ===========================
    // L1: remove organizer
    // ===========================

    function testL1_RemoveOrganizer() public {
        assertTrue(ticket.isEventOrganizer(event1Id, org1));

        vm.prank(admin);
        ticket.removeEventOrganizer(event1Id, org1);
        assertFalse(ticket.isEventOrganizer(event1Id, org1));
    }

    function testL1_RemoveOrganizer_UnknownEvent_Reverts() public {
        vm.prank(admin);
        vm.expectRevert("Event not found");
        ticket.removeEventOrganizer(999, org1);
    }

    // ===========================
    // L2: independent event supplies
    // ===========================

    function testL2_EventSupplies_Independent() public {
        vm.deal(buyer1, 10 ether);
        for (uint256 i = 0; i < 5; i++) {
            vm.prank(buyer1);
            ticket.mintTicket{value: 0.005 ether}(event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1");
            vm.prank(buyer1);
            ticket.mintTicket{value: 0.0025 ether}(event2Id, "GA", "Base", "2026-09-01", "https://example.com/2");
        }

        assertEq(ticket.getEventDetails(event1Id).currentSupply, 5);
        assertEq(ticket.getEventDetails(event2Id).currentSupply, 5);
    }

    // ===========================
    // edge cases
    // ===========================

    function testEdge_UseBurnedTicket_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org1);
        ticket.cancelTicket(tokenId);

        vm.prank(org1);
        vm.expectRevert("Ticket not found");
        ticket.useTicket(tokenId);
    }

    function testEdge_Cancel_AfterCancel_Reverts() public {
        vm.deal(buyer1, 1 ether);
        vm.prank(buyer1);
        uint256 tokenId = ticket.mintTicket{value: 0.005 ether}(
            event1Id, "VIP", "Jakarta", "2026-08-15", "https://example.com/1"
        );

        vm.prank(org1);
        ticket.cancelTicket(tokenId);

        vm.prank(org1);
        vm.expectRevert("Ticket not found");
        ticket.cancelTicket(tokenId);
    }

    function testEdge_MintZeroPriceEvent_Blocked() public {
        // createEvent harus tolak price = 0
        vm.prank(admin);
        vm.expectRevert("Price must be > 0");
        ticket.createEvent(77, "Free Event", 10, 0, START, END);
    }
}