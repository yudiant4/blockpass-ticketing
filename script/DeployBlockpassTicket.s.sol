// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/BlockpassTicket.sol";

contract DeployBlockpassTicket is Script {
    function run() external returns (BlockpassTicket) {
        vm.startBroadcast();

        BlockpassTicket ticket = new BlockpassTicket("ipfs://QmBase/{id}.json");

        // Configure 3 tiers: REGULAR(1), VIP(2), VVIP(3)
        ticket.configureTier(1, 1000, 0.001 ether); // REGULAR: 1 mETH
        ticket.configureTier(2, 500, 0.003 ether); // VIP: 3 mETH
        ticket.configureTier(3, 100, 0.01 ether); // VVIP: 10 mETH

        vm.stopBroadcast();
        return ticket;
    }
}
