// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract BlockpassTicket is ERC1155, AccessControl, Pausable {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");

    // Token ID tiers
    uint256 public constant REGULAR_ID = 1;
    uint256 public constant VIP_ID = 2;
    uint256 public constant VVIP_ID = 3;

    struct Tier {
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 price; // in wei
        bool active;
    }

    mapping(uint256 => Tier) public tiers;
    mapping(address => mapping(uint256 => uint256)) public purchasedCount;
    string private _baseURI;

    event TierConfigured(uint256 indexed tokenId, uint256 maxSupply, uint256 price);
    event TicketMinted(address indexed buyer, uint256 indexed tokenId, uint256 amount, uint256 totalPrice);
    event FundsWithdrawn(address indexed admin, uint256 amount);

    constructor(string memory baseUri) ERC1155("") {
        _baseURI = baseUri;
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ORGANIZER_ROLE, msg.sender);
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory currentURI = _baseURI;
        if (bytes(currentURI).length == 0) return "";
        string memory idStr = Strings.toString(id);
        return string(abi.encodePacked(_replace(currentURI, "{id}", idStr)));
    }

    function _replace(string memory source, string memory search, string memory replace)
        internal pure returns (string memory)
    {
        bytes memory s = bytes(source);
        bytes memory searchBytes = bytes(search);
        bytes memory replaceBytes = bytes(replace);
        if (searchBytes.length == 0) return source;

        uint256 index = 0;
        bool found = false;
        for (uint256 i = 0; i <= s.length - searchBytes.length; i++) {
            bool isMatch = true;
            for (uint256 j = 0; j < searchBytes.length; j++) {
                if (s[i + j] != searchBytes[j]) { isMatch = false; break; }
            }
            if (isMatch) { index = i; found = true; break; }
        }
        if (!found) return source;

        uint256 newLen = s.length - searchBytes.length + replaceBytes.length;
        bytes memory r = new bytes(newLen);
        for (uint256 i = 0; i < index; i++) r[i] = s[i];
        for (uint256 i = 0; i < replaceBytes.length; i++) r[index + i] = replaceBytes[i];
        for (uint256 i = 0; i < s.length - index - searchBytes.length; i++)
            r[index + replaceBytes.length + i] = s[index + searchBytes.length + i];
        return string(r);
    }

    function configureTier(uint256 id, uint256 maxSupply, uint256 price)
        external onlyRole(ADMIN_ROLE)
    {
        require(id >= REGULAR_ID && id <= VVIP_ID, "Invalid tier");
        require(maxSupply > 0 && price > 0);
        tiers[id] = Tier({maxSupply: maxSupply, currentSupply: 0, price: price, active: true});
        emit TierConfigured(id, maxSupply, price);
    }

    function mintTicket(uint256 id, uint256 amount) public payable whenNotPaused returns (uint256) {
        require(amount > 0 && tiers[id].active, "Invalid tier");
        require(tiers[id].currentSupply + amount <= tiers[id].maxSupply, "Insufficient supply");
        uint256 total = tiers[id].price * amount;
        require(msg.value >= total, "Insufficient payment");
        _mint(msg.sender, id, amount, "");
        tiers[id].currentSupply += amount;
        purchasedCount[msg.sender][id] += amount;
        emit TicketMinted(msg.sender, id, amount, total);
        return total;
    }

    function cancelTicket(uint256 id, uint256 amount) external {
        require(hasRole(ADMIN_ROLE, msg.sender) || hasRole(ORGANIZER_ROLE, msg.sender), "Unauthorized");
        require(tiers[id].active && balanceOf(msg.sender, id) >= amount);
        _burn(msg.sender, id, amount);
        tiers[id].currentSupply -= amount;
    }

    function withdraw() external onlyRole(ADMIN_ROLE) {
        uint256 bal = address(this).balance;
        require(bal > 0);
        (bool ok, ) = payable(msg.sender).call{value: bal}("");
        require(ok, "Withdraw failed");
        emit FundsWithdrawn(msg.sender, bal);
    }

    function setBaseURI(string memory newUri) external onlyRole(ADMIN_ROLE) {
        _baseURI = newUri;
        _setURI(newUri);
    }

    function getBalance() external view returns (uint256) { return address(this).balance; }
    function pause() external onlyRole(ADMIN_ROLE) { _pause(); }
    function unpause() external onlyRole(ADMIN_ROLE) { _unpause(); }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC1155, AccessControl) returns (bool)
    { return super.supportsInterface(interfaceId); }
}