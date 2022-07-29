function Error({ statusCode }){
	return (
		<p>
			{statusCode != 404
			? `An error ${statusCode} occured on server!`
			: `Err: ${statusCode} Page Not Found.\nAn error occured on client!`
			}
		</p>
	);
}

Error.getInitialProps = ({ res, err }) => {
	const statusCode = res ? (res.statusCode) : (err ? err.statusCode : 404)
	return { statusCode }
};

export default Error;