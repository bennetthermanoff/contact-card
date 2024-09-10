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
	},
	hits:{
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
};

export type ContactModel = {
    id:string, // UUID
    eventId:string, // UUID
    vcard:string // vCard text
	hits:number // number of times this contact has been accessed
};