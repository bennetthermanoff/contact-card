import express from 'express';
export const getVcardFile = async (
	req: express.Request,
	res: express.Response,
) => {
	const { id } = req.params;
	res.download(`./contacts/${id}.vcf`);
};
