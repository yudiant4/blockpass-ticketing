// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract BlockpassTicket is ERC721URIStorage, AccessControl {
    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    
    uint256 private _tokenIdCounter;

    enum TicketStatus { Unused, Used }

    struct TicketDetails {
        uint256 eventId;
        string tierName;
        string location;
        string eventDate;
        TicketStatus status;
        uint256 mintedAt;
    }

    mapping(uint256 => TicketDetails) public tickets;

    event TicketMinted(address indexed buyer, uint256 indexed tokenId, uint256 eventId, string tierName);
    event TicketUsed(uint256 indexed tokenId, address indexed holder, uint256 usedAt);

    constructor(address defaultAdmin) ERC721("Blockpass Ticket", "BPASS") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ORGANIZER_ROLE, defaultAdmin);
    }

    /**
     * @dev Minting Tiket Baru oleh Pembeli
     */
    function mintTicket(
        uint256 eventId,
        string memory tierName,
        string memory location,
        string memory eventDate,
        string memory tokenURI
    ) public payable returns (uint256) {
        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);

        tickets[newTokenId] = TicketDetails({
            eventId: eventId,
            tierName: tierName,
            location: location,
            eventDate: eventDate,
            status: TicketStatus.Unused,
            mintedAt: block.timestamp
        });

        emit TicketMinted(msg.sender, newTokenId, eventId, tierName);

        return newTokenId;
    }

    /**
     * @dev Scan & Perubahan Status Tiket (Hanya oleh Penyelenggara/ORGANIZER_ROLE)
     */
    function useTicket(uint256 tokenId) external onlyRole(ORGANIZER_ROLE) {
        require(_ownerOf(tokenId) != address(0), "Tiket tidak ditemukan");
        require(tickets[tokenId].status == TicketStatus.Unused, "Tiket sudah digunakan");

        tickets[tokenId].status = TicketStatus.Used;

        emit TicketUsed(tokenId, ownerOf(tokenId), block.timestamp);
    }

    /**
     * @dev Menambahkan Panitia/Scanner Baru
     */
    function addOrganizer(address organizer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ORGANIZER_ROLE, organizer);
    }

    /**
     * @dev Membaca Informasi On-Chain Tiket
     */
    function getTicketDetails(uint256 tokenId) external view returns (TicketDetails memory) {
        return tickets[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}