// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract BlockpassTicket is ERC721URIStorage, AccessControl, Pausable {
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
        uint256 pricePaid;
    }

    struct Event {
        string name;
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 price;
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool exists;
    }

    mapping(uint256 => TicketDetails) public tickets;
    mapping(uint256 => Event) public events;
    mapping(uint256 => mapping(address => bool)) public eventOrganizers;

    event TicketMinted(address indexed buyer, uint256 indexed tokenId, uint256 eventId, string tierName);
    event TicketUsed(uint256 indexed tokenId, address indexed holder, uint256 usedAt);
    event EventCreated(uint256 indexed eventId, string name, uint256 maxSupply, uint256 price);
    event EventOrganizerAdded(uint256 indexed eventId, address indexed organizer);
    event EventOrganizerRemoved(uint256 indexed eventId, address indexed organizer);
    event ContractPaused(address account);
    event ContractUnpaused(address account);
    event TicketCancelled(uint256 indexed tokenId, uint256 eventId);

    constructor(address defaultAdmin) ERC721("Blockpass Ticket", "BPASS") {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(ORGANIZER_ROLE, defaultAdmin);
    }

    /**
     * @dev Create a new event (Only DEFAULT_ADMIN_ROLE)
     */
    function createEvent(
        uint256 eventId,
        string memory name,
        uint256 maxSupply,
        uint256 price,
        uint256 startTime,
        uint256 endTime
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(!events[eventId].exists, "Event already exists");
        require(maxSupply > 0, "Max supply must be > 0");
        require(price > 0, "Price must be > 0");
        require(startTime < endTime, "Invalid time range");

        events[eventId] = Event({
            name: name,
            maxSupply: maxSupply,
            currentSupply: 0,
            price: price,
            startTime: startTime,
            endTime: endTime,
            active: true,
            exists: true
        });

        eventOrganizers[eventId][msg.sender] = true;

        emit EventCreated(eventId, name, maxSupply, price);
        emit EventOrganizerAdded(eventId, msg.sender);
    }

    /**
     * @dev Add organizer for specific event
     */
    function addEventOrganizer(uint256 eventId, address organizer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(events[eventId].exists, "Event not found");
        require(organizer != address(0), "Invalid address");
        require(!eventOrganizers[eventId][organizer], "Already organizer");

        eventOrganizers[eventId][organizer] = true;
        emit EventOrganizerAdded(eventId, organizer);
    }

    /**
     * @dev Remove organizer for specific event
     */
    function removeEventOrganizer(uint256 eventId, address organizer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(events[eventId].exists, "Event not found");
        require(eventOrganizers[eventId][organizer], "Not an organizer");

        eventOrganizers[eventId][organizer] = false;
        emit EventOrganizerRemoved(eventId, organizer);
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
    ) public payable whenNotPaused returns (uint256) {
        require(events[eventId].exists, "Event not found");
        require(events[eventId].active, "Event not active");
        require(events[eventId].currentSupply < events[eventId].maxSupply, "Event sold out");
        require(msg.value >= events[eventId].price, "Insufficient payment");
        require(bytes(tierName).length > 0, "Tier name required");
        require(bytes(location).length > 0, "Location required");
        require(bytes(eventDate).length > 0, "Event date required");
        require(bytes(tokenURI).length > 0, "Token URI required");
        require(bytes(tokenURI).length <= 2048, "Token URI too long");
        require(block.timestamp >= events[eventId].startTime, "Event not started");
        require(block.timestamp <= events[eventId].endTime, "Event ended");

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
            mintedAt: block.timestamp,
            pricePaid: msg.value
        });

        events[eventId].currentSupply++;

        emit TicketMinted(msg.sender, newTokenId, eventId, tierName);

        return newTokenId;
    }

    /**
     * @dev Scan & Perubahan Status Tiket (Hanya oleh Organizer event tersebut)
     */
    function useTicket(uint256 tokenId) external whenNotPaused {
        require(_ownerOf(tokenId) != address(0), "Ticket not found");
        require(tickets[tokenId].status == TicketStatus.Unused, "Ticket already used");

        uint256 eventId = tickets[tokenId].eventId;
        require(eventOrganizers[eventId][msg.sender], "Not organizer for this event");
        require(events[eventId].exists, "Event not found");

        tickets[tokenId].status = TicketStatus.Used;
        emit TicketUsed(tokenId, ownerOf(tokenId), block.timestamp);
    }

    /**
     * @dev Cancel tiket dan kembalikan ke status unsold
     * Hanya Organizer atau Admin bisa cancel
     */
    function cancelTicket(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Ticket not found");
        require(tickets[tokenId].status == TicketStatus.Unused, "Ticket already used");

        uint256 eventId = tickets[tokenId].eventId;
        require(
            eventOrganizers[eventId][msg.sender] || hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Not authorized"
        );
        require(events[eventId].exists, "Event not found");

        // Burn tiket
        _burn(tokenId);

        // Kurangi supply
        events[eventId].currentSupply--;

        emit TicketCancelled(tokenId, eventId);
    }

    /**
     * @dev Menambahkan Panitia/Scanner Baru (Legacy - global organizer)
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

    function getEventDetails(uint256 eventId) external view returns (Event memory) {
        return events[eventId];
    }

    function isEventOrganizer(uint256 eventId, address account) external view returns (bool) {
        return eventOrganizers[eventId][account];
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
        emit ContractPaused(msg.sender);
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
        emit ContractUnpaused(msg.sender);
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