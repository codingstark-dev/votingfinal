const formatAddress = (address) => {
    try {
        return `${address.substring(0, 4)}...${address.substring(address.length - 4, address.length)}`
    } catch (e) {
        return "";
    }
}

export { formatAddress };