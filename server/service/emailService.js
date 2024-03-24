const AWS = require('aws-sdk');

// Create an instance of the Amazon SES service
const ses = new AWS.SES({ apiVersion: '2010-12-01' });

// Function to send an email using Amazon SES
exports.sendEmail = async (to, subject, body) => {
  try {
    console.log("To email:",to);
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'f20202027@hyderabad.bits-pilani.ac.in', // Replace with your verified email address
    };

    // Send email
    await ses.sendEmail(params).promise();

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email');
  }
};