import util from "util";
import vcard from "vcard";
import express from "express";
import fs from "fs";
export const getPerson = async (
  req: express.Request,
  res: express.Response,
) => {
  const { id } = req.params;
  getPersonFromVcard(id, res);
};
export const getPersonFromVcard = (id: string, res: express.Response) => {
  const card = new vcard();
  try {
    const readFile = fs.readFileSync(`./contacts/${id}.vcf`, "utf8");
    card.readData(readFile, (err: any, json: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: err });
      } else {
        res.status(200).json(json);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
