import { DataTypes, ModelAttributes } from 'sequelize';

export const eventsModel:ModelAttributes = {
	id:{
		type: DataTypes.STRING,
		primaryKey: true,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false
        
	},
	name:{
		type: DataTypes.STRING,
		allowNull: false
	},
	adminSecret:{
		type: DataTypes.STRING,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false
	},
	registerSecret:{
		type: DataTypes.STRING,
		defaultValue: DataTypes.UUIDV4,
		allowNull: false
	},
	icon:{
		type: DataTypes.STRING,
		allowNull: true
	},
	primaryColor:{
		type: DataTypes.STRING,
		allowNull: true
	},
	secondaryColor:{
		type: DataTypes.STRING,
		allowNull: true
	}
};

export type EventModel = {
    id:string, // UUID
    name:string,
    adminSecret:string, // UUID
    registerSecret:string, // UUID
    icon:string, //JPEG URI
    primaryColor:string, //HEX (#FFFFFF)
    secondaryColor:string //HEX (#FFFFFF)
};