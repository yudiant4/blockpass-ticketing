// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../contracts/BlockpassTicket.sol";

contract DeployBlockpassTicket is Script {
    function run() external returns (BlockpassTicket) {
        // Pakai wallet dari forge CLI (--private-key / --account / default keystore).
        address deployerAddress = msg.sender;

        vm.startBroadcast();

        BlockpassTicket ticket = new BlockpassTicket(deployerAddress);

        vm.stopBroadcast();

        return ticket;
    }
}