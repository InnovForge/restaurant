import React from "react";

const Home = () => {
  // TODO: This is a placeholder for the home page. You can replace this content.
	const items = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
	return (
		<div>
			<h1>this is page home</h1>
			{items.map((item) => (
				<div key={item}>{item}</div>
			))}
		</div>
	);
};

export default Home;
