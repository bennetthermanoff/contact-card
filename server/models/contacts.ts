import { DataTypes, ModelAttributes } from 'sequelize';

export const contactsModel:ModelAttributes = {
	id:{
		type: DataTypes.STRING,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false
	},
	eventId:{
		type: DataTypes.STRING,
		allowNull: false
	},
	vcard:{
		type: DataTypes.STRING,
		allowNull: false
	}
};

export type ContactModel = {
    id:string, // UUID
    eventId:string, // UUID
    vcard:string // vCard text
};