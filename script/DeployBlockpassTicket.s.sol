// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/BlockpassTicket.sol";

contract DeployBlockpassTicket is Script {
    function run() external returns (BlockpassTicket) {
        address deployerAddress = msg.sender;

        vm.startBroadcast();

        BlockpassTicket ticket = new BlockpassTicket(deployerAddress);

        // Window waktu (UTC)
        uint256 augStart = 1_785_408_000; // 2026-08-01 00:00
        uint256 augEnd   = 1_793_376_000; // 2026-08-31 23:59
        uint256 sepEnd   = 1_802_016_000; // 2026-09-30 23:59
        uint256 octEnd   = 1_810_656_000; // 2026-10-31 23:59

        // 12 event, harga murah 0.001 - 0.01 ETH
        ticket.createEvent(1,  "ALAS TRAIL RUN 2026",            150,  0.005 ether,  augStart, augEnd);
        ticket.createEvent(2,  "TALUS WEB3 SUMMIT",               500,  0.002 ether,  augStart, sepEnd);
        ticket.createEvent(3,  "ANIME MATSURI: SOUL SOCIETY",    1000,  0.0025 ether, augStart, octEnd);
        ticket.createEvent(4,  "RINJANI EXPEDITION VIP",           50,  0.01 ether,   augStart, octEnd);
        ticket.createEvent(5,  "NEON CITY RAVE VOL. 4",           2000,  0.003 ether,  augStart, octEnd);
        ticket.createEvent(6,  "BLOCKPASS ESPORTS ARENA",        1000,  0.001 ether,  augStart, sepEnd);
        ticket.createEvent(7,  "JAVA HIKING COMMUNITY MEETUP",     100,  0.001 ether,  augStart, augEnd);
        ticket.createEvent(8,  "NFT ART JAKARTA EXPO",             300,  0.0015 ether, augStart, sepEnd);
        ticket.createEvent(9,  "BANDUNG INDIE MUSIC FEST",         800,  0.002 ether,  augStart, octEnd);
        ticket.createEvent(10, "BALI SUNSET YOGA RETREAT",         200,  0.004 ether,  augStart, octEnd);
        ticket.createEvent(11, "SURABAYA STREET FOOD FEST",        500,  0.001 ether,  augStart, sepEnd);
        ticket.createEvent(12, "WEB3 DEV HACKATHON 2026",          200,  0.0015 ether, augStart, octEnd);

        vm.stopBroadcast();

        return ticket;
    }
}
