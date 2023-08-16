import express from 'express';
export const getVcardFile = async (
	req: express.Request,
	res: express.Response,
) => {
	try {
		const { id } = req.params;
		res.download(`./contacts/${id}.vcf`);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Server Error' });
	}
};
