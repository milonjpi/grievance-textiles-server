import axios from 'axios';

export const sendSms = async (to: string[], message: string) => {
  await axios.post('https://sms.novocom-bd.com/api/v2/SendSMS', {
    senderId: process.env.SENDER_ID,
    is_Unicode: false,
    is_Flash: false,
    isRegisteredForDelivery: true,
    message,
    mobileNumbers: to.join(', '),
    apiKey: process.env.API_KEY,
    clientId: process.env.CLIENT_ID,
  });
};
