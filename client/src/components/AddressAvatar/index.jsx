import { Avatar } from '@mui/material';

const getColor = (address) => {
	let hash = 0;
	let i;

	for (i = 0; i < address.length; i += 1) {
		hash = address.charCodeAt(i) + ((hash << 5) - hash);
	}

	let color = '#';

	for (i = 0; i < 3; i += 1) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}

	return color;
}

function computeAvatarStyle(address) {
	return {
		sx: {
			bgcolor: getColor(address),
			color: "white",
			fontWeight: "bold",
			width: 20,
			height: 20
		},
	};
}
function AddressAvatar({ address }) {
	try {
		return <Avatar {...computeAvatarStyle(address)} />
	} catch (e) {
		return <Avatar />
	}
}

export default AddressAvatar;