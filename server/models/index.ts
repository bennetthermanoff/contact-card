import { Sequelize } from 'sequelize';
import { eventsModel } from './events';
import { contactsModel } from './contacts';

export const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: '../../database.sqlite',
	logging:console.log
});

export const eventsDB = sequelize.define('events', eventsModel);
export const contactsDB = sequelize.define('contacts', contactsModel);
